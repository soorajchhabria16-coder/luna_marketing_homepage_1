"use client";

import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { GlassCard, CosmicButton, GradientText } from './ui/CosmicUI';

const slideIn = keyframes`
  from { transform: translateY(100%) scale(0.9); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const ChatWrapper = styled.div`
  position: fixed !important;
  bottom: 30px !important;
  right: 30px !important;
  z-index: 9999 !important;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
`;

const ChatWindow = styled(GlassCard)`
  width: 400px;
  height: 600px;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: ${slideIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  
  @media (max-width: 500px) {
    width: calc(100vw - 40px);
    right: 20px;
    height: 70vh;
  }
`;

const ChatHeader = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div<{ isAi?: boolean }>`
  max-width: 80%;
  padding: 12px 18px;
  border-radius: 20px;
  font-size: 0.9rem;
  align-self: ${props => props.isAi ? 'flex-start' : 'flex-end'};
  background: ${props => props.isAi ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)'};
  color: ${props => props.isAi ? 'var(--text-dim)' : '#fff'};
  border: ${props => props.isAi ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
`;

const InputArea = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const ChatInput = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 20px;
  color: #fff;
  outline: none;
  
  &:focus {
    border-color: var(--gold-accent);
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const ActionPill = styled.button`
  background: rgba(248, 207, 156, 0.1);
  border: 1px solid rgba(248, 207, 156, 0.2);
  color: var(--gold-accent);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(248, 207, 156, 0.2);
    transform: translateY(-1px);
  }
`;

const FAB = styled.button`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8cf9c 0%, #d8a05c 100%);
  border: none;
  color: #1a1a2e;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(248, 207, 156, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: scale(1.1) rotate(15deg);
    box-shadow: 0 15px 40px rgba(248, 207, 156, 0.6);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
`;

const VoiceButton = styled.button`
  background: none;
  border: none;
  color: var(--gold-accent);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ContextInfo = styled.div`
  font-size: 0.7rem;
  color: var(--text-dim);
`;

const SendButton = styled(CosmicButton)`
  padding: 0 15px;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ChatHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AstroChat = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Greetings, celestial traveler. I am Luna, your AI Astro-Guide. How can I help you navigate the stars today?", isAi: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    console.log("AstroChat mounted");
  }, []);

  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openAstroChat', handleOpenChat);
    return () => window.removeEventListener('openAstroChat', handleOpenChat);
  }, []);

  if (!mounted) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { text: input, isAi: false };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.text, isAi: true }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        text: "The cosmic energy is a bit turbulent. Please try again in a moment.", 
        isAi: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatWrapper>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <ChatHeaderContainer>
              <GradientText style={{ fontSize: '1.1rem' }}>LUNA AI GUIDE</GradientText>
              <ContextInfo>Mercury in Pisces ♓</ContextInfo>
            </ChatHeaderContainer>
            <CloseButton 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              title="Close"
            >
              <i className="fa-solid fa-times"></i>
            </CloseButton>
          </ChatHeader>
          <ChatBody ref={bodyRef}>
            {messages.map((m, i) => (
              <MessageBubble key={i} isAi={m.isAi}>
                {m.text}
              </MessageBubble>
            ))}
            {isLoading && (
              <MessageBubble isAi={true}>
                <i className="fa-solid fa-ellipsis fa-fade"></i> Luna is reading the stars...
              </MessageBubble>
            )}
          </ChatBody>
          <InputArea>
            <QuickActions>
              <ActionPill onClick={() => setInput("Why am I feeling restless?")}>Why am I restless?</ActionPill>
              <ActionPill onClick={() => setInput("Love outlook for today")}>Love outlook</ActionPill>
              <ActionPill onClick={() => setInput("Career transits")}>Career path</ActionPill>
            </QuickActions>
            <InputRow>
              <VoiceButton title="Voice Input (AI Voice Ready)">
                <i className="fa-solid fa-microphone"></i>
              </VoiceButton>
              <ChatInput 
                placeholder="Ask the stars..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <SendButton onClick={handleSend}>
                <i className="fa-solid fa-paper-plane"></i>
              </SendButton>
            </InputRow>
          </InputArea>
        </ChatWindow>
      )}
      <FAB onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <i className="fa-solid fa-times"></i> : <i className="fa-solid fa-comments"></i>}
      </FAB>
    </ChatWrapper>
  );
};

export default AstroChat;
