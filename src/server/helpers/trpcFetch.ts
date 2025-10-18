import type { IncomingMessage } from "http";

/**
 * Helper function to fetch data from tRPC API endpoints on the server side.
 * This is useful for getServerSideProps where we can't use createCaller.
 */
export async function fetchTRPCQuery<TInput, TOutput>(
  req: IncomingMessage,
  procedure: string,
  input: TInput,
): Promise<TOutput | null> {
  try {
    const protocol = req.headers.host?.includes("localhost") ? "http" : "https";
    const host = req.headers.host;

    // Format input according to tRPC batch format
    const batchInput = {
      "0": {
        json: input,
      },
    };

    const url = `${protocol}://${host}/api/trpc/${procedure}?batch=1&input=${encodeURIComponent(
      JSON.stringify(batchInput),
    )}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `tRPC fetch failed for ${procedure}: ${response.statusText}`,
      );
      return null;
    }

    const data = (await response.json()) as [
      {
        result: { data: { json: TOutput } };
      },
    ];

    return data[0]?.result?.data?.json ?? null;
  } catch (error) {
    console.error(`Error fetching tRPC procedure ${procedure}:`, error);
    return null;
  }
}
