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

  const desktopLinkClasses = (path: string) =>
    `inline-flex items-center px-3 py-1.5 text-sm rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue ${
      isActive(path)
        ? "bg-baltic-blue/10 text-baltic-blue font-semibold"
        : "text-text-muted hover:text-baltic-blue hover:bg-slate-50 font-medium"
    }`;

  const mobileLinkClasses = (path: string) =>
    `inline-flex items-center px-2.5 py-1 text-xs rounded-md shrink-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue ${
      isActive(path)
        ? "bg-baltic-blue/10 text-baltic-blue font-semibold"
        : "text-text-muted hover:text-baltic-blue hover:bg-slate-50 font-medium"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-surface shadow-xs">
      {/* Baris Utama: Logo & Navigasi Layar Lebar (sm:) atau Tombol Aksi Mobile (< sm) */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-bold text-baltic-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue rounded-md py-0.5"
        >
          Papan Bantuan Warga
        </Link>

        {/* Navigasi Desktop / Layar Lebar (>= sm) */}
        <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={desktopLinkClasses("/")}
          >
            Beranda
          </Link>

          {user && (
            <>
              <Link
                href="/minta-bantu"
                aria-current={isActive("/minta-bantu") ? "page" : undefined}
                className={desktopLinkClasses("/minta-bantu")}
              >
                Minta Bantuan
              </Link>

              <Link
                href="/bantuan-saya"
                aria-current={isActive("/bantuan-saya") ? "page" : undefined}
                className={desktopLinkClasses("/bantuan-saya")}
              >
                Bantuan Saya
              </Link>
            </>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-2xs transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              className={`ml-1 inline-flex items-center justify-center rounded-md px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue ${
                isActive("/login")
                  ? "bg-baltic-blue-hover text-white shadow-2xs"
                  : "bg-baltic-blue text-white hover:bg-baltic-blue-hover shadow-2xs"
              }`}
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Tombol Aksi Mobile (< sm) */}
        <div className="flex sm:hidden items-center">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white shadow-2xs transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue ${
                isActive("/login")
                  ? "bg-baltic-blue-hover text-white shadow-2xs"
                  : "bg-baltic-blue text-white hover:bg-baltic-blue-hover shadow-2xs"
              }`}
            >
              Masuk
            </Link>
          )}
        </div>
      </div>

      {/* Baris Navigasi Mobile (< sm) */}
      <div className="flex sm:hidden items-center border-t border-border/60 px-4 py-1 overflow-x-auto gap-1 scrollbar-none">
        <Link
          href="/"
          aria-current={isActive("/") ? "page" : undefined}
          className={mobileLinkClasses("/")}
        >
          Beranda
        </Link>

        {user && (
          <>
            <Link
              href="/minta-bantu"
              aria-current={isActive("/minta-bantu") ? "page" : undefined}
              className={mobileLinkClasses("/minta-bantu")}
            >
              Minta Bantuan
            </Link>

            <Link
              href="/bantuan-saya"
              aria-current={isActive("/bantuan-saya") ? "page" : undefined}
              className={mobileLinkClasses("/bantuan-saya")}
            >
              Bantuan Saya
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
