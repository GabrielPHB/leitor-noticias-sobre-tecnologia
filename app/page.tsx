"use client";
type NewsStory = {
  id: string;
  title: string;
  author: string;
  created_at: string;
};

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import News from "@/components/NewsCard";
import Link from "next/link";

export default function Home() {
  const [news, setNews] = useState<NewsStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState("relevance");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchNews() {
      try {
        setError(null);
        const response = await fetch(`/api/stories?query=${search}&page=${page}&sort=${sort}`, { signal: controller.signal });
        if (response.ok === false) {
          throw new Error("Erro ao buscar notícias")
        }
        const data = await response.json();
        setNews(data.stories);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setError("Não é possível carregar as notícias no momento")
      }
      finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    const timer = setTimeout(() => {
      fetchNews();
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer)
    };
  }, [search, page, sort]);
  return (
    <main className="text-[#F8FAFC] bg-[#F8FAFC]">
      <Header />
      <div className=" bg-[#0B1120] m-5 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center px-5 pt-8">

    <input
        className="w-full min-w-0 bg-[#F8FAFC] text-black rounded-lg text-center font-oswald text-base md:text-lg px-3 py-2"
        type="text"
        placeholder="Buscar notícias"
        value={search}
        onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
        }}
    />

    <div className="flex items-center justify-center gap-2">
        <h2 className="text-base md:text-lg whitespace-nowrap">
            Ordenar por:
        </h2>

        <select
            className="bg-[#0B1120] border border-[#64748B] rounded-lg px-3 py-2 min-w-0"
            value={sort}
            onChange={(event) => {
                setSort(event.target.value);
                setPage(0);
            }}
        >
            <option value="relevance">Relevância</option>
            <option value="date">Data</option>
        </select>
    </div>

    <Link
        href="/reading-list"
        className="w-full md:w-fit md:justify-self-end text-center bg-[#2563EB] text-white border border-[#3B82F6] px-5 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors"
    >
        Ver notícias salvas
    </Link>

</div>
        {loading && <p>Carregando notícias...</p>}
        {error && <p>{error}</p>}
        {!loading && error === null && news.length === 0 && (
          <p>Nenhuma notícia encontrada</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
          {news.map((item) => (<News key={item.id} title={item.title} author={item.author} created_at={item.created_at} id={item.id} />
          ))}
        </div>
        <div className="flex justify-center gap-8 pt-20 pb-10 text-lg">
    <button
        className="bg-[#1E293B] text-[#F8FAFC] border border-[#64748B] px-6 py-3 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer"
        onClick={() => setPage(page - 1)}
        hidden={page === 0}
    >
        ← Página anterior
    </button>

    <button
        className="bg-[#2563EB] text-white border border-[#3B82F6] px-6 py-3 rounded-lg hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        onClick={() => setPage(page + 1)}
        hidden={page >= totalPages - 1}
    >
        Página seguinte →
    </button>
</div>
      </div>
    </main>
  );
}