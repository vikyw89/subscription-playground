import json
import time
from typing import AsyncGenerator, Generator, List, Union
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/http_stream_text")
def http_stream_text():
    def generator():
        count = 5
        while count != 0:
            yield  "test"
            count -= 1
            time.sleep(1)
    return StreamingResponse(generator(), media_type="text/event-stream")

class HttpStreamJsonResponse(BaseModel):
    test: str
    null: Union[str, None]
    
@app.get("/api/http_stream_json")
async def http_stream_json() -> Generator[str, None,None]:
    def generator():
        while True:
            yield  HttpStreamJsonResponse(test="test", null=None).model_dump_json()
            time.sleep(2)
    return StreamingResponse(generator(), media_type="text/event-stream")

@app.get("/api/http_stream_video")
def http_stream_video():
    def generator():
        while True:
            yield  json.dumps({"test": "test", "null": None})
            time.sleep(1)
    return StreamingResponse(generator(), media_type="text/event-stream")


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
