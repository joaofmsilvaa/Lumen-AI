<div align="center">
  <img src="https://github.com/joaofmsilvaa/Lumen-AI/blob/main/readme_images/img1.png" alt="Frontend">
</div>

# Lumen-AI

Lumen-AI is an AI-powered document assistant that leverages Retrieval-Augmented Generation (RAG) to provide intelligent answers, sources, and suggestions based on uploaded PDF documents. It features a robust Python FastAPI backend for AI processing and a dynamic Next.js frontend with an interactive chat interface, file upload capabilities, and integrated gamification elements for an engaging user experience.

## ✨ Key Features & Benefits

*   **Intelligent Document Querying**: Ask natural language questions about your PDF documents and receive accurate, context-aware answers.
*   **Retrieval-Augmented Generation (RAG)**: Combines powerful language models with document retrieval to ensure responses are grounded in your data, minimizing hallucinations.
*   **Source Citation**: Get direct links and references to the exact document passages used to formulate answers, enhancing trustworthiness and verifiability.
*   **Query Suggestions**: Receive intelligent follow-up questions or related topic suggestions to deepen your understanding.
*   **Intuitive Chat Interface**: Interact with your documents through a user-friendly conversational UI.
*   **Secure File Upload**: Easily upload PDF documents for processing and indexing.
*   **Gamification Panel (Planned/Under Development)**: Engage with the assistant through gamified elements to make learning and interaction more fun.
*   **Modular & Scalable Architecture**: Built with a clear separation between frontend and backend, allowing for independent development and scaling.

## 🛠️ Prerequisites & Dependencies

To set up and run Lumen-AI, you will need the following installed on your system:

### General

*   **Git**: For cloning the repository.

### Backend (Python)

*   **Python 3.8+**: The core language for the API.
*   **FastAPI**: The framework that supports connects the RAG engine to the frontend.
*   **pip**: Python package installer.
*   **virtualenv** (recommended): For managing Python dependencies.

### Frontend (TypeScript/Node.js)

*   **Node.js 18+**: JavaScript runtime environment.
*   **NextJS**: The robust frontend framework that powers the system.
*   **npm** (Node Package Manager) or **Yarn**, **pnpm**, **Bun**: For managing frontend dependencies.

## 🚀 Installation & Setup Instructions

The project consists of two main parts: the Python FastAPI backend and the Next.js frontend.

### 1. Clone the Repository

First, clone the Lumen-AI repository to your local machine:

```bash
git clone https://github.com/joaofmsilvaa/Lumen-AI.git
cd Lumen-AI
```

### 2. Backend Setup (FastAPI)

Navigate to the root directory of the cloned repository for backend setup.

```bash
# Ensure you are in the Lumen-AI root directory
# cd Lumen-AI 
```

#### a. Create and Activate a Virtual Environment

It's highly recommended to use a virtual environment to manage dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

#### b. Install Python Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt # (You will likely need to create this file based on api.py and config.py)
# Expected packages: fastapi, uvicorn, python-dotenv, pydantic, langchain (inferred for RAGAssistant), openai, chromadb (inferred for vectorstore)
# Example: pip install fastapi "uvicorn[standard]" python-dotenv pydantic langchain openai chromadb
```

#### c. Configure Environment Variables

Create a `.env` file in the root directory (`Lumen-AI/.env`) based on `config.py`:

```
OPENAI_MODEL="gpt-4o-mini"
DATA_DIRECTORY="data"
VECTORSTORE_DIR="vectorstore"
COLLECTION_NAME="rag_collection"
CHUNK_SIZE=800
CHUNK_OVERLAP=100
TOP_K=4
```

Adjust the values as needed. You will also need an `OPENAI_API_KEY` in your environment, which is typically loaded by the `rag_engine` or `config.py` if not explicitly shown.

#### d. Run the Backend Server

Start the FastAPI application. Ensure you are in the `Lumen-AI` root directory.

```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be accessible at `http://localhost:8000`.

