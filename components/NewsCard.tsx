type NewsProps = {
    title: string;
    author: string;
    created_at: string;
};

export default function News({ title, author, created_at }: NewsProps) {
    return <div className="text-[#F8FAFC] bg-[#1E293B] rounded-lg p-6 min-h-30 mx-5">
        <h2>{title}</h2>
        <p>Autor: {author}</p>
        <p>Enviado em: {created_at}</p>
    </div>;
}