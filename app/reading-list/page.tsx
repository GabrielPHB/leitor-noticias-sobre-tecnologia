"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ReadingListItem {
    id: number;
    story_id: number;
    title: string;
    url: string | null;
    is_read: number;
    note: string | null;
    created_at: string | null;
}

export default function ReadingListPage() {
    const [stories, setStories] = useState<ReadingListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStories() {
            try {
                const response = await fetch("/api/reading-list");

                if (!response.ok) {
                    throw new Error("Erro ao buscar notícias");
                }

                const data: ReadingListItem[] = await response.json();
                setStories(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadStories();
    }, []);

    async function toggleRead(story: ReadingListItem) {
        try {
            const response = await fetch(`/api/reading-list/${story.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    is_read: story.is_read === 1 ? 0 : 1,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar notícia");
            }

            setStories((previous) =>
                previous.map((item) =>
                    item.id === story.id
                        ? { ...item, is_read: story.is_read === 1 ? 0 : 1 }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
            alert("Não foi possível atualizar a notícia.");
        }
    }

    async function editNote(story: ReadingListItem) {
        const note = prompt("Digite sua anotação:", story.note ?? "");

        if (note === null) return;

        try {
            const response = await fetch(`/api/reading-list/${story.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    note: note.trim() === "" ? null : note,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar anotação");
            }

            setStories((previous) =>
                previous.map((item) =>
                    item.id === story.id
                        ? { ...item, note: note.trim() === "" ? null : note }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
            alert("Não foi possível salvar a anotação.");
        }
    }

    async function deleteStory(story: ReadingListItem) {
        const confirmed = confirm(`Deseja remover "${story.title}" da lista?`);

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/reading-list/${story.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir notícia");
            }

            setStories((previous) =>
                previous.filter((item) => item.id !== story.id)
            );
        } catch (error) {
            console.error(error);
            alert("Não foi possível excluir a notícia.");
        }
    }

    return (
        <main className="min-h-screen text-[#F8FAFC] bg-[#F8FAFC] flow-root">

            <div className="bg-[#0B1120] m-5 rounded-2xl p-5 sm:p-10 min-h-[80vh]">

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                    <h1 className="text-3xl font-bold text-center sm:text-left">
                        Minha lista de leitura
                    </h1>

                    <Link
                        href="/"
                        className="bg-[#334155] border border-[#64748B] px-5 py-2 rounded-lg text-center"
                    >
                        Voltar ao início
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center text-lg text-[#94A3B8]">
                        Carregando notícias...
                    </p>
                ) : stories.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-[#94A3B8]">
                            Nenhuma notícia salva ainda.
                        </p>
                        <p className="mt-2 text-[#64748B]">
                            Volte à página inicial para salvar notícias.
                        </p>
                    </div>
                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {stories.map((story) => (
                            <div
                                key={story.id}
                                className="flex flex-col bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-lg min-w-0"
                            >

                                <h2 className="text-xl font-semibold mb-5 wrap-break-word">
                                    {story.title}
                                </h2>

                                <span
                                    className={`self-start px-3 py-1 rounded-full text-sm font-medium mb-5 ${story.is_read === 1
                                        ? "bg-[#14532D] text-[#BBF7D0]"
                                        : "bg-[#713F12] text-[#FEF08A]"
                                        }`}
                                >
                                    {story.is_read === 1 ? "Lida" : "Não lida"}
                                </span>

                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-[#94A3B8] mb-2">
                                        Anotações:
                                    </h3>

                                    <p className="text-[#CBD5E1] wrap-break-word whitespace-pre-wrap">
                                        {story.note ?? "Sem anotação"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 mt-auto pt-4">

                                    <button
                                        type="button"
                                        onClick={() => toggleRead(story)}
                                        className="bg-[#2563EB] border border-[#3B82F6] px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        {story.is_read === 1
                                            ? "Marcar como não lida"
                                            : "Marcar como lida"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => editNote(story)}
                                        className="bg-[#334155] border border-[#64748B] px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Editar anotação
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteStory(story)}
                                        className="bg-[#991B1B] border border-[#DC2626] px-4 py-2 rounded-lg cursor-pointer"
                                    >
                                        Excluir
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </main>
    );
}

