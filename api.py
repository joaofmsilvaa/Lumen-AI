from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

from rag_engine import RAGAssistant
import config

app = FastAPI(
    title="AI Document Assistant RAG API",
    description="API para upload de PDFs, criação de index RAG e query com resposta + fontes + sugestão.",
    version="0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = RAGAssistant()


class QueryRequest(BaseModel):
    question: str


def _suggest_follow_up(question: str, answer: str) -> str:
    if not question:
        return "Pergunte algo mais específico sobre os documentos carregados."

    if "benefícios" in question.lower() or "vantagens" in question.lower():
        return "Gostaria de saber também as limitações ou cuidados sobre este tópico?"

    if "como" in question.lower() or "de que forma" in question.lower():
        return "Você deseja um exemplo prático ou um passo a passo mais detalhado?"

    if "oque" in question.lower() or "o que" in question.lower() or "qual" in question.lower():
        return "Quer aprofundar com outra pergunta relacionada ao mesmo tema?"

    # fallback
    return "Gostaria de fazer uma pergunta de seguimento para aprofundar este tema?"


@app.on_event("startup")
def startup_event():
    Path(config.DATA_DIRECTORY).mkdir(parents=True, exist_ok=True)
    Path(config.VECTORSTORE_DIR).mkdir(parents=True, exist_ok=True)


@app.post("/upload")
async def upload_files(files: list[UploadFile] = File(...)):
    saved_files = []

    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="O sistema apenas suporta arquivos PDF.")

        dest_path = Path(config.DATA_DIRECTORY) / file.filename

        with dest_path.open("wb") as out_file:
            content = await file.read()
            out_file.write(content)

        saved_files.append(str(dest_path))

    return {
        "status": "uploaded",
        "uploaded_files": saved_files,
        "message": "Ficheiros gravados em data/. Execute /build para atualizar o índice RAG antes de interrogar."
    }


@app.post("/build")
def build_index():
    docs = rag.load_documents(config.DATA_DIRECTORY)
    if not docs:
        raise HTTPException(status_code=404, detail="Nenhum documento encontrado em data/. Faça upload de PDFs primeiro.")

    chunks = rag.split_documents(docs)
    rag.create_vectorstore(chunks)

    return {
        "status": "index_built",
        "documents": len(docs),
        "chunks": len(chunks),
        "message": "Vectorstore criado/atualizado com sucesso."
    }


@app.post("/query")
def query(request: QueryRequest):
    try:
        if not rag.vectorstore:
            rag.load_vectorstore()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha ao carregar vectorstore: {e}. Execute /build primeiro.")

    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="question não pode estar vazia.")

    result = rag.query(request.question.strip())

    answer = result.get("result") if isinstance(result, dict) else None
    source_documents = result.get("source_documents", []) if isinstance(result, dict) else []

    sources = []
    for doc in source_documents:
        source = None
        if hasattr(doc, "metadata"):
            source = doc.metadata.get("source")
        if not source:
            source = getattr(doc, "source", None)
        sources.append(source or "origem desconhecida")

    return {
        "question": request.question.strip(),
        "answer": answer,
        "sources": sources,
        "possible_future_question": _suggest_follow_up(request.question.strip(), answer)
    }


