"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // startTransition giúp UI mượt hơn khi đang fetch dữ liệu mới
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="relative w-full md:w-72">
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Tìm kiếm game..."
        className={`w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#f58220] transition-all outline-none ${
          isPending ? "opacity-70" : ""
        }`}
      />
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          isPending ? "text-[#f58220] animate-pulse" : "text-zinc-400"
        }`}
        size={18}
      />
    </div>
  );
}
	
