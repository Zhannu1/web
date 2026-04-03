import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';
import { Send, User, MessageSquare, Bot } from 'lucide-react';
import api from '../../utils/api';
import { SOCKET_URL } from '../../utils/runtimeConfig';
import './Chat.css';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const autoSelectId = location.state?.autoSelectId;

  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  
  // 1-ӨЗГЕРІС: Бүкіл чат терезесінің айналдыруын (скролл) бақылауға арналған ref
  const chatMessagesRef = useRef(null);

  const aiContact = { id: 'ai', email: 'AI Көмекші', role: 'BOT' };

  useEffect(() => {
    const newSocket = io(SOCKET_URL, { query: { userId: user?.id } });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleReceive = (message) => {
        // 2-ӨЗГЕРІС (ДУБЛИКАТТЫ ЖОЮ): Егер хатты өзіміз жіберген болсақ, оны қайта қоспаймыз
        if (message.senderId === user.id) return;

        if (activeContact && activeContact.id !== 'ai' && (message.senderId === activeContact.id || message.receiverId === activeContact.id)) {
          setMessages((prev) => [...prev, message]);
        }
      };

      socket.on('receiveMessage', handleReceive);
      return () => socket.off('receiveMessage', handleReceive);
    }
  }, [socket, activeContact, user.id]);

  // 3-ӨЗГЕРІС (СКРОЛЛДЫ ЖӨНДЕУ): Экран секірмеуі үшін тек чат терезесінің ішін ғана төмен түсіреміз
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, aiTyping]);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/extra/chat-contacts');
      const loadedContacts = [aiContact, ...res.data];
      setContacts(loadedContacts);

      if (autoSelectId) {
        const target = loadedContacts.find(c => c.id === autoSelectId);
        if (target) selectContact(target);
      } else {
        selectContact(aiContact);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (contactId) => {
    if (contactId === 'ai') {
      setMessages([{ senderId: 'ai', content: 'Сәлеметсіз бе! Мен AI көмекшімін. Сізге қандай көмек көрсете аламын?', createdAt: new Date().toISOString() }]);
      return;
    }
    try {
      const res = await api.get(`/extra/messages/${contactId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectContact = (contact) => {
    setActiveContact(contact);
    fetchMessages(contact.id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const messageData = {
      senderId: user.id,
      receiverId: activeContact.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');

    if (activeContact.id === 'ai') {
      setAiTyping(true);
      try {
        const res = await api.post('/extra/ai-chat', { message: messageData.content });
        const aiReply = { senderId: 'ai', receiverId: user.id, content: res.data.reply, createdAt: new Date().toISOString() };
        setMessages((prev) => [...prev, aiReply]);
      } catch (err) {
        console.error(err);
      } finally {
        setAiTyping(false);
      }
    } else {
      socket.emit('sendMessage', messageData);
      try {
        await api.post('/extra/messages', messageData);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="chat-container animate-fade-in">
      <div className="chat-sidebar">
        <h3 className="sidebar-title">Сұхбаттар</h3>
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`contact-item ${activeContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => selectContact(contact)}
            >
              <div className="contact-avatar">
                {contact.id === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="contact-info">
                <h4>{contact.email.split('@')[0]}</h4>
                <span className="contact-role">{contact.role === 'BOT' ? 'Жасанды Интеллект' : contact.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {activeContact ? (
          <>
            <div className="chat-header">
              <div className="contact-avatar">
                {activeContact.id === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <h4>{activeContact.email.split('@')[0]}</h4>
            </div>

            {/* 4-ӨЗГЕРІС: ref-ті осы терезеге (div) байладық */}
            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message-bubble ${msg.senderId === user.id ? 'sent' : 'received'} ${msg.senderId === 'ai' ? 'ai-bubble' : ''}`}
                >
                  <p>{msg.content}</p>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {aiTyping && (
                <div className="message-bubble received ai-bubble">
                  <p className="typing-indicator"><span>.</span><span>.</span><span>.</span></p>
                </div>
              )}
            </div>

            <form className="chat-input-form" onSubmit={sendMessage}>
              <input 
                type="text" 
                placeholder="Хабарлама жазыңыз..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" disabled={!newMessage.trim() || aiTyping}>
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <MessageSquare size={48} />
            <p>Сөйлесуді бастау үшін контактіні таңдаңыз</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
