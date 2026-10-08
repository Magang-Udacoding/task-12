"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { HelpRequest } from "@/lib/types";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";

function buildWhatsAppUrl(contact: string, title: string): string {
  let digits = contact.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (digits.startsWith("8")) {
    digits = "62" + digits;
  }
  const message = encodeURIComponent(
    `Halo, saya siap membantu masalah Anda terkait permintaan: "${title}".`
  );
  return `https://wa.me/${digits}?text=${message}`;
}

export default function DetailBantuanPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [helped, setHelped] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isNaN(id)) return;

    let isMounted = true;

    const loadData = async () => {
      const [
        { data: requestData, error: requestError },
        {
          data: { user: currentUser },
        },
      ] = await Promise.all([
        supabase.from("help_requests").select("*").eq("id", id).single(),
        supabase.auth.getUser(),
      ]);

      if (!isMounted) return;

      setLoading(false);

      if (requestError) {
        setFetchError("Permintaan bantuan tidak ditemukan atau telah dihapus.");
        return;
      }

      setRequest(requestData);
      setUser(currentUser);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleHelp = async () => {
    setSubmitting(true);
    setActionError("");

    const { data, error: updateError } = await supabase
      .from("help_requests")
      .update({ status: "Selesai" })
      .eq("id", id)
      .eq("status", "Menunggu")
      .select();

    setSubmitting(false);

    if (updateError) {
      setActionError(`Gagal memperbarui status: ${updateError.message}`);
      return;
    }

    if (!data || data.length === 0) {
      setActionError(
        "Permintaan bantuan tidak dapat diperbarui. Mungkin status sudah diubah oleh relawan lain atau data tidak ditemukan."
      );
      return;
    }

    setRequest((prev) => (prev ? { ...prev, status: "Selesai" } : prev));
    setHelped(true);
    setShowToast(true);

    // Auto-dismiss toast setelah 6 detik
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  if (isNaN(id)) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 md:px-6">
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-alert-border bg-alert-bg px-4 py-3 text-sm font-medium text-alert-text"
        >
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>ID permohonan bantuan tidak valid.</span>
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-[40px] items-center text-sm font-semibold text-baltic-blue hover:underline"
        >
          &larr; Kembali ke Beranda
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 md:px-6">
        <div className="h-72 animate-pulse rounded-2xl border border-border bg-surface shadow-xs" />
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 md:px-6">
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-alert-border bg-alert-bg px-4 py-3 text-sm font-medium text-alert-text"
        >
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{fetchError}</span>
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-[40px] items-center text-sm font-semibold text-baltic-blue hover:underline"
        >
          &larr; Kembali ke Beranda
        </Link>
      </main>
    );
  }

  if (!request) return null;

  const isOwner = user?.id === request.user_id;
  const canHelp = user !== null && !isOwner && request.status === "Menunggu";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 md:px-6">
      {/* Toast Notification (Opsi 3) */}
      {showToast && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-50 flex items-start gap-3 rounded-xl border border-green-300 bg-white p-4 text-slate-900 shadow-lg animate-in fade-in slide-in-from-bottom-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-bold text-emerald-900">Kontribusi Berhasil!</p>
            <p className="mt-0.5 text-text-muted">
              Status telah diperbarui menjadi Selesai. Anda kini dapat menghubungi peminta langsung.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            aria-label="Tutup pemberitahuan"
            className="text-text-muted hover:text-text-main p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Link
        href="/"
        className="mb-6 inline-flex min-h-[40px] items-center text-sm font-semibold text-baltic-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue rounded"
      >
        &larr; Kembali ke Beranda
      </Link>

      <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {request.category}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              request.status === "Selesai"
                ? "border-green-200 bg-status-done-bg text-status-done-text"
                : "border-amber-200 bg-status-waiting-bg text-status-waiting-text"
            }`}
          >
            {request.status === "Selesai" ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {request.status}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-text-main md:text-3xl">
          {request.title}
        </h1>

        <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-blue-energy-text">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{request.location}</span>
        </div>

        <div className="my-6 border-t border-border/80" />

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Rincian Kebutuhan
          </h2>
          <p className="mt-2 text-base leading-relaxed text-text-main/90 whitespace-pre-line">
            {request.description}
          </p>
        </div>

        {helped && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-status-done-bg px-4 py-3 text-sm font-semibold text-status-done-text">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Terima kasih! Anda telah bersedia membantu permohonan warga ini.</span>
            </div>

            {request.contact ? (
              <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Kontak Peminta Bantuan</span>
                  </div>
                  <span className="text-sm font-bold text-teal-950 font-mono">
                    {request.contact}
                  </span>
                </div>

                <p className="text-xs text-teal-800 leading-relaxed">
                  Hubungi langsung warga peminta bantuan untuk koordinasi penyerahan barang atau bantuan tenaga.
                </p>

                {/* Tombol Hubungi WhatsApp */}
                <a
                  href={buildWhatsAppUrl(request.contact, request.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Hubungi via WhatsApp (Saya Siap Membantu)</span>
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-slate-50 p-4 text-xs text-text-muted">
                Peminta tidak mencantumkan nomor kontak langsung. Anda dapat berkoordinasi langsung di lokasi yang tercantum.
              </div>
            )}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-lg border border-alert-border bg-alert-bg px-3.5 py-2.5 text-sm font-medium text-alert-text"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{actionError}</span>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-6">
          {canHelp && !helped && (
            <button
              type="button"
              onClick={handleHelp}
              disabled={submitting}
              className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-baltic-blue px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-baltic-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? "Memproses Bantuan..." : "Saya Ingin Membantu"}
            </button>
          )}

          {!user && request.status === "Menunggu" && (
            <p className="text-sm text-text-muted">
              Silakan{" "}
              <Link
                href="/login"
                className="font-semibold text-baltic-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue rounded"
              >
                Masuk ke akun
              </Link>{" "}
              untuk dapat merespons dan membantu warga ini.
            </p>
          )}

          {isOwner && (
            <p className="text-sm text-text-muted">
              Ini adalah permohonan bantuan yang Anda buat. Anda dapat memantau atau menghapusnya dari halaman{" "}
              <Link
                href="/bantuan-saya"
                className="font-semibold text-baltic-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue rounded"
              >
                Bantuan Saya
              </Link>
              .
            </p>
          )}

          {request.status === "Selesai" && !helped && (
            <div className="flex items-center gap-2 text-sm font-semibold text-status-done-text">
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>Permintaan bantuan ini sudah selesai ditangani oleh relawan.</span>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
