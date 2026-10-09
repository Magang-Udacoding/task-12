"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { AlertCircle, LogOut, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (
        typeof window !== "undefined" &&
        window.sessionStorage.getItem("is_registering") === "true"
      ) {
        return;
      }
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");

    const { error } = await supabase.auth.signOut();

    setLoggingOut(false);

    if (error) {
      setLogoutError(`Gagal keluar: ${error.message}`);
      return;
    }

    setShowLogoutModal(false);
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  const getLinkClasses = (path: string) =>
    `flex min-h-[44px] shrink-0 items-center px-3.5 py-2 text-sm rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 ${
      isActive(path)
        ? "bg-baltic-blue/10 text-baltic-blue font-bold shadow-2xs"
        : "text-text-muted hover:text-baltic-blue hover:bg-slate-50 font-medium"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-surface shadow-xs">
      {/* Baris Utama: Brand Logo + Navigasi Desktop / Tombol Aksi Mobile */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-bold text-baltic-blue md:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 rounded-md py-1"
        >
          Papan Bantuan Warga
        </Link>

        {/* Navigasi Desktop (>= md) */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={getLinkClasses("/")}
          >
            Beranda
          </Link>

          {user && (
            <>
              <Link
                href="/minta-bantu"
                aria-current={isActive("/minta-bantu") ? "page" : undefined}
                className={getLinkClasses("/minta-bantu")}
              >
                Minta Bantuan
              </Link>

              <Link
                href="/bantuan-saya"
                aria-current={isActive("/bantuan-saya") ? "page" : undefined}
                className={getLinkClasses("/bantuan-saya")}
              >
                Bantuan Saya
              </Link>
            </>
          )}

          {user ? (
            <button
              type="button"
              onClick={() => {
                setLogoutError("");
                setShowLogoutModal(true);
              }}
              className="flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              className={`flex min-h-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 ${
                isActive("/login")
                  ? "bg-baltic-blue-hover text-white shadow-xs"
                  : "bg-baltic-blue text-white hover:bg-baltic-blue-hover shadow-xs"
              }`}
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Tombol Aksi Mobile (< md: Masuk / Keluar) */}
        <div className="flex md:hidden items-center">
          {user ? (
            <button
              type="button"
              onClick={() => {
                setLogoutError("");
                setShowLogoutModal(true);
              }}
              className="flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              className={`flex min-h-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 ${
                isActive("/login")
                  ? "bg-baltic-blue-hover text-white shadow-xs"
                  : "bg-baltic-blue text-white hover:bg-baltic-blue-hover shadow-xs"
              }`}
            >
              Masuk
            </Link>
          )}
        </div>
      </div>

      {/* Baris Navigasi Mobile (< md): Tab Navigasi Langsung dengan Active Link & Ukuran Standar */}
      <div className="flex md:hidden items-center border-t border-border/70 px-4 py-1.5 overflow-x-auto gap-1.5 scrollbar-none">
        <Link
          href="/"
          aria-current={isActive("/") ? "page" : undefined}
          className={getLinkClasses("/")}
        >
          Beranda
        </Link>

        {user && (
          <>
            <Link
              href="/minta-bantu"
              aria-current={isActive("/minta-bantu") ? "page" : undefined}
              className={getLinkClasses("/minta-bantu")}
            >
              Minta Bantuan
            </Link>

            <Link
              href="/bantuan-saya"
              aria-current={isActive("/bantuan-saya") ? "page" : undefined}
              className={getLinkClasses("/bantuan-saya")}
            >
              Bantuan Saya
            </Link>
          </>
        )}
      </div>

      {/* Modal Dialog Konfirmasi Logout */}
      {showLogoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                aria-label="Tutup modal"
                className="rounded p-1 text-text-muted hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2
                id="modal-logout-title"
                className="text-lg font-bold text-text-main"
              >
                Konfirmasi Keluar
              </h2>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                Apakah Anda yakin ingin keluar dari akun Anda? Anda dapat masuk kembali kapan saja untuk mengelola atau membuat permohonan bantuan.
              </p>
            </div>

            {logoutError && (
              <div
                role="alert"
                className="mt-4 flex items-center gap-2 rounded-lg border border-alert-border bg-alert-bg px-3.5 py-2.5 text-sm font-medium text-alert-text"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{logoutError}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-slate-50 hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Mengeluarkan..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
