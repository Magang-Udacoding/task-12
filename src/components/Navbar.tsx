"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  Menu,
  X,
  Home,
  PlusCircle,
  ClipboardList,
  LogOut,
  LogIn,
} from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

type NavLinkProps = {
  href: string;
  isActive: boolean;
  children: ReactNode;
};

function DesktopNavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex min-h-[44px] items-center rounded-lg px-3.5 py-2 text-sm font-semibold transition ${FOCUS_RING} focus-visible:ring-baltic-blue ${
        isActive
          ? "bg-baltic-blue/10 text-baltic-blue shadow-2xs"
          : "text-text-muted hover:bg-slate-50 hover:text-baltic-blue"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Tutup menu mobile ketika navigasi berpindah rute
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Tutup menu mobile ketika tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    const { error } = await supabase.auth.signOut();

    if (error) {
      window.alert(`Gagal keluar: ${error.message}`);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-6">
        {/* Brand / Logo */}
        <Link
          href="/"
          className={`shrink-0 rounded-md py-1 text-base font-bold text-baltic-blue md:text-lg ${FOCUS_RING} focus-visible:ring-baltic-blue`}
        >
          Papan Bantuan Warga
        </Link>

        {/* Desktop Navigation (>= md) */}
        <nav
          aria-label="Navigasi Desktop"
          className="hidden items-center gap-1.5 md:flex"
        >
          <DesktopNavLink href="/" isActive={isActive("/")}>
            Beranda
          </DesktopNavLink>

          {user && (
            <>
              <DesktopNavLink
                href="/minta-bantu"
                isActive={isActive("/minta-bantu")}
              >
                Minta Bantuan
              </DesktopNavLink>

              <DesktopNavLink
                href="/bantuan-saya"
                isActive={isActive("/bantuan-saya")}
              >
                Bantuan Saya
              </DesktopNavLink>
            </>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`ml-2 flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 ${FOCUS_RING} focus-visible:ring-red-600`}
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              className={`ml-2 flex min-h-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-xs transition ${FOCUS_RING} focus-visible:ring-baltic-blue ${
                isActive("/login")
                  ? "bg-baltic-blue-hover"
                  : "bg-baltic-blue hover:bg-baltic-blue-hover"
              }`}
            >
              Masuk
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Button (< md) */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? "Tutup menu utama" : "Buka menu utama"}
            className={`flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-text-main transition hover:bg-slate-50 ${FOCUS_RING} focus-visible:ring-baltic-blue`}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel (< md) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-surface px-4 py-4 shadow-lg md:hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <nav aria-label="Navigasi Mobile" className="flex flex-col gap-1">
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${FOCUS_RING} focus-visible:ring-baltic-blue ${
                isActive("/")
                  ? "bg-baltic-blue/10 text-baltic-blue"
                  : "text-text-main hover:bg-slate-50 hover:text-baltic-blue"
              }`}
            >
              <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Beranda</span>
            </Link>

            {user && (
              <>
                <Link
                  href="/minta-bantu"
                  aria-current={isActive("/minta-bantu")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${FOCUS_RING} focus-visible:ring-baltic-blue ${
                    isActive("/minta-bantu")
                      ? "bg-baltic-blue/10 text-baltic-blue"
                      : "text-text-main hover:bg-slate-50 hover:text-baltic-blue"
                  }`}
                >
                  <PlusCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Minta Bantuan</span>
                </Link>

                <Link
                  href="/bantuan-saya"
                  aria-current={isActive("/bantuan-saya")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${FOCUS_RING} focus-visible:ring-baltic-blue ${
                    isActive("/bantuan-saya")
                      ? "bg-baltic-blue/10 text-baltic-blue"
                      : "text-text-main hover:bg-slate-50 hover:text-baltic-blue"
                  }`}
                >
                  <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Bantuan Saya</span>
                </Link>
              </>
            )}

            <div className="my-2 border-t border-border" />

            {user ? (
              <div className="flex flex-col gap-2 pt-1">
                {user.email && (
                  <p className="truncate px-3.5 text-xs text-text-muted">
                    Masuk sebagai <span className="font-semibold text-text-main">{user.email}</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 ${FOCUS_RING} focus-visible:ring-red-600`}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                aria-current={isActive("/login") ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-baltic-blue px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-baltic-blue-hover ${FOCUS_RING} focus-visible:ring-baltic-blue`}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>Masuk ke Akun</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
