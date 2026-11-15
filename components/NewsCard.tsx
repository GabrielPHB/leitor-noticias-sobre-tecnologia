type NewsProps = {
    title: string;
};

export default function News({ title }: NewsProps) {
    return <h2>{title}</h2>;
}