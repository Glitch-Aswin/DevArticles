from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for local dev and frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analytics/views")
def get_article_views():
    # Dummy data for now
    return {"article_id": "demo-uuid", "views": 42}

@app.get("/analytics/top-articles")
def get_top_articles():
    # Dummy data for now
    return [{"article_id": "demo-uuid", "views": 42}]
