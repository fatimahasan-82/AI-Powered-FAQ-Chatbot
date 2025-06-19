# AI-Powered FAQ Chatbot

## Verayaa AI Chatbot Website 🤖

A stunning, fully web-based AI chatbot website powered by Google's Gemini API. Built with Next.js, featuring beautiful animations, modern design, and intelligent customer support capabilities.

##  Features

###  **Beautiful Modern Design**
- **Gradient backgrounds** with glass-morphism effects
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works on all devices
- **Modern UI components** with shadcn/ui
- **Professional color schemes** with purple/pink gradients

###  **Intelligent AI Assistant**
- **Google Gemini AI** integration for smart responses
- **Context-aware conversations** about fashion and orders
- **25+ predefined FAQs** for instant answers
- **Real-time typing indicators** and smooth UX
- **Feedback system** with thumbs up/down

###  **Complete Website Experience**
- **Landing page** with hero section, features, testimonials
- **Chat interface** with sidebar and quick questions
- **About page** with technology details and timeline
- **Admin dashboard** with analytics and system monitoring
- **Professional navigation** and footer

###  **Advanced Features**
- **Client-side API key management** (secure localStorage)
- **Real-time statistics** and performance monitoring
- **Feedback collection** and analytics
- **Quick action buttons** for common questions
- **Mobile-optimized** chat interface

##  Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone or download the project
# Install dependencies

# Start development server
npm run dev
```

### Configuration

1. **Open the website**: Visit `http://localhost:3000`
2. **Navigate to chat**: Click "Start Chatting" or go to `/chat`
3. **Configure API key**: Click the settings (⚙️) button
4. **Enter your Gemini API key** and save
5. **Start chatting!** Ask questions about Verayaa

##  Website Structure

###  **Home Page** (`/`)
- **Hero section** with call-to-action
- **Feature highlights** with icons and descriptions
- **Statistics showcase** (customers, responses, satisfaction)
- **Customer testimonials** with ratings
- **Professional footer** with links

###  **Chat Page** (`/chat`)
- **Full-screen chat interface** with message bubbles
- **Sidebar with quick questions** for easy access
- **Real-time typing indicators** and animations
- **Feedback buttons** on every AI response
- **Mobile-responsive design**

###  **About Page** (`/about`)
- **Technology overview** and AI capabilities
- **Feature deep-dive** with benefits
- **Development timeline** and roadmap
- **Technical specifications** and architecture

###  **Admin Dashboard** (`/admin`)
- **System statistics** and health monitoring
- **Performance metrics** with progress bars
- **Recent activity** feed and logs
- **Quick action buttons** for management

##  Design System

### **Color Palette**
- **Primary**: Purple to Pink gradients (`from-purple-600 to-pink-600`)
- **Secondary**: Blue to Purple gradients (`from-blue-600 to-purple-600`)
- **Backgrounds**: Soft gradients (`from-purple-50 via-pink-50 to-orange-50`)
- **Text**: Professional grays with high contrast

### **Typography**
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts with proper spacing
- **UI Elements**: Consistent sizing and weight

### **Components**
- **Cards**: Glass-morphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Badges**: Contextual colors and animations
- **Icons**: Lucide React with consistent sizing

##  Customization

### **Update Branding**

```tsx
// Change brand name and colors in components
const brandName = "Your Brand AI"
const primaryGradient = "from-blue-600 to-green-600"
```

### **Modify FAQ Database**

```tsx
// Edit FAQ_DATA in app/api/chat/route.ts
const FAQ_DATA = {
  brand: "Your Brand",
  faqs: [
    {
      question: "Your question?",
      answer: "Your answer here."
    }
  ]
}
```

### **Customize AI Behavior**

```tsx
// Update the prompt in constructPrompt() function
const prompt = `Your custom AI instructions...`
```

##  Analytics & Monitoring

### **Built-in Analytics**
- **Response accuracy** tracking
- **User satisfaction** metrics
- **System performance** monitoring
- **Feedback collection** and analysis

### **Admin Dashboard Features**
- **Real-time statistics** display
- **System health** monitoring
- **Recent activity** logs
- **Quick management** actions

##  Deployment

### **Vercel**

```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod
```

### **Other Platforms**
- **Netlify**: Drag and drop the `out` folder
- **Railway**: Connect GitHub repository
- **Heroku**: Use Node.js buildpack
- **AWS Amplify**: Connect repository

##  Security Features

- **Client-side API key storage** (localStorage)
- **No server-side secrets** required
- **Direct browser-to-API** communication
- **No conversation logging** (privacy-first)

##  Development

### **Project Structure**

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/page.tsx         # Chat interface
│   ├── about/page.tsx        # About page
│   ├── admin/page.tsx        # Admin dashboard
│   └── api/
│       ├── chat/route.ts     # Chat API endpoint
│       ├── feedback/route.ts # Feedback API
│       └── stats/route.ts    # Statistics API
├── components/ui/            # shadcn/ui components
└── package.json
```

### **Adding New Features**

1. **New Pages**: Create files in `app/` directory
2. **API Endpoints**: Add routes in `app/api/`
3. **Components**: Use shadcn/ui components
4. **Styling**: Extend Tailwind classes

##  Use Cases

### **E-commerce Support**
- Product inquiries and recommendations
- Order status and tracking
- Return and refund policies
- Sizing and fit guidance

### **Customer Service**
- 24/7 automated support
- FAQ automation
- Escalation to human agents
- Multi-language support (extensible)

### **Business Intelligence**
- Customer feedback collection
- Common question identification
- Support ticket reduction
- User satisfaction tracking

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---
