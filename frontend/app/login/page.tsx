"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Code2, Eye, EyeOff, Lock, Shield, Sparkles, User } from "lucide-react";

type LoginMode = "officer" | "developer";

const modes = {
  officer: {
    title: "Welcome back",
    description: "Sign in to review tenders and make confident procurement decisions.",
    label: "Officer ID or email",
    placeholder: "officer@gov.in",
    button: "Sign in as Procurement Officer",
    role: "Procurement Officer",
    destination: "/search",
  },
  developer: {
    title: "Developer access",
    description: "Access platform tools, integrations, and development resources.",
    label: "Developer email",
    placeholder: "developer@example.com",
    button: "Sign in as Developer",
    role: "Developer",
    destination: "/settings",
  },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("officer");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const copy = modes[mode];

  const selectMode = (nextMode: LoginMode) => {
    setMode(nextMode);
    setUserId("");
    setPassword("");
    setError("");
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!userId.trim() || !password) {
      setError(`Please enter your ${mode === "officer" ? "Officer ID and" : "email and"} password.`);
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    localStorage.setItem("atc_user", JSON.stringify({ id: userId.trim(), role: copy.role }));
    router.push(copy.destination);
  };

  return (
    <main className="min-h-screen bg-[#f4f6fb] p-4 sm:p-6 lg:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(22,28,87,0.14)] sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-5rem)]">
        <section className="relative hidden w-[46%] overflow-hidden bg-[#161c57] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#2545e8]/50 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#8b5cf6]/25 blur-3xl" />
          <div className="relative">
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><Shield className="h-5 w-5" /></div>
              <div><p className="font-bold leading-tight">AI Tender Compliance</p><p className="text-xs text-white/55">Government Procurement Platform</p></div>
            </div>
            <div className="max-w-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><Sparkles className="h-6 w-6 text-indigo-200" /></div>
              <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">Smarter compliance starts here.</h1>
              <p className="mt-5 text-sm leading-7 text-white/65">Verify bidder documents, surface risk, and keep every procurement decision transparent and audit-ready.</p>
            </div>
          </div>
          <p className="relative text-xs text-white/40">Secure. Auditable. Built for better procurement.</p>
        </section>

        <section className="flex flex-1 flex-col px-6 py-8 sm:px-12 sm:py-10 lg:px-16 lg:py-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white"><Shield className="h-4 w-4" /></div><span className="text-sm font-bold text-navy-950">AI Tender Compliance</span></div>
            <div className="ml-auto text-xs text-gray-500"><span className="hidden sm:inline">Need platform tools? </span><button type="button" onClick={() => selectMode(mode === "officer" ? "developer" : "officer")} className="font-semibold text-navy-800 hover:text-navy-600">{mode === "officer" ? "Developer sign in" : "Officer sign in"}</button></div>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
            <div className="mb-8">
              <div className="mb-5 flex w-fit rounded-full bg-navy-50 p-1">
                <button type="button" onClick={() => selectMode("officer")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${mode === "officer" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500"}`}>Procurement Officer</button>
                <button type="button" onClick={() => selectMode("developer")} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${mode === "developer" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500"}`}><Code2 className="h-3 w-3" /> Developer</button>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-950">{copy.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">{copy.description}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div><label htmlFor="user-id" className="mb-2 block text-xs font-semibold text-gray-700">{copy.label}</label><div className="relative"><User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input id="user-id" type="text" value={userId} onChange={(event) => setUserId(event.target.value)} placeholder={copy.placeholder} className="input-base h-12 rounded-xl pl-10" autoComplete="username" /></div></div>
              <div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</label><button type="button" className="text-xs font-medium text-navy-700 hover:text-navy-900">Forgot password?</button></div><div className="relative"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input id="password" type={visible ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="input-base h-12 rounded-xl pl-10 pr-11" autoComplete="current-password" /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
              {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}
              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-900 text-sm font-semibold text-white shadow-lg shadow-navy-900/15 hover:bg-navy-800 disabled:opacity-60">{loading ? "Authenticating..." : copy.button}{!loading && <ArrowRight className="h-4 w-4" />}</button>
            </form>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-gray-100 pt-5 text-center text-[11px] text-gray-400"><Lock className="h-3 w-3" /><span>Secure procurement environment · All access is logged and audited.</span></div>
        </section>
      </div>
    </main>
  );
}
