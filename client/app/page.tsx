// @ts-nocheck
'use client';
import Image from 'next/image';
import { useState, MouseEvent } from 'react';
import axios from 'axios';

export default function Home() {
	const [state, setState] = useState('');

	const streamSelectorHandler = async (e: MouseEvent<HTMLButtonElement>) => {
		try {
			const streamType = e.currentTarget.textContent;

			const response = await fetch(`http://localhost:8000/api/http_stream`,{method:"GET"});
			let total = 0;

      if (!response.body){
        return
      }

			// @ts-ignore
			// Iterate response.body (a ReadableStream) asynchronously
			for await (const chunk of response.body as AsyncIterable) {
				console.log("🚀 ~ file: page.tsx:20 ~ forawait ~ chunk:", chunk)
				// Do something with each chunk
				// Here we just accumulate the size of the response.
				total += chunk.length;
				console.log("🚀 ~ file: page.tsx:23 ~ forawait ~ total:", total)
			}

			// Do something with the total
			console.log(total);
	
		} catch (error) {
			console.error(error);
		}
	};

	const resetHandler = () => {
		setState('');
	};
	return (
		<main className='fixed inset-0 flex flex-col justify-center items-center bg-base-100 text-base-content'>
			<div>{state}</div>
			<button
				className='btn-primary btn'
				onClick={streamSelectorHandler}
			>
				http_stream
			</button>
			<button
				className='btn-primary btn'
				onClick={resetHandler}
			>
				reset
			</button>
		</main>
	);
}
