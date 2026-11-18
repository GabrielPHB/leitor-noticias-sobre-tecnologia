import { convert } from "html-to-text";

export type CommentData = {
    id: number;
    author: string;
    text: string | null;
    children: CommentData[];
    deleted?: boolean;
};

type CommentProps = {
    author: string;
    text: string;
    children: CommentData[];
    depth: number;
}

export default function Comment({ author, text, children, depth }: CommentProps) {
    const cleanText = convert(text);
    return <div>
        <h3>Usuário: {author}</h3>
        <p>Comentário: {cleanText}</p>
        {depth < 5 && (
            <div>
                {children
                    .filter((item): item is CommentData & { text: string } =>
                        item.text !== null && item.text.trim() !== "" && item.deleted !== true
                    )
                    .map((item) => (
                        <Comment key={item.id} author={item.author} text={item.text} children={item.children} depth={depth + 1} />
                    ))}
            </div>
        )}
    </div>
}