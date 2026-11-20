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
    return (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 sm:p-6 min-w-0">

            <h3 className="text-[#60A5FA] font-oswald text-xl mb-3 wrap-break-word">
                Usuário: {author}
            </h3>

            <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
                {cleanText}
            </p>

            {depth < 5 && (
                <div className="flex flex-col gap-4 mt-5 ml-2 sm:ml-5 pl-3 sm:pl-5 border-l-2 border-[#475569]">
                    {children
                        .filter((item): item is CommentData & { text: string } =>
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
                                depth={depth + 1}
                            />
                        ))}
                </div>
            )}

        </div>
    );
}