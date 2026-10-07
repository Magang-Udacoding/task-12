"use client";

export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const CATEGORIES = [
    "Medis & Darurat",
    "Sembako",
    "Peminjaman Alat",
    "Tenaga Relawan",
] as const;

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
        const checkAuth = async() => {
            const {
                data: {user},
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
            setError("Title Can't Empty");
            return;
        }
        if (!description.trim()) {
            setError("Description Can't Empty");
            return;
        }
        if (!category.trim()) {
            setError("Category Can't Empty");
            return;
        }
        if (!location.trim()) {
            setError("Location Can't Empty");
            return;
        }
        setSubmitting(true);

        const {
            data: {user},
        } = await supabase.auth.getUser();
    
        if (!user) {
            router.replace("/login");
            return;
        }

        const {error: insertError} = await supabase.from("help_requests").insert({
            title: title.trim(),
            description: description.trim(),
            category,
            location: location.trim(),
            contact: contact.trim() || null,
            user_id: user.id,
        });

        setSubmitting(false);

        if (insertError) {
            setError(`Failed to Saving the Requests${insertError.message}`);
            return;
        }

        router.push("/");
        // router.refresh();
    };

    if (!authChecked) {
        return (
            <main
            className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-md items-center justify-center px-4 "
            >
                <p
                className="text-sm text-gray-600"
                >
                    Checking the Session
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6">
      <section className="mb-6">
        <p className="mb-2 text-sm font-medium text-baltic-blue">
          Papan Bantuan Warga
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          Buat Permintaan Bantuan
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Ceritakan kebutuhan Anda. Relawan akan melihat dan merespons.
        </p>
      </section>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Judul <span className="text-alert">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Contoh: Butuh tabung oksigen di Padang"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Deskripsi <span className="text-alert">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Jelaskan kebutuhan Anda secara detail..."
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Kategori <span className="text-alert">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">-- Pilih Kategori --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Lokasi (Kota) <span className="text-alert">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Contoh: Padang"
          />
        </div>
        <div>
          <label
            htmlFor="contact"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Kontak WhatsApp/Telepon{" "}
            <span className="text-xs font-normal text-gray-500">
              (opsional — ditampilkan ke relawan setelah mereka merespons)
            </span>
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Contoh: 0812-3456-7890"
          />
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-baltic-blue px-4 py-2 text-sm font-medium text-white hover:bg-baltic-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Kirim Permintaan"}
          </button>
        </div>
      </form>
    </main>
    )
}