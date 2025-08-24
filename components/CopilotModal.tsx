import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Task, Goal, Transaction, Prospect, Contact } from '../types';
import { CloseIcon, SparklesIcon } from './Icons';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  ai: GoogleGenAI;
  context: {
    tasks: Task[];
    goals: Goal[];
    transactions: Transaction[];
    prospects: Prospect[];
    contacts: Contact[];
  };
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderedHtml = useMemo(() => {
        let html = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        const lines = html.split('\n');
        let inList = false;
        const processedLines = lines.map(line => {
            if (line.match(/^\s*\*\s/)) {
                const itemContent = line.replace(/^\s*\*\s/, '');
                if (!inList) {
                    inList = true;
                    return `<ul class="list-disc pl-6 my-2 space-y-1"><li>${itemContent}</li>`;
                }
                return `<li>${itemContent}</li>`;
            } else {
                if (inList) {
                    inList = false;
                    return `</ul>${line}`;
                }
                return line;
            }
        });
        if (inList) {
            processedLines.push('</ul>');
        }
        return processedLines.join('\n');
    }, [content]);

    return (
        <div 
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
    );
};

const CopilotModal: React.FC<CopilotModalProps> = ({ isOpen, onClose, ai, context }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseContainerRef.current) {
        responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [response]);

  const generateContextPrompt = useCallback(() => {
    // Create summaries to save tokens
    const taskSummary = context.tasks.map(({ title, status, priority, dueDate }) => ({ title, status, priority, dueDate }));
    const goalSummary = context.goals.map(({ title, horizon, targetDate, taskIds }) => ({ title, horizon, targetDate, linkedTasksCount: taskIds.length }));
    const transactionSummary = context.transactions.map(({ title, amount, type, category, date }) => ({ title, amount, type, category, date }));
    
    const contactMap = new Map(context.contacts.map(c => [c.id, c]));
    const prospectSummary = context.prospects.map(p => {
        const contact = contactMap.get(p.contactId);
        return {
            name: contact?.name,
            company: contact?.company,
            stage: p.stage,
            followUpDate: p.followUpDate,
        };
    });
    
    const fullContext = {
      tasks: taskSummary,
      goals: goalSummary,
      transactions: transactionSummary,
      prospects: prospectSummary,
      contactsCount: context.contacts.length,
    };

    return `Eres Zenith, un asistente de productividad de clase mundial integrado en la aplicación Zenith Task Manager. Tu propósito es ayudar al usuario a analizar sus datos y ofrecerle resúmenes, recomendaciones y planes de acción inteligentes. Sé conciso, claro y útil. Responde siempre en español y usa formato markdown para mejorar la legibilidad (listas con '*' y negritas con '**'). No inventes datos. Basa tus respuestas únicamente en el contexto proporcionado.

Contexto de los Datos del Usuario:
${JSON.stringify(fullContext, null, 2)}
`;
  }, [context]);

  const handleSendPrompt = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setResponse('');
    
    const fullPrompt = `${generateContextPrompt()}\nPregunta del Usuario:\n${currentPrompt}`;

    try {
        const result = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        for await (const chunk of result) {
            setResponse(prev => prev + chunk.text);
        }

    } catch (e) {
        console.error("Error al contactar la API de Gemini:", e);
        setError("Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo.");
    } finally {
        setIsLoading(false);
        setPrompt('');
    }
  }, [ai, isLoading, generateContextPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(prompt);
  };

  if (!isOpen) return null;

  const promptSuggestions = [
    "¿Cuál es mi prioridad para hoy?",
    "Resume mis finanzas de este mes",
    "Dame consejos para alcanzar mis metas",
    "¿Qué tareas están atrasadas?",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-secondary rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col relative overflow-hidden border border-border-color">
        <header className="flex items-center justify-between p-4 border-b border-border-color shrink-0">
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-text-primary">Asistente Zenith IA</h2>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                <CloseIcon />
            </button>
        </header>

        <main ref={responseContainerRef} className="flex-1 p-6 overflow-y-auto">
            {isLoading && !response && (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="mt-4">Pensando...</p>
                </div>
            )}
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}
            
            {!isLoading && !response && !error && (
                <div className="text-center h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-text-primary mb-4">¿Cómo puedo ayudarte hoy?</h3>
                    <p className="text-text-secondary mb-8">Puedes preguntarme sobre tus tareas, metas, finanzas o prospectos.</p>
                    <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                        {promptSuggestions.map(suggestion => (
                            <button key={suggestion} onClick={() => handleSendPrompt(suggestion)} className="bg-primary text-left p-3 rounded-lg hover:bg-border-color transition-colors text-sm">
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {response && <MarkdownRenderer content={response} />}
        </main>

        <footer className="p-4 border-t border-border-color shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Pregúntale algo a Zenith..."
                    className="w-full bg-primary border border-border-color rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !prompt.trim()} className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-500 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
                    Enviar
                </button>
            </form>
        </footer>
      </div>
    </div>
  );
};

export default CopilotModal;