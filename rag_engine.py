import os

# PROCESSA PASTA, FICHEIROS DE TEXTO E PDFs
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
# DIVIDE O CONTÉUDO EM CHUNKS
from langchain_text_splitters import RecursiveCharacterTextSplitter
# EMBEDDINGS PRÓPRIOS DA OPENAI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
# BASE DE DADOS VECTORIAL
from langchain_chroma import Chroma
# CRIA A CHAIN COM O LLM, PROMPT E RETRIEVER
from langchain_classic.chains import RetrievalQA
# UTILIZADO PARA CRIAR TEMPLATES PARA PROMPTS
from langchain_core.prompts import PromptTemplate

# FICHEIRO COM AS CONFIGURAÇÕES COMO O LLM, NÚMERO DE CHUNKS E PASTA DA BASE DE DADOS VECTORIAL
import config

class RAGAssistant:

    def __init__(self):
        # INICIALIZA OS EMBEDDINGS
        self.embeddings = OpenAIEmbeddings()

        # INICIALIZAÇÃO DO MODELO DA OPENAI COM A TEMPERATURA
        self.llm = ChatOpenAI(
            model=config.OPENAI_MODEL,
            temperature=0
        )

        self.vectorstore = None


    def load_documents(self, directory=None):
        # SE A VARIÁVEL DIRECTORY FOR NULA VAI BUSCAR O VALOR NO FICHEIRO DE CONFIGURAÇÃO
        directory = directory or config.DATA_DIRECTORY

        loaders = []

        if os.path.exists(directory):
            # GUARDA TODOS OS FICHEIROS .pdf QUE ENCONTRAR
            loaders.append(
                DirectoryLoader(
                    directory,
                    glob="**/*.pdf",
                    loader_cls=PyPDFLoader
                )
            )

            # GUARDA TODOS OS FICHEIROS .txt QUE ENCONTRAR
            loaders.append(
                DirectoryLoader(
                    directory,
                    glob="**/*.txt",
                    loader_cls=TextLoader
                )
            )

        documents = []

        # ADICIONA OS FICHEIROS CARREGADOS À VARIÁVEL DOCUMENTS
        for loader in loaders:
            try:
                docs = loader.load()
                documents.extend(docs)
            except Exception:
                pass

        return documents


    def split_documents(self, documents):
        # INICIALIZAÇÃO DO OBJETO DE SPLIT COM OS CHUNKS, CHUNK_OVERLAP, E SEPARADORES
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.CHUNK_SIZE,
            chunk_overlap=config.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

        # RETORNA A LISTA DOS DOCUMENTOS JÁ PROCESSADOS PELO SPLITTER
        return splitter.split_documents(documents)


    def create_vectorstore(self, chunks):

        # INICIALIZAÇÃO DO OBJETO CHROMA PARA GUARDAR OS CONTÉUDOS
        self.vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=config.VECTORSTORE_DIR,
            collection_name=config.COLLECTION_NAME
        )


    def load_vectorstore(self):

        # ABRE O ACESSO À BASE DE DADOS VECTORIAL PARA PESQUISAS FUTURAS
        self.vectorstore = Chroma(
            persist_directory=config.VECTORSTORE_DIR,
            embedding_function=self.embeddings,
            collection_name=config.COLLECTION_NAME
        )


    def create_qa_chain(self):

        template = """
És um assistente de perguntas e respostas. O teu objetivo é responder às perguntas com base no contexto fornecido.
Se a pergunta não estiver presente no contexto ou existir qualquer incerteza que possa levar a uma resposta errada, deves responder que com base no teu contexto não consegues determinar uma resposta correta e que o utilizador deve fornecer mais informações ou reformular a pergunta.

Caso o tema faça parte do contexto, deves responder de forma clara e concisa, utilizando apenas as informações presentes no contexto. Evita fornecer informações adicionais que não estejam presentes no contexto.

O público alvo do sistema serão alunos universitários de diversas áreas, pelo que as respostas devem ser claras e concisas, evitando jargões técnicos sempre que possível.

Context:
{context}

Question:
{question}

Answer:
"""
        # CRIA A PROMPT COM BASE NO TEMPLATE E NAS VARIÁVEIS CONTEXT E QUESTION
        prompt = PromptTemplate(
            template=template,
            input_variables=["context", "question"]
        )

        # RETRIEVER RESPONSÁVEL POR RECOLHER OS TOP 4 RESULTADOS SEMELHANTES
        retriever = self.vectorstore.as_retriever(
            search_kwargs={"k": config.TOP_K}
        )

        # CHAIN QUE JUNTA O LLM, RETRIEVER E PROMPT
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": prompt},
            return_source_documents=True
        )

        return qa_chain


    # FUNÇÃO RESPONSÁVEL POR FAZER AS QUERIES AO CHAMAR A FUNÇÃO DE CRIAÇÃO DE CHAIN
    def query(self, question):

        if not self.vectorstore:
            raise ValueError("Vectorstore not loaded")

        qa_chain = self.create_qa_chain()

        result = qa_chain.invoke({
            "query": question
        })

        return result