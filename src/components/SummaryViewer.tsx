
import React, { useState } from 'react';
import { SummaryData } from '../types';
import { 
  CopyIcon, CheckIcon, PrinterIcon, SummaryIcon, SparklesIcon, 
  BrainIcon, StethoscopeIcon, PillIcon, AlertIcon, GraduationCapIcon,
  FlashcardIcon, QuizIcon
} from './Icons';

interface Props {
  data: SummaryData | null;
  title: string | null;
  onRegenerate?: () => void;
}

const SummaryViewer: React.FC<Props> = ({ data, title, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Rough plain text conversion for clipboard
    const text = data ? 
      `${data.title}\n\n${data.sections?.map(s => `[${s.title}]\n${s.content?.join('\n')}`).join('\n\n')}` 
      : '';
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!data || !data.sections) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center animate-fade-in">
         <div className="bg-slate-100 p-8 rounded-full mb-6">
            <SummaryIcon className="w-12 h-12 text-slate-400" />
         </div>
         <h2 className="text-xl font-bold text-slate-700 mb-2">Resumo Inteligente</h2>
         <p className="mb-6 max-w-md">
           {data ? "Ocorreu um erro ao processar o resumo. Tente gerar novamente." : "Selecione uma aula em 'Fontes' para a IA estruturar seu material de estudo."}
         </p>
         {onRegenerate && (
            <button 
              onClick={onRegenerate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm"
            >
              {data ? "Regenerar Resumo" : "Gerar Resumo Agora"}
            </button>
         )}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* MAIN CONTENT COLUMN */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-[800px]">
          
          {/* Header */}
          <div className="bg-white border-b border-slate-100 p-6 md:p-8">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-wider">
                  <SparklesIcon className="w-4 h-4" />
                  Material Gerado por IA
                </div>
                {onRegenerate && (
                   <button 
                     onClick={onRegenerate}
                     className="text-xs text-slate-400 hover:text-blue-600 font-medium underline"
                   >
                     Regenerar Resumo
                   </button>
                )}
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-2">
               {data.title || title || "Sem título"}
             </h1>
             <p className="text-slate-500 font-medium">{data.topic || "Tópico Geral"}</p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
             {data.sections.map((section, idx) => {
               // Render based on Section Type
               
               if (section.type === 'warning') {
                  return (
                     <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                        <div className="flex items-center gap-3 mb-3 text-red-700 font-bold text-lg">
                           <AlertIcon className="w-6 h-6" />
                           {section.title}
                        </div>
                        <div className="space-y-2 text-red-900/80">
                           {section.content?.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                     </div>
                  );
               }

               if (section.type === 'treatment') {
                  return (
                     <div key={idx} className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <PillIcon className="w-24 h-24 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-3 mb-4 text-emerald-700 font-bold text-lg relative z-10">
                           <PillIcon className="w-6 h-6" />
                           {section.title}
                        </div>
                        <div className="space-y-3 relative z-10">
                           {section.content?.map((p, i) => (
                              <div key={i} className="flex items-start gap-3 bg-white/60 p-3 rounded-lg">
                                 <div className="w-2 h-2 mt-2 bg-emerald-500 rounded-full shrink-0"></div>
                                 <p className="text-emerald-900">{p}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  );
               }

               if (section.type === 'diagnosis') {
                  return (
                     <div key={idx} className="bg-sky-50 border border-sky-100 rounded-xl p-6">
                         <div className="flex items-center gap-3 mb-4 text-sky-700 font-bold text-lg">
                           <StethoscopeIcon className="w-6 h-6" />
                           {section.title}
                        </div>
                        <ul className="space-y-2">
                           {section.content?.map((p, i) => (
                              <li key={i} className="flex items-start gap-2 text-sky-900">
                                 <span className="text-sky-400 font-bold">•</span>
                                 {p}
                              </li>
                           ))}
                        </ul>
                     </div>
                  );
               }

               // Default / Concept
               return (
                  <div key={idx} className="group">
                     <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                        {section.title}
                     </h3>
                     <div className="text-slate-600 leading-relaxed space-y-4 pl-4 border-l border-slate-100">
                        {section.content?.map((p, i) => <p key={i}>{p}</p>)}
                     </div>
                  </div>
               );

             })}
          </div>

          <div className="mt-auto border-t border-slate-100 p-6 flex justify-between items-center bg-slate-50">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Med.Fy AI Notes</span>
               <div className="flex gap-2">
                  <button onClick={handlePrint} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500">
                     <PrinterIcon className="w-5 h-5" />
                  </button>
                  <button onClick={handleCopy} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500">
                     {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                  </button>
               </div>
          </div>
        </div>

        {/* SIDEBAR: HIGH YIELD / PEARLS */}
        <div className="lg:w-80 shrink-0 space-y-6">
           {/* Exam Pearls Card */}
           {data.examPearls && data.examPearls.length > 0 && (
             <div className="bg-indigo-900 text-white rounded-xl p-6 shadow-xl sticky top-6">
                <div className="flex items-center gap-3 mb-6 border-b border-indigo-700 pb-4">
                   <div className="bg-indigo-500 p-2 rounded-lg">
                      <GraduationCapIcon className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg">Pérolas de Prova</h3>
                      <p className="text-indigo-300 text-xs">High Yield (USP/ENARE)</p>
                   </div>
                </div>

                <div className="space-y-4">
                   {data.examPearls.map((pearl, i) => (
                      <div key={i} className="flex gap-3 text-indigo-100 text-sm leading-relaxed">
                         <span className="text-yellow-400 font-bold text-lg leading-none">★</span>
                         {pearl}
                      </div>
                   ))}
                </div>

                <div className="mt-8 pt-4 border-t border-indigo-800 text-center">
                   <p className="text-xs text-indigo-400">Essas dicas caem em 80% das provas.</p>
                </div>
             </div>
           )}

           {/* Quick Actions (Mock) */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">Ações Rápidas</p>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center gap-2">
                 <FlashcardIcon className="w-4 h-4" /> Criar Flashcards deste tema
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium flex items-center gap-2">
                 <QuizIcon className="w-4 h-4" /> Gerar Questões sobre isso
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
