
import React, { useState } from 'react';
import { QuizQuestion, QuizResult, QuizFilters } from '../types';

interface Props {
  questions: QuizQuestion[];
  loading: boolean;
  onGenerate: (filters: QuizFilters, useErrorNotebook?: boolean) => void;
  onRecordResult: (result: QuizResult, question: QuizQuestion) => void;
  onFinish: () => void;
  errorCount: number;
}

const QuizMode: React.FC<Props> = ({ questions, loading, onGenerate, onRecordResult, onFinish, errorCount }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Filter State
  const [specialty, setSpecialty] = useState('Clínica Médica');
  const [institution, setInstitution] = useState('Todas (Mix)');
  const [difficulty, setDifficulty] = useState('Difícil (R1)');
  const [count, setCount] = useState(10);

  const specialties = [
    "Clínica Médica", "Cirurgia Geral", "Pediatria", "Ginecologia e Obstetrícia", "Medicina Preventiva", "Mix Geral"
  ];
  
  const institutions = [
    "Todas (Mix)", "USP-SP", "UNIFESP", "ENARE", "SES-PE", "SUS-SP", "UNICAMP", "SCMK"
  ];

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption(null);
    onGenerate({
      specialty,
      institution,
      difficulty,
      count
    }, false);
  };

  const handleStartErrorNotebook = () => {
    if (errorCount === 0) return;
    setCurrentIndex(0);
    setIsAnswered(false);
    setSelectedOption(null);
    onGenerate({
      specialty: 'Caderno de Erros',
      institution: 'Mix',
      difficulty: 'Personalizado',
      count: 10
    }, true);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctIndex;

    onRecordResult({
      category: currentQ.category,
      isCorrect: isCorrect,
      timestamp: Date.now()
    }, currentQ);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      // End of quiz logic handled by Finish button
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Preparando Simulado...</h3>
        <p className="text-rose-600 font-medium animate-pulse mb-4">Organizando as questões.</p>
      </div>
    );
  }

  // 2. Configuration State (No active questions)
  if (questions.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-6 md:p-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h7"/><path d="m20 13.5-3 3 2 2 4-4"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Banco de Questões Inteligente</h2>
                <p className="text-slate-500 text-lg">
                    Gere simulados personalizados ou revise seus erros.
                </p>
            </div>

            {/* Error Notebook Callout - ALWAYS VISIBLE */}
            <div className={`mb-8 border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm animate-fade-in gap-4 
                ${errorCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl shadow-sm border 
                        ${errorCount > 0 ? 'bg-white text-amber-600 border-amber-100' : 'bg-white text-emerald-600 border-emerald-100'}`}>
                        {errorCount > 0 ? (
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        )}
                    </div>
                    <div>
                        <h3 className={`font-bold text-xl ${errorCount > 0 ? 'text-amber-900' : 'text-emerald-900'}`}>
                            Caderno de Erros
                        </h3>
                        {errorCount > 0 ? (
                            <p className="text-amber-700 mt-1">
                                Você tem <span className="font-black text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md mx-1">{errorCount}</span> questões pendentes.
                            </p>
                        ) : (
                            <p className="text-emerald-700 mt-1">
                                Parabéns! Você não tem erros pendentes para revisar.
                            </p>
                        )}
                    </div>
                </div>
                
                <button 
                    onClick={handleStartErrorNotebook}
                    disabled={errorCount === 0}
                    className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap
                        ${errorCount > 0 
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 active:scale-95' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                >
                    {errorCount > 0 ? 'Revisar Meus Erros' : 'Caderno Limpo'}
                    {errorCount > 0 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    )}
                </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
                <div className="border-b border-slate-100 pb-4 mb-4">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                        Novo Simulado (IA)
                    </h3>
                </div>

                {/* Specialty Select */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Grande Área</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {specialties.map(s => (
                            <button
                                key={s}
                                onClick={() => setSpecialty(s)}
                                className={`p-3 rounded-lg text-sm font-medium border transition-all text-left
                                    ${specialty === s 
                                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Institution Select */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Banca / Instituição</label>
                    <select 
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-4 focus:ring-rose-100 focus:border-rose-500 outline-none appearance-none font-medium"
                    >
                        {institutions.map(inst => (
                            <option key={inst} value={inst}>{inst}</option>
                        ))}
                    </select>
                </div>

                {/* Count Select */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Tamanho do Simulado</label>
                    <div className="grid grid-cols-5 gap-2">
                            {[5, 10, 20, 50, 100].map(n => (
                            <button
                                key={n}
                                onClick={() => setCount(n)}
                                className={`p-3 rounded-xl font-bold transition-all border flex flex-col items-center justify-center
                                    ${count === n 
                                        ? 'bg-slate-800 text-white border-slate-800 shadow-lg transform scale-105' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                    }`}
                            >
                                <span className="text-lg">{n}</span>
                                <span className="text-[10px] uppercase opacity-70">Qts</span>
                            </button>
                            ))}
                    </div>
                </div>

                {/* Difficulty Select */}
                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Nível</label>
                     <div className="flex gap-3">
                        {['Médio', 'Difícil (R1)', 'Desafio'].map(d => (
                             <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`flex-1 p-3 rounded-lg text-sm font-medium border transition-all
                                    ${difficulty === d
                                        ? 'bg-rose-50 border-rose-500 text-rose-700 bg-opacity-20'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                     </div>
                </div>

                <button
                    onClick={handleStartQuiz}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                    Gerar Simulado Inédito
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                </button>
            </div>
        </div>
      </div>
    );
  }

  // 3. Quiz Taking State
  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-rose-200">
            {currentQ.category}
            </span>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200">
            {currentQ.institution || 'Geral'}
            </span>
        </div>
        <button onClick={onFinish} className="text-slate-400 hover:text-rose-600 text-sm font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            Sair
        </button>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <div 
                className="h-full bg-rose-500 transition-all duration-500" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
             <span className="text-slate-400 text-sm font-bold">Questão {currentIndex + 1} de {questions.length}</span>
             {errorCount > 0 && currentQ.id.startsWith('qz') === false && (
                <span className="text-amber-600 text-xs font-bold uppercase tracking-wide bg-amber-100 px-2 py-1 rounded flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    Revisão de Erro
                </span>
             )}
        </div>
        
        <p className="text-lg md:text-xl font-medium text-slate-800 mb-8 leading-relaxed">
          {currentQ.question}
        </p>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ";
            
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnClass += "bg-green-50 border-green-500 text-green-900 shadow-sm";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-900";
              } else {
                btnClass += "bg-white border-slate-100 text-slate-400 opacity-50";
              }
            } else {
              btnClass += "bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-700";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span className="font-bold flex-shrink-0 mt-0.5 w-6">{String.fromCharCode(65 + idx)}</span>
                <span>{option}</span>
                {isAnswered && idx === currentQ.correctIndex && (
                    <span className="ml-auto text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                )}
                 {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <span className="ml-auto text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation / Next Button */}
      {isAnswered && (
        <div className="animate-fade-in pb-20">
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg mb-6 border-l-4 border-rose-500">
            <div className="font-bold mb-2 flex items-center gap-2 text-rose-300 uppercase text-xs tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Comentário da Banca
            </div>
            <p className="text-slate-200 leading-relaxed">{currentQ.explanation}</p>
          </div>
          
          <div className="flex justify-end">
            {isLast ? (
                <button 
                    onClick={onFinish} 
                    className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                >
                    Finalizar e Ver Resultado
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </button>
            ) : (
                <button 
                    onClick={nextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
                >
                    Próxima Questão
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizMode;
