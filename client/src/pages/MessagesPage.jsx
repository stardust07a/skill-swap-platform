import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { motion } from 'framer-motion'
import { Send, MessageCircle, ArrowLeft, Search } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

export default function MessagesPage() {
  const { conversationId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const pollRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    return () => clearInterval(pollRef.current)
  }, [])

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === conversationId)
      if (conv) selectConversation(conv)
    }
  }, [conversationId, conversations])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/conversations')
      setConversations(data.conversations || [])
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = async (conv) => {
    setActiveConv(conv)
    navigate(`/messages/${conv.id}`, { replace: true })
    setMsgLoading(true)
    clearInterval(pollRef.current)
    try {
      const { data } = await api.get(`/conversations/${conv.id}/messages`)
      setMessages(data.messages || [])
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
      )
    } finally {
      setMsgLoading(false)
      inputRef.current?.focus()
    }
    // Poll every 5s
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/conversations/${conv.id}/messages`)
        setMessages(data.messages || [])
      } catch {}
    }, 5000)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeConv || sending) return
    setSending(true)
    const optimistic = {
      id: Date.now().toString(),
      text: text.trim(),
      senderId: user.id,
      sender: user,
      createdAt: new Date().toISOString(),
      isRead: false,
    }
    setMessages((prev) => [...prev, optimistic])
    setText('')
    try {
      const { data } = await api.post(`/conversations/${activeConv.id}/messages`, { text: text.trim() })
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? data.message : m)))
      setConversations((prev) =>
        prev.map((c) => c.id === activeConv.id ? { ...c, lastMessage: data.message } : c)
      )
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id))
    } finally {
      setSending(false)
    }
  }

  const filteredConvs = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(search.toLowerCase())
  )

  const formatTime = (date) => {
    const d = new Date(date)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    if (isToday) return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-cyan-400" /> Mesajlar
      </h1>

      <div className="glass rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Conversations sidebar */}
          <div className={`${activeConv ? 'hidden sm:flex' : 'flex'} w-full sm:w-72 lg:w-80 flex-col border-r border-white/10 shrink-0`}>
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ara..."
                  className="input-field pl-9 text-sm py-2"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">Konuşma bulunamadı</p>
                </div>
              ) : (
                filteredConvs.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left
                      ${activeConv?.id === conv.id ? 'bg-purple-600/10 border-r-2 border-purple-500' : ''}`}
                  >
                    <img
                      src={conv.otherUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUser.name}`}
                      alt={conv.otherUser.name}
                      className="w-10 h-10 rounded-full bg-purple-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">{conv.otherUser.name}</span>
                        {conv.lastMessage && (
                          <span className="text-xs text-white/30 shrink-0 ml-2">{formatTime(conv.lastMessage.createdAt)}</span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 truncate mt-0.5">
                        {conv.lastMessage?.text || 'Konuşma başladı'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`${activeConv ? 'flex' : 'hidden sm:flex'} flex-1 flex-col`}>
            {!activeConv ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">Bir konuşma seç</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                  <button onClick={() => { setActiveConv(null); navigate('/messages') }} className="sm:hidden text-white/50 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={activeConv.otherUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConv.otherUser.name}`}
                    alt={activeConv.otherUser.name}
                    className="w-9 h-9 rounded-full bg-purple-900"
                  />
                  <div>
                    <p className="font-semibold text-white text-sm">{activeConv.otherUser.name}</p>
                    <p className="text-xs text-green-400">Aktif</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {msgLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-white/30 text-sm">İlk mesajı sen gönder!</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMine = msg.senderId === user?.id
                      const showDate = i === 0 || new Date(messages[i - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString()
                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="text-center text-xs text-white/30 my-3">
                              {new Date(msg.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                            </div>
                          )}
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                              isMine
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                                : 'glass text-white/90 rounded-bl-sm'
                            }`}>
                              <p className="leading-relaxed">{msg.text}</p>
                              <p className={`text-xs mt-1 ${isMine ? 'text-white/60' : 'text-white/30'} text-right`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/10">
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="input-field flex-1 py-2.5 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
                    />
                    <button
                      type="submit"
                      disabled={!text.trim() || sending}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shrink-0
                        disabled:opacity-50 hover:scale-105 transition-transform"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
