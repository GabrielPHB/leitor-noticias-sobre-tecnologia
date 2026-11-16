"use client";
type NewsStory = {
  id: string;
  title: string;
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
    }, 500);
    return () => {
      controller.abort();
      clearTimeout(timer)
    };
  }, [search, page, sort]);
  return (
    <main>
      <Header />
      <input type="text" placeholder="Buscar notícias" value={search} onChange={(event) => {
        setSearch(event.target.value);
        setPage(0);
      }}></input>
      <select value={sort} onChange={(event) => {
        setSort(event.target.value);
        setPage(0);
      }}>
        <option value="relevance">Relevância</option>
        <option value="date">Data</option>
      </select>
      {loading && <p>Carregando notícias...</p>}
      {error && <p>{error}</p>}
      {!loading && error === null && news.length === 0 && (
        <p>Nenhuma notícia encontrada</p>
      )}
      {news.map((item) => (<News key={item.id} title={item.title} />
      ))}
      <button className="cursor-pointer" onClick={() => setPage(page - 1)} hidden={page === 0}>Página anterior</button>;
      <button className="cursor-pointer" onClick={() => setPage(page + 1)} hidden={page >= totalPages - 1}>Página seguinte</button>

    </main>
  );
}