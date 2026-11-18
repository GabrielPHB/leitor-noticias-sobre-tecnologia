"use client";

export default function ErrorPage({ reset }: { reset: () => void })
    {
        return (
            <div>
                <h2>Não foi possível carregar a notícia.</h2>
                <p>Tente novamente em alguns instantes.</p>
                <button onClick={() => reset()}>Tentar novamente</button>
            </div>
        );
    }