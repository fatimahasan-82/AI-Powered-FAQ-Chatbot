import { NextResponse } from "next/server"

// Mock statistics - in a real app, this would come from a database
export async function GET() {
  try {
    // In a real application, you would query your database for these stats
    const stats = {
      faq_count: 25,
      total_conversations: 0, // Would be tracked in database
      total_feedback: 0, // Would be tracked in database
      positive_feedback: 0, // Would be tracked in database
      negative_feedback: 0, // Would be tracked in database
      uptime: "99.9%",
      last_updated: new Date().toISOString(),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error getting stats:", error)
    return NextResponse.json({ error: "Failed to get statistics" }, { status: 500 })
  }
}
