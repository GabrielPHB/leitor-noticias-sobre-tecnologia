"use client";

import Link from "next/link";

type NewsProps = {
    title: string;
    author: string;
    created_at: string;
    id: string;
};

export default function News({ title, author, created_at, id }: NewsProps) {
    async function saveStory() {
        try {
            const response = await fetch("/api/reading-list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    story_id: Number(id),
                    title,
                    url: null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error ?? "Erro ao salvar notícia");
                return;
            }

            alert("Notícia salva com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Não foi possível salvar a notícia.");
        }
    }
    return (
        <div className="flex flex-col h-full text-[#F8FAFC] bg-[#1E293B] rounded-lg p-6 mx-5">

            <h2 className="py-5 px-2 text-lg">{title}</h2>

            <p>Autor: {author}</p>

            <p className="py-3">
                Enviado em: {new Date(created_at).toLocaleDateString("pt-BR")}
            </p>

            <div className="flex flex-col gap-3 mt-auto pt-4">
                <Link
                    className="text-center bg-[#334155] border border-[#64748B] px-3 py-2 rounded-lg hover:bg-[#475569] transition-colors"
                    href={`/stories/${id}`}
                >
                    Ver mais detalhes
                </Link>

                <button
                    className="bg-[#334155] border border-[#64748B] px-3 py-2 rounded-lg hover:bg-[#475569] transition-colors cursor-pointer"
                    type="button"
                    onClick={saveStory}
                >
                    Salvar na lista
                </button>
            </div>
        </div>
    );
}