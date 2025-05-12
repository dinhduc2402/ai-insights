# AI Insights Platform

A powerful AI-powered insights platform that leverages multiple language models to provide intelligent analysis and responses.

## Features

- Multi-model support (GPT-4, Claude, Grok-3)
- Real-time streaming responses
- Context-aware processing with Pinecone vector database
- Modern web interface with model selection
- Secure API endpoints
- Scalable architecture

## Tech Stack

### Backend

- FastAPI
- LangChain
- Pinecone (Vector Database)
- PostgreSQL
- Cloudflare R2 (Storage)

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Pinecone account
- Cloudflare R2 account
- API keys for:
  - OpenAI
  - Anthropic
  - Grok
  - Pinecone

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-insights.git
cd ai-insights
```

2. Set up the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:

```bash
cd frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:

```env
# API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GROK_API_KEY=your_grok_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_environment

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_insights

# Storage
R2_ACCESS_KEY_ID=your_r2_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT_URL=your_r2_endpoint
```

## Running the Application

1. Start the backend server:

```bash
cd backend
uvicorn app.main:app --reload
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Endpoints

### Main Endpoints

- `POST /api/v1/process`: Process text with AI models
- `POST /api/v1/stream`: Stream AI responses
- `GET /api/v1/models`: List available AI models

## Development

### Project Structure

```
ai-insights/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── tests/
│   └── requirements.txt
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    └── public/
```

### Adding New Models

To add a new AI model:

1. Add the model configuration in `backend/app/services/assistant_service.py`
2. Add the model's API key to settings
3. Update the frontend model selector component

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- xAI for Grok models
- LangChain for the AI framework
- FastAPI for the backend framework
- Next.js for the frontend framework
