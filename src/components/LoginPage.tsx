
import React, { useState } from 'react';
import { BrainIcon, GoogleIcon } from './Icons';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    // Simulate Backend Purchase Verification
    setTimeout(() => {
      onLogin({
        id: 'user-google-123',
        name: 'Dr. Conrado',
        email: 'medico.residente@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Conrado+M&background=0D8ABC&color=fff',
        plan: 'pro' // Directly assign PRO as login implies access
      });
    }, 1500);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Por favor, preencha todos os campos.");
        return;
    }
    
    setLoading(true);
    setError('');

    // Simulate Backend Verification
    setTimeout(() => {
      onLogin({
        id: 'user-email-456',
        name: 'Dra. Marcela',
        email: email,
        avatar: `https://ui-avatars.com/api/?name=Marcela+S&background=e11d48&color=fff`,
        plan: 'pro'
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80" 
          alt="Medical Library" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        
        <div className="relative z-20">
           <div className="flex items-center gap-3 text-white font-bold text-2xl mb-2">
             <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <BrainIcon className="w-8 h-8" />
             </div>
             Med.Fy AI
           </div>
        </div>

        <div className="relative z-20 max-w-lg">
          <div className="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4">
              Área do Aluno
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
             Portal de Residência Médica
          </h1>
          <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
            Acesse sua plataforma de estudos inteligente. Seus flashcards, simulados e métricas estão sincronizados.
          </p>
        </div>

        <div className="relative z-20 text-xs text-indigo-300/50">
          © 2024 Med.Fy Technologies. Acesso restrito a assinantes.
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Login do Assinante</h2>
            <p className="mt-2 text-slate-500">Utilize as credenciais enviadas após a compra.</p>
          </div>

          <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5" />
                  Entrar com e-mail de compra
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400">ou acesse manualmente</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail Cadastrado</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>
              
              <div>
                 <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Senha</label>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Esqueceu?</a>
                 </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center"
              >
                {loading ? 'Verificando Assinatura...' : 'Acessar Plataforma'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500">
            Ainda não é aluno?{' '}
            <a href="#" className="font-bold text-blue-600 hover:text-blue-500">
              Adquira seu plano aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
