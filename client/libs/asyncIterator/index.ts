export type StreamAsyncIteratorInput = {
	stream: ReadableStream;
	decoder?: any;
};

export async function* streamAsyncIterator({
	stream,
	decoder = new TextDecoder('utf-8'),
}: StreamAsyncIteratorInput) {
	// Get a lock on the stream
	const reader = stream.getReader();

	try {
		while (true) {
			// Read from the stream
			const { done, value } = await reader.read();
			// Exit if we're done
			if (done) return;

			// Decode the chunk
			const decodedValue = decoder.decode(value);
			// Else yield the chunk
			yield decodedValue;
		}
	} finally {
		reader.releaseLock();
	}
}
