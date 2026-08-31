"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!officerId || !password) {
      setError("Please enter your Officer ID and password.");
      return;
    }

    setLoading(true);
    // Demo: simulate auth check
    await new Promise((res) => setTimeout(res, 900));

    // Demo credentials: any non-empty input proceeds
    localStorage.setItem("atc_user", JSON.stringify({ id: officerId, role: "Procurement Officer" }));
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">

          {/* Header strip */}
          <div className="sidebar-gradient px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-base leading-tight">AI Tender Compliance</div>
                <div className="text-white/50 text-xs leading-tight">Government Procurement Platform</div>
              </div>
            </div>
            <h2 className="text-white font-semibold text-lg leading-snug">
              Procurement Officer Sign In
            </h2>
            <p className="text-white/50 text-xs mt-1">
              Intelligent bidder verification and decision support
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Officer ID */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Officer ID / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="officer@gov.in"
                    className="input-base pl-9"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-navy-700 hover:text-navy-900 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-base pl-9 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-semibold rounded-lg
                  hover:bg-navy-800 active:bg-navy-950 transition-all duration-150 shadow-sm
                  disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Platform"
                )}
              </button>
            </form>
          </div>

          {/* Security footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
            <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <p className="text-2xs text-gray-400">
              <span className="font-semibold text-gray-500">Secure Procurement Environment</span>
              {" "}· This system is for authorised government officers only.
              All access is logged and audited.
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center">
          <p className="text-white/30 text-2xs">
            Demo mode · Enter any credentials to proceed
          </p>
        </div>
      </div>
    </div>
  );
}
