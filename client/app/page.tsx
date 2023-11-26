// @ts-nocheck
'use client';
import Image from 'next/image';
import { useState, MouseEvent } from 'react';
import axios from 'axios';
import { streamAsyncIterator } from '@/libs/asyncIterator';
import { randomUUID } from 'crypto';
export default function Home() {
	const [state, setState] = useState([]);

	const streamSelectorHandler = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			const streamType = e.currentTarget.textContent;

			const response = await fetch(`http://localhost:8000/api/${streamType}`, {
				method: 'GET',
			});

			const stream = response.body;

			for await (const chunk of streamAsyncIterator({ stream: stream })) {
				const value = chunk;

				if (streamType === 'http_stream_json') {
					const decodedValue = JSON.parse(value);
					console.log("🚀 ~ file: page.tsx:26 ~ forawait ~ decodedValue:", decodedValue)
					setState((p) => [...p, decodedValue]);
				}
				if (streamType === "http_stream_text") {
					setState((p) => [...p, value]);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const resetHandler = () => {
		setState([]);
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
