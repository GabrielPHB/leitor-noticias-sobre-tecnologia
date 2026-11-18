
import db from "@/lib/db";
import { NextResponse } from "next/server";

interface ReadingListItem {
    id: number;
    story_id: number;
    title: string;
    url: string | null;
    is_read: number;
    note: string | null;
    created_at: string | null;
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
        return NextResponse.json(
            { error: "ID inválido" },
            { status: 400 }
        );
    }

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

    const { is_read, note } = body as {
        is_read?: unknown;
        note?: unknown;
    };

    if (is_read !== undefined && is_read !== 1 && is_read !== 0) {
        return NextResponse.json(
            { error: "is_read deve ser 0 ou 1" },
            { status: 400 }
        );
    }

    if (note != null && typeof note !== "string") {
        return NextResponse.json(
            { error: "note deve ser uma string ou null" },
            { status: 400 }
        );
    }

    try {
        const findStory = db.prepare(`
            SELECT * FROM reading_list
            WHERE id = ?;
        `);

        const story = findStory.get(numericId) as ReadingListItem | undefined;

        if (story === undefined) {
            return NextResponse.json(
                { error: "Notícia não encontrada" },
                { status: 404 }
            );
        }

        const updatedIsRead = is_read ?? story.is_read;
        const updatedNote = note === undefined ? story.note : note;

        const update = db.prepare(`
            UPDATE reading_list
            SET is_read = ?, note = ?
            WHERE id = ?;
        `);

        update.run(updatedIsRead, updatedNote, numericId);

        return NextResponse.json(
            { message: "Notícia atualizada com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Erro ao atualizar notícia" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
        return NextResponse.json(
            { error: "ID inválido" },
            { status: 400 }
        );
    }

    try {
        const remove = db.prepare(`
            DELETE FROM reading_list
            WHERE id = ?;
        `);

        const result = remove.run(numericId);

        if (result.changes === 0) {
            return NextResponse.json(
                { error: "Notícia não encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Notícia removida com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Erro ao remover notícia" },
            { status: 500 }
        );
    }
}

