import requests
import json
import time

# Test the API endpoints
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print("Health Check:", response.json())
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_ask_question():
    """Test ask endpoint"""
    try:
        questions = [
            "How do I create an account?",
            "What payment methods do you accept?",
            "How long does delivery take?",
            "Can I return items?",
            "What is Verayaa?"
        ]
        
        for question in questions:
            print(f"\nTesting question: {question}")
            response = requests.post(
                f"{BASE_URL}/ask",
                json={"question": question}
            )
            
            if response.status_code == 200:
                answer = response.json()["answer"]
                print(f"Answer: {answer[:100]}...")
            else:
                print(f"Error: {response.status_code} - {response.text}")
            
            time.sleep(1)  # Rate limiting
            
    except Exception as e:
        print(f"Ask question test failed: {e}")

def test_feedback():
    """Test feedback endpoint"""
    try:
        feedback_data = {
            "message_id": "test_123",
            "question": "Test question",
            "answer": "Test answer",
            "feedback": "positive",
            "timestamp": "2024-01-01T12:00:00Z"
        }
        
        response = requests.post(
            f"{BASE_URL}/feedback",
            json=feedback_data
        )
        
        print("Feedback test:", response.json())
        
    except Exception as e:
        print(f"Feedback test failed: {e}")

def test_stats():
    """Test stats endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/stats")
        print("Stats:", response.json())
        
    except Exception as e:
        print(f"Stats test failed: {e}")

if __name__ == "__main__":
    print("Testing Verayaa FAQ Chatbot API...")
    
    if test_health():
        print("✅ Health check passed")
        test_ask_question()
        test_feedback()
        test_stats()
    else:
        print("❌ Health check failed - make sure the server is running")
