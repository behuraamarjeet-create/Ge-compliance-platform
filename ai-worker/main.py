import json
import os
from pathlib import Path
from typing import Any, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import google.generativeai as genai
from dotenv import load_dotenv

# Load Environment
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY not found. Add it to /ai-worker/.env")

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use the fast and free "Flash" model
    model = genai.GenerativeModel('gemini-3.6-flash')
else:
    model = None

app = FastAPI(title="GE Compliance AI Worker", version="0.1.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper: Convert Image to Base64
def image_to_base64(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Helper: Load bidder mock data used for verification
def load_mock_data() -> list[dict[str, Any]]:
    for data_path in (Path("mock_data.json"), Path("data") / "mock_data.json"):
        if data_path.exists():
            try:
                with data_path.open("r", encoding="utf-8") as data_file:
                    data = json.load(data_file)
                return data if isinstance(data, list) else []
            except (OSError, json.JSONDecodeError) as exc:
                print(f"Mock data load error: {exc}")
                return []
    return []

# Helper: Call Gemini API
def extract_data_from_image(image_path: str) -> dict:
    if not model:
        raise HTTPException(status_code=503, detail="Gemini API not configured (Missing API Key)")

    try:
        # Prepare the prompt
        prompt = """
        You are an expert document analyzer. Extract the following fields from this image of a government certificate (GST, PAN, Udyam, etc.):
        1. Company Name
        2. GSTIN (if present)
        3. PAN (if present)
        4. Udyam ID (if present)
        5. Registration Date
        6. Status (Active, Cancelled, Expired, or Unknown)
        
        Return ONLY a valid JSON object with these keys. Do not add markdown, explanations, or extra text.
        Example format:
        {
            "company_name": "ABC Pvt Ltd",
            "gstin": "27AABCU9603R1Z5",
            "pan": "AABCU9603R",
            "udyam_id": "UDYAM-...",
            "registration_date": "2023-01-01",
            "status": "Active"
        }
        """

        # Create the image part
        image_part = {
            "mime_type": "image/png", # Adjust if needed, but flash handles auto
            "data": image_to_base64(image_path)
        }

        # Send request
        response = model.generate_content([prompt, image_part])
        
        # Clean up response (remove markdown code blocks if present)
        content = response.text
        content = content.replace("```json", "").replace("```", "").strip()
        
        return json.loads(content)
        
    except Exception as e:
        print(f"Gemini AI Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Extraction failed: {str(e)}")

# Endpoints
@app.get("/health")
def health():
    return {"status": "ok", "ai_source": "Gemini 1.5 Flash" if model else "Not Configured"}

@app.post("/extract")
async def extract_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Save file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        extracted_data = extract_data_from_image(temp_path)
        
                # --- VERIFICATION LOGIC START ---
        # 1. Compare extracted GSTIN with Mock DB
        mock_data = load_mock_data()
        found_bidder = None
        for bidder in mock_data:
            if str(bidder.get('gst')).upper() == str(extracted_data.get('gstin', '')).upper():
                found_bidder = bidder
                break
        
        score = 0
        risk = "Unknown"
        details = {}
        
        if found_bidder:
            # Check GST Status
            is_gst_active = found_bidder.get("gst_status") == "Active"
            details["gst_check"] = "Pass" if is_gst_active else "Fail"
            if is_gst_active: score += 50
            
            # Check PAN
            is_pan_valid = found_bidder.get("pan") == extracted_data.get("pan")
            details["pan_check"] = "Pass" if is_pan_valid else "Fail"
            if is_pan_valid: score += 30
            
            # Check Udyam
            is_udyam_active = found_bidder.get("udyam_status") == "Active"
            details["udyam_check"] = "Pass" if is_udyam_active else "Fail"
            if is_udyam_active: score += 20
            
            risk = "Low" if score >= 80 else "Medium" if score >= 50 else "High"
            status = "Verified" if score >= 80 else "Review Required"
        else:
            # Not found in DB
            details["gst_check"] = "Not Found in DB"
            details["pan_check"] = "Not Found in DB"
            details["udyam_check"] = "Not Found in DB"
            score = 0
            risk = "High"
            status = "Not Found"
        
        # --- VERIFICATION LOGIC END ---

        return {
            "filename": file.filename,
            "extracted_data": extracted_data,
            "verification_result": {
                "compliance_score": score,
                "risk_level": risk,
                "status": status,
                "details": details,
                "matched_bidder": found_bidder["company_name"] if found_bidder else None
            },
            "source": "Gemini 1.5 Flash (Free)"
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)