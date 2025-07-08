// src/components/ChatHistory.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { MdDelete, MdAddComment, MdMoreVert, MdEdit, MdCheck, MdClose } from 'react-icons/md'; // Import MdEdit, MdCheck, MdClose
import { useNavigate } from 'react-router-dom';

const ChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const {
    conversations,
    currentConversationId,
    startNewConversation,
    loadConversation,
    deleteConversation,
    updateConversationTitle, // Use the new action
  } = useChatStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If we start a new conversation and there's no current one selected,
    // or if the current one is deleted, ensure a 'new chat' is focused
    if (!currentConversationId && conversations.length > 0) {
      loadConversation(conversations[0].id);
    } else if (!currentConversationId && conversations.length === 0) {
      // Potentially, if all are deleted, start a new one automatically
      // startNewConversation(); // Uncomment if you want an auto-new chat
    }
  }, [currentConversationId, conversations, loadConversation]);

  const handleNewChat = () => {
    startNewConversation();
    navigate('/ask-ai'); // Navigate to chat interface if not already there
  };

  const handleOpenChat = (id: string) => {
    loadConversation(id);
    navigate('/ask-ai'); // Navigate to chat interface
  };

  const handleDeleteChat = (id: string) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
      // After deleting, if the current chat was deleted, navigate to a new chat or home
      if (currentConversationId === id) {
        navigate('/ask-ai'); // This will effectively show a blank slate or the first available chat
      }
    }
  };

  const handleEditClick = (convId: string, currentTitle: string) => {
    setEditingId(convId);
    setEditingTitle(currentTitle);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select(); // Select text for easy overwriting
    }, 0); // Focus after render
  };

  const handleSaveTitle = (convId: string) => {
    if (editingTitle.trim() !== '') {
      updateConversationTitle(convId, editingTitle.trim());
    } else {
      updateConversationTitle(convId, 'Untitled Chat'); // Default if empty
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, convId: string) => {
    if (e.key === 'Enter') {
      handleSaveTitle(convId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div style={{
      width: '280px',
      backgroundColor: '#282a36',
      color: '#f8f8f2',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #44475a',
      boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
      overflowY: 'auto'
    }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: '600' }}>Conversations</h2>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 15px',
          backgroundColor: '#6272a4',
          color: '#f8f8f2',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          marginBottom: '20px',
          gap: '8px',
          transition: 'background-color 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a8ab8')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6272a4')}
      >
        <MdAddComment size={20} /> New Chat
      </button>

      {/* Conversation List */}
      <div style={{ flexGrow: 1 }}>
        {conversations.length === 0 ? (
          <p style={{ color: '#bd93f9', textAlign: 'center', marginTop: '20px' }}>
            Start a new conversation!
          </p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 15px',
                marginBottom: '10px',
                borderRadius: '8px',
                backgroundColor: conv.id === currentConversationId ? '#44475a' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                position: 'relative',
                boxShadow: conv.id === currentConversationId ? 'inset 0 0 5px rgba(0,0,0,0.3)' : 'none',
                border: conv.id === currentConversationId ? '1px solid #bd93f9' : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (conv.id !== currentConversationId) {
                  e.currentTarget.style.backgroundColor = '#383a59';
                }
              }}
              onMouseLeave={(e) => {
                if (conv.id !== currentConversationId) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {editingId === conv.id ? (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => handleInputKeyDown(e, conv.id)}
                    style={{
                      flexGrow: 1,
                      backgroundColor: '#6272a4',
                      color: '#f8f8f2',
                      border: '1px solid #bd93f9',
                      borderRadius: '5px',
                      padding: '5px 8px',
                      marginRight: '10px',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    onClick={() => handleSaveTitle(conv.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#50fa7b', marginRight: '5px' }}
                    title="Save Title"
                  >
                    <MdCheck size={20} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff5555' }}
                    title="Cancel Edit"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => handleOpenChat(conv.id)}
                    style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1rem' }}
                    title={conv.title}
                  >
                    {conv.title}
                  </span>
                  <div className="dropdown" style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
                    <button
                      className="dropdown-toggle"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f8f8f2', padding: '5px' }}
                      title="More options"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening chat when clicking dots
                        // Simple toggle for now, ideally managed by state for multiple dropdowns
                        const dropdownContent = e.currentTarget.nextElementSibling as HTMLElement;
                        if (dropdownContent) {
                          dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
                        }
                      }}
                    >
                      <MdMoreVert size={20} />
                    </button>
                    <div
                      className="dropdown-content"
                      style={{
                        display: 'none',
                        position: 'absolute',
                        backgroundColor: '#44475a',
                        minWidth: '120px',
                        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                        zIndex: 1,
                        right: '0',
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}
                      onMouseLeave={(e) => { // Hide dropdown when mouse leaves
                          (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    >
                      <button
                        onClick={() => {
                          handleOpenChat(conv.id);
                          (document.querySelector('.dropdown-content') as HTMLElement).style.display = 'none'; // Hide
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                          border: 'none',
                          background: 'none',
                          color: '#f8f8f2',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6272a4')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <MdMoreVert style={{ marginRight: '5px' }} /> Open
                      </button>
                      <button
                        onClick={() => {
                          handleEditClick(conv.id, conv.title);
                          (document.querySelector('.dropdown-content') as HTMLElement).style.display = 'none'; // Hide
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                          border: 'none',
                          background: 'none',
                          color: '#f8f8f2',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6272a4')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <MdEdit style={{ marginRight: '5px' }} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteChat(conv.id);
                          (document.querySelector('.dropdown-content') as HTMLElement).style.display = 'none'; // Hide
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                          border: 'none',
                          background: 'none',
                          color: '#f8f8f2',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6272a4')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <MdDelete style={{ marginRight: '5px' }} /> Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;