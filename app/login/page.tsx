"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Harap isi email dan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setError(`Pendaftaran gagal: ${error.message}`);
        return;
      }

      if (data.session) {
        router.push("/");
        return;
      }

      setMessage(
        "Pendaftaran berhasil. Silakan cek email Anda atau masuk langsung.",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(`Login gagal: ${error.message}`);
      return;
    }

    router.push("/");
  };

  const handleGoogleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(`Gagal masuk dengan Google: ${error.message}`);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-md items-center px-4 py-8 md:py-12">
      <section className="w-full rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="mb-1 text-sm font-semibold tracking-wide text-blue-energy-text uppercase">
            Papan Bantuan Warga
          </p>

          <h1 className="text-2xl font-bold text-text-main">
            {isRegister ? "Buat Akun Baru" : "Masuk ke Akun"}
          </h1>

          <p className="mt-2 text-sm text-text-muted leading-relaxed">
            {isRegister
              ? "Daftar untuk mulai memposting permohonan bantuan bagi keluarga atau tetangga Anda."
              : "Masuk untuk mengelola dan memantau status permintaan bantuan Anda."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-text-main"
            >
              Alamat Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-text-main"
            >
              Kata Sandi
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-lg border border-alert-border bg-alert-bg px-3.5 py-2.5 text-sm font-medium text-alert-text"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-status-done-bg px-3.5 py-2.5 text-sm font-medium text-status-done-text"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-baltic-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-baltic-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : isRegister ? "Daftar Akun" : "Masuk"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-2.5 font-medium text-text-muted">
              atau
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-main transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
        >
          <svg
            className="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Masuk dengan Google
        </button>

        <div className="mt-6 border-t border-border pt-5 text-center">
          <p className="text-sm text-text-muted">
            {isRegister ? "Sudah memiliki akun?" : "Belum memiliki akun?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRegister((current) => !current);
              setError("");
              setMessage("");
            }}
            className="mt-1.5 inline-flex min-h-[36px] items-center text-sm font-semibold text-baltic-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue rounded"
          >
            {isRegister ? "Masuk di sini" : "Daftar sekarang"}
          </button>
        </div>
      </section>
    </main>
  );
}
