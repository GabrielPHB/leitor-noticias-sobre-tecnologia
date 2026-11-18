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
        <div className="flex justify-center pt-8">
          <input className="bg-[#F8FAFC] text-black rounded text-center font-oswald text-lg ml-5" type="text" placeholder="Buscar notícias" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}>
          </input>
          <h2 className=" pl-20 pr-2 text-lg">Ordenar por: </h2>
          <select className="bg-[#0B1120] mr-5" value={sort} onChange={(event) => {
            setSort(event.target.value);
            setPage(0);
          }}>
            <option value="relevance">Relevância</option>
            <option value="date">Data</option>
          </select>
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
        <div className="flex justify-around pt-20 pb-10 text-2xl">
          <button className="cursor-pointer" onClick={() =>
            setPage(page - 1)} hidden={page === 0}>Página anterior</button>
          <button className="cursor-pointer" onClick={() =>
            setPage(page + 1)} hidden={page >= totalPages - 1}>Página seguinte</button>
        </div>
      </div>
    </main>
  );
}