import React from 'react';
import { MindMapNode } from '../types';

interface NodeProps {
  node: MindMapNode;
  level: number;
}

const TreeNode: React.FC<NodeProps> = ({ node, level }) => {
  // Color palette for different depths
  const colors = [
    'border-l-blue-500 bg-blue-50', 
    'border-l-teal-500 bg-teal-50', 
    'border-l-indigo-500 bg-indigo-50',
    'border-l-purple-500 bg-purple-50'
  ];
  
  const activeColor = colors[level % colors.length];

  return (
    <div className="ml-4 md:ml-8 my-2">
      <div className={`p-3 rounded-r-lg border-l-4 shadow-sm ${activeColor} flex items-center animate-fade-in`}>
        <div className={`w-3 h-3 rounded-full mr-3 ${level === 0 ? 'bg-blue-600' : 'bg-slate-400'}`}></div>
        <span className="font-medium text-slate-800">{node.label}</span>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="border-l-2 border-slate-200 ml-5">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ViewerProps {
  data: MindMapNode | null;
  loading: boolean;
  onGenerate: () => void;
  hasContext: boolean;
}

const MindMapViewer: React.FC<ViewerProps> = ({ data, loading, onGenerate, hasContext }) => {
  if (!hasContext) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <p className="mb-4">Selecione uma aula no menu Fontes para gerar um mapa mental.</p>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="bg-slate-100 p-8 rounded-full mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Mapa Mental</h2>
        <p className="text-slate-600 mb-6 text-center max-w-md">
          A IA estruturará o conteúdo da aula em um mapa visual para facilitar a memorização.
        </p>
        <button
          onClick={onGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Gerar Mapa Mental
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-600 font-medium animate-pulse">Organizando ideias...</p>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[500px]">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-4 border-b">Estrutura do Conhecimento</h2>
        {data && <TreeNode node={data} level={0} />}
      </div>
    </div>
  );
};

export default MindMapViewer;