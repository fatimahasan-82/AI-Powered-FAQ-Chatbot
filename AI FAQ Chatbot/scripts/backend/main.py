from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
import logging
from datetime import datetime
import asyncio
from google import genai
from google.genai import types

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Verayaa FAQ Chatbot API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QuestionRequest(BaseModel):
    question: str

class FeedbackRequest(BaseModel):
    message_id: str
    question: str
    answer: str
    feedback: str  # 'positive' or 'negative'
    timestamp: str

class ChatResponse(BaseModel):
    answer: str
    confidence: Optional[float] = None

# Global variables
faq_data = {}
gemini_client = None

def load_faq_data():
    """Load FAQ data from JSON file"""
    global faq_data
    try:
        with open('scripts/backend/faq_data.json', 'r', encoding='utf-8') as f:
            faq_data = json.load(f)
        logger.info(f"Loaded {len(faq_data.get('faqs', []))} FAQ entries")
    except FileNotFoundError:
        logger.error("FAQ data file not found")
        faq_data = {"faqs": []}
    except json.JSONDecodeError:
        logger.error("Invalid JSON in FAQ data file")
        faq_data = {"faqs": []}

def initialize_gemini_client():
    """Initialize Gemini API client"""
    global gemini_client
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY environment variable not set")
        return False
    
    try:
        gemini_client = genai.Client(api_key=api_key)
        logger.info("Gemini client initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize Gemini client: {e}")
        return False

def construct_prompt(user_question: str) -> str:
    """Construct the prompt for Gemini API"""
    faq_examples = ""
    for faq in faq_data.get('faqs', []):
        faq_examples += f"Q: {faq['question']}\nA: {faq['answer']}\n\n"
    
    prompt = f"""Verayaa is Fashion & Apparel brand selling clothes, shoes, and accessories online. You are Verayaa's AI-Powered FAQ Chatbot. Answer customer questions based only on the examples below. 
If you're unsure, say: "I'm not sure how to answer that yet."

You are deployed in India, so make sure to converse in INR and keep it Indian economy relevant.

You are Verayaa's friendly AI-Powered FAQ Chatbot assistant. You help customers with questions about the Verayaa brand, products, orders, and policies. You speak clearly and politely. If you don't know an answer, say "I'm not sure how to answer that yet."

Examples:

{faq_examples}

User Question: {user_question}
Answer:"""
    
    return prompt

async def get_gemini_response(prompt: str) -> str:
    """Get response from Gemini API"""
    if not gemini_client:
        raise HTTPException(status_code=500, detail="Gemini client not initialized")
    
    try:
        model = "gemini-2.0-flash"
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            )
        ]
        
        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )
        
        # Use generate_content instead of stream for simpler handling
        response = gemini_client.models.generate_content(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        
        return response.text.strip()
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support@verayaa.com."

def save_feedback(feedback_data: dict):
    """Save feedback to JSON file"""
    try:
        feedback_file = 'scripts/backend/feedback_log.json'
        
        # Load existing feedback
        if os.path.exists(feedback_file):
            with open(feedback_file, 'r', encoding='utf-8') as f:
                feedback_log = json.load(f)
        else:
            feedback_log = {"feedback": []}
        
        # Add new feedback
        feedback_log["feedback"].append(feedback_data)
        
        # Save back to file
        with open(feedback_file, 'w', encoding='utf-8') as f:
            json.dump(feedback_log, f, indent=2, ensure_ascii=False)
            
        logger.info(f"Feedback saved: {feedback_data['feedback']}")
        
    except Exception as e:
        logger.error(f"Error saving feedback: {e}")

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    load_faq_data()
    if not initialize_gemini_client():
        logger.warning("Starting without Gemini client - API calls will fail")

# API Routes
@app.get("/")
async def root():
    return {"message": "Verayaa FAQ Chatbot API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_client": gemini_client is not None,
        "faq_count": len(faq_data.get('faqs', []))
    }

@app.post("/ask", response_model=ChatResponse)
async def ask_question(request: QuestionRequest):
    """Handle user questions"""
    try:
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        # Construct prompt
        prompt = construct_prompt(request.question)
        
        # Get response from Gemini
        answer = await get_gemini_response(prompt)
        
        return ChatResponse(answer=answer)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """Handle user feedback"""
    try:
        feedback_data = {
            "message_id": request.message_id,
            "question": request.question,
            "answer": request.answer,
            "feedback": request.feedback,
            "timestamp": request.timestamp,
            "processed_at": datetime.now().isoformat()
        }
        
        save_feedback(feedback_data)
        
        return {"message": "Feedback received successfully"}
        
    except Exception as e:
        logger.error(f"Error processing feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to process feedback")

@app.get("/stats")
async def get_stats():
    """Get basic statistics"""
    try:
        feedback_file = 'scripts/backend/feedback_log.json'
        feedback_count = 0
        positive_feedback = 0
        negative_feedback = 0
        
        if os.path.exists(feedback_file):
            with open(feedback_file, 'r', encoding='utf-8') as f:
                feedback_log = json.load(f)
                feedback_count = len(feedback_log.get('feedback', []))
                positive_feedback = sum(1 for f in feedback_log.get('feedback', []) if f.get('feedback') == 'positive')
                negative_feedback = sum(1 for f in feedback_log.get('feedback', []) if f.get('feedback') == 'negative')
        
        return {
            "faq_count": len(faq_data.get('faqs', [])),
            "total_feedback": feedback_count,
            "positive_feedback": positive_feedback,
            "negative_feedback": negative_feedback
        }
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return {"error": "Failed to get statistics"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
