from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

# === CONFIGURATION ===
MONGO_URI = "mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/retryWrites=true&w=majority&appName=Sandbox"
DB_NAME = "bookdb"
COLLECTION_NAME = "books_with_embeddings"
MODEL_NAME = "all-MiniLM-L6-v2"
FORCE_UPDATE = False  # Set to True to overwrite even if embedding exists

# === SETUP ===
client = MongoClient(MONGO_URI)
collection = client[DB_NAME][COLLECTION_NAME]

print(f"Connecting to MongoDB at {MONGO_URI}...")
print(f"Loading embedding model: {MODEL_NAME}")
model = SentenceTransformer(MODEL_NAME)

# === FETCH BOOKS ===
query = {} if FORCE_UPDATE else {"embedding": {"$exists": False}}
cursor = collection.find(query, {"title": 1, "description": 1})

total = collection.count_documents(query)
print(f"Found {total} book(s) to process.")

# === PROCESS BOOKS ===
for book in tqdm(cursor, total=total, desc="Embedding books"):
    title = book.get("title", "")
    desc = book.get("description", "")
    if not title and not desc:
        continue

    combined_text = f"{title.strip()} {desc.strip()}"
    embedding = model.encode(combined_text).tolist()

    collection.update_one(
        {"_id": book["_id"]},
        {"$set": {"embedding": embedding}}
    )

print("" All applicable books have embeddings.")

