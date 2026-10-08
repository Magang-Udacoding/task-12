"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
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
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-bold text-baltic-blue md:text-lg"
        >
          Papan Bantuan Warga
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="hidden text-sm font-medium text-gray-700 hover:text-baltic-blue md:inline"
          >
            Beranda
          </Link>

          {user && (
            <>
              <Link
                href="/minta-bantu"
                className="text-sm font-medium text-gray-700 hover:text-baltic-blue"
              >
                <span className="md:hidden">Buat</span>
                <span className="hidden md:inline">Minta Bantuan</span>
              </Link>

              <Link
                href="/bantuan-saya"
                className="text-sm font-medium text-gray-700 hover:text-baltic-blue"
              >
                <span className="md:hidden">Riwayat</span>
                <span className="hidden md:inline">Bantuan Saya</span>
              </Link>
            </>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-baltic-blue px-3 py-2 text-sm font-medium text-white hover:bg-baltic-blue/90 md:px-4"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-baltic-blue px-3 py-2 text-sm font-medium text-white hover:bg-baltic-blue/90 md:px-4"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
