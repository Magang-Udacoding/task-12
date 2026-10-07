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
      setError("Please fill in your email and password.");
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
        setError(`Registration failed: ${error.message}`);
        return;
      }

      if (data.session) {
        router.push("/");
        router.refresh();
        return;
      }

      setMessage(
        "Registration successful. Please check your email to confirm your account.",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(`Login failed: ${error.message}`);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-baltic-blue">
            Citizen's Help Board
          </p>

          <h1 className="text-2xl font-bold text-gray-900">
            {isRegister ? "Create Account" : "Login"}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {isRegister
              ? "Create an account to start sharing your requests for help."
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="yourname@mail.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="**********"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-baltic-blue px-4 py-2 font-medium text-white transition hover:bg-baltic-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-5 text-center">
          <p className="text-sm text-gray-600">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
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
            {isRegister ? "Log in here!" : "Register here!"}
          </button>
        </div>
      </section>
    </main>
  );
}
