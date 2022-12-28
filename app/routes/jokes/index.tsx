import {db} from "~/util/db.server";
import {json} from "@remix-run/node";
import {useLoaderData, useCatch} from "@remix-run/react";

export const loader = async () => {
    const count = await db.joke.count();
    const randomRowNumber = Math.floor(Math.random() * count);
    const [randomJoke] = await db.joke.findMany({
        take: 1,
        skip: randomRowNumber,
    });
    if (!randomJoke) {
        throw new Response("No random joke found", {
            status: 404,
        });
    }
    return json({ joke: randomJoke });
}

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 404) {
        return (
            <div className="error-container">
                There are no jokes to display.
            </div>
        );
    }
    throw new Error(
        `Unexpected caught response with status: ${caught.status}`
    );
}
export default function JokesIndexRoute() {
    const data = useLoaderData<typeof loader>();
    return (
        <div>
            <p>Here's a random joke:</p>
            <p>
                {data.joke.content}
            </p>
        </div>
    );
}

export function ErrorBoundary() {
    return (
        <div className="error-container">
            I did a whoopsies.
        </div>
    );
}
