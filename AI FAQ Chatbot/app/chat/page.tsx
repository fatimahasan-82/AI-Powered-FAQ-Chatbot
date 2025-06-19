"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Send, Bot, User, Loader2, Settings, Home, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  feedback?: "positive" | "negative"
}

const quickQuestions = [
  "How do I create an account?",
  "What payment methods do you accept?",
  "How long does delivery take?",
  "What is your return policy?",
  "Do you offer plus-size options?",
  "How do I track my order?",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm Verayaa's AI assistant. I'm here to help you with questions about our fashion brand, products, orders, and policies. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [tempApiKey, setTempApiKey] = useState("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [apiKeyStatus, setApiKeyStatus] = useState<"none" | "configured" | "checking">("checking")

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem("gemini_api_key")
    if (savedApiKey && savedApiKey.trim()) {
      setApiKey(savedApiKey)
      setApiKeyStatus("configured")
      console.log("API Key found in localStorage:", savedApiKey.substring(0, 10) + "...")
    } else {
      setApiKeyStatus("none")
      console.log("No API key found in localStorage")
    }
  }, [])

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey)
      localStorage.setItem("gemini_api_key", tempApiKey)
      setApiKeyStatus("configured")
      setIsSettingsOpen(false)
      setTempApiKey("")
      console.log("API Key saved:", tempApiKey.substring(0, 10) + "...")
    }
  }

  const sendMessage = async (question?: string) => {
    const messageText = question || inputValue
    if (!messageText.trim() || isLoading) return

    if (!apiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Please configure your Gemini API key in the settings first.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: messageText,
          apiKey: apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble connecting right now. Please check your API key and try again, or contact support@verayaa.com for assistance.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (messageId: string, feedback: "positive" | "negative") => {
    const message = messages.find((m) => m.id === messageId)
    if (!message) return

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message_id: messageId,
          question: messages[messages.findIndex((m) => m.id === messageId) - 1]?.content || "",
          answer: message.content,
          feedback: feedback,
          timestamp: message.timestamp.toISOString(),
        }),
      })

      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, feedback } : m)))
    } catch (error) {
      console.error("Failed to send feedback:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Verayaa AI
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>API Configuration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key">Gemini API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your Gemini API key"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Get your API key from{" "}
                        <a
                          href="https://makersuite.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Google AI Studio
                        </a>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveApiKey} className="flex-1">
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTempApiKey("")
                          setIsSettingsOpen(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>
                        Status: <span className="font-mono">{apiKeyStatus}</span>
                      </div>
                      <div>
                        Key Length: <span className="font-mono">{apiKey ? apiKey.length : 0}</span>
                      </div>
                      <div>
                        Key Preview:{" "}
                        <span className="font-mono">{apiKey ? apiKey.substring(0, 10) + "..." : "None"}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        localStorage.removeItem("gemini_api_key")
                        setApiKey("")
                        setApiKeyStatus("none")
                        console.log("API Key cleared from localStorage")
                      }}
                    >
                      Clear Stored API Key
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Questions</h3>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start h-auto p-2 text-xs hover:bg-purple-50"
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tips</h3>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li>• Ask about sizing, orders, returns</li>
                  <li>• Get product recommendations</li>
                  <li>• Check delivery information</li>
                  <li>• Learn about payment options</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <Card className="flex-1 flex flex-col shadow-xl border-0 bg-white/90 backdrop-blur-sm min-h-0">
              {/* Chat Header */}
              <div className="border-b p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Verayaa AI Assistant</h2>
                      <p className="text-sm opacity-90">Always here to help</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    AI Powered
                  </Badge>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 flex flex-col min-h-0">
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ maxHeight: "calc(100vh - 300px)" }}
                >
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex items-start gap-3",
                          message.sender === "user" ? "justify-end" : "justify-start",
                        )}
                      >
                        {message.sender === "bot" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-purple-600" />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl p-4 shadow-sm",
                            message.sender === "user"
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-white border border-gray-100",
                          )}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-2",
                              message.sender === "user" ? "text-white/70" : "text-gray-500",
                            )}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </p>

                          {message.sender === "bot" && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={cn(
                                  "h-7 px-2 hover:bg-green-50",
                                  message.feedback === "positive" && "bg-green-100 text-green-600",
                                )}
                                onClick={() => handleFeedback(message.id, "positive")}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={cn(
                                  "h-7 px-2 hover:bg-red-50",
                                  message.feedback === "negative" && "bg-red-100 text-red-600",
                                )}
                                onClick={() => handleFeedback(message.id, "negative")}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {message.sender === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Invisible div for scrolling to bottom */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4 bg-gray-50/50 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about Verayaa..."
                      disabled={isLoading}
                      className="flex-1 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send • Get help with orders, sizing, returns, and more
                  </p>
                  {apiKeyStatus === "none" && (
                    <p className="text-xs text-orange-600 mt-1 text-center">
                      ⚠️ No API key configured - Please add your Gemini API key in settings
                    </p>
                  )}
                  {apiKeyStatus === "configured" && (
                    <p className="text-xs text-green-600 mt-1 text-center">✅ API key configured - Ready to chat!</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
