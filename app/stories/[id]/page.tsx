import Comment from "@/components/Comment";
import type { CommentData } from "@/components/Comment";
import { error } from "console";

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
    return <div>
        <h1>Detalhes da notícia: {data.title}</h1>
        <p>Autor: {data.author}</p>
        <p>Enviado em: {new Date(data.created_at).toLocaleDateString("pt-BR")}</p>
        {data.url && (
            <a href={data.url}>Ler notícia original</a>
        )}
        <h2>Comentários: {totalComments}</h2>
        {data.children
            .filter((item: CommentData): item is CommentData & { text: string } =>
                item.text !== null && item.text.trim() !== "" && item.deleted !== true
            )
            .map((item) => (
                <Comment key={item.id} author={item.author} text={item.text} children={item.children} depth={1} />
            ))}
    </div>;
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