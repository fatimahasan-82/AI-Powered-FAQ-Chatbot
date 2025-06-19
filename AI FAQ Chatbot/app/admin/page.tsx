"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  RefreshCw,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Home,
  Sparkles,
  Clock,
  Activity,
  BarChart3,
  Download,
  Settings,
  Database,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Stats {
  faq_count: number
  total_conversations: number
  total_feedback: number
  positive_feedback: number
  negative_feedback: number
  uptime: string
  last_updated: string
}

const quickActions = [
  {
    icon: <Download className="w-5 h-5" />,
    title: "Export Data",
    description: "Download conversation logs and feedback data",
    action: "export",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Update FAQ",
    description: "Manage FAQ database and responses",
    action: "faq",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Configuration",
    description: "System settings and API configuration",
    action: "config",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Analytics",
    description: "Detailed performance analytics",
    action: "analytics",
  },
]

const recentActivity = [
  { time: "2 minutes ago", action: "User asked about return policy", type: "question" },
  { time: "5 minutes ago", action: "Positive feedback received", type: "feedback" },
  { time: "8 minutes ago", action: "User asked about sizing", type: "question" },
  { time: "12 minutes ago", action: "API key updated", type: "system" },
  { time: "15 minutes ago", action: "User asked about delivery", type: "question" },
]

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const satisfactionRate =
    stats && stats.total_feedback > 0 ? Math.round((stats.positive_feedback / stats.total_feedback) * 100) : 0

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "export":
        console.log("Exporting data...")
        break
      case "faq":
        console.log("Opening FAQ manager...")
        break
      case "config":
        console.log("Opening configuration...")
        break
      case "analytics":
        console.log("Opening analytics...")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                System Online
              </Badge>
              <Link href="/chat">
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your Verayaa AI chatbot</p>
          </motion.div>
          <Button onClick={fetchStats} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">FAQ Database</CardTitle>
                  <Database className="h-5 w-5 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.faq_count}</div>
                  <p className="text-xs opacity-75">Questions available</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Feedback</CardTitle>
                  <TrendingUp className="h-5 w-5 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.total_feedback}</div>
                  <p className="text-xs opacity-75">User responses received</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Positive Feedback</CardTitle>
                  <ThumbsUp className="h-5 w-5 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.positive_feedback}</div>
                  <p className="text-xs opacity-75">Satisfied users</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Satisfaction Rate</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {satisfactionRate}%
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{satisfactionRate}%</div>
                  <p className="text-xs opacity-75">Overall satisfaction</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Uptime</span>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    {stats?.uptime || "99.9%"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">API Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Response Time</span>
                  <Badge variant="secondary">{"<2s"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-gray-500">
                    {stats?.last_updated ? new Date(stats.last_updated).toLocaleString() : "Just now"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-600">{action.icon}</div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Accuracy</span>
                    <span>98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>User Satisfaction</span>
                    <span>{satisfactionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      style={{ width: `${satisfactionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>System Load</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                      style={{ width: "23%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "question"
                          ? "bg-blue-500"
                          : activity.type === "feedback"
                            ? "bg-green-500"
                            : "bg-purple-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        activity.type === "question"
                          ? "border-blue-200 text-blue-700"
                          : activity.type === "feedback"
                            ? "border-green-200 text-green-700"
                            : "border-purple-200 text-purple-700"
                      }
                    >
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
