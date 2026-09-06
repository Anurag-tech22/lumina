import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, doc, query, orderBy, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Message, Session } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, LogOut, Plus, MessageSquare, Loader2, Menu, X, Lightbulb, AlertCircle, Maximize2, Minimize2, Copy, Mic, MicOff, Volume2, Wind, MoreVertical, Trash2, Square, ImagePlus, StopCircle, BookOpen, BrainCircuit, Origami, ShieldCheck,  Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { cn } from '../lib/utils';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CommandPalette } from '../components/CommandPalette';

const detectLanguage = (text: string): string => {
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(text)) {
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja-JP';
    return 'zh-CN';
  }
  if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU';
  
  const words = text.toLowerCase().split(/\W+/);
  const spanish = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'y', 'en', 'es', 'por', 'para', 'con', 'que', 'como', 'su']);
  const french = new Set(['le', 'la', 'les', 'un', 'une', 'et', 'en', 'est', 'pour', 'avec', 'qui', 'que', 'comme', 'son', 'dans']);
  const german = new Set(['der', 'die', 'das', 'und', 'in', 'ist', 'für', 'mit', 'auf', 'von', 'zu', 'dass', 'wie', 'ein', 'eine']);
  
  let esCount = 0, frCount = 0, deCount = 0;
  for (const w of words) {
    if (spanish.has(w)) esCount++;
    if (french.has(w)) frCount++;
    if (german.has(w)) deCount++;
  }
  
  if (esCount > frCount && esCount > deCount && esCount > 0) return 'es-ES';
  if (frCount > esCount && frCount > deCount && frCount > 0) return 'fr-FR';
  if (deCount > esCount && deCount > frCount && deCount > 0) return 'de-DE';
  return 'en-US';
};

const cleanPayload = (obj: any) => JSON.parse(JSON.stringify(obj));


