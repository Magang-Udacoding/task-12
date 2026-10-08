"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { HelpRequest } from "@/lib/types";
import { AlertCircle, Check, Clock, Trash2, X } from "lucide-react";

export default function BantuanSayaPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // State Modal Konfirmasi Hapus (Opsi 2)
  const [targetDeleteRequest, setTargetDeleteRequest] = useState<HelpRequest | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setCurrentUser(user);
      setAuthChecked(true);

      const { data, error: fetchError } = await supabase
        .from("help_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setLoading(false);

      if (fetchError) {
        setError("Gagal memuat data riwayat. Coba muat ulang halaman.");
        return;
      }

      setRequests(data ?? []);
    };

    loadData();
  }, [router]);

  const confirmDelete = async () => {
    if (!targetDeleteRequest) return;
    const id = targetDeleteRequest.id;

    if (!currentUser) {
      setError("Sesi pengguna tidak valid. Silakan masuk kembali.");
      return;
    }

    setDeletingId(id);
    setError("");

    const { data, error: deleteError } = await supabase
      .from("help_requests")
      .delete()
      .eq("id", id)
      .eq("user_id", currentUser.id)
      .select();

    setDeletingId(null);
    setTargetDeleteRequest(null);

    if (deleteError) {
      setError(`Gagal menghapus permohonan: ${deleteError.message}`);
      return;
    }

    if (!data || data.length === 0) {
      setError(
        "Permohonan bantuan tidak dapat dihapus. Anda hanya dapat menghapus permohonan milik Anda sendiri."
      );
      return;
    }

    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  if (!authChecked) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-md items-center justify-center px-4">
        <p className="text-sm font-medium text-text-muted">Memeriksa sesi pengguna...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12 md:px-6">
      {/* Modal Dialog Konfirmasi Hapus Kustom (Opsi 2) */}
      {targetDeleteRequest && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setTargetDeleteRequest(null)}
                aria-label="Tutup modal"
                className="rounded p-1 text-text-muted hover:text-text-main"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 id="modal-delete-title" className="text-lg font-bold text-text-main">
                Hapus Permintaan Bantuan?
              </h2>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                Apakah Anda yakin ingin menghapus permohonan <span className="font-semibold text-text-main">&quot;{targetDeleteRequest.title}&quot;</span>? Tindakan ini bersifat permanen dan data tidak dapat dipulihkan.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setTargetDeleteRequest(null)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-slate-50 hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId !== null ? "Menghapus..." : "Ya, Hapus Permintaan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mb-6 flex flex-wrap items-start justify-between gap-4 md:mb-8">
        <div>
          <p className="mb-1 text-sm font-semibold tracking-wide text-blue-energy-text uppercase">
            Papan Bantuan Warga
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-text-main md:text-3xl">
            Bantuan Saya
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Riwayat dan status seluruh permohonan bantuan yang telah Anda publikasikan.
          </p>
        </div>

        <Link
          href="/minta-bantu"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-baltic-blue px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-baltic-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
        >
          Buat Permintaan Baru
        </Link>
      </section>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2.5 rounded-xl border border-alert-border bg-alert-bg px-4 py-3 text-sm font-medium text-alert-text"
        >
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-32 animate-pulse rounded-xl border border-border bg-surface shadow-xs"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center shadow-xs">
          <h2 className="text-lg font-semibold text-text-main">
            Belum ada permintaan bantuan aktif
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Anda belum pernah membuat postingan bantuan. Jika membutuhkan bantuan atau ingin mencarikan bantuan untuk tetangga, silakan buat permintaan baru.
          </p>
          <Link
            href="/minta-bantu"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-baltic-blue px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-baltic-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
          >
            Buat Permintaan Bantuan Pertama
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li
              key={request.id}
              className="rounded-xl border border-border bg-surface p-5 shadow-xs transition hover:border-slate-300 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 whitespace-nowrap">
                    {request.category}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                      request.status === "Selesai"
                        ? "border-green-200 bg-status-done-bg text-status-done-text"
                        : "border-amber-200 bg-status-waiting-bg text-status-waiting-text"
                    }`}
                  >
                    {request.status === "Selesai" ? (
                      <Check className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <Clock className="h-3 w-3" aria-hidden="true" />
                    )}
                    {request.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/bantuan/${request.id}`}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-baltic-blue transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
                  >
                    Lihat
                  </Link>

                  <button
                    type="button"
                    onClick={() => setTargetDeleteRequest(request)}
                    disabled={deletingId === request.id}
                    className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/60 px-3.5 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

              <h2 className="mt-3 text-base font-semibold text-text-main md:text-lg">
                {request.title}
              </h2>

              <p className="mt-1.5 line-clamp-2 text-sm text-text-muted leading-relaxed">
                {request.description}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs font-medium text-text-muted">
                <span className="font-semibold text-blue-energy-text">{request.location}</span>
                <span>ID #{request.id}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
