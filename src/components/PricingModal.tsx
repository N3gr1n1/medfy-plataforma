
import React from 'react';
import { BrainIcon } from './Icons';

interface Props {
  onClose: () => void;
  onUpgrade: () => void;
}

const PricingModal: React.FC<Props> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 z-10 bg-white/50 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Left Side - Value Prop */}
        <div className="bg-slate-900 p-8 md:p-12 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-50"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 font-bold text-xl mb-6">
                <div className="bg-white/20 p-1.5 rounded backdrop-blur-sm">
                    <BrainIcon className="w-5 h-5" />
                </div>
                Med.Fy Pro
             </div>
             <h2 className="text-3xl font-bold mb-4 leading-tight">Domine a prova de residência.</h2>
             <p className="text-blue-100 mb-8">Desbloqueie o potencial máximo da IA e garanta sua vaga na R1.</p>
             
             <div className="space-y-4">
                <div className="flex items-start gap-3">
                   <div className="bg-green-500/20 p-1 rounded text-green-400 mt-0.5">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   </div>
                   <span className="text-sm">Geração ilimitada de Flashcards</span>
                </div>
                <div className="flex items-start gap-3">
                   <div className="bg-green-500/20 p-1 rounded text-green-400 mt-0.5">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   </div>
                   <span className="text-sm">Analytics Avançado (Gráfico de Aranha)</span>
                </div>
                <div className="flex items-start gap-3">
                   <div className="bg-green-500/20 p-1 rounded text-green-400 mt-0.5">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   </div>
                   <span className="text-sm">Mapas Mentais Complexos</span>
                </div>
             </div>
           </div>
           <div className="relative z-10 mt-8 text-xs text-slate-400">
              Milhares de estudantes aprovados.
           </div>
        </div>

        {/* Right Side - Plans */}
        <div className="p-8 md:p-12 md:w-3/5 bg-slate-50">
           <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Escolha seu plano</h3>
              <p className="text-slate-500">Cancele a qualquer momento.</p>
           </div>

           <div className="grid gap-4">
              {/* Monthly Plan */}
              <button 
                onClick={onUpgrade}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 relative group transition-all hover:shadow-md"
              >
                 <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
                    Mais Popular
                 </div>
                 <div className="text-left">
                    <p className="font-bold text-slate-900">Mensal</p>
                    <p className="text-xs text-slate-500">Acesso completo por 30 dias</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold text-blue-700">R$ 29,90</p>
                    <p className="text-xs text-slate-500">/mês</p>
                 </div>
              </button>

              {/* Annual Plan */}
              <button 
                 onClick={onUpgrade}
                 className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm"
              >
                 <div className="text-left">
                    <p className="font-bold text-slate-900">Anual</p>
                    <p className="text-xs text-green-600 font-medium">Economize 20%</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold text-slate-700">R$ 289,00</p>
                    <p className="text-xs text-slate-500">/ano</p>
                 </div>
              </button>
           </div>

           <div className="mt-8 text-center">
              <p className="text-xs text-slate-400 mb-4">Pagamento seguro via Stripe/PIX.</p>
              <button 
                onClick={onUpgrade}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                Desbloquear Med.Fy Pro
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
