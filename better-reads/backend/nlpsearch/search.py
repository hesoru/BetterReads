from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi import FastAPI, Query

app = FastAPI()
client = MongoClient("mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/retryWrites=true&w=majority&appName=Sandbox")
books = client.bookdb.books_with_embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")



@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/debug")
def debug_books():
    books_with_embeddings = list(books.find({"embedding": {"$exists": True}}))
    print(f"Found {len(books_with_embeddings)} books with embeddings.")
    for book in books_with_embeddings:
        print(book.get("title"), "|", book.get("genre"))
    return {"count": len(books_with_embeddings)}

@app.get("/search")
def search_books(q: str, genre: list[str] = Query(default=[])):
    query_vec = model.encode(q).reshape(1, -1)

    # Normalize genre inputs
    filters = {"embedding": {"$exists": True}}
    if genre:
        normalized_genres = [g.title() for g in genre]
        filters["genre"] = {"$in": normalized_genres}

    # Fetch candidates
    candidates = list(books.find(filters))
    print(f" Found {len(candidates)} candidate books:")
    for book in candidates:
        print(f"- {book.get('title')} | Genres: {book.get('genre')}")

    # Score each candidate
    results = []
    for book in candidates:
        try:
            emb = np.array(book["embedding"]).reshape(1, -1)
            sim = cosine_similarity(query_vec, emb)[0][0]
        except Exception as e:
            print(f"Skipping '{book.get('title')}' due to error: {e}")
            continue

        print(f"→ {book.get('title')} | Score: {round(sim, 4)}")

        results.append({
            "title": book.get("title"),
            "author": book.get("author"),
            "description": book.get("description"),
            "genre": book.get("genre"),
            "publishYear": book.get("publishYear"),
            "image": book.get("image"),
            "score": round(sim, 4)
        })

    return sorted(results, key=lambda b: b["score"], reverse=True)[:10]
