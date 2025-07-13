from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi import FastAPI, Query
from typing import Optional

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

@app.post("/add_embeddings")
def add_embeddings(book_isbn: str):
    # 1. Lookup the book
    book = books.find_one({"ISBN": book_isbn})

    if not book:
        return {"error": f"No book found with ISBN {book_isbn}"}

    title = book.get("title", "")
    desc = book.get("description", "")

    if not title and not desc:
        return {"error": "Book has no title or description to embed."}

    # 2. Generate embedding
    combined_text = f"{title.strip()} {desc.strip()}"
    embedding = model.encode(combined_text).tolist()

    # 3. Update Mongo
    books.update_one(
        {"_id": book["_id"]},
        {"$set": {"embedding": embedding}}
    )

    return {"message": f"Embedding added to book '{title}'."}

@app.get("/search")
def search_books(
    q: str,
    genre: Optional[list[str]] = Query(default=[]),
    min_year: Optional[int] = None,
    max_year: Optional[int] = None
):
    query_vec = model.encode(q).reshape(1, -1)

    # === Build Mongo filters
    filters = {"embedding": {"$exists": True}}

    if genre:
        filters["genre"] = {"$in": [g.title() for g in genre]}  # Normalize

    if min_year and max_year:
        filters["publishYear"] = {"$gte": min_year, "$lte": max_year}
    elif min_year:
        filters["publishYear"] = {"$gte": min_year}
    elif max_year:
        filters["publishYear"] = {"$lte": max_year}

    # === Fetch and rank
    candidates = list(books.find(filters))
    results = []
    for book in candidates:
        try:
            emb = np.array(book["embedding"]).reshape(1, -1)
            sim = cosine_similarity(query_vec, emb)[0][0]
        except Exception as e:
            print(f"Skipping {book.get('title')}: {e}")
            continue

        results.append({
            "_id": str(book["_id"]),
            "ISBN": book.get("ISBN"),
            "averageRating": book.get("averageRating"),
            "title": book.get("title"),
            "author": book.get("author"),
            "description": book.get("description"),
            "genre": book.get("genre"),
            "publishYear": book.get("publishYear"),
            "image": book.get("image"),
            "score": round(sim, 4)
        })

    return sorted(results, key=lambda x: x["score"], reverse=True)[:10]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5002, reload=True)