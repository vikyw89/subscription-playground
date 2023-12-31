// @ts-nocheck
'use client';

import { useState, MouseEvent } from 'react';
import { streamAsyncIterator } from '@/libs/asyncIterator';

let isReset = false;

export default function Home() {
	const [state, setState] = useState([]);

	const streamSelectorHandler = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			isReset = false;
			const streamType = e.currentTarget.textContent;

			const response = await fetch(`http://localhost:8000/api/${streamType}`, {
				method: 'GET',
			});
			const decoder = new TextDecoder();

			for await (const chunk of streamAsyncIterator(response.body)) {
				const value = decoder.decode(chunk);
				if (streamType === 'http_stream_json') {
					const decodedValue = JSON.parse(value);
					setState((p) => [...p, decodedValue]);
				}
				if (streamType === 'http_stream_text') {
					setState((p) => [...p, value]);
				}
				if (isReset) {
					break;
				}
			}
			response.body.cancel();
		} catch (error) {
			console.log(
				'🚀 ~ file: page.tsx:37 ~ streamSelectorHandler ~ error:',
				error
			);
		}
	};

	const resetHandler = () => {
		isReset = true;
	};
	return (
		<main className='fixed inset-0 grid grid-cols-2 justify-center items-center bg-base-100 text-base-content'>
			<div className='flex overflow-y-scroll h-full flex-col'>
				{state.map((v, i) => (
					<div key={i}>{JSON.stringify(v)}</div>
				))}
			</div>
			<div>
				<button
					className='btn-primary btn'
					onClick={streamSelectorHandler}
				>
					http_stream_text
				</button>
				<button
					className='btn-primary btn'
					onClick={streamSelectorHandler}
				>
					http_stream_json
				</button>
				<button
					className='btn-primary btn'
					onClick={resetHandler}
				>
					reset
				</button>
			</div>
		</main>
	);
}
