import { useState } from 'react'
import { Send, Hash, Lock, Plus } from 'lucide-react'
import TopBar from '../components/TopBar'
import { chatChannels, chatMessages, systemUsers } from '../data/mockData'

const currentUser = 'u1' // Fabrice — the logged-in user

export default function Chat() {
  const [activeChannel, setActiveChannel] = useState(chatChannels[0].id)
  const [messageText, setMessageText] = useState('')
  const [allMessages, setAllMessages] = useState(chatMessages)

  const channel = chatChannels.find(c => c.id === activeChannel)!
  const messages = allMessages[activeChannel] || []

  const sendMessage = () => {
    if (!messageText.trim()) return
    const newMsg = {
      id: `m${Date.now()}`,
      from: currentUser,
      text: messageText.trim(),
      ts: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }
    setAllMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }))
    setMessageText('')
  }

  // DM channels derived from other users
  const dmChannels = systemUsers.filter(u => u.id !== currentUser).map(u => ({
    id: `dm-${u.id}`,
    name: u.name,
    type: 'dm' as const,
    members: [currentUser, u.id],
  }))

  return (
    <>
      <TopBar title="Internal Chat" />
      <main className="flex h-[calc(100vh-3.5rem)] overflow-hidden -m-0">
        {/* Sidebar */}
        <div className="w-56 bg-pluto-950 flex flex-col shrink-0">
          <div className="px-4 py-4 border-b border-pluto-800">
            <p className="text-xs font-semibold text-pluto-300 uppercase tracking-wider mb-3">Channels</p>
            {chatChannels.map(ch => (
              <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm mb-0.5 transition-colors text-left ${
                  activeChannel === ch.id ? 'bg-pluto-700 text-white' : 'text-pluto-300 hover:bg-pluto-800 hover:text-white'
                }`}>
                <Hash size={13} className="shrink-0" />
                {ch.name}
              </button>
            ))}
            <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-pluto-500 hover:text-pluto-300 transition-colors mt-1">
              <Plus size={13} />New Channel
            </button>
          </div>
          <div className="px-4 py-4 flex-1">
            <p className="text-xs font-semibold text-pluto-300 uppercase tracking-wider mb-3">Direct Messages</p>
            {dmChannels.map(dm => {
              const user = systemUsers.find(u => u.id === dm.members.find(m => m !== currentUser))!
              return (
                <button key={dm.id} onClick={() => setActiveChannel(dm.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm mb-0.5 transition-colors text-left ${
                    activeChannel === dm.id ? 'bg-pluto-700 text-white' : 'text-pluto-300 hover:bg-pluto-800 hover:text-white'
                  }`}>
                  <div className="w-4 h-4 rounded-full bg-pluto-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {user.avatar[0]}
                  </div>
                  <span className="truncate">{user.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
          <div className="px-4 py-3 border-t border-pluto-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-pluto-500 flex items-center justify-center text-xs font-bold text-white">FM</div>
              <span className="text-xs text-pluto-300">Fabrice Mvondo</span>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel header */}
          <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
            <Hash size={16} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900">{channel?.name}</h2>
            <span className="text-xs text-gray-400 ml-2">{channel?.members.length} members</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
              <Lock size={11} />
              Messages are logged for compliance
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-12">
                <Hash size={24} className="mx-auto mb-2 text-gray-200" />
                No messages yet. Start the conversation.
              </div>
            ) : (
              messages.map(msg => {
                const sender = systemUsers.find(u => u.id === msg.from)
                const isMe = msg.from === currentUser
                return (
                  <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {sender?.avatar}
                    </div>
                    <div className={`max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-semibold text-gray-900">{isMe ? 'You' : sender?.name}</span>
                        <span className="text-xs text-gray-400">{msg.ts}</span>
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-pluto-600 text-white rounded-tr-sm'
                          : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-pluto-300 focus-within:ring-2 focus-within:ring-pluto-100 transition-all">
              <input
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={`Message #${channel?.name}…`}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <button onClick={sendMessage}
                disabled={!messageText.trim()}
                className="p-1.5 bg-pluto-600 text-white rounded-lg hover:bg-pluto-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
