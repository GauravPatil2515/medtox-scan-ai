import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  CpuChipIcon,
  ClipboardDocumentIcon,
  TrashIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Welcome to MedToXAi Assistant!\n\nI am your specialized AI companion for chemistry, toxicology, and pharmaceutical sciences. I can provide expert insights on:\n\nCore Expertise:\n• Chemical Analysis: SMILES notation, molecular descriptors, structure-activity relationships\n• Toxicology: Safety assessments, endpoint interpretations (NR-AR, NR-AhR, SR-MMP, etc.)\n• Drug Discovery: ADME properties, pharmacokinetics, mechanism of action\n• Risk Assessment: Hepatotoxicity, cardiotoxicity, reproductive toxicity\n• Computational Chemistry: QSAR modeling, molecular dynamics, prediction algorithms\n\nTry asking about:\n• Explain the toxicity mechanisms of benzene\n• What are the key ADME properties for drug development?\n• How do I interpret SMILES notation?\n• Compare toxicity profiles of common painkillers\n\nI am designed to provide scientifically accurate, detailed explanations while making complex concepts accessible.\n\nWhat would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedQuestions = [
    "Explain benzene toxicity mechanisms",
    "Key toxicology testing endpoints",
    "ADME properties in drug safety",
    "What causes hepatotoxicity?",
    "SMILES notation basics",
    "Compare aspirin vs ibuprofen toxicity",
    "How to interpret NR-AR endpoint?",
    "Drug-drug interaction prediction"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: 'chemistry_toxicology'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: cleanResponse(data.response || 'I apologize, but I encountered an issue processing your request. Please try again.'),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Failed to get response from chat API');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I\'m currently having trouble connecting to the chat service. Please check that the backend server is running and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftModifier) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Chat Cleared!\n\nI am ready to help you with chemistry, toxicology, and pharmaceutical sciences.\n\nPopular topics:\n• Chemical structure analysis\n• Toxicity endpoint interpretation\n• Drug safety assessment\n• SMILES notation guidance\n• Molecular property prediction\n\nWhat would you like to explore?',
        timestamp: new Date()
      }
    ]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const cleanResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/#+\s/g, '')           // Remove header symbols
      .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
      .replace(/`([^`]+)`/g, '$1')    // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .trim();
  };

  const handlePredefinedQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col p-4">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <CpuChipIcon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MedToXAi Assistant</h1>
                <p className="text-blue-100 text-sm">Specialized Chemistry & Toxicology AI</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
              title="Clear Chat"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0 max-h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <CpuChipIcon className="h-4 w-4" />
                  )}
                </div>
                <div className={`p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="text-sm whitespace-pre-wrap flex-1 leading-relaxed">
                      {message.content}
                    </div>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors duration-200 flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <CpuChipIcon className="h-4 w-4" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Predefined Questions */}
        <div className="px-4 py-3 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 mb-2">
            <LightBulbIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Quick Questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {predefinedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedQuestion(question)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-sm text-gray-700 rounded-full transition-all duration-200 border hover:border-blue-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about chemistry, toxicology, drug discovery, SMILES notation, molecular analysis, safety assessments..."
                className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows="2"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl hover:from-blue-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 min-w-[80px]"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;