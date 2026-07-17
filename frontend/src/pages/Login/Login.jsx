import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  Sparkles,
  Users,
} from 'lucide-react'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const handleSubmit = async (event) => {
  event.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || "Login Failed");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
  } catch (err) {
    setError("Unable to connect to server.");
  } finally {
    setLoading(false);
  }
};
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7ff] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1216px] items-center justify-center">
        <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(99,102,241,0.12),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(232,240,255,0.88))] shadow-[0_32px_80px_rgba(30,41,59,0.08)] ring-1 ring-white/70" />

        <div className="relative grid w-full min-h-[820px] gap-10 overflow-hidden rounded-[2rem] px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-12">
          <div className="absolute left-14 top-20 h-24 w-24 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute right-24 top-16 h-28 w-28 rounded-full bg-indigo-300/20 blur-3xl" />

          <section className="relative flex flex-col justify-center">
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  SocialMediaAutomation
                </p>
                <p className="text-sm text-slate-500">Enterprise social operations</p>
              </div>
            </div>

            <div className="max-w-xl">
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-[4rem] lg:leading-[0.95]">
                Welcome Back
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                Log in to manage your social media presence with AI-powered insights.
              </p>

              <form className="mt-12 max-w-md space-y-6" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-3 block text-sm font-medium text-slate-800">Email Address</span>
                  <input
                    type="email"
                    value={email}
onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white/90 px-5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-3 block text-sm font-medium text-slate-800">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white/90 px-5 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-slate-500 transition hover:text-slate-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember Me</span>
                  </label>
                  <button type="button" className="text-sm font-medium text-blue-700 transition hover:text-blue-800">
                    Forgot Password?
                  </button>
                </div>
               {error && (
  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
    {error}
  </div>
)}

                <button
                  type="submit"
                    disabled={loading}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 text-base font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.30)] transition hover:brightness-105 active:translate-y-[1px]"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                  
                  <ArrowRight className="h-5 w-5" />
                </button>

                <p className="text-center text-sm text-slate-600">
                  Don&apos;t have an account?{' '}
                  <button type="button" className="font-medium text-blue-700 transition hover:text-blue-800">
                    Create an account
                  </button>
                </p>
              </form>
            </div>
          </section>

          <section className="relative flex items-center justify-center">
            <div className="absolute left-8 top-10 text-blue-500/80">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="flex w-full max-w-[560px] flex-col gap-8 pb-8">
              <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_18px_48px_rgba(148,163,184,0.22)] backdrop-blur">
                <div className="rounded-[1.6rem] bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Users className="h-4 w-4 text-blue-500" />
                      Live dashboard preview
                    </div>
                    <div className="rounded-full bg-slate-900 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white">
                      Sync
                    </div>
                  </div>

                  <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
                    <div className="rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500">Campaign performance</p>
                          <p className="mt-1 text-xl font-semibold text-slate-900">+42.8%</p>
                        </div>
                        <BarChart3 className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex h-40 items-end gap-3 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50 p-4">
                        <div className="h-10 w-3 rounded-full bg-slate-200" />
                        <div className="h-16 w-3 rounded-full bg-blue-200" />
                        <div className="h-24 w-3 rounded-full bg-blue-300" />
                        <div className="h-20 w-3 rounded-full bg-slate-300" />
                        <div className="h-28 w-3 rounded-full bg-blue-400" />
                        <div className="h-18 w-3 rounded-full bg-slate-200" />
                        <div className="h-32 w-3 rounded-full bg-blue-500" />
                        <div className="h-26 w-3 rounded-full bg-slate-300" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm">
                        <p className="text-xs text-slate-500">Connected channels</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <ChannelBadge label="in" tone="linkedin" />
                          <ChannelBadge label="f" tone="facebook" />
                          <ChannelBadge label="ig" tone="instagram" />
                          <ChannelBadge label="x" tone="twitter" />
                        </div>
                      </div>

                      <div className="rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <Avatar initials="JD" color="blue" />
                            <Avatar initials="AS" color="indigo" />
                            <Avatar initials="ML" color="slate" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">Trusted by 10k+ enterprises</span>
                        </div>
                        <p className="text-sm italic leading-6 text-slate-600">
                          “The AI-driven post timing increased our engagement by 40% in just one month.”
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-auto flex w-fit items-center gap-2 rounded-[1.25rem] border border-white/80 bg-white/85 px-5 py-4 shadow-[0_18px_48px_rgba(148,163,184,0.18)] backdrop-blur">
                <div className="grid grid-cols-3 items-end gap-1">
                  <span className="h-6 w-2 rounded-full bg-blue-300" />
                  <span className="h-10 w-2 rounded-full bg-blue-400" />
                  <span className="h-14 w-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Performance snapshot</p>
                  <p className="text-xs text-slate-500">Realtime overview</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function ChannelBadge({ label, tone }) {
  const toneClasses = {
    linkedin: 'bg-blue-600 text-white',
    facebook: 'bg-sky-500 text-white',
    instagram: 'bg-pink-500 text-white',
    twitter: 'bg-slate-900 text-white',
  }

  return (
    <span className={`grid h-11 w-11 place-items-center rounded-2xl text-sm font-semibold shadow-sm ${toneClasses[tone]}`}>
      {label}
    </span>
  )
}

function Avatar({ initials, color }) {
  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    indigo: 'bg-indigo-500 text-white',
    slate: 'bg-slate-400 text-white',
  }

  return (
    <span
      className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[0.65rem] font-semibold shadow-sm ${colorClasses[color]}`}
    >
      {initials}
    </span>
  )
}

export default Login