from rag_engine import RAGAssistant

def build_index():

    rag = RAGAssistant()

    print("Loading documents...")
    docs = rag.load_documents()

    if not docs:
        print("No documents found.")
        return

    print("Splitting documents...")
    chunks = rag.split_documents(docs)

    print("Creating vectorstore...")
    rag.create_vectorstore(chunks)

    print("Vectorstore created successfully.")

def interactive_query():

    rag = RAGAssistant()

    rag.load_vectorstore()

    print("RAG system ready. Type 'exit' to quit.")

    while True:

        question = input("\nQuestion: ")

        if question.lower() in ["exit", "quit"]:
            break

        result = rag.query(question)

        print("\nAnswer:\n")
        print(result["result"])

        if result.get("source_documents"):

            print("\nSources:")

            for doc in result["source_documents"]:
                source = doc.metadata.get("source", "Unknown source")
                print("-", source)

if __name__ == "__main__":

    mode = input("Choose mode: [1] Build index  [2] Query system: ")

    if mode == "1":
        build_index()
    else:
        interactive_query()