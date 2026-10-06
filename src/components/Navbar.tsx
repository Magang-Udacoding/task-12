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
      window.alert(`Failed to Logout: ${error.message}`);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-lg font-bold text-baltic-blue">
          Papan Bantuan Warga
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-baltic-blue"
          >
            Home
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-baltic-blue px-4 py-2 text-sm font-medium text-white hover:bg-baltic-blue/90"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-baltic-blue px-4 py-2 text-sm font-medium text-white hover:bg-baltic-blue/90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
