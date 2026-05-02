import { useState, useRef, useEffect } from 'react'
import axios from '../api/axios'
import './Chatbot.css'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Сәлем! TechStore-ға қош келдіңіз! 👋 Қалай көмектесе аламын?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('/api/chat', { message: text, use_ai: true })
      setMessages(prev => [...prev, { from: 'bot', text: res.data.response }])
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Қате орын алды. Қайталап көріңіз.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>🤖 TechStore AI</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.from}`}>
                <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg bot">
                <span className="chatbot-typing">●●●</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Сұрағыңызды жазыңыз..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '💬'}
      </button>
    </div>
  )
}
