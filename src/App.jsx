import React, { useState, useEffect, useRef } from 'react';
import { Bot, Key, Send, User, X } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '¡Hola! Soy tu **Asistente Académico** alimentado por Gemini. ¿En qué tema, resumen o dudas de estudio te ayudo hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    if (savedKey) {
      setApiKey(savedKey);
      setTempApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveKey = () => {
    const trimmed = tempApiKey.trim();
    if (trimmed) {
      setApiKey(trimmed);
      localStorage.setItem('gemini_api_key', trimmed);
      setIsModalOpen(false);
    }
  };

  const candidateModels = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];

  const fetchGeminiResponse = async (currentHistory) => {
    const formattedContents = currentHistory
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    const payload = {
      system_instruction: {
        parts: [{ text: "Eres EduBot, un asistente académico experto, claro, estructurado y paciente. Ayudas a estudiantes con resúmenes, síntesis de conceptos y dudas de estudio." }]
      },
      contents: formattedContents
    };

    let lastError = '';
    for (const model of candidateModels) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return { success: true, text: data.candidates[0].content.parts[0].text };
        }
        lastError = data.error?.message || `Status ${res.status}`;
      } catch (err) {
        lastError = 'Error de conexión de red.';
      }
    }
    return { success: false, error: lastError };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const result = await fetchGeminiResponse(newMessages);
    setIsLoading(false);

    if (result.success) {
      setMessages([...newMessages, { role: 'assistant', text: result.text }]);
    } else {
      setMessages([...newMessages, { role: 'assistant', text: `⚠️ Ocurrió una demora o error con la API.\nDetalle: ${result.error}` }]);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">EduBot AI</h1>
              <p class="text-xs text-slate-400">Asistente Académico (React + Vite)</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition text-xs flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>Gemini API Key</span>
          </button>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-white">Configurar Gemini API Key</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Ingresa tu API Key de Google AI Studio. Se almacena localmente.</p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
            />
            <button
              onClick={saveKey}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium text-sm transition"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div key={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full ${isUser ? 'bg-slate-700' : 'bg-indigo-600'} flex items-center justify-center shrink-0`}>
                  {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`${isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'} rounded-2xl p-4 max-w-[85%] text-sm whitespace-pre-wrap`}>
                  {m.text}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 text-sm border border-slate-700/50 text-slate-400 italic">
                Gemini está pensando...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-2 focus-within:border-indigo-500 transition">
            <textarea
              rows="1"
              placeholder="Escribe tu consulta académica..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent px-3 py-1 text-sm focus:outline-none resize-none max-h-32 text-white"
              required
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}