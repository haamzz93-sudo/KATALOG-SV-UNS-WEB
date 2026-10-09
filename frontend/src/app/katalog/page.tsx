"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function KatalogRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const target = params ? `/?${params}#katalog` : "/#katalog";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#07192C]">
      <div className="w-10 h-10 border-4 border-[#000080] dark:border-[#FFD800] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Membuka Katalog Vokasi UNS...
      </p>
    </div>
  );
}

export default function KatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#07192C]">
        <div className="w-10 h-10 border-4 border-[#000080] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <KatalogRedirect />
    </Suspense>
  );
}
