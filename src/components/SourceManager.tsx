
import React, { useState } from 'react';
import { DriveFile, ClassStudyMaterial } from '../types';
import { 
  FileIcon, SummaryIcon, FlashcardIcon, BrainIcon, DriveIcon, 
  HeartIcon, BabyIcon, WomanIcon, DropletIcon, StethoscopeIcon, ArrowLeftIcon
} from './Icons';

interface Props {
  files: DriveFile[];
  onFileSelect: (file: DriveFile) => void;
  activeFileId: string | null;
  studyData: Record<string, ClassStudyMaterial>;
}

const SourceManager: React.FC<Props> = ({ files, onFileSelect, activeFileId, studyData }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  // Group files by Area
  const filesByArea = files.reduce((acc, file) => {
    const area = file.area || 'Geral';
    if (!acc[area]) acc[area] = [];
    acc[area].push(file);
    return acc;
  }, {} as Record<string, DriveFile[]>);

  const areas = Object.keys(filesByArea);

  // Helper to get Icon and Color for Areas
  const getAreaConfig = (area: string) => {
    switch(area) {
        case 'Cardiologia':
            return { icon: HeartIcon, color: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200' };
        case 'Pediatria':
            return { icon: BabyIcon, color: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200' };
        case 'Ginecologia':
            return { icon: WomanIcon, color: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200' };
        case 'Endocrinologia':
            return { icon: DropletIcon, color: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' };
        default:
            return { icon: StethoscopeIcon, color: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' };
    }
  };

  // --- VIEW 1: AREA DASHBOARD (Clean Mode) ---
  if (!selectedArea) {
    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-slate-50">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Biblioteca de Estudos</h2>
                    <p className="text-slate-500">Selecione uma grande área para acessar suas aulas.</p>
                </div>
                <button className="hidden md:flex bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-2 px-4 rounded-xl transition-all items-center gap-2 shadow-sm text-sm">
                    <DriveIcon className="w-4 h-4" /> Importar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {areas.map(area => {
                    const config = getAreaConfig(area);
                    const count = filesByArea[area].length;
                    
                    return (
                        <button 
                            key={area}
                            onClick={() => setSelectedArea(area)}
                            className="group relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all text-left flex flex-col justify-between h-64"
                        >
                            <div className={`absolute top-0 right-0 p-32 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-500 rounded-full ${config.color}`}></div>
                            
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${config.color} text-white`}>
                                <config.icon className="w-8 h-8" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">{area}</h3>
                                <p className="text-slate-500 font-medium">{count} {count === 1 ? 'Aula' : 'Aulas'} Disponíveis</p>
                            </div>

                            <div className="mt-6 flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                                Acessar Conteúdo &rarr;
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
  }

  // --- VIEW 2: FILE LIST (Inside an Area) ---
  const currentFiles = filesByArea[selectedArea];
  const config = getAreaConfig(selectedArea);

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto bg-slate-50 animate-fade-in">
        {/* Navigation Header */}
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => setSelectedArea(null)}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all"
            >
                <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Biblioteca</p>
                <h2 className={`text-3xl font-bold flex items-center gap-3 ${config.text}`}>
                    <config.icon className="w-8 h-8" />
                    {selectedArea}
                </h2>
            </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentFiles.map((file) => {
                const data = studyData[file.id];
                const hasSummary = !!data?.summary;
                const cardCount = data?.flashcards?.length || 0;
                const hasMindMap = !!data?.mindMap;
                const isActive = activeFileId === file.id;

                return (
                    <button
                        key={file.id}
                        onClick={() => onFileSelect(file)}
                        className={`relative flex flex-col h-full bg-white rounded-2xl border-2 text-left transition-all hover:-translate-y-1 hover:shadow-lg group
                            ${isActive 
                            ? 'border-blue-500 ring-4 ring-blue-500/10' 
                            : 'border-slate-100 hover:border-blue-300'
                            }`}
                    >
                        <div className="p-5 border-b border-slate-50">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${file.type === 'video' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                    <FileIcon className="w-6 h-6" />
                                </div>
                                {isActive && <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-1 rounded">Em Aberto</span>}
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2 min-h-[3.5rem]">
                                {file.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                {file.date}
                            </p>
                        </div>

                        <div className="p-5 bg-slate-50/50 flex-1 flex flex-col justify-end rounded-b-2xl">
                            <div className="grid grid-cols-2 gap-2">
                                <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-colors
                                    ${hasSummary ? 'bg-white border-green-200 text-green-700' : 'bg-slate-100 border-transparent text-slate-400 opacity-60'}`}>
                                    <SummaryIcon className="w-3.5 h-3.5" />
                                    {hasSummary ? 'Resumo' : '---'}
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-colors
                                    ${cardCount > 0 ? 'bg-white border-green-200 text-green-700' : 'bg-slate-100 border-transparent text-slate-400 opacity-60'}`}>
                                    <FlashcardIcon className="w-3.5 h-3.5" />
                                    {cardCount > 0 ? `${cardCount}` : '---'}
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-colors
                                    ${hasMindMap ? 'bg-white border-green-200 text-green-700' : 'bg-slate-100 border-transparent text-slate-400 opacity-60'}`}>
                                    <BrainIcon className="w-3.5 h-3.5" />
                                    {hasMindMap ? 'Mapa' : '---'}
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default SourceManager;
