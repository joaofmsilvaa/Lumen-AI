import { useState } from 'react';
import { Send, MessageCircle, Lightbulb } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  onQuerySuccess: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
}

export default function ChatInterface({ onQuerySuccess }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/query', {
        question: input
      });

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.answer,
        suggestions: response.data.suggestions || []
      };

      setMessages(prev => [...prev, aiMessage]);
      onQuerySuccess();
    } catch (error) {
      console.error('Query failed:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your question. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <MessageCircle className="w-6 h-6 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Ask Questions</h3>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto border border-gray-200 rounded-md p-4 mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Start asking questions about your documents!</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.type === 'ai' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-gray-600">Suggested questions:</p>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block text-xs text-indigo-600 hover:text-indigo-800 underline"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="text-zinc-900 flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
        <Lightbulb className="w-3 h-3" />
        <span>Tip: Ask specific questions to get better answers. Earn points for each question!</span>
      </div>
    </div>
  );
}