"use client";

export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { HELP_CATEGORIES } from "@/lib/card-styles";


export default function MintaBantuPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Judul permohonan bantuan tidak boleh kosong.");
      return;
    }
    if (!description.trim()) {
      setError("Deskripsi kebutuhan bantuan tidak boleh kosong.");
      return;
    }
    if (!category.trim()) {
      setError("Silakan pilih kategori bantuan.");
      return;
    }
    if (!location.trim()) {
      setError("Lokasi kota/daerah tidak boleh kosong.");
      return;
    }
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error: insertError } = await supabase.from("help_requests").insert({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      contact: contact.trim() || null,
      user_id: user.id,
      status: "Menunggu",
    });

    setSubmitting(false);

    if (insertError) {
      setError(`Gagal menyimpan permintaan bantuan: ${insertError.message}`);
      return;
    }

    router.push("/");
  };

  if (!authChecked) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-md items-center justify-center px-4">
        <p className="text-sm font-medium text-text-muted">Memeriksa sesi pengguna...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 md:px-6">
      <section className="mb-6 md:mb-8">
        <p className="mb-1 text-sm font-semibold tracking-wide text-blue-energy-text uppercase">
          Papan Bantuan Warga
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-text-main md:text-3xl">
          Buat Permintaan Bantuan
        </h1>
        <p className="mt-2 text-sm text-text-muted leading-relaxed">
          Ceritakan kebutuhan Anda secara jelas agar relawan dan warga sekitar dapat memahami dan mengulurkan bantuan.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-semibold text-text-main"
          >
            Judul Permintaan <span className="text-alert-text font-bold" aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
            placeholder="Contoh: Butuh tabung oksigen di Padang Barat"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-semibold text-text-main"
          >
            Deskripsi Kebutuhan <span className="text-alert-text font-bold" aria-hidden="true">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-surface p-3.5 text-sm text-text-main placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
            placeholder="Jelaskan kebutuhan Anda secara detail (kondisi, batas waktu, dan kebutuhan spesifik)..."
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-semibold text-text-main"
          >
            Kategori Bantuan <span className="text-alert-text font-bold" aria-hidden="true">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
          >
            <option value="">-- Pilih Kategori Bantuan --</option>
            {HELP_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-1.5 block text-sm font-semibold text-text-main"
          >
            Lokasi (Kota / Kecamatan) <span className="text-alert-text font-bold" aria-hidden="true">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
            placeholder="Contoh: Padang"
          />
        </div>

        <div>
          <label
            htmlFor="contact"
            className="mb-1.5 block text-sm font-semibold text-text-main"
          >
            Kontak WhatsApp / Telepon{" "}
            <span className="text-xs font-normal text-text-muted">
              (opsional — hanya ditampilkan kepada relawan setelah mereka menekan tombol respon)
            </span>
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-main placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
            placeholder="Contoh: 0812-3456-7890"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-lg border border-alert-border bg-alert-bg px-3.5 py-2.5 text-sm font-medium text-alert-text"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-slate-50 hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-[44px] items-center justify-center rounded-lg bg-baltic-blue px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-baltic-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baltic-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Menyimpan Permintaan..." : "Kirim Permintaan Bantuan"}
          </button>
        </div>
      </form>
    </main>
  );
}