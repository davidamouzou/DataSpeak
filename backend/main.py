import os
from typing import Union

from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()


@app.get("/")
def read_root():
    return RedirectResponse(url=os.getenv("NEXT_PUBLIC_API_URL"))


@app.get("/status")
def read_status():
    return {"Hello": "World", "url": os.getenv("NEXT_PUBLIC_API_URL")}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}