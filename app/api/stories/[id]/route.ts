import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const response = await fetch(`https://hn.algolia.com/api/v1/items/${id}`);
        if (response.status === 404) {
            return NextResponse.json(
                { error: "Notícia não encontrada" },
                { status: 404 }
            );
        }
        if (!response.ok) {
            return NextResponse.json(
                { error: "Erro ao buscar notícia" },
                { status: 502 }
            )
        }
        const data = await response.json()
        return NextResponse.json(data)
    } catch {
        return NextResponse.json(
            { error: "Erro ao buscar notícia" },
            { status: 502 }
        )
    }
}