import Comment from "@/components/Comment";
import type { CommentData } from "@/components/Comment";
import Link from "next/link";

type StoryDetailsProps = {
    params: Promise<{ id: string }>;
};

type StoryData = {
    title: string;
    author: string;
    created_at: string;
    url: string | null;
    children: CommentData[];
};

export default async function StoryDetails({ params }: StoryDetailsProps) {
    const { id } = await params;
    const response = await fetch(`http://localhost:3000/api/stories/${id}`);
    if (!response.ok) {
        throw new Error("Não é possível carregar a notícia no momento, tente outra vez em breve");
    }
    const data: StoryData = await response.json();
    const totalComments = countComments(data.children, 1);
    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#F8FAFC] flow-root">

            <div className="bg-[#0B1120] m-5 rounded-2xl p-5 sm:p-10 min-h-[80vh]">

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
                        Detalhes da notícia
                    </h1>

                    <Link
                        href="/"
                        className="bg-[#334155] border border-[#64748B] px-5 py-2 rounded-lg text-center"
                    >
                        Voltar ao início
                    </Link>
                </div>

                <section className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 sm:p-8 mb-10">

                    <h2 className="text-xl sm:text-2xl font-semibold mb-6 wrap-break-word">
                        {data.title}
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 text-[#CBD5E1] mb-6">
                        <p>Autor: {data.author}</p>

                        <p>
                            Enviado em: {new Date(data.created_at).toLocaleDateString("pt-BR")}
                        </p>
                    </div>

                    {data.url && (
                        <a
                            href={data.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-[#2563EB] border border-[#334155] px-5 py-2 rounded-lg text-center"
                        >
                            Ler notícia original
                        </a>
                    )}

                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-6">
                        Comentários ({totalComments})
                    </h2>

                    <div className="flex flex-col gap-4">

                        {data.children
                            .filter(
                                (item: CommentData): item is CommentData & { text: string } =>
                                    item.text !== null &&
                                    item.text.trim() !== "" &&
                                    item.deleted !== true
                            )
                            .map((item) => (
                                <Comment
                                    key={item.id}
                                    author={item.author}
                                    text={item.text}
                                    children={item.children}
                                    depth={1}
                                />
                            ))}

                    </div>
                </section>

            </div>
        </main>
    );
}

function countComments(comments: CommentData[], depth: number): number {
    if (depth > 5) {
        return 0;
    }
    let total = 0;
    comments.forEach((item) => {
        if (item.text !== null && item.text.trim() !== "" && item.deleted !== true) {
            total = total + 1;
            total = total + countComments(item.children, depth + 1);
        }
    });
    return total;
}