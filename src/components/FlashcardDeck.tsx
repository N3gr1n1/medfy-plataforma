
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { SparklesIcon } from './Icons';

interface Props {
  cards: Flashcard[];
  loading: boolean;
  onGenerate: () => void;
  hasContext: boolean;
}

const FlashcardDeck: React.FC<Props> = ({ cards, loading, onGenerate, hasContext }) => {
  // Use a local queue state to handle re-queuing cards (SRS behavior)
  const [sessionQueue, setSessionQueue] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync props with local state when cards change (new deck generated)
  useEffect(() => {
    if (cards.length > 0) {
        setSessionQueue([...cards]);
        setCurrentIndex(0);
        setIsFinished(false);
        setIsFlipped(false);
        setShowFeedback(false);
    }
  }, [cards]);

  // SRS Logic
  const handleRate = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    setShowFeedback(false);

    // Logic: If 'again', push current card to end of queue to review again in this session
    if (difficulty === 'again') {
        const currentCard = sessionQueue[currentIndex];
        setSessionQueue(prev => [...prev, currentCard]);
        showToast("Card reenfileirado para revisão hoje.");
    }

    setTimeout(() => {
        if (currentIndex < sessionQueue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of deck
            setIsFinished(true);
        }
    }, 200);
  };

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 2000);
  };

  const handleFlip = () => {
      if (isFinished) return;
      setIsFlipped(!isFlipped);
      if (!isFlipped) {
          // Show buttons only after revealing answer
          setTimeout(() => setShowFeedback(true), 150); 
      } else {
          setShowFeedback(false);
      }
  };

  const handleRestart = () => {
      // Reset using original cards prop, discarding the extra 'again' cards from previous session
      setSessionQueue([...cards]);
      setIsFinished(false);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowFeedback(false);
  };

  if (!hasContext) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <p>Selecione uma aula no menu Fontes para criar Flashcards.</p>
      </div>
    );
  }

  if (cards.length === 0 && !loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-slate-100 p-8 rounded-full mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="m8 10 4 4 4-4"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Flashcards Inteligentes</h2>
        <p className="text-slate-600 mb-6 text-center max-w-md">
          Transforme a videoaula em cards de memorização ativa (Flashcards) automaticamente.
        </p>
        <button
          onClick={onGenerate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Criar Deck SRS
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-600 font-medium animate-pulse">Criando cards de estudo...</p>
      </div>
    );
  }

  // --- FINISHED STATE ---
  if (isFinished) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in text-center">
            <div className="bg-emerald-100 p-6 rounded-full mb-6 text-emerald-600">
                <SparklesIcon className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Ciclo Completo!</h2>
            <p className="text-slate-500 mb-8 text-lg max-w-md">
                Você revisou todos os flashcards deste baralho. Continue assim para fixar o conteúdo na memória de longo prazo.
            </p>
            <div className="flex gap-4">
                <button 
                    onClick={handleRestart}
                    className="bg-white border-2 border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-8 py-3 rounded-xl font-bold transition-all shadow-sm"
                >
                    Revisar Novamente
                </button>
            </div>
        </div>
    );
  }

  // Ensure safe access if switching contexts rapidly
  const currentCard = sessionQueue[currentIndex];
  if (!currentCard) return null;

  const progress = ((currentIndex + 1) / sessionQueue.length) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg animate-fade-in z-20">
              {toastMessage}
          </div>
      )}

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6 flex items-center gap-4">
         <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
         </div>
         <span className="text-xs font-bold text-slate-400">Card {currentIndex + 1} de {sessionQueue.length}</span>
      </div>

      <div className="w-full max-w-2xl perspective-1000 h-96 relative group cursor-pointer" onClick={handleFlip}>
        <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-slate-200 p-10 flex flex-col items-center justify-center text-center">
             <span className="absolute top-6 left-6 text-xs font-bold text-slate-400 tracking-widest uppercase bg-slate-100 px-2 py-1 rounded">Pergunta</span>
             <p className="text-2xl font-medium text-slate-800 leading-relaxed font-serif">{currentCard.front}</p>
             <div className="absolute bottom-6 text-sm text-emerald-600 font-bold flex items-center gap-2 animate-pulse">
                Clique para ver a resposta
             </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-800 rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center text-center text-white border border-slate-700">
             <span className="absolute top-6 left-6 text-xs font-bold text-emerald-400 tracking-widest uppercase bg-slate-900/50 px-2 py-1 rounded">Resposta</span>
             <p className="text-xl leading-relaxed text-slate-100 font-serif">{currentCard.back}</p>
          </div>
        </div>
      </div>

      {/* SRS Controls - Anki Style */}
      <div className={`mt-8 transition-opacity duration-300 ${showFeedback ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="grid grid-cols-4 gap-3 max-w-2xl w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); handleRate('again'); }}
                className="flex flex-col items-center p-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors border border-rose-200"
              >
                  <span className="text-sm font-bold">Errei</span>
                  <span className="text-[10px] opacity-70 uppercase tracking-wide font-bold mt-1">Repetir</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); handleRate('hard'); }}
                className="flex flex-col items-center p-3 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 transition-colors border border-orange-200"
              >
                  <span className="text-sm font-bold">Difícil</span>
                  <span className="text-[10px] opacity-70 uppercase tracking-wide font-bold mt-1">6 min</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); handleRate('good'); }}
                className="flex flex-col items-center p-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors border border-emerald-200"
              >
                  <span className="text-sm font-bold">Bom</span>
                  <span className="text-[10px] opacity-70 uppercase tracking-wide font-bold mt-1">10 min</span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); handleRate('easy'); }}
                className="flex flex-col items-center p-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 transition-colors border border-blue-200"
              >
                  <span className="text-sm font-bold">Fácil</span>
                  <span className="text-[10px] opacity-70 uppercase tracking-wide font-bold mt-1">4 dias</span>
              </button>
          </div>
      </div>
      
      {!showFeedback && isFlipped && (
          <div className="mt-8 text-slate-400 text-sm">Selecione a dificuldade acima</div>
      )}
      {!isFlipped && (
          <div className="mt-8 text-slate-300 text-sm opacity-0">Placeholder</div>
      )}

    </div>
  );
};

export default FlashcardDeck;
