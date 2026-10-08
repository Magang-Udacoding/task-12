"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2";

const CONTROL_SIZE =
  "min-h-[44px] px-3 py-1.5 pointer-fine:min-h-9 pointer-fine:py-1";

type NavLinkProps = {
  href: string;
  isActive: boolean;
  className?: string;
  children: ReactNode;
};

function NavLink({ href, isActive, className = "", children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center rounded-lg text-sm transition ${CONTROL_SIZE} ${FOCUS_RING} ${className} ${
        isActive
          ? "bg-baltic-blue/10 font-semibold text-baltic-blue"
          : "font-medium text-text-muted hover:bg-slate-50 hover:text-baltic-blue"
      }`}
    >
      {children}
    </Link>
  );
}

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

  return (
    <nav className="border-b border-border bg-surface sticky top-0 z-40 shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 md:px-6">
        <Link
          href="/"
          className={`shrink-0 rounded-md py-1 text-base font-bold text-baltic-blue md:text-lg ${FOCUS_RING}`}
        >
          Papan Bantuan Warga
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden md:block">
            <NavLink href="/" isActive={pathname === "/"}>
              Beranda
            </NavLink>
          </span>

          {user && (
            <>
              <NavLink href="/minta-bantu" isActive={pathname === "/minta-bantu"}>
                <span className="md:hidden">Buat</span>
                <span className="hidden md:inline">Minta Bantuan</span>
              </NavLink>

              <NavLink href="/bantuan-saya" isActive={pathname === "/bantuan-saya"}>
                <span className="md:hidden">Riwayat</span>
                <span className="hidden md:inline">Bantuan Saya</span>
              </NavLink>
            </>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`flex items-center justify-center rounded-lg bg-red-600 px-3.5 text-sm font-semibold text-white transition hover:bg-red-700 pointer-fine:px-4 ${CONTROL_SIZE} ${FOCUS_RING} focus-visible:ring-red-600`}
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              aria-current={pathname === "/login" ? "page" : undefined}
              className={`flex items-center justify-center rounded-lg px-4 text-sm font-semibold text-white shadow-xs transition ${CONTROL_SIZE} ${FOCUS_RING} ${
                pathname === "/login"
                  ? "bg-baltic-blue-hover"
                  : "bg-baltic-blue hover:bg-baltic-blue-hover"
              }`}
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
