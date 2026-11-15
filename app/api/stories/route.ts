type NewsStory = {
    title: string;
    objectID: string;
}

type NewsResponse = {
    hits: NewsStory[];
    nbHits: number;
    nbPages: number;
    page: number;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query") ?? "technology";
        const page = searchParams.get("page") ?? "0";
        const pageNumber = Number(page);
        const sort = searchParams.get("sort") ?? "relevance";
        let endpoint;
        if (sort !== "relevance" && sort !== "date") {
            return Response.json(
                { error: "Tipo de ordenação inválida." },
                { status: 400 }
            );
        }

        if (pageNumber < 0 || Number.isNaN(pageNumber) || !Number.isSafeInteger(pageNumber) || page.trim() === "") {
            return Response.json(
                { error: "Página inválida" },
                { status: 400 }
            )
        }

        if (sort === "date") {
            endpoint = "search_by_date";
        } else {
            endpoint = "search"
        };

        const params = new URLSearchParams({
            query: query,
            page: page,
            tags: "story"
        });
        const response = await fetch(`https://hn.algolia.com/api/v1/${endpoint}?${params}`);
        if (!response.ok) {
            return Response.json(
                { error: "Erro ao buscar notícias" },
                { status: 502 }
            );
        }
        const data: NewsResponse = await response.json();
        const stories = data.hits.map((item) => ({
            id: item.objectID,
            title: item.title
        }
        ));
        return Response.json({ stories, totalHits: data.nbHits, totalPages: data.nbPages, page: data.page });
    }
    catch {
        return Response.json(
            { error: "Falha na comunicação com a API" },
            { status: 502 })
    }
}