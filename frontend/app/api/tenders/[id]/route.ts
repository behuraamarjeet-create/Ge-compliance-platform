import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

async function strapiRequest(path: string, options: RequestInit = {}) {
  return fetch(`${STRAPI_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      ...options.headers,
    },
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const search = req.nextUrl.searchParams.toString();
  const path = `/api/tenders/${params.id}${search ? "?" + search : ""}`;
  const res = await strapiRequest(path);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
