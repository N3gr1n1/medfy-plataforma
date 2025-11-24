
import React from 'react';
import { QuizQuestion } from '../types';
import { ErrorBookIcon, QuizIcon } from './Icons';

interface Props {
  errors: QuizQuestion[];
  onStartReview: () => void;
}

const ErrorNotebookViewer: React.FC<Props> = ({ errors, onStartReview }) => {
  if (errors.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 text-center animate-fade-in">
        <div className="bg-emerald-100 p-8 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Caderno Limpo!</h2>
        <p className="text-slate-600 max-w-md mb-8">
          Você revisou todas as suas questões erradas. Parabéns pela dedicação!
        </p>
      </div>
    );
  }

  // Group by category for nicer display
  const byCategory = errors.reduce((acc, q) => {
      const cat = q.category || 'Geral';
      if (!acc[cat]) acc[cat] = 0;
      acc[cat]++;
      return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
                    <ErrorBookIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Caderno de Erros</h2>
             </div>
             <p className="text-slate-500 text-lg">
               Você tem <span className="font-bold text-amber-600">{errors.length}</span> questões pendentes de revisão.
             </p>
          </div>
          
          <button
            onClick={onStartReview}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <QuizIcon className="w-5 h-5" />
            Iniciar Revisão Agora
          </button>
        </div>

        {/* Categories Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Object.entries(byCategory).map(([cat, count]) => (
                <div key={cat} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Área</p>
                    <h3 className="font-bold text-slate-700 truncate">{cat}</h3>
                    <p className="text-2xl font-bold text-amber-600 mt-2">{count} <span className="text-sm font-medium text-slate-400">erros</span></p>
                </div>
            ))}
        </div>

        {/* Question List Preview */}
        <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Questões Pendentes</h3>
            {errors.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-amber-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                {q.institution || 'Geral'}
                            </span>
                            <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                {q.category}
                            </span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                    </div>
                    <p className="text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {q.question}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorNotebookViewer;
