import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Square,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { VoiceService } from '../../services/voiceService';
import { useLanguage } from '../../context/LanguageContext';

export interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  simpleExplanation?: string;
  suggestedActions?: string[];
  actionRoute?: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerifiedAt?: string;
  isStreaming?: boolean;
  isError?: boolean;
}

export const TribalScholarAIAssistant: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Namaste! I'm **Tribal Scholar AI Assistant** (Ministry of Tribal Affairs).\n\nI can help you with:\n• finding verified scholarships\n• understanding eligibility\n• fixing document deficiencies\n• tracking your application\n• understanding your Digital Twin\n• scholarship renewal`,
      suggestedActions: ['Find Scholarships', 'Check Eligibility', 'Fix Document Issue', 'Track Application'],
      sourceName: 'Ministry of Tribal Affairs',
      sourceUrl: 'https://tribal.nic.in',
      lastVerifiedAt: '27 September 2026',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Health check on drawer mount/open
  useEffect(() => {
    if (isOpen) {
      api
        .get('/health')
        .then((res) => {
          setIsOnline(res.data?.status === 'ONLINE');
        })
        .catch(() => {
          setIsOnline(false);
        });
    }
  }, [isOpen]);

  // Scroll to bottom of message log on change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isGenerating]);

  // Auto-resize composer textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const getPageContext = () => {
    const path = location.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];

    const context: any = { routePath: path };

    if (path.includes('/opportunities/') || path.includes('/scholarships/')) {
      context.scholarshipId = lastPart;
    } else if (path.includes('/digital-twin/') || path.includes('/applications/')) {
      context.applicationId = lastPart;
    } else if (path.includes('/renewals/')) {
      context.renewalId = lastPart;
    }

    return context;
  };

  const handleSendMessage = async (queryText?: string, retryMessageText?: string) => {
    const textToSend = (queryText || retryMessageText || inputText).trim();
    if (!textToSend || isGenerating) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    // Append user message if not a retry
    if (!retryMessageText && !queryText) {
      const userMsg: MessageItem = { id: userMsgId, sender: 'user', text: textToSend };
      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
    } else if (queryText) {
      const userMsg: MessageItem = { id: userMsgId, sender: 'user', text: textToSend };
      setMessages((prev) => [...prev, userMsg]);
    }

    // Add initial placeholder for assistant
    const placeholderMsg: MessageItem = {
      id: assistantMsgId,
      sender: 'assistant',
      text: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev.filter((m) => !m.isError), placeholderMsg]);
    setIsGenerating(true);

    abortControllerRef.current = new AbortController();

    const historyPayload = messages
      .filter((m) => m.id !== 'welcome-msg' && !m.isError)
      .slice(-10)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    const pageContext = getPageContext();
    const token = localStorage.getItem('tribal_scholar_token');

    try {
      const apiBase = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');
      const response = await fetch(`${apiBase}/ai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          query: textToSend,
          language,
          pageContext,
          history: historyPayload,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';
      let responseMeta: any = {};

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', '').trim());
              if (data.type === 'start' && data.responseMeta) {
                responseMeta = data.responseMeta;
              } else if (data.type === 'chunk' && data.text) {
                streamedText += data.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          text: streamedText,
                          suggestedActions: responseMeta.suggestedActions,
                          sourceName: responseMeta.sourceName,
                          sourceUrl: responseMeta.sourceUrl,
                          lastVerifiedAt: responseMeta.lastVerifiedAt,
                        }
                      : m
                  )
                );
              } else if (data.type === 'done' && data.fullResponse) {
                const res = data.fullResponse;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          text: res.answer || streamedText,
                          simpleExplanation: res.simpleExplanation,
                          suggestedActions: res.suggestedActions,
                          actionRoute: res.actionRoute,
                          sourceName: res.sourceName,
                          sourceUrl: res.sourceUrl,
                          lastVerifiedAt: res.lastVerifiedAt,
                          isStreaming: false,
                        }
                      : m
                  )
                );
              }
            } catch (e) {
              // Ignore partial SSE chunk parses
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, isStreaming: false } : m))
        );
      } else {
        // Fallback to standard POST request if SSE stream fails
        try {
          const fallbackRes = await api.post('/ai/assistant', {
            query: textToSend,
            language,
            pageContext,
            history: historyPayload,
          });

          if (fallbackRes.data.success) {
            const resp = fallbackRes.data.response;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      text: resp.answer || 'Information retrieved from official database.',
                      simpleExplanation: resp.simpleExplanation,
                      suggestedActions: resp.suggestedActions,
                      actionRoute: resp.actionRoute,
                      sourceName: resp.sourceName || 'Ministry of Tribal Affairs & NSP',
                      sourceUrl: resp.sourceUrl || 'https://scholarships.gov.in',
                      lastVerifiedAt: resp.lastVerifiedAt || '27 September 2026',
                      isStreaming: false,
                    }
                  : m
              )
            );
          } else {
            throw new Error('API returned success false');
          }
        } catch (fallbackErr) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    text: 'Something went wrong while generating the response.',
                    isError: true,
                    isStreaming: false,
                  }
                : m
            )
          );
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    if (isGenerating) handleStopGeneration();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Namaste! I'm **Tribal Scholar AI Assistant** (Ministry of Tribal Affairs).\n\nI can help you with:\n• finding verified scholarships\n• understanding eligibility\n• fixing document deficiencies\n• tracking your application\n• understanding your Digital Twin\n• scholarship renewal`,
        suggestedActions: ['Find Scholarships', 'Check Eligibility', 'Fix Document Issue', 'Track Application'],
        sourceName: 'Ministry of Tribal Affairs',
        sourceUrl: 'https://tribal.nic.in',
        lastVerifiedAt: '27 September 2026',
      },
    ]);
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(undefined, lastUserMsg.text);
    }
  };

  const toggleVoiceInput = () => {
    if (!VoiceService.isSpeechRecognitionSupported()) {
      setVoiceNotice('Voice input isn\'t supported in this browser.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening) {
      VoiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const langCode = language === 'hi' ? 'hi-IN' : 'en-IN';
      VoiceService.startListening(langCode, {
        onResult: (transcript) => {
          setIsListening(false);
          setInputText(transcript);
        },
        onError: (err) => {
          setIsListening(false);
          setVoiceNotice(err || 'Microphone error.');
          setTimeout(() => setVoiceNotice(null), 4000);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    }
  };

  const toggleTTS = (text: string) => {
    if (isSpeaking) {
      VoiceService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const langCode = language === 'hi' ? 'hi-IN' : 'en-IN';
      VoiceService.speak(text, langCode, () => setIsSpeaking(false));
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(id);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Rich Markdown Formatter & Table Parser
  const renderMarkdown = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let tableBuffer: string[] = [];

    const flushTable = (keyIndex: number) => {
      if (tableBuffer.length < 2) {
        tableBuffer = [];
        return;
      }
      const headers = tableBuffer[0]
        .split('|')
        .map((h) => h.trim())
        .filter(Boolean);
      const rows = tableBuffer
        .slice(2)
        .map((row) =>
          row
            .split('|')
            .map((c) => c.trim())
            .filter(Boolean)
        )
        .filter((r) => r.length > 0);

      elements.push(
        <div key={`table-${keyIndex}`} className="my-2.5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-[11px] border-collapse bg-white">
            <thead>
              <tr className="bg-[#5B1720] text-white border-b border-maroon-700">
                {headers.map((h, idx) => (
                  <th key={idx} className="p-2 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-ivory/50'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2 border-t border-border font-medium text-charcoal">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableBuffer = [];
    };

    lines.forEach((line, idx) => {
      if (line.trim().startsWith('|')) {
        tableBuffer.push(line.trim());
        return;
      } else if (tableBuffer.length > 0) {
        flushTable(idx);
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="font-extrabold text-xs text-[#5B1720] mt-2.5 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
            {line.replace('### ', '')}
          </h4>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <div key={idx} className="my-2 p-2.5 bg-amber-50 border-l-4 border-amber-500 rounded-r text-[11px] text-amber-900 font-medium shadow-2xs">
            {line.replace('> ', '').replace('[!NOTE]', '').replace('[!IMPORTANT]', '')}
          </div>
        );
      } else if (line.startsWith('• ') || line.startsWith('- ')) {
        elements.push(
          <div key={idx} className="flex items-start gap-1.5 my-0.5 text-xs leading-relaxed">
            <span className="text-gold font-extrabold select-none">•</span>
            <span>{renderInline(line.substring(2))}</span>
          </div>
        );
      } else if (line.trim().length === 0) {
        elements.push(<div key={idx} className="h-1.5" />);
      } else {
        elements.push(
          <p key={idx} className="my-0.5 leading-relaxed text-xs">
            {renderInline(line)}
          </p>
        );
      }
    });

    if (tableBuffer.length > 0) {
      flushTable(lines.length);
    }

    return elements;
  };

  const renderInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-brand-dark">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-ivory text-brand-maroon px-1.5 py-0.5 rounded border border-border font-mono text-[10px] font-bold">{part.slice(1, -1)}</code>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-maroon font-bold underline hover:text-brand-dark inline-flex items-center gap-0.5"
          >
            {linkMatch[1]} <ExternalLink className="w-2.5 h-2.5 inline text-gold" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (Hides when Chat is Open to prevent overlap) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          className="fixed bottom-6 right-6 z-40 bg-[#5B1720] hover:bg-[#471118] text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-2xl border-2 border-gold flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
          </div>
          <span className="hidden sm:inline font-bold tracking-wide">Ask AI Assistant</span>
        </button>
      )}

      {/* 2. CHAT WINDOW PANEL */}
      {isOpen && (
        <div
          className="fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden border border-border animate-in fade-in slide-in-from-bottom-5 duration-200
            /* Mobile: full viewport fixed */
            w-full h-[100dvh] inset-0 rounded-none sm:rounded-2xl
            /* Desktop / Tablet: bounded max-height, 460px width */
            sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[460px] sm:max-w-[calc(100vw-32px)] sm:h-[720px] sm:max-h-[calc(100vh-32px)]"
          aria-label="Tribal Scholar AI Assistant Chat Panel"
        >
          {/* HEADER */}
          <div className="bg-[#5B1720] text-white p-3.5 flex items-center justify-between border-b border-maroon-700 shrink-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#471118] border border-gold/40 flex items-center justify-center text-gold shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs tracking-wide text-white flex items-center gap-1.5">
                  Tribal Scholar AI Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-ivory-200">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  <span>{isOnline ? 'Online' : 'Temporarily unavailable'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                title="New Chat"
                className="flex items-center gap-1 bg-[#471118] hover:bg-maroon-800 text-ivory-100 text-[10px] font-bold px-2 py-1 rounded-lg border border-gold/30 transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-gold" />
                <span className="hidden sm:inline">New Chat</span>
              </button>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-[#471118] text-white text-[10px] font-bold px-2 py-1 rounded border border-gold/30 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Assistant"
                className="p-1 text-ivory-200 hover:text-white rounded-lg hover:bg-[#471118] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MESSAGE AREA */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream text-xs scroll-smooth"
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                {m.sender === 'user' ? (
                  <div className="bg-[#5B1720] text-white p-3 rounded-2xl rounded-br-xs font-medium max-w-[85%] shadow-2xs leading-relaxed">
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                ) : (
                  <div className="flex gap-2.5 items-start max-w-[95%]">
                    <div className="w-7 h-7 rounded-lg bg-[#5B1720] border border-gold/40 flex items-center justify-center shrink-0 text-gold text-xs font-bold shadow-2xs mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>

                    <div className="bg-white border border-border text-charcoal p-3.5 rounded-2xl rounded-bl-xs w-full shadow-2xs space-y-2">
                      {m.isError ? (
                        <div className="space-y-2.5 text-terracotta">
                          <div className="flex items-center gap-2 font-bold text-xs">
                            <AlertCircle className="w-4 h-4 text-terracotta shrink-0" />
                            <span>{m.text}</span>
                          </div>
                          <button
                            onClick={() => handleSendMessage(undefined, messages.filter((x) => x.sender === 'user').slice(-1)[0]?.text)}
                            className="bg-terracotta hover:bg-red-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <RefreshCw className="w-3 h-3" /> Retry
                          </button>
                        </div>
                      ) : (
                        <>
                          {renderMarkdown(m.text)}

                          {m.isStreaming && (
                            <div className="flex items-center gap-1.5 text-brand-maroon font-bold text-[11px] pt-1">
                              <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
                              <span>AI generating response...</span>
                            </div>
                          )}

                          {/* Source Citation Card */}
                          {m.sourceName && !m.isStreaming && (
                            <div className="pt-2 border-t border-border space-y-1.5">
                              <div className="bg-ivory p-2 rounded text-[10px] text-muted-text font-medium flex flex-wrap items-center justify-between gap-1 border border-border">
                                <span>Source: <strong className="text-brand-dark font-bold">{m.sourceName}</strong></span>
                                {m.lastVerifiedAt && <span>Verified: {m.lastVerifiedAt}</span>}
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleTTS(m.simpleExplanation || m.text)}
                                    className="text-[10px] font-bold text-brand-maroon hover:underline flex items-center gap-1"
                                  >
                                    {isSpeaking ? <VolumeX className="w-3 h-3 text-terracotta" /> : <Volume2 className="w-3 h-3 text-brand-maroon" />}
                                    {isSpeaking ? 'Stop Audio' : '🔊 Listen'}
                                  </button>

                                  <button
                                    onClick={() => copyToClipboard(m.text, m.id)}
                                    className="text-[10px] font-bold text-gray-600 hover:text-brand-maroon flex items-center gap-1"
                                  >
                                    {copiedIdx === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    {copiedIdx === m.id ? 'Copied' : 'Copy'}
                                  </button>
                                </div>

                                {m.sourceUrl && (
                                  <a
                                    href={m.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-extrabold text-brand-maroon hover:underline flex items-center gap-1"
                                  >
                                    Official Portal <ExternalLink className="w-3 h-3 text-gold" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {m.sender === 'assistant' && m.suggestedActions && !m.isStreaming && (
                  <div className="flex flex-wrap gap-1.5 max-w-[90%] pl-9 pt-1">
                    {m.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(act)}
                        disabled={isGenerating}
                        className="bg-white hover:bg-maroon-50 text-brand-maroon text-[11px] font-bold px-2.5 py-1 rounded-full border border-brand-maroon/30 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 disabled:opacity-50"
                      >
                        {act} <ArrowRight className="w-3 h-3 text-gold" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* VOICE ERROR / NOTICE BANNER */}
          {voiceNotice && (
            <div className="bg-amber-100 text-amber-900 border-t border-amber-300 px-3 py-1.5 text-[11px] font-bold flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{voiceNotice}</span>
            </div>
          )}

          {/* COMPOSER */}
          <div className="p-3 bg-white border-t border-border shrink-0 z-10 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                  isListening
                    ? 'bg-terracotta text-white animate-bounce border-terracotta'
                    : 'bg-ivory text-brand-maroon hover:bg-cream border-border'
                }`}
                title={isListening ? 'Stop Listening' : 'Voice Input (Web Speech API)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isListening ? 'Listening to voice...' : 'Ask about scholarships, eligibility, status...'}
                className="flex-1 bg-ivory text-xs p-2.5 rounded-xl border border-border focus:outline-none focus:border-brand-maroon text-charcoal font-medium resize-none max-h-28"
              />

              {isGenerating ? (
                <button
                  type="button"
                  onClick={handleStopGeneration}
                  className="bg-terracotta hover:bg-red-700 text-white font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-brand-maroon text-white p-2.5 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-40 shrink-0"
                >
                  <Send className="w-4 h-4 text-gold" />
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
