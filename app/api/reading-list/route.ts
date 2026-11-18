import db from "@/lib/db";
import { NextResponse } from "next/server";

export function GET() {
    const stories = db.prepare(
        "SELECT * FROM reading_list").all();

    return NextResponse.json(stories);
}

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "JSON inválido" },
            { status: 400 }
        );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return NextResponse.json(
            { error: "O corpo deve ser um objeto JSON" },
            { status: 400 }
        );
    }

    const { story_id, title, url } = body as {
        story_id?: unknown;
        title?: unknown;
        url?: unknown;
    };
    if (!story_id || !title) {
        return NextResponse.json(
            { error: "Ambos story_id e title são obrigatórios." },
            { status: 400 })
    }

    if (typeof story_id !== "number") {
        return NextResponse.json(
            { error: "story_id deve ser um número" },
            { status: 400 }
        );
    }

    if (!Number.isInteger(story_id) || story_id <= 0) {
        return NextResponse.json(
            { error: "story_id deve ser um inteiro positivo" },
            { status: 400 }
        );
    }

    if (url != null && typeof url !== "string") {
        return NextResponse.json(
            { error: "url deve ser uma string ou null" },
            { status: 400 }
        );
    }

    if (typeof title !== "string") {
        return NextResponse.json(
            { error: "title deve ser uma string" },
            { status: 400 }
        );
    }

    if (title.trim() === "") {
        return NextResponse.json(
            { error: "title não pode estar vazio" },
            { status: 400 }
        );
    }
    try {
        const insert = db.prepare(`
            INSERT INTO reading_list (story_id, title, url)
            VALUES (?, ?, ?);
`);
        insert.run(story_id, title, url ?? null)
        return Response.json(
            { message: "Notícia salva com sucesso" },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            if (error.message.includes("UNIQUE constraint failed")) {
                return NextResponse.json(
                    { error: "Esta notícia já está na lista de leitura" },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: "Erro ao salvar notícia" },
            { status: 500 }
        );
    }
}