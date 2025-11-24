import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from 'recharts';
import { QuizResult } from '../types';

interface Props {
  results: QuizResult[];
}

interface AggregatedData {
  category: string;
  correct: number;
  total: number;
  score: number;
}

const Analytics: React.FC<Props> = ({ results }) => {
  // Aggregate data safely
  const aggregated: Record<string, AggregatedData> = results.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { category: curr.category, correct: 0, total: 0, score: 0 };
    }
    acc[curr.category].total += 1;
    if (curr.isCorrect) acc[curr.category].correct += 1;
    return acc;
  }, {} as Record<string, AggregatedData>);

  const data = Object.values(aggregated).map((item) => ({
    ...item,
    score: Math.round((item.correct / item.total) * 100)
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#06b6d4'];

  if (results.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-full mb-6 shadow-sm border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Painel de Métricas Vazio</h2>
        <p>Realize simulados para gerar seu gráfico de desempenho (Radar Chart).</p>
      </div>
    );
  }

  const totalCorrect = results.filter(r => r.isCorrect).length;
  const overallScore = Math.round((totalCorrect / results.length) * 100);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-50">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Suas Métricas</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Aproveitamento Geral</p>
            <p className={`text-4xl font-bold ${overallScore >= 70 ? 'text-green-600' : 'text-slate-800'}`}>{overallScore}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Questões Resolvidas</p>
            <p className="text-4xl font-bold text-slate-800">{results.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Áreas Cobertas</p>
            <p className="text-4xl font-bold text-slate-800">{data.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart (Spider Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-700 mb-2">Desempenho por Área (Radar)</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="#3b82f6"
                          fillOpacity={0.4}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        cursor={false}
                      />
                  </RadarChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Bar Chart Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-700 mb-2">Taxa de Acerto (%)</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="category" type="category" width={100} tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                          {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#10b981' : entry.score < 50 ? '#f43f5e' : '#f59e0b'} />
                          ))}
                      </Bar>
                  </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;