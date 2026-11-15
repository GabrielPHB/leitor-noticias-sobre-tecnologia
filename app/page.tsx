import Header from "@/components/Header";
import News from "@/components/NewsCard";

export default function Home() {
  const news = [
    {id: 1, title: "Título 1"},
    {id: 2, title: "Título 2"},
    {id: 3, title: "Título 3"}
  ]
  return (
    <main>
      <Header />
      {news.map((item) => (<News key={item.id} title={item.title} />
      ))}
    </main>
  );
}