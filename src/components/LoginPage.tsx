import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { Eye, EyeOff, Landmark, LockKeyhole } from "lucide-react";

interface Props {
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSwitchToRegister }: Props) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google login failed. Check Supabase and Google OAuth settings.");
    }
  };

  return (
    <div className="min-h-dvh bg-[#f7f7f4] px-4 py-8 text-black">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div className="hidden lg:block">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black bg-[#d7ff5f] px-4 py-2 text-xs font-black">
            <LockKeyhole className="h-4 w-4" /> Secure wallet access
          </div>
          <h1 className="text-6xl font-black leading-[0.95] tracking-tight">Open your Visa Kenya wallet.</h1>
          <p className="mt-5 max-w-lg text-base font-medium leading-7 text-zinc-600">
            Sign in to audit balances, send money, scan QR recipients, and manage solid-gradient cards.
          </p>
        </div>

        <div className="rounded-[28px] border border-black bg-white p-6 shadow-[8px_8px_0_#000]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-black bg-[#d7ff5f]">
              <Landmark className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm font-medium text-zinc-500">Sign in to continue to your wallet</p>
          </div>

          {error && <div className="mb-4 rounded-2xl border border-red-500 bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase text-zinc-600">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required className="w-full rounded-2xl border border-black bg-white px-4 py-3 font-bold text-black outline-none focus:shadow-[3px_3px_0_#000]" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase text-zinc-600">Password</span>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required className="w-full rounded-2xl border border-black bg-white px-4 py-3 pr-11 font-bold text-black outline-none focus:shadow-[3px_3px_0_#000]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-2xl border border-black bg-black py-3.5 text-sm font-black text-white shadow-[4px_4px_0_#d7ff5f] disabled:opacity-60">
              {loading ? "Signing in..." : "Open Wallet"}
            </button>
          </form>

          <button onClick={handleGoogleLogin} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-black bg-[#d7ff5f] py-3.5 text-sm font-black text-black shadow-[4px_4px_0_#000]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.2 3.31v2.78h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.78c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm font-bold text-zinc-600">
            Need a wallet? <button onClick={onSwitchToRegister} className="text-black underline">Start free</button>
          </p>
        </div>
      </div>
    </div>
  );
}
