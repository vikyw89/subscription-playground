from typing import Union
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/http_stream/{media_type}")
def http_stream(media_type: str):
    def generator():
        while True:
            yield "test"
    StreamingResponse(generator(), media_type=media_type)


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
