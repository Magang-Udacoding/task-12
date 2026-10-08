"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

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
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      window.alert(`Gagal keluar: ${error.message}`);
    }
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
              onClick={handleLogout}
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
              onClick={handleLogout}
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
    </nav>
  );
}
