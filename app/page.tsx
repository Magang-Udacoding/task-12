"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { CategoryType, StatusType } from "@/lib/card-styles";
import { AlertCircle, ChevronDown } from "lucide-react";

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

const PAGE_SIZE = 6;

export default function HomePage() {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError("");
    }

    const currentOffset = isLoadMore ? helpRequests.length : 0;

    let query = supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .range(currentOffset, currentOffset + PAGE_SIZE - 1);

    if (activeCategory !== "Semua") {
      query = query.eq("category", activeCategory);
    }

    const { data, error: fetchError } = await query;

    if (isLoadMore) {
      setLoadingMore(false);
    } else {
      setLoading(false);
    }

    if (fetchError) {
      setError("Gagal memuat data bantuan. Coba muat ulang halaman.");
      return;
    }

    const fetchedItems = data ?? [];

    if (isLoadMore) {
      setHelpRequests((prev) => [...prev, ...fetchedItems]);
    } else {
      setHelpRequests(fetchedItems);
    }

    // Jika data yang didapat lebih sedikit dari PAGE_SIZE, berarti sudah habis
    setHasMore(fetchedItems.length === PAGE_SIZE);
  };

  useEffect(() => {
    loadRequests(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12 md:px-6">
      <section className="mb-8 md:mb-10">
        <p className="mb-2 text-sm font-semibold tracking-wide text-baltic-blue uppercase">
          Papan Bantuan Warga
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-text-main md:text-4xl">
          Saling Bantu, Saling Jaga
        </h1>

        <p className="mt-3 max-w-2xl text-base text-text-muted leading-relaxed">
          Temukan permintaan bantuan warga di sekitar Anda dan ulurkan tangan untuk saling meringankan beban sesama.
        </p>

        <Link
          href="/minta-bantu"
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-baltic-blue px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-baltic-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
        >
          Buat Permintaan Bantuan
        </Link>
      </section>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-xl border border-alert-border bg-alert-bg px-4 py-3 text-sm font-medium text-alert-text"
        >
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Kategori dengan target sentuh ramah jempol */}
      <div className="mb-8 flex flex-wrap gap-2 sm:gap-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`inline-flex min-h-[40px] items-center rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 ${
              activeCategory === cat
                ? "bg-baltic-blue text-white shadow-xs font-semibold"
                : "border border-border bg-surface text-text-muted hover:border-baltic-blue hover:text-baltic-blue"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-52 animate-pulse rounded-xl border border-border bg-surface shadow-xs"
            />
          ))}
        </div>
      ) : helpRequests.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center shadow-xs">
          <h2 className="text-lg font-semibold text-text-main">
            Belum ada permintaan bantuan
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {activeCategory === "Semua"
              ? "Jadilah yang pertama memposting permintaan bantuan untuk warga."
              : `Belum ada permintaan di kategori "${activeCategory}".`}
          </p>
        </div>
      ) : (
        <section>
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-text-main">
              Permintaan Bantuan Warga
            </h2>
            <span className="text-xs font-medium text-text-muted">
              Menampilkan {helpRequests.length} permintaan
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {helpRequests.map((request) => (
              <Card
                key={request.id}
                category={request.category as CategoryType}
                status={request.status as StatusType}
                title={request.title}
                description={request.description}
                location={request.location}
                date={request.created_at}
                href={`/bantuan/${request.id}`}
              />
            ))}
          </div>

          {/* Tombol Muat Lebih Banyak (Opsi 1) */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => loadRequests(true)}
                disabled={loadingMore}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-text-main shadow-xs transition hover:bg-slate-50 hover:border-baltic-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                <span>{loadingMore ? "Memuat data tambahan..." : "Muat Lebih Banyak Permintaan"}</span>
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}