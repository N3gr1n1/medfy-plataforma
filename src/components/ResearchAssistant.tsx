
import React, { useState } from 'react';
import { DriveFile, SearchResults } from '../types';
import { SearchIcon, SparklesIcon, FileIcon } from './Icons';

interface Props {
  onSearch: (query: string) => Promise<void>;
  searchResult: SearchResults | null;
  files: DriveFile[]; // To look up file details from IDs
  onFileClick: (file: DriveFile) => void;
  loading: boolean;
}

const ResearchAssistant: React.FC<Props> = ({ onSearch, searchResult, files, onFileClick, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const quickTopics = [
    "Hipertensão",
    "Vacinação",
    "Diabetes",
    "Cetoacidose",
    "Emergência"
  ];

  // Find the full file objects based on IDs returned by search
  const foundFiles = searchResult?.relevantFileIds
    .map(id => files.find(f => f.id === id))
    .filter((f): f is DriveFile => f !== undefined) || [];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10 shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon className="w-5 h-5" />
           </div>
           <input 
             type="text" 
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="Busque conteúdo nas suas aulas (Ex: Tratamento de Cetoacidose...)"
             className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg shadow-sm"
           />
           <button 
             type="submit"
             disabled={loading || !query.trim()}
             className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             {loading ? 'Buscando...' : 'Buscar na Plataforma'}
             {!loading && <SearchIcon className="w-4 h-4" />}
           </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!searchResult && !loading && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-0 animate-fade-in" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
             <div className="bg-blue-50 p-6 rounded-full mb-6">
                <SearchIcon className="w-12 h-12 text-blue-600" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-3">O que você precisa encontrar?</h2>
             <p className="text-slate-500 max-w-md mb-8">
               A IA irá varrer todas as suas aulas e resumos para encontrar exatamente o momento que o professor fala sobre o assunto.
             </p>
             
             <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
               {quickTopics.map((topic) => (
                 <button
                   key={topic}
                   onClick={() => {
                     setQuery(topic);
                     onSearch(topic);
                   }}
                   className="bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
                 >
                   {topic}
                 </button>
               ))}
             </div>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center p-8">
             <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
             <p className="text-slate-500 font-medium animate-pulse">Analisando biblioteca de aulas...</p>
          </div>
        )}

        {searchResult && !loading && (
          <div className="max-w-4xl mx-auto p-6 md:p-10">
             
             {/* AI Explanation Section */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold">
                   <SparklesIcon className="w-5 h-5" />
                   Resumo do Conteúdo Encontrado
                </div>
                <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700">
                   {searchResult.explanation}
                </div>
             </div>

             {/* Results List */}
             <h3 className="text-lg font-bold text-slate-800 mb-4">Aulas Relacionadas ({foundFiles.length})</h3>
             
             {foundFiles.length > 0 ? (
                <div className="grid gap-4">
                   {foundFiles.map(file => (
                      <button
                        key={file.id}
                        onClick={() => onFileClick(file)}
                        className="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                      >
                         <div className="p-4 bg-red-50 text-red-500 rounded-xl shrink-0">
                            <FileIcon className="w-8 h-8" />
                         </div>
                         <div>
                            <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
                               {file.name}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                               <span>{file.date}</span>
                               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                               <span>Vídeo Aula</span>
                            </div>
                            <span className="text-sm font-medium text-blue-600 hover:underline">
                               Abrir aula e gerar materiais &rarr;
                            </span>
                         </div>
                      </button>
                   ))}
                </div>
             ) : (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                   Nenhuma aula encontrada especificamente sobre este termo.
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAssistant;
