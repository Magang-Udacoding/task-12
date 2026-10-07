/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Link } from "lucide-react";
export const dynamic = "force-dynamic";

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

  useEffect(() => {
    if (isNaN(id)) {
      setFetchError("ID Request Is not Valid");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      const [
        { data: requestData, error: requestError },
        {
          data: { user: currentUser },
        },
      ] = await Promise.all([
        supabase.from("help_request").select("*").eq("id", id).single(),
        supabase.auth.getUser(),
      ]);

      setLoading(false);

      if (requestError) {
        setFetchError("Help Request not Found!");
        return;
      }

      setRequest(requestData);
      setUser(currentUser);
    };
    loadData();
  }, [id]);

  const handleHelp = async () => {
    setSubmitting(true);
    setActionError("");

    const { error: rpcError } = await supabase.rpc("mark_finished", {
      request_id: id,
    });
    setSubmitting(false);

    if (rpcError) {
      setActionError(`Failed to Update Status: ${rpcError.message}`);
      return;
    }
    setRequest((prev) =>
      prev
        ? {
            ...prev,
            status: "Finish",
          }
        : prev,
    );

    setHelped(true);
  };

  if (loading) {
    return (
      <main className="mx-auto w-full w-max-2xl px-4 py-10 md:px-5">
        <div className="h-95 animate-pulse rounded-xl bg-gray-100" />
      </main>
    );
  }
  if (fetchError) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </div>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-baltic-blue hover:underline"
        >
          &larr; Back to Home
        </Link>
      </main>
    );
  }

  if (!request) return null;

  const isOwner = user?.id === request.user_id;
  const canHelp = user !== null && !isOwner && request.status === "Waiting";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 md:px-6">
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-medium text-baltic-blue hover:underline"
      >
        &larr; Kembali ke Beranda
      </Link>
      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-turquoise/20 px-2.5 py-1 text-xs font-medium text-gray-800">
            {request.category}
          </span>
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              request.status === "Selesai"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {request.status}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
        <p className="mt-1 text-sm font-medium text-baltic-blue">
          {request.location}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">
          {request.description}
        </p>
        {helped && (
          <>
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Terima kasih! Anda telah merespons permintaan ini.
            </div>
            {request.contact && (
              <div className="mt-3 rounded-lg border border-turquoise/40 bg-turquoise/10 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Kontak peminta
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-800">
                  {request.contact}
                </p>
              </div>
            )}
            {!request.contact && (
              <p className="mt-3 text-sm text-gray-500">
                Peminta tidak mencantumkan kontak. Koordinasi dapat dilakukan
                melalui komunitas setempat.
              </p>
            )}
          </>
        )}
        {actionError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}
        <div className="mt-6 border-t border-gray-100 pt-5">
          {canHelp && !helped && (
            <button
              type="button"
              onClick={handleHelp}
              disabled={submitting}
              className="rounded-lg bg-baltic-blue px-6 py-2.5 font-medium text-white hover:bg-baltic-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Memproses..." : "Saya Ingin Membantu"}
            </button>
          )}
          {!user && request.status === "Menunggu" && (
            <p className="text-sm text-gray-600">
              <Link
                href="/login"
                className="font-medium text-baltic-blue hover:underline"
              >
                Login
              </Link>{" "}
              untuk merespons permintaan ini.
            </p>
          )}
          {isOwner && (
            <p className="text-sm text-gray-600">
              Ini adalah permintaan bantuan Anda. Kelola dari halaman{" "}
              <Link
                href="/bantuan-saya"
                className="font-medium text-baltic-blue hover:underline"
              >
                Bantuan Saya
              </Link>
              .
            </p>
          )}
          {request.status === "Selesai" && !helped && (
            <p className="text-sm text-gray-500">
              Permintaan ini sudah ditangani.
            </p>
          )}
        </div>
      </article>
    </main>
  );
}
