import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function ChatModal({ task, currentUser, otherUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load messages for this task
    const storedMessages = JSON.parse(localStorage.getItem('flextasks_messages') || '[]');
    const taskMessages = storedMessages.filter(m => m.taskId === task.id);
    setMessages(taskMessages);
  }, [task.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: crypto.randomUUID(),
      taskId: task.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: otherUser.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save message to localStorage
    const storedMessages = JSON.parse(localStorage.getItem('flextasks_messages') || '[]');
    storedMessages.push(message);
    localStorage.setItem('flextasks_messages', JSON.stringify(storedMessages));

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Chat with {otherUser.name}</h2>
            <p style={styles.subtitle}>{task.title}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div style={styles.messagesList}>
              {messages.map((msg, index) => {
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);
                const isCurrentUser = msg.senderId === currentUser.id;

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div style={styles.dateLabel}>
                        {formatDate(msg.createdAt)}
                      </div>
                    )}
                    <div
                      style={{
                        ...styles.messageWrapper,
                        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          ...styles.messageBubble,
                          ...(isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble),
                        }}
                      >
                        <p style={styles.messageContent}>{msg.content}</p>
                        <span style={styles.messageTime}>{formatTime(msg.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSend} style={styles.inputForm}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
            placeholder="Type your message..."
          />
          <button type="submit" style={styles.sendBtn}>
            Send
          </button>
        </form>

        <div style={styles.paymentNote}>
          <p style={styles.noteText}>
            💡 <strong>Tip:</strong> Discuss payment details, work specifics, and any questions here.
          </p>
        </div>
      </div>
    </div>
  );
}

ChatModal.propTypes = {
  task: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  otherUser: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px',
    borderBottom: '1px solid #eee',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
    background: '#f9f9f9',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  emptyText: {
    color: '#888',
    fontSize: '14px',
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  dateLabel: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#888',
    padding: '8px 0',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '4px',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  currentUserBubble: {
    background: '#d7747e',
    color: 'white',
  },
  otherUserBubble: {
    background: 'white',
    color: '#333',
    border: '1px solid #ddd',
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  inputForm: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #eee',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  sendBtn: {
    background: '#d7747e',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '24px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  },
  paymentNote: {
    padding: '12px 24px',
    background: '#fff3e0',
    borderTop: '1px solid #ffe0b2',
  },
  noteText: {
    fontSize: '12px',
    color: '#e65100',
    margin: 0,
  },
};
