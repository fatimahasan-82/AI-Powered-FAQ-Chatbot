import { type NextRequest, NextResponse } from "next/server"

interface FeedbackData {
  message_id: string
  question: string
  answer: string
  feedback: "positive" | "negative"
  timestamp: string
  processed_at: string
}

// In a real application, you would store this in a database
// For now, we'll just log it and return success
export async function POST(request: NextRequest) {
  try {
    const feedbackData = await request.json()

    // Validate the feedback data
    if (!feedbackData.message_id || !feedbackData.feedback) {
      return NextResponse.json({ error: "Missing required feedback data" }, { status: 400 })
    }

    // Add processing timestamp
    const processedFeedback: FeedbackData = {
      ...feedbackData,
      processed_at: new Date().toISOString(),
    }

    // In a real app, save to database here
    // For demo purposes, we'll just log it
    console.log("Feedback received:", processedFeedback)

    // You could also store in localStorage on the client side
    // or send to an analytics service like Google Analytics

    return NextResponse.json({
      message: "Feedback received successfully",
      feedback_id: processedFeedback.message_id,
    })
  } catch (error) {
    console.error("Error processing feedback:", error)
    return NextResponse.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