export default function Dashboard() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [breathingText, setBreathingText] = useState('Inhale');
  const [breathScale, setBreathScale] = useState(1);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [sessionInsight, setSessionInsight] = useState<any>(null);
  const [hideInsights, setHideInsights] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [preferredLang, setPreferredLang] = useState('auto');
  const [attachedImage, setAttachedImage] = useState<{ url: string; base64: string; mimeType: string } | null>(null);
  const [interactionMode, setInteractionMode] = useState<'chat' | 'research' | 'prism'>('chat');

  const showError = React.useCallback((message: string) => {
    setToastError(message);
    setTimeout(() => setToastError(null), 5000);
  }, []);

  // Compute activity data for the last 14 days
  const activityData = React.useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'MMM dd');
      const count = sessions.filter(s => {
        const sDate = new Date(s.createdAt);
        return sDate.getDate() === date.getDate() && sDate.getMonth() === date.getMonth();
      }).length;
      data.push({ name: dateStr, count });
    }
    return data;
  }, [sessions]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<any>(null);
  const oscRef = useRef<any>(null);
  const gainRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognition: any = null;
    
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      if (preferredLang !== 'auto') {
        recognition.lang = preferredLang;
      } else {
        recognition.lang = ''; // Let OS auto-detect
      }
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
          setTimeout(autoResize, 50);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          showError("Microphone access denied. Try opening the app in a new tab (click the icon in top right) or check browser permissions.");
        }
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [preferredLang]);

  const toggleListen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try using Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const playAudio = React.useCallback((text: string, messageId: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMessageId === messageId && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      setSpeakingMessageId(messageId);
      
      const cleanText = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Pin to window to prevent Chrome garbage collection bug cutting off audio
      (window as any)._currentUtterance = utterance;
      
      const voices = window.speechSynthesis.getVoices();
      
      if (preferredLang === 'auto') {
        const detected = detectLanguage(cleanText);
        utterance.lang = detected;
        const targetVoice = voices.find(v => v.lang.startsWith(detected.split('-')[0]) && v.name.includes('Google')) || voices.find(v => v.lang.startsWith(detected.split('-')[0]));
        if (targetVoice) utterance.voice = targetVoice;
      } else {
        utterance.lang = preferredLang;
        const targetVoice = voices.find(v => v.lang.startsWith(preferredLang.split('-')[0]) && v.name.includes('Google')) || voices.find(v => v.lang.startsWith(preferredLang.split('-')[0]));
        if (targetVoice) utterance.voice = targetVoice;
      }
      
      utterance.rate = 0.95;
      utterance.pitch = 0.95;
      
      utterance.onend = () => {
        setSpeakingMessageId(prev => (prev === messageId ? null : prev));
      };
      
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.error("SpeechSynthesis error:", e.error || e);
          showError(`Text-to-speech failed: ${e.error || 'Unknown error'}`);
        }
        setSpeakingMessageId(prev => (prev === messageId ? null : prev));
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      showError("Text-to-speech is not supported by your browser.");
    }
  }, [speakingMessageId, preferredLang]);

  const toggleZenMode = () => {
    const newZenState = !zenMode;
    setZenMode(newZenState);
    
    if (newZenState) {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      
      if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        
        osc1.frequency.value = 174; // Solfeggio frequency
        osc2.frequency.value = 178; // 4hz detune for theta waves
        
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        
        oscRef.current = { osc1, osc2 };
        gainRef.current = gain;
      }
    } else {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 2);
        setTimeout(() => {
          oscRef.current?.osc1?.stop();
          oscRef.current?.osc2?.stop();
        }, 2000);
      }
    }
  };

  // Breathing Loop
  useEffect(() => {
    let interval: any;
    if (zenMode) {
      let phase = 0;
      const loop = () => {
        if (phase === 0) {
          setBreathingText('Inhale');
          setBreathScale(1.5);
          interval = setTimeout(() => { phase = 1; loop(); }, 4000);
        } else if (phase === 1) {
          setBreathingText('Hold');
          interval = setTimeout(() => { phase = 2; loop(); }, 4000);
        } else {
          setBreathingText('Exhale');
          setBreathScale(1);
          interval = setTimeout(() => { phase = 0; loop(); }, 6000);
        }
      };
      loop();
    } else {
      setBreathingText('');
      setBreathScale(1);
    }
    return () => clearTimeout(interval);
  }, [zenMode]);

  const handleDeleteSession = React.useCallback(async (sessionId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/sessions`, sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
        setSessionInsight(null);
      }
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting session", error);
      showError("Failed to delete session.");
    }
  }, [user, activeSessionId, showError]);


  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const sessionsRef = collection(db, `users/${user.uid}/sessions`);
    const q = query(sessionsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedSessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Session[];
      setSessions(loadedSessions);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !activeSessionId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, `users/${user.uid}/sessions/${activeSessionId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(loadedMessages);
      scrollToBottom();
    });

    const sessionRef = doc(db, `users/${user.uid}/sessions/${activeSessionId}`);
    const unsubscribeSession = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.insights) setSessionInsight(data.insights);
        else setSessionInsight(null);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeSession();
    };
  }, [user, activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleNewSession = async () => {
    if (!user) return;
    
    const newSessionRef = doc(collection(db, `users/${user.uid}/sessions`));
    const now = Date.now();
    await setDoc(newSessionRef, {
      title: 'New Entry',
      createdAt: now,
      updatedAt: now,
    });
    
    setActiveSessionId(newSessionRef.id);
    setHideInsights(false);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !attachedImage) || !user || isGenerating) return;

    const currentInput = input.trim();
    const currentImage = attachedImage;
    setInput('');
    setAttachedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    let currentSessionId = activeSessionId;

    try {
      const idToken = await user.getIdToken();
      
      // Create session if it doesn't exist
      if (!currentSessionId) {
        const newSessionRef = doc(collection(db, `users/${user.uid}/sessions`));
        const now = Date.now();
        await setDoc(newSessionRef, cleanPayload({
          title: currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : ''),
          createdAt: now,
          updatedAt: now,
        }));
        currentSessionId = newSessionRef.id;
        setActiveSessionId(currentSessionId);
      } else if (messages.length === 0) {
        // Update title on first message
        const sessionRef = doc(db, `users/${user.uid}/sessions`, currentSessionId);
        await updateDoc(sessionRef, cleanPayload({
          title: currentInput.substring(0, 30) + (currentInput.length > 30 ? '...' : ''),
          updatedAt: Date.now()
        }));
      }

      // Save user message to firestore
      const messagesRef = collection(db, `users/${user.uid}/sessions/${currentSessionId}/messages`);
      const userMsgRef = doc(messagesRef);
      await setDoc(userMsgRef, cleanPayload({
        role: 'user',
        text: currentInput,
        images: currentImage ? [{
          base64: currentImage.base64,
          mimeType: currentImage.mimeType
        }] : undefined,
        createdAt: Date.now(),
      }));

      setIsGenerating(true);
      abortControllerRef.current = new AbortController();

      // Prepare history for API (last 10 messages for context window optimization)
      const recentMessages = [...messages.slice(-9), { role: 'user', text: currentInput, images: currentImage ? [{ base64: currentImage.base64, mimeType: currentImage.mimeType }] : undefined }];

      const assistantMsgRef = doc(messagesRef);

      if (interactionMode === 'prism') {
        const personas = [
          { id: 'visionary', name: '🧠 The Visionary', color: '#c084fc' },
          { id: 'analyst', name: '📊 The Analyst', color: '#60a5fa' },
          { id: 'critic', name: '⚖️ The Critic', color: '#f87171' }
        ];

        let combinedText = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">';
        let streams = ['', '', ''];
        let synthesisTriggered = false;
        
        await setDoc(assistantMsgRef, cleanPayload({
          role: 'model',
          text: combinedText + '</div>',
          createdAt: Date.now() + 1,
        }));

                const fetchPersona = async (personaId: string, index: number) => {
          const res = await fetch('/api/prism', {
            method: 'POST',
            signal: abortControllerRef.current?.signal,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify({ 
              prompt: currentInput, 
              persona: personaId,
              image: currentImage ? { base64: currentImage.base64, mimeType: currentImage.mimeType } : undefined
            })
          });
          
          if (!res.ok) {
            streams[index] = 'Error generating response for this persona.';
            return;
          }
          
          if (!res.body) return;
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let done = false;
          
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.substring(6);
                  if (dataStr === '[DONE]') continue;
                  try {
                    const data = JSON.parse(dataStr);
                    if (data.text) {
                      streams[index] += data.text;
                      
                      // Build HTML
                      let tempHtml = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">';
                      personas.forEach((p, i) => {
                        tempHtml += `<div class="bg-slate-800 rounded-xl p-4 border border-slate-700"><h4 style="color: ${p.color}; font-weight: bold; margin-bottom: 8px;">${p.name}</h4><div class="text-sm opacity-90">${streams[i] || '...'}</div></div>`;
                      });
                      tempHtml += '</div>';
                      
                      await updateDoc(assistantMsgRef, cleanPayload({ text: tempHtml }));
                    }
                  } catch (e) {}
                }
              }
            }
          }
        };

        await Promise.all([
          fetchPersona('visionary', 0),
          fetchPersona('analyst', 1),
          fetchPersona('critic', 2)
        ]);
        
        // After all finish, run Synthesis
        let finalHtml = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">';
        personas.forEach((p, i) => {
          finalHtml += `<div class="bg-slate-800 rounded-xl p-4 border border-slate-700"><h4 style="color: ${p.color}; font-weight: bold; margin-bottom: 8px;">${p.name}</h4><div class="text-sm opacity-90">${streams[i]}</div></div>`;
        });
        finalHtml += '</div>';
        finalHtml += '\n\n<hr class="border-slate-700 my-6" />\n\n### ⚡ Omni-Synthesis\n\n*Synthesizing perspectives...*';
        
        await updateDoc(assistantMsgRef, cleanPayload({ text: finalHtml }));

                const synthRes = await fetch('/api/prism', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
          body: JSON.stringify({ 
            prompt: `User asked: ${currentInput}

Visionary said: ${streams[0]}

Analyst said: ${streams[1]}

Critic said: ${streams[2]}`, 
            persona: 'synthesizer' 
          })
        });

        if (synthRes.ok && synthRes.body) {
          const sReader = synthRes.body.getReader();
          const sDecoder = new TextDecoder();
          let sDone = false;
          let sText = '';
          while (!sDone) {
            const { value, done: doneReading } = await sReader.read();
            sDone = doneReading;
            if (value) {
              const chunk = sDecoder.decode(value, { stream: true });
              const lines = chunk.split('\n\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.substring(6);
                  if (dataStr === '[DONE]') continue;
                  try {
                    const data = JSON.parse(dataStr);
                    if (data.text) {
                      sText += data.text;
                      let updateHtml = finalHtml.replace('*Synthesizing perspectives...*', sText);
                      await updateDoc(assistantMsgRef, cleanPayload({ text: updateHtml }));
                    }
                  } catch (e) {}
                }
              }
            }
          }
        }

      } else {
        let assistantText = '';
        await setDoc(assistantMsgRef, cleanPayload({
          role: 'model',
          text: '',
          createdAt: Date.now() + 1,
        }));

        const endpoint = interactionMode === 'research' ? '/api/research' : '/api/chat';
        const response = await fetch(endpoint, {
          method: 'POST',
          signal: abortControllerRef.current.signal,
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            messages: recentMessages,
            prompt: currentInput,
            language: preferredLang,
            deepSearch: interactionMode === 'research'
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || 'Network response was not ok');
        }
        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6);
                if (dataStr === '[DONE]') break;
                try {
                  const data = JSON.parse(dataStr);
                  if (data.error) {
                    throw new Error(data.error);
                  }
                  if (data.text) {
                    assistantText += data.text;
                    await updateDoc(assistantMsgRef, cleanPayload({ text: assistantText }));
                  }
                } catch (e: any) {
                  if (e.message !== 'Unexpected end of JSON input') {
                    throw e;
                  }
                }
              }
            }
          }
        }
      }
      
      const sessionRef = doc(db, `users/${user.uid}/sessions`, currentSessionId);
      await updateDoc(sessionRef, cleanPayload({
        updatedAt: Date.now()
      }));

    } catch (error: any) {
      if (error.name === 'AbortError') return; // Ignore intentional aborts
      console.error("Error calling Gemini API", error);
      showError(error.message || "I encountered an error processing that. Please try again.");
      
      if (currentSessionId) {
        const messagesRef = collection(db, `users/${user.uid}/sessions/${currentSessionId}/messages`);
        await addDoc(messagesRef, cleanPayload({
          role: 'model',
          text: `[System Error]: ${error.message?.includes("429") || error.message?.includes("Too many") || error.message?.includes("requests") ? "I am currently receiving too many requests. Please try again in a moment." : "Failed to generate response. Please try again later."}`,
          createdAt: Date.now() + 1,
        }));
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const generateInsights = async () => {
    if (!user || !activeSessionId || messages.length < 2) return;
    setIsGeneratingInsight(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ messages: messages.map(m => ({ role: m.role, text: m.text })) })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to generate insights');
      }

      const insightData = await response.json();
      
      // Save insights to Firestore inside the session document
      const sessionRef = doc(db, `users/${user.uid}/sessions`, activeSessionId);
      await updateDoc(sessionRef, cleanPayload({ insights: insightData }));

    } catch (error: any) {
      console.error("Insight generation error:", error);
      showError(error.message || "Could not generate insights.");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastError && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 flex items-center gap-3 bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md max-w-[90vw]"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <p className="text-sm font-medium">{toastError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-700 flex flex-col transition-all duration-300",
          !focusMode ? "md:translate-x-0 md:flex" : "md:hidden" 
        )}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 px-1">
            <div className="bg-blue-600 p-1.5 rounded-lg border border-blue-700">
              <motion.div animate={{ rotateY: 360, y: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Origami className="w-4 h-4 text-white" strokeWidth={2} /></motion.div>
            </div>
            <h1 className="font-medium text-[16px] text-slate-50 tracking-tight">Lumina</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" className="md:hidden text-slate-500 hover:text-slate-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-between gap-2 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-lg px-4 py-2 transition-colors text-[13px] font-medium"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Entry
            </div>
            <span className="text-[10px] font-mono text-blue-200 bg-blue-700 px-1.5 py-0.5 rounded opacity-80 border border-blue-500">⌘K</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-2">Timeline</h3>
          {sessions.length === 0 ? (
            <div className="text-[12px] text-slate-500 px-2 italic">No past sessions.</div>
          ) : (
            sessions.map(session => (
              <SidebarItem 
                key={session.id} 
                session={session} 
                isActive={activeSessionId === session.id} 
                onSelect={setActiveSessionId} 
                onDelete={handleDeleteSession}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-50 font-medium text-[13px]">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-[13px] truncate w-full block text-slate-50">{user?.displayName || user?.email || 'User'}</span>
            </div>
          </div>
          <button
            onClick={logOut}
            className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-50 hover:bg-slate-800 py-2 px-2.5 rounded-lg transition-colors text-[13px] font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className="text-slate-500 hover:text-slate-50">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-medium text-sm">GenAI Learning Journal</span>
          <div className="w-5" /> {/* Spacer */}
        </header>

        {/* Desktop Header Enhancement: Export & Session Info */}
        <header className="hidden md:flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900 sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-3">
            <h2 className="font-medium text-slate-50 tracking-wide">
              {activeSessionId 
                ? sessions.find(s => s.id === activeSessionId)?.title || 'Untitled Session'
                : 'GenAI Learning Journal'
              }
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleZenMode}
              className={cn(
                "flex items-center gap-2 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors border",
                zenMode 
                  ? "bg-slate-800 text-blue-600 border-blue-200" 
                  : "text-slate-500 hover:text-slate-50 hover:bg-slate-800 border-transparent"
              )}
              title="Toggle Zen Mode"
            >
              <Wind className={cn("w-4 h-4", zenMode && "animate-pulse")} strokeWidth={1.5} />
              <span className="hidden md:inline">Zen Mode</span>
            </button>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-50 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Toggle Focus Mode"
            >
              {focusMode ? <Minimize2 className="w-4 h-4" strokeWidth={1.5} /> : <Maximize2 className="w-4 h-4" strokeWidth={1.5} />}
            </button>
            {activeSessionId && messages.length >= 2 && (
              <button
                onClick={() => {
                  if (sessionInsight) {
                    setHideInsights(!hideInsights);
                  } else {
                    generateInsights();
                    setHideInsights(false);
                  }
                }}
                disabled={isGeneratingInsight}
                className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-indigo-200 bg-blue-600/10 hover:bg-blue-600/20 border border-transparent px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGeneratingInsight ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3" />}
                AI Insights
              </button>
            )}
            {activeSessionId && messages.length > 0 && (
              <button
                onClick={() => {
                  const sessionTitle = sessions.find(s => s.id === activeSessionId)?.title || 'Entry';
                  const mdContent = `# ${sessionTitle}\n\n` + messages.map(m => `**${m.role === 'user' ? 'You' : 'Lumina'}**:\n${m.text}`).join('\n\n---\n\n');
                  const blob = new Blob([mdContent], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${sessionTitle.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-50 bg-slate-800 hover:bg-slate-800 border border-slate-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export Markdown
              </button>
            )}
          </div>
        </header>

        {/* Chat Area */}
        <div className="relative flex-1 overflow-y-auto px-4 py-8 pb-40 md:px-8 flex flex-col items-center">
          
          {/* Zen Mode Breathing Overlay */}
          <AnimatePresence>
            {zenMode && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden"
              >
                <motion.div
                  animate={{ scale: breathScale }}
                  transition={{ duration: breathScale === 1.5 ? 4 : (breathScale === 1 ? 6 : 4), ease: "easeInOut" }}
                  className="w-96 h-96 rounded-full border border-[#a8c7fa]/10 flex items-center justify-center bg-[#a8c7fa]/[0.02]"
                >
                  <motion.div 
                    className="w-64 h-64 rounded-full border border-transparent flex items-center justify-center bg-[#a8c7fa]/[0.03]"
                  >
                     <span className="text-blue-600/30 tracking-[0.3em] uppercase text-sm font-medium">
                       {breathingText}
                     </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Main Chat Column */}
            <div className="flex-1 space-y-8 min-w-0">
              {!activeSessionId && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-12 w-full max-w-2xl mx-auto">
                  
                  {sessions.length > 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-3xl mb-12"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium tracking-tight text-slate-50">Cognitive Analytics</h2>
                        <span className="text-xs font-medium text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">Last 14 Days</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a8c7fa" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#a8c7fa" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#444746" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                              itemStyle={{ color: '#a8c7fa' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#a8c7fa" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-[18px] flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group"
                      >
                        <motion.div animate={{ rotateY: 360, y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Origami className="w-8 h-8 text-blue-600 relative z-10" strokeWidth={1.5} /></motion.div>
                      </motion.div>
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-medium tracking-tight text-slate-50 mb-3 text-center"
                      >
                        Capture your consciousness
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-[15px] max-w-md font-normal mb-12 text-center"
                      >
                        Start a new session. Your thoughts will be safely isolated and preserved in your personal vault.
                      </motion.p>
                    </>
                  )
                  }
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    {[
                      "Analyze system architecture...",
                      "I'm feeling anxious about...",
                      "Help me brainstorm ideas for...",
                      "Let's do a gratitude exercise."
                    ].map((starter, i) => (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        key={i}
                        onClick={() => {
                          setInput(starter);
                          textareaRef.current?.focus();
                        }}
                        className="text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl transition-colors text-[14px] text-slate-50 shadow-sm shadow-black/50 flex items-center justify-between group"
                      >
                        <span>{starter}</span>
                        <MessageSquare className="w-4 h-4 text-[#444746] group-hover:text-blue-600 transition-colors" strokeWidth={1.5} />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-4xl flex flex-col gap-6 md:gap-8 pb-8">
                  {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    msg={msg} 
                    speakingMessageId={speakingMessageId} 
                    playAudio={playAudio} 
                    showError={showError} 
                  />
                ))}
              </div>
              )}
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600/10 border border-transparent flex items-center justify-center mt-1">
                    <motion.div animate={{ rotateY: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><motion.div animate={{ rotateY: [0, 20, 0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}><Origami className="w-4 h-4 text-blue-600" strokeWidth={1.5} /></motion.div></motion.div>
                  </div>
                  <div className="bg-slate-800 text-slate-50 rounded-bl-sm px-6 py-4 flex items-center">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#a8c7fa]/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#a8c7fa]/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#a8c7fa]/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Insights Side Panel (Desktop only when active, or inline below) */}
            <AnimatePresence>
              {sessionInsight && !hideInsights && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full md:w-80 shrink-0 space-y-4"
                >
                  <div className="bg-slate-900 border border-slate-700 rounded-[24px] p-6 shadow-sm shadow-black/50 relative">
                    <button 
                      onClick={() => setHideInsights(true)}
                      className="absolute top-5 right-5 text-slate-500 hover:text-slate-50 bg-slate-800 hover:bg-slate-800 p-1.5 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center border border-[#eab308]/20">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-slate-50">Cognitive Synthesis</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Detected State</div>
                        <div className="inline-flex items-center bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-50 font-medium shadow-sm shadow-black/50">
                          {sessionInsight.mood}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Key Themes</div>
                        <div className="flex flex-wrap gap-2">
                          {sessionInsight.keyThemes?.map((theme: string, i: number) => (
                            <span key={i} className="text-[12px] font-medium bg-slate-800 text-slate-500 px-2.5 py-1.5 rounded-lg border border-slate-700">
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Synthesis</div>
                        <p className="text-[13px] text-slate-500 leading-relaxed">
                          {sessionInsight.summary}
                        </p>
                      </div>

                      {sessionInsight.actionItems?.length > 0 && (
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Next Steps</div>
                          <ul className="space-y-2">
                            {sessionInsight.actionItems.map((item: string, i: number) => (
                              <li key={i} className="text-[13px] text-slate-50 flex gap-2.5 items-start">
                                <span className="text-blue-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#a8c7fa] flex-shrink-0" />
                                <span className="leading-tight">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 md:pb-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent flex justify-center fixed bottom-0 left-0 md:left-64 right-0 z-20">
          <div className="w-full max-w-4xl relative">
            {attachedImage && (
              <div className="absolute bottom-full mb-3 left-4 z-10">
                <div className="relative inline-block shadow-lg shadow-black/40 rounded-xl">
                  <img src={attachedImage.url} alt="Attached" className="h-20 w-20 object-cover rounded-xl border border-slate-600/80" />
                  <button 
                    type="button" 
                    onClick={() => setAttachedImage(null)}
                    className="absolute -top-2 -right-2 bg-slate-800 text-slate-50 rounded-full p-1 border border-slate-600 hover:bg-blue-600/80 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={handleSend} className="relative flex items-end bg-slate-800 rounded-[24px] shadow-md shadow-black/20 focus-within:bg-slate-800 focus-within:ring-1 focus-within:ring-[#a8c7fa] transition-colors overflow-hidden border border-slate-700 focus-within:border-[#a8c7fa] shadow-sm shadow-black/50">
              <label className="shrink-0 p-3 pb-3.5 pl-4 cursor-pointer text-slate-500 hover:text-slate-50 transition-colors rounded-full flex items-center justify-center">
                <ImagePlus className="w-6 h-6" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64String = (event.target?.result as string).split(',')[1];
                      setAttachedImage({ url: URL.createObjectURL(file), base64: base64String, mimeType: file.type });
                    };
                    reader.readAsDataURL(file);
                  }} 
                />
              </label>
              <textarea aria-label="Message input"
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={interactionMode === 'prism' ? "Activate Omni-Cognitive Synthesis..." : (interactionMode === 'research' ? "Enter a topic for deep research..." : "Ask Lumina...")}
                className="w-full max-h-[200px] bg-transparent border-none focus:ring-0 resize-none py-4 pl-4 pr-[220px] text-slate-50 placeholder-[#9ca3af] text-[15px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent outline-none"
                rows={1}
              />
              <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-500 hover:text-slate-50 text-xs focus:ring-0 cursor-pointer appearance-none rounded-lg px-2.5 py-1.5 outline-none transition-colors"
                  title="Spoken Language"
                >
                  <option value="auto" className="bg-slate-800 text-slate-50">Auto-Detect</option>
                  <option value="en-US" className="bg-slate-800 text-slate-50">English</option>
                  <option value="hi-IN" className="bg-slate-800 text-slate-50">Hindi</option>
                  <option value="es-ES" className="bg-slate-800 text-slate-50">Spanish</option>
                  <option value="fr-FR" className="bg-slate-800 text-slate-50">French</option>
                  <option value="de-DE" className="bg-slate-800 text-slate-50">German</option>
                  <option value="zh-CN" className="bg-slate-800 text-slate-50">Chinese</option>
                  <option value="ja-JP" className="bg-slate-800 text-slate-50">Japanese</option>
                  <option value="ar-SA" className="bg-slate-800 text-slate-50">Arabic</option>
                  <option value="ru-RU" className="bg-slate-800 text-slate-50">Russian</option>
                </select>

                <div className="flex items-center gap-0.5 border-l border-slate-700 pl-1.5 ml-0.5">
                  <button
                    type="button"
                    onClick={() => setInteractionMode('chat')}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      interactionMode === 'chat' ? "text-blue-600 bg-blue-600/10" : "text-slate-500 hover:text-slate-50 hover:bg-slate-800"
                    )}
                    title="Chat Mode"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteractionMode('research')}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      interactionMode === 'research' ? "text-blue-600 bg-blue-600/10" : "text-slate-500 hover:text-slate-50 hover:bg-slate-800"
                    )}
                    title="Deep Research Mode"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteractionMode('prism')}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      interactionMode === 'prism' ? "text-blue-600 bg-blue-600/10" : "text-slate-500 hover:text-slate-50 hover:bg-slate-800"
                    )}
                    title="Quantum Prism Mode (Parallel Personas)"
                  >
                    <BrainCircuit className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleListen}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors ml-0.5",
                    isListening ? "text-red-600 bg-red-400/10" : "text-slate-500 hover:text-slate-50 hover:bg-slate-800"
                  )}
                  title="Dictate via microphone"
                >
                  {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                </button>
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="p-2 rounded-full text-red-400 bg-red-950/30 hover:bg-red-900/50 transition-colors shadow-sm"
                  >
                    <StopCircle className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() && !attachedImage}
                    className="p-2.5 ml-0.5 rounded-full text-white bg-slate-700 hover:bg-blue-600 disabled:opacity-30 disabled:bg-slate-700 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <CommandPalette 
        sessions={sessions}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onToggleZenMode={() => setZenMode(z => !z)}
        open={paletteOpen}
        setOpen={setPaletteOpen}
      />
    </div>
  );
}




interface MessageBubbleProps {
  msg: Message;
  speakingMessageId: string | null;
  playAudio: (text: string, id: string) => void;
  showError: (message: string) => void;
}

const MessageBubble = React.memo(({ msg, speakingMessageId, playAudio, showError }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4",
        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
      )}
      style={{ width: "100%" }}
    >
      {msg.role === 'model' && (
        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600/10 border border-transparent flex items-center justify-center mt-1">
          <motion.div animate={{ rotateY: [0, 20, 0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}><Origami className="w-4 h-4 text-blue-600" strokeWidth={1.5} /></motion.div>
        </div>
      )}
      
      <div className={cn(
        "group relative rounded-[20px] px-0 py-3 text-[16px] leading-relaxed transition-all w-full flex flex-col",
        msg.role === 'model' ? "items-start" : "items-end",
        msg.role === 'user' 
          ? "bg-slate-700 text-slate-50 rounded-2xl shadow-sm ml-auto max-w-[85%] md:max-w-[75%] px-5 py-3" 
          : "bg-transparent text-slate-50 w-full max-w-full py-2"
      )}>
        
        {msg.role === 'model' ? (
          <div className="prose prose-p:text-white prose-li:text-white prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:m-0 prose-pre:mt-4 prose-pre:mb-4 prose-pre:w-full prose-pre:overflow-x-auto max-w-full prose-a:text-blue-400 prose-strong:text-white prose-headings:font-medium prose-headings:text-white text-white w-full">
            <div className="text-white"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.text || "..."}</ReactMarkdown></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-slate-50">{msg.text}</div>
        )}

        {msg.role === 'model' && msg.text && (
          <div className="flex w-full justify-start mt-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(msg.text);
                  showError("Copied to clipboard!");
                } catch (e) {
                  try {
                    const textArea = document.createElement("textarea");
                    textArea.value = msg.text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showError("Copied to clipboard!");
                  } catch (err) {
                    showError("Failed to copy");
                  }
                }
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-50 hover:bg-slate-800 flex items-center justify-center transition-colors"
              title="Copy message"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => playAudio(msg.text, msg.id)}
              className={cn(
                "p-1.5 rounded-lg text-slate-500 hover:text-slate-50 hover:bg-slate-800 flex items-center justify-center transition-colors",
                speakingMessageId === msg.id && "text-blue-600 bg-slate-800"
              )}
              title={speakingMessageId === msg.id ? "Stop Reading" : "Read Aloud"}
            >
              {speakingMessageId === msg.id ? <Square className="w-3.5 h-3.5" fill="currentColor" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
});


interface SidebarItemProps {
  session: Session;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
}

const SidebarItem = React.memo(({ session, isActive, onSelect, onDelete, openMenuId, setOpenMenuId }: SidebarItemProps) => {
  return (
    <div
      className={cn(
        "group flex items-center justify-between w-full px-2 py-2 rounded-lg cursor-pointer transition-colors relative",
        isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"
      )}
      onClick={() => onSelect(session.id)}
    >
      <div className="flex flex-col items-start min-w-0 flex-1">
        <span className="text-[12px] font-medium text-slate-100 truncate w-full px-1">{session.title}</span>
        <span className="text-[10px] text-slate-500 px-1">{format(new Date(session.createdAt), 'MMM d, h:mm a')}</span>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuId(openMenuId === session.id ? null : session.id);
        }}
        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-700 text-slate-400 hover:text-slate-50 transition-all"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {openMenuId === session.id && (
        <div className="absolute right-8 top-8 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(session.id);
            }}
            className="w-full text-left px-3 py-2 text-[12px] text-red-400 hover:bg-slate-700 flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
});
