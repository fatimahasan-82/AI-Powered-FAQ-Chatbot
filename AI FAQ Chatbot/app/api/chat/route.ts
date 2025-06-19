import { type NextRequest, NextResponse } from "next/server"

// FAQ Data - In a real app, this could be in a database
const FAQ_DATA = {
  brand: "Verayaa",
  description: "Fashion & Apparel brand selling clothes, shoes, and accessories online",
  faqs: [
    {
      id: 1,
      category: "Account",
      question: "How do I create an account on Verayaa?",
      answer: "Click on 'Sign Up' at the top-right corner and fill in your details to create a Verayaa account.",
    },
    {
      id: 2,
      category: "Orders",
      question: "How do I check my order status?",
      answer: "Log in to your account and visit the 'My Orders' section to track your order status.",
    },
    {
      id: 3,
      category: "Orders",
      question: "I didn't receive an order confirmation email. What should I do?",
      answer: "Please check your spam or promotions folder. If not found, contact us at support@verayaa.com.",
    },
    {
      id: 4,
      category: "Sizing",
      question: "How do I know which size to order?",
      answer: "Please refer to our detailed size chart on each product page before placing an order.",
    },
    {
      id: 5,
      category: "Products",
      question: "Are your hijabs see-through?",
      answer:
        "Most of our hijabs are opaque. Specific details about fabric thickness are mentioned in the product description.",
    },
    {
      id: 6,
      category: "Sizing",
      question: "Do you offer plus-size options?",
      answer: "Yes, many of our outfits are available in sizes up to 3XL. Check size availability on the product page.",
    },
    {
      id: 7,
      category: "Payment",
      question: "What payment methods does Verayaa accept?",
      answer: "We accept UPI, credit/debit cards, net banking, and wallet payments. COD is available on select orders.",
    },
    {
      id: 8,
      category: "Payment",
      question: "Can I apply more than one coupon at checkout?",
      answer: "No, only one discount code can be used per order.",
    },
    {
      id: 9,
      category: "Payment",
      question: "My payment failed, but I was charged. What now?",
      answer: "Don't worry! If the amount was deducted, it will be automatically refunded within 5–7 business days.",
    },
    {
      id: 10,
      category: "Shipping",
      question: "How long does Verayaa take to deliver?",
      answer: "Standard orders are usually delivered within 3–7 business days, depending on your location.",
    },
    {
      id: 11,
      category: "Shipping",
      question: "Do you offer international shipping?",
      answer: "Yes, we ship internationally. Shipping rates and timelines are calculated at checkout.",
    },
    {
      id: 12,
      category: "Shipping",
      question: "Can I change my delivery address after placing an order?",
      answer: "You can request a change by contacting us within 1 hour of placing your order.",
    },
    {
      id: 13,
      category: "Returns",
      question: "What is Verayaa's return policy?",
      answer: "You can return most items within 7 days of delivery. Items must be unused and in original condition.",
    },
    {
      id: 14,
      category: "Returns",
      question: "How do I request a return?",
      answer: "Go to 'My Orders', select the item, and choose 'Return'. Follow the instructions on-screen.",
    },
    {
      id: 15,
      category: "Returns",
      question: "How long do refunds take?",
      answer: "Refunds are processed within 5–7 working days after we receive and approve the return.",
    },
    {
      id: 16,
      category: "Orders",
      question: "Can I cancel my order?",
      answer: "Orders can be canceled within 1 hour of placing them, or before they are shipped.",
    },
    {
      id: 17,
      category: "Sustainability",
      question: "Is Verayaa's packaging eco-friendly?",
      answer: "Yes, we use sustainable packaging materials wherever possible.",
    },
    {
      id: 18,
      category: "Services",
      question: "Do you offer gift wrapping?",
      answer: "Yes! Select the gift wrap option at checkout for a small additional fee.",
    },
    {
      id: 19,
      category: "Support",
      question: "How do I contact Verayaa support?",
      answer: "You can reach us via live chat on our website or email us at support@verayaa.com.",
    },
    {
      id: 20,
      category: "Brand",
      question: "What makes Verayaa different from other brands?",
      answer:
        "Verayaa blends timeless modesty with modern style — designed with care, comfort, and confidence in mind.",
    },
    {
      id: 21,
      category: "Products",
      question: "Do you restock sold-out items?",
      answer: "We restock our bestsellers regularly. You can sign up for restock alerts on the product page.",
    },
    {
      id: 22,
      category: "Brand",
      question: "What is Verayaa?",
      answer:
        "Verayaa is our premium fashion and lifestyle brand, offering elegant, modern, and modest apparel and accessories.",
    },
    {
      id: 23,
      category: "Support",
      question: "Who are you?",
      answer: "I'm Verayaa's AI assistant—your 24/7 helper for anything from sizing and orders to returns and support.",
    },
    {
      id: 24,
      category: "Support",
      question: "How can you help me?",
      answer:
        "I can answer questions about browsing products, placing and tracking orders, payment methods, returns, shipping, and more.",
    },
    {
      id: 25,
      category: "Support",
      question: "What should I do if you can't answer my question?",
      answer:
        "If I'm unsure, I'll let you know. You can then reach out directly at support@verayaa.com for further assistance.",
    },
  ],
}

function constructPrompt(userQuestion: string): string {
  let faqExamples = ""
  for (const faq of FAQ_DATA.faqs) {
    faqExamples += `Q: ${faq.question}\nA: ${faq.answer}\n\n`
  }

  const prompt = `Verayaa is Fashion & Apparel brand selling clothes, shoes, and accessories online. You are Verayaa's AI-Powered FAQ Chatbot. Answer customer questions based only on the examples below. 
If you're unsure, say: "I'm not sure how to answer that yet."

You are deployed in India, so make sure to converse in INR and keep it Indian economy relevant.

You are Verayaa's friendly AI-Powered FAQ Chatbot assistant. You help customers with questions about the Verayaa brand, products, orders, and policies. You speak clearly and politely. If you don't know an answer, say "I'm not sure how to answer that yet."

Examples:

${faqExamples}

User Question: ${userQuestion}
Answer:`

  return prompt
}

async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API Error:", errorData)
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text.trim()
    } else {
      throw new Error("Invalid response format from Gemini API")
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support@verayaa.com."
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, apiKey } = await request.json()

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Construct the prompt
    const prompt = constructPrompt(question.trim())

    // Call Gemini API
    const answer = await callGeminiAPI(prompt, apiKey)

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
