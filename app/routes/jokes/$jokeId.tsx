import {json, MetaFunction} from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import {db} from "~/util/db.server";
import {Link, useLoaderData, useParams, useCatch} from "@remix-run/react";

export const meta: MetaFunction<typeof loader> = ({
                                                      data,
                                                  }) => {
    if (!data) {
        return {
            title: "No joke",
            description: "No joke found",
        };
    }
    return {
        title: `"${data.joke.name}" joke`,
        description: `Enjoy the "${data.joke.name}" joke and much more`,
    };
};

export const loader = async ({ params }: LoaderArgs) => {
    const joke = await db.joke.findUnique({
        where: { id: params.jokeId },
    });
    if (!joke) {
        throw new Response("What a joke! Not found.", {
            status: 404,
        });
    }
    return json({ joke });
};

export function CatchBoundary() {
    const caught = useCatch();
    const params = useParams();
    if (caught.status === 404) {
        return (
            <div className="error-container">
                Huh? What the heck is "{params.jokeId}"?
            </div>
        );
    }
    throw new Error(`Unhandled error: ${caught.status}`);
}

export default function JokeRoute() {
    const data = useLoaderData<typeof loader>();
    return (
        <div>
            <p>Here's your hilarious joke:</p>
            <p>
                {data.joke.content}
            </p>
            <Link to=".">{data.joke.name} Permalink</Link>
        </div>
    );
}

export function ErrorBoundary() {
    const { jokeId } = useParams();
    return (
        <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
    );
}