### 3. Frontend Setup (Next.js)

Navigate into the `lumen/` directory for frontend setup:

```bash
cd lumen
```

#### a. Install Node.js Dependencies

Install the necessary Node.js packages:

```bash
npm install
# or yarn install
# or pnpm install
# or bun install
```

#### b. Run the Frontend Development Server

Start the Next.js development server:

```bash
npm run dev
# or yarn dev
# or pnpm dev
# or bun dev
```

The frontend application will be accessible at `http://localhost:3000`.

## 💡 Usage Examples & API Documentation

### Frontend Usage

Once both the backend and frontend servers are running:

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  Use the "File Upload" component to upload your PDF documents. These will be processed by the backend to create the RAG index.
3.  Interact with the "Chat Interface" by typing your questions. The frontend will communicate with the FastAPI backend to retrieve answers, sources, and suggestions.
4.  (Future) Explore the "Gamification Panel" for engaging interactions.

### Backend API Documentation

The FastAPI backend automatically generates interactive API documentation using Swagger UI.

*   Access the API documentation at: `http://localhost:8000/docs`

Key API Endpoints:

*   **`POST /uploadfile/`**: Upload a PDF file to create or update the RAG index.
    *   `file` (UploadFile): The PDF document to upload.
*   **`POST /query/`**: Send a query to the RAG assistant to get answers, sources, and suggestions.
    *   `query` (str): The natural language question to ask.

## ⚙️ Configuration Options

The backend configuration is managed via environment variables loaded from the `.env` file, as detailed in `config.py`.

| Variable          | Description                                                    | Default Value   |
| :---------------- | :------------------------------------------------------------- | :-------------- |
| `OPENAI_MODEL`    | The OpenAI model to use for RAG (e.g., `gpt-4o-mini`).        | `gpt-4o-mini`   |
| `DATA_DIRECTORY`  | Directory where uploaded files are temporarily stored.         | `data`          |
| `VECTORSTORE_DIR` | Directory where the vector store index is persisted.            | `vectorstore`   |
| `COLLECTION_NAME` | Name of the collection within the vector store.                | `rag_collection`|
| `CHUNK_SIZE`      | The size of document chunks for vectorization.                 | `800`           |
| `CHUNK_OVERLAP`   | The overlap between document chunks to maintain context.       | `100`           |
| `TOP_K`           | The number of top relevant documents to retrieve for RAG.      | `4`             |

**CORS Configuration**: The `api.py` file also configures Cross-Origin Resource Sharing (CORS). By default, it allows requests from `http://localhost:3000`. If your frontend is running on a different origin, you will need to update the `allow_origins` list in `api.py`.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Update this list for different frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🤝 Contributing Guidelines

We welcome contributions to Lumen-AI! If you're interested in improving the project, please follow these steps:

1.  **Fork the repository** on GitHub.
2.  **Clone your forked repository** to your local machine.
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
4.  **Make your changes**. Ensure your code adheres to the project's coding standards.
    *   **For Next.js Development**: Please read `lumen/AGENTS.md` for important Next.js breaking changes and conventions.
5.  **Test your changes** thoroughly.
6.  **Commit your changes** with a clear and descriptive commit message.
7.  **Push your branch** to your forked repository.
8.  **Open a Pull Request** against the `main` branch of the original repository. Provide a detailed description of your changes and why they are necessary.

## 📄 License Information

This project currently does not have an explicit license specified. Users are advised to contact the owner, joaofmsilvaa, for licensing terms regarding use, distribution, and modification.

## 🙏 Acknowledgments

*   **Next.js**: For the robust and production-ready frontend framework.
*   **FastAPI**: For the high-performance and easy-to-use Python web framework.
*   **OpenAI**: For providing powerful AI models that enable the RAG capabilities.
*   **create-next-app**: For bootstrapping the Next.js project.
