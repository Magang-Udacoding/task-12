"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type HelpRequest = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  user_id: string;
  contact: string | null;
  created_at: string;
};

const CATEGORIES = [
  "Semua",
  "Medis & Darurat",
  "Sembako",
  "Peminjaman Alat",
  "Tenaga Relawan",
] as const;

export default function HomePage() {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHelpRequests = async () => {
      setLoading(true);
      setError("");

      let query = supabase
        .from("help_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (activeCategory !== "Semua") {
        query = query.eq("category", activeCategory);
      }

      const { data, error } = await query;

      setLoading(false);

      if (error) {
        setError("Gagal memuat data. Coba muat ulang halaman.");
        return;
      }

      setHelpRequests(data ?? []);
    };

    loadHelpRequests();
  }, [activeCategory]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <section className="mb-10">
        <p className="mb-2 text-sm font-medium text-baltic-blue">
          Papan Bantuan Warga
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Saling Bantu, Saling Jaga
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Temukan permintaan bantuan warga dan ulurkan tangan Anda.
        </p>

        <Link
          href="/minta-bantu"
          className="mt-5 inline-block rounded-lg bg-baltic-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-baltic-blue/90"
        >
          Buat Permintaan Bantuan
        </Link>
      </section>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-baltic-blue text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:border-baltic-blue hover:text-baltic-blue"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : helpRequests.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Belum ada permintaan bantuan
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeCategory === "Semua"
              ? "Jadilah yang pertama memposting permintaan bantuan."
              : `Belum ada permintaan di kategori "${activeCategory}".`}
          </p>
        </div>
      ) : (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Permintaan Bantuan
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {helpRequests.map((request) => (
              <Link
                key={request.id}
                href={`/bantuan/${request.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-baltic-blue hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="rounded-md bg-turquoise/20 px-2.5 py-1 text-xs font-medium text-gray-800">
                    {request.category}
                  </span>

                  <span
                    className={`shrink-0 text-xs font-medium ${
                      request.status === "Selesai"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900">
                  {request.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {request.description}
                </p>

                <p className="mt-3 text-sm font-medium text-baltic-blue">
                  {request.location}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}