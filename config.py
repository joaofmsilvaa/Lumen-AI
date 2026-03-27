import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

DATA_DIRECTORY = os.getenv("DATA_DIRECTORY", "data")

VECTORSTORE_DIR = os.getenv("VECTORSTORE_DIR", "vectorstore")

COLLECTION_NAME = os.getenv("COLLECTION_NAME", "rag_collection")

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 800))

CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 100))

TOP_K = int(os.getenv("TOP_K", 4))