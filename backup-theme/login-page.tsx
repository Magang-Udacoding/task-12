// Backup login/page.tsx
/* eslint-disable react/no-unescaped-entities */
"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-baltic-blue">
            Papan Bantuan Warga
          </p>

          <h1 className="text-2xl font-bold text-gray-900">
            {isRegister ? "Buat Akun" : "Masuk"}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {isRegister
              ? "Daftar untuk mulai memposting permintaan bantuan."
              : "Masuk untuk mengelola permintaan bantuan Anda."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Kata Sandi
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-baltic-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-baltic-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">atau</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Masuk dengan Google
        </button>

        <div className="mt-6 border-t border-gray-200 pt-5 text-center">
          <p className="text-sm text-gray-600">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRegister((current) => !current);
              setError("");
              setMessage("");
            }}
            className="mt-1 text-sm font-medium text-baltic-blue hover:underline"
          >
            {isRegister ? "Masuk di sini" : "Daftar di sini"}
          </button>
        </div>
      </section>
    </main>
  );
}
