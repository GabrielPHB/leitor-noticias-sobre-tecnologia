"use client";

import { useEffect, useState } from "react";

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
        <main>
            <h1>Minha lista de leitura</h1>

            {loading ? (
                <p>Carregando notícias...</p>
            ) : (
                stories.map((story) => (
                    <div key={story.id}>
                        <h2>{story.title}</h2>
                        <p>{story.is_read === 1 ? "Lida" : "Não lida"}</p>
                        <p>{story.note ?? "Sem anotação"}</p>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <button type="button" onClick={() => toggleRead(story)} className="bg-[#2563EB] border border-[#3B82F6] px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors cursor-pointer">
                                {story.is_read === 1 ? "Marcar como não lida" : "Marcar como lida"}
                            </button>
                            <button type="button" onClick={() => editNote(story)} className=" bg-[#334155] border border-[#64748B] px-4 py-2 rounded-lg hover:bg-[#475569] cursor-pointer">Editar anotação
                            </button>

                            <button type="button" onClick={() => deleteStory(story)} className="bg-[#991B1B] border border-[#DC2626] px-4 py-2 rounded-lg hover:bg-[#B91C1C] cursor-pointer">Excluir
                            </button>
                        </div>
                    </div>
                ))
            )}
        </main>
    );
}

