
import React, { useState, useEffect } from 'react';
import { AppMode, Flashcard, MindMapNode, QuizQuestion, QuizResult, User, SearchResults, DriveFile, QuizFilters, SummaryData, ClassStudyMaterial } from './types';
import { generateFlashcards, generateMindMap, generateQuizQuestions, generateSummary, searchMedicalTopic } from './services/geminiService';
import { BrainIcon, FlashcardIcon, QuizIcon, ChartIcon, SummaryIcon, LogOutIcon, SearchIcon, LibraryIcon, ErrorBookIcon } from './components/Icons';
import SourceManager from './components/SourceManager';
import FlashcardDeck from './components/FlashcardDeck';
import MindMapViewer from './components/MindMapViewer';
import QuizMode from './components/QuizMode';
import Analytics from './components/Analytics';
import LoginPage from './components/LoginPage';
import ResearchAssistant from './components/ResearchAssistant';
import SummaryViewer from './components/SummaryViewer';
import ErrorNotebookViewer from './components/ErrorNotebookViewer';

// Mock Data Defined in App to act as "Database"
const MOCK_DRIVE_FILES: DriveFile[] = [
  {
    id: '1',
    name: 'Hipertensão e Crises Hipertensivas - Aula 01',
    area: 'Cardiologia',
    type: 'video',
    date: '2023-10-12',
    transcript: `A Hipertensão Arterial Sistêmica (HAS) é uma condição clínica multifatorial.
    
    CRISES HIPERTENSIVAS:
    Diferenciar Emergência de Urgência Hipertensiva.
    
    1. EMERGÊNCIA HIPERTENSIVA: PA elevada com lesão de órgão-alvo aguda e progressiva (LOA). Risco iminente de vida.
    Exemplos: 
    - Encefalopatia Hipertensiva (cefaleia, confusão, rebaixamento). Conduta: Nitroprussiato de Sódio IV. Reduzir 25% da PAM na 1ª hora.
    - Dissecção Aórtica Aguda: Dor torácica lancinante + assimetria de pulsos. Conduta: Beta-bloqueador IV (Esmolol/Labetalol) + Nitroprussiato. Meta: FC < 60 e PAS < 120 em 20 min.
    - Edema Agudo de Pulmão: Dispneia, crepitações. Conduta: Nitroglicerina (Tridil) + Diurético (Furosemida).
    
    2. URGÊNCIA HIPERTENSIVA: PA elevada sem LOA aguda. Risco potencial.
    Conduta: Medicamentos orais (Captopril, Clonidina). Observação. Redução gradativa em 24-48h.
    
    3. PSEUDOCRISE: PA elevada por dor, ansiedade, pânico. Tratamento: Analgesia ou ansiolítico. Não tratar a PA agressivamente.

    HAS CRÔNICA:
    Metas: Geral < 140/90 (Ideal < 130/80 em alto risco).
    Drogas 1ª linha: Tiazídicos (Hidroclorotiazida), IECA (Enalapril), BRA (Losartana), BCC (Anlodipino).
    Estágio 1 baixo risco: Monoterapia.
    Estágio 2 ou alto risco: Combinação (IECA/BRA + BCC/Tiazídico).`
  },
  {
    id: '10',
    name: 'Insuficiência Cardíaca (ICFER vs ICFEP)',
    area: 'Cardiologia',
    type: 'video',
    date: '2023-10-14',
    transcript: `Insuficiência Cardíaca. Classificação por Fração de Ejeção: Reduzida (<40%), Levemente Reduzida (40-49%), Preservada (>=50%). O quarteto fantástico do tratamento da ICFER: Beta-bloqueador (Metoprolol, Carvedilol, Bisoprolol), IECA/BRA/ARNI (Sacubitril-Valsartana), Espironolactona e Inibidores SGLT2 (Dapagliflozina).`
  },
  {
    id: '2',
    name: 'Cetoacidose Diabética e Estado Hiperosmolar',
    area: 'Endocrinologia',
    type: 'video',
    date: '2023-10-15',
    transcript: `Cetoacidose Diabética (CAD): Complicação aguda hiperglicêmica, mais comum no DM1, mas pode ocorrer no DM2.

    TRÍADE:
    1. Hiperglicemia (> 250 mg/dL).
    2. Acidose Metabólica (pH < 7,3 e HCO3 < 15-18).
    3. Cetose (Cetonemia/Cetonúria positivas).

    QUADRO CLÍNICO:
    Poliúria, polidipsia, desidratação, dor abdominal (pode simular abdome agudo), respiração de Kussmaul, hálito cetônico, rebaixamento do nível de consciência.

    TRATAMENTO (VIP):
    1. VOLUME (A mais importante): SF 0,9% 1000ml na 1ª hora. Avaliar Na+ corrigido para decidir manutenção (SF 0,45% se Na+ normal/alto).
    
    2. INSULINA: Apenas após garantir K+ > 3,3.
    Insulina Regular IV em bomba (0,1 U/kg/h).
    Quando glicemia < 200: Adicionar SG 5% e reduzir infusão de insulina para evitar hipoglicemia, mantendo até corrigir acidose.
    
    3. POTÁSSIO (K+):
    - Se K+ < 3,3: NÃO iniciar insulina. Repor K+ vigorosamente.
    - Se K+ 3,3 - 5,2: Repor K+ junto com insulina.
    - Se K+ > 5,2: Não repor, monitorar.

    CRITÉRIOS DE RESOLUÇÃO:
    pH > 7,3; HCO3 > 15-18; Anion Gap <= 12.
    Neste momento, iniciar insulina SC e desligar bomba IV após 1-2h (transição).`
  },
  {
      id: '3',
      name: 'Calendário Vacinal (PNI 2024) - Completo',
      area: 'Pediatria',
      type: 'pdf',
      date: '2023-11-02',
      transcript: `Calendário Vacinal da Criança (PNI 2024 - Pontos Chave):
      
      AO NASCER: BCG (ID, braço direito, cicatriz) + Hepatite B.
      
      2 MESES:
      - Pentavalente (DTP + Hib + HepB)
      - VIP (Polio inativada)
      - VORH (Rotavírus)
      - Pneumo-10
      
      3 MESES: Meningo C.
      
      4 MESES: Reforço dos 2 meses (Penta, VIP, VORH, Pneumo).
      
      5 MESES: Reforço Meningo C.
      
      6 MESES: Penta + VIP. (Sem VORH e Pneumo aqui).
      + Influenza (se época de campanha).
      + COVID-19 (dependendo da recomendação vigente para > 6m).
      
      9 MESES: Febre Amarela.
      
      12 MESES (1 ANO):
      - Tríplice Viral (Sarampo, Caxumba, Rubéola)
      - Pneumo-10 (Reforço)
      - Meningo C (Reforço)
      
      15 MESES:
      - Tetraviral (Tríplice + Varicela)
      - Hepatite A
      - DTP (Reforço - Tríplice Bacteriana)
      - VOP (Poliomielite oral - Gotinha - Reforço)
      
      4 ANOS:
      - DTP (Reforço)
      - VOP (Reforço)
      - Varicela (2ª dose agora recomendada em alguns calendários ou aos 4 anos).
      - Febre Amarela (Reforço).
      
      CONTRAINDICAÇÕES GERAIS DE VACINAS VIVAS (BCG, VORH, VOP, FA, Tríplice, Varicela):
      - Imunodeficiência grave.
      - Gestantes.
      - Corticoterapia em dose imunossupressora (> 2mg/kg/dia ou > 20mg/dia de prednisona por > 14 dias).`
  },
  {
      id: '4',
      name: 'Pneumonias na Infância',
      area: 'Pediatria',
      type: 'video',
      date: '2023-11-05',
      transcript: `Pneumonia adquirida na comunidade em pediatria. Etiologia por idade. < 2 meses: GBS, Gram negativos. 2m a 5 anos: Viral (VSR), Pneumococo. > 5 anos: Pneumococo, Atípicos (Mycoplasma). Tratamento ambulatorial: Amoxicilina. Critérios de internação: Tiragem subcostal, gemência, hipoxemia.`
  },
  {
      id: '5',
      name: 'Sangramento Uterino Anormal (SUA)',
      area: 'Ginecologia',
      type: 'video',
      date: '2023-11-10',
      transcript: `PALM-COEIN. Pólipo, Adenomiose, Leiomioma, Malignidade. Coagulopatia, Disfunção Ovulatória, Endometrial, Iatrogênica, Não classificada.`
  }
];

export default function App() {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);

  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.SOURCES);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // GLOBAL STUDY DATA (Persistence Layer)
  const [studyData, setStudyData] = useState<Record<string, ClassStudyMaterial>>({});

  // Non-Persisted / Global State
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  
  // ERROR NOTEBOOK STATE (Persisted)
  const [errorNotebook, setErrorNotebook] = useState<QuizQuestion[]>([]);
  
  const [searchResult, setSearchResult] = useState<SearchResults | null>(null);
  
  // Quiz Mode State (Can be transient or Global)
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);

  // Loading States
  const [loading, setLoading] = useState(false);

  // Load from LocalStorage on Mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('medfy_study_data');
      if (savedData) {
        setStudyData(JSON.parse(savedData));
      }
      
      const savedErrors = localStorage.getItem('medfy_error_notebook');
      if (savedErrors) {
          setErrorNotebook(JSON.parse(savedErrors));
      }
    } catch (e) {
      console.error("Erro ao carregar dados", e);
    }
  }, []);

  // Save to LocalStorage on Change
  useEffect(() => {
    if (Object.keys(studyData).length > 0) {
      localStorage.setItem('medfy_study_data', JSON.stringify(studyData));
    }
  }, [studyData]);
  
  // Persist Error Notebook
  useEffect(() => {
      localStorage.setItem('medfy_error_notebook', JSON.stringify(errorNotebook));
  }, [errorNotebook]);

  // --- Helper to get Current File Data ---
  const getCurrentFileData = () => {
    if (!activeFileId) return null;
    return studyData[activeFileId] || null;
  };
  
  const getCurrentTranscript = () => {
    if (!activeFileId) return '';
    const file = MOCK_DRIVE_FILES.find(f => f.id === activeFileId);
    return file?.transcript || '';
  };
  
  const getCurrentFileName = () => {
    const file = MOCK_DRIVE_FILES.find(f => f.id === activeFileId);
    return file?.name || '';
  };

  // --- Handlers ---

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveFileId(null);
    setActiveMode(AppMode.SOURCES);
  };

  const handleModeChange = (mode: AppMode) => {
      setActiveMode(mode);
  };

  // INTELLIGENT FILE SELECTION - SHELF LOGIC
  const handleFileSelect = async (file: DriveFile) => {
    setActiveFileId(file.id);
    setActiveMode(AppMode.SUMMARY); // Default view
    
    // Check if we ALREADY have data for this file
    const existingData = studyData[file.id];

    // If data exists AND summary is valid, just switch.
    if (existingData && existingData.summary) {
      return; 
    }
    
    // DATA DOES NOT EXIST OR SUMMARY IS MISSING: Auto-generate Summary
    await generateNewSummary(file.id, file.transcript || '');
  };

  const generateNewSummary = async (fileId: string, transcript: string) => {
     setLoading(true);
     
     // Initialize entry if needed
     const currentEntry = studyData[fileId] || {
            fileId: fileId,
            summary: null,
            flashcards: [],
            mindMap: null,
            quizQuestions: [],
            lastAccessed: Date.now()
     };

     // Optimistic update to init structure
     setStudyData(prev => ({ 
        ...prev, 
        [fileId]: currentEntry
     }));

     const summary = await generateSummary(transcript);
    
     // Update State with result (even if null)
     setStudyData(prev => ({
       ...prev,
       [fileId]: {
         ...prev[fileId],
         summary: summary // might be null if failed
       }
     }));
     setLoading(false);
  };

  const handleRegenerateSummary = () => {
      if (activeFileId) {
          generateNewSummary(activeFileId, getCurrentTranscript());
      }
  };

  const handleGenerateFlashcards = async () => {
    if (!activeFileId) return;
    setLoading(true);
    const context = getCurrentTranscript();
    const cards = await generateFlashcards(context);
    
    setStudyData(prev => ({
      ...prev,
      [activeFileId]: {
        ...prev[activeFileId],
        flashcards: cards
      }
    }));
    setLoading(false);
  };

  const handleGenerateMindMap = async () => {
    if (!activeFileId) return;
    setLoading(true);
    const context = getCurrentTranscript();
    const map = await generateMindMap(context);
    
    setStudyData(prev => ({
      ...prev,
      [activeFileId]: {
        ...prev[activeFileId],
        mindMap: map
      }
    }));
    setLoading(false);
  };

  const handleGenerateQuiz = async (filters: QuizFilters, useErrorNotebook: boolean = false) => {
    
    // Error Notebook Logic (Global)
    if (useErrorNotebook) {
        if (errorNotebook.length === 0) {
            alert("Seu caderno de erros está vazio! Ótimo trabalho.");
            return;
        }
        // Shuffle the notebook for practice
        const shuffled = [...errorNotebook].sort(() => 0.5 - Math.random());
        setActiveQuizQuestions(shuffled);
        // Ensure we switch to Quiz mode to take the exam
        setActiveMode(AppMode.QUIZ);
        return;
    }

    // Normal Quiz Logic
    // If filters (Specialty/Institution) are present, it's a GENERAL quiz (not bound to file)
    if (filters.specialty && filters.specialty !== '') {
        setLoading(true);
        const questions = await generateQuizQuestions(null, [], filters);
        setActiveQuizQuestions(questions);
        setLoading(false);
        return;
    }

    // Context Quiz Logic (From current file)
    if (activeFileId) {
        setLoading(true);
        const context = getCurrentTranscript();
        const questions = await generateQuizQuestions(context, [], filters);
        setActiveQuizQuestions(questions);
        setLoading(false);
    }
  };

  const handleRecordQuizResult = (result: QuizResult, question: QuizQuestion) => {
    setQuizResults(prev => [...prev, result]);
    
    if (!result.isCorrect) {
        // Add to Error Notebook if wrong (and not already there)
        setErrorNotebook(prev => {
            if (prev.some(q => q.id === question.id)) return prev;
            return [...prev, question];
        });
    } else {
        // Remove from Error Notebook if correct (Mastery)
        setErrorNotebook(prev => prev.filter(q => q.id !== question.id));
    }
  };

  const handleQuizFinish = () => {
    // Clear current quiz questions to return to setup screen next time
    setActiveQuizQuestions([]);
    // Redirect to Analytics to show performance
    setActiveMode(AppMode.ANALYTICS);
  };

  // Dedicated handler for starting Error Review from the Error Notebook view
  const handleStartErrorReview = () => {
      // Logic same as generating quiz from errors, but triggered from distinct view
      const shuffled = [...errorNotebook].sort(() => 0.5 - Math.random());
      setActiveQuizQuestions(shuffled);
      setActiveMode(AppMode.QUIZ);
  };

  const handleLocalSearch = async (query: string) => {
    setLoading(true);
    const result = await searchMedicalTopic(query, MOCK_DRIVE_FILES);
    setSearchResult(result);
    setLoading(false);
  };

  const handleSearchResultClick = (file: DriveFile) => {
    handleFileSelect(file);
  };

  // --- Navigation Component ---
  const NavItem = ({ mode, icon: Icon, label }: { mode: AppMode, icon: any, label: string }) => (
    <button
      onClick={() => handleModeChange(mode)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all mb-1 group
        ${activeMode === mode 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${activeMode === mode ? 'text-white' : ''}`} />
        <span className="font-medium">{label}</span>
      </div>
      {mode === AppMode.ERRORS && errorNotebook.length > 0 && (
         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeMode === mode ? 'bg-white text-blue-600' : 'bg-amber-100 text-amber-700'}`}>
            {errorNotebook.length}
         </span>
      )}
    </button>
  );

  // If not logged in, show Login Page
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentData = getCurrentFileData();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm hidden md:flex">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <BrainIcon className="w-5 h-5" />
             </div>
             Med.Fy AI
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-10">Área do Aluno</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Biblioteca</p>
            <NavItem mode={AppMode.SOURCES} icon={LibraryIcon} label="Minha Biblioteca" />
            
            {activeFileId && (
              <div className="ml-4 pl-4 border-l border-slate-200 mt-2 space-y-1 animate-fade-in">
                 <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 truncate pr-2">
                    Estudando Agora:
                 </p>
                 <p className="text-xs font-bold text-blue-700 mb-2 truncate" title={getCurrentFileName()}>
                    {getCurrentFileName()}
                 </p>
                 <NavItem mode={AppMode.SUMMARY} icon={SummaryIcon} label="Resumo" />
                 <NavItem mode={AppMode.MINDMAP} icon={BrainIcon} label="Mapa Mental" />
                 <NavItem mode={AppMode.FLASHCARDS} icon={FlashcardIcon} label="Flashcards" />
              </div>
            )}
          </div>

          <div>
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prática & Pesquisa</p>
            <NavItem mode={AppMode.QUIZ} icon={QuizIcon} label="Banco de Questões" />
            <NavItem mode={AppMode.ERRORS} icon={ErrorBookIcon} label="Caderno de Erros" />
            <NavItem mode={AppMode.RESEARCH} icon={SearchIcon} label="Pesquisa IA" />
            <NavItem mode={AppMode.ANALYTICS} icon={ChartIcon} label="Desempenho" />
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
           <div className="mb-4 px-2 flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wide bg-emerald-50 p-2 rounded border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Acesso Premium
           </div>
           
           <div className="flex items-center gap-3 mb-3">
              <img 
                src={user.avatar || "https://ui-avatars.com/api/?name=User&background=random"} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                 <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium"
           >
             <LogOutIcon className="w-4 h-4" /> Sair
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 z-20">
             <div className="font-bold text-blue-700 flex items-center gap-2">
                 <BrainIcon className="w-6 h-6"/> Med.Fy
             </div>
             <div className="flex items-center gap-3">
               <select 
                  value={activeMode} 
                  onChange={(e) => handleModeChange(e.target.value as AppMode)}
                  className="bg-slate-100 border-none rounded-md text-sm p-2"
               >
                   <option value={AppMode.SOURCES}>Prateleira</option>
                   <option value={AppMode.SUMMARY}>Resumo</option>
                   <option value={AppMode.FLASHCARDS}>Flashcards</option>
                   <option value={AppMode.MINDMAP}>Mapa Mental</option>
                   <option value={AppMode.QUIZ}>Questões</option>
                   <option value={AppMode.ERRORS}>Erros</option>
               </select>
               <button onClick={handleLogout} className="text-slate-500">
                  <LogOutIcon className="w-5 h-5" />
               </button>
             </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50/50">
          
          {activeMode === AppMode.SOURCES && (
            <SourceManager 
              files={MOCK_DRIVE_FILES}
              onFileSelect={handleFileSelect} 
              activeFileId={activeFileId} 
              studyData={studyData}
            />
          )}

          {activeMode === AppMode.SUMMARY && (
             loading ? (
                <div className="flex h-full items-center justify-center gap-2 text-blue-600">
                    <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce delay-75"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce delay-150"></div>
                </div>
             ) : (
                <SummaryViewer 
                  key={activeFileId} // Force refresh on file change
                  data={currentData?.summary || null} 
                  title={getCurrentFileName()}
                  onRegenerate={handleRegenerateSummary}
                />
             )
          )}

          {activeMode === AppMode.FLASHCARDS && (
            <FlashcardDeck 
                key={activeFileId} // Force refresh on file change
                cards={currentData?.flashcards || []} 
                loading={loading} 
                onGenerate={handleGenerateFlashcards} 
                hasContext={!!activeFileId}
            />
          )}

          {activeMode === AppMode.MINDMAP && (
            <MindMapViewer 
                key={activeFileId} // Force refresh on file change
                data={currentData?.mindMap || null} 
                loading={loading} 
                onGenerate={handleGenerateMindMap}
                hasContext={!!activeFileId}
            />
          )}

          {activeMode === AppMode.QUIZ && (
            <QuizMode 
                questions={activeQuizQuestions}
                loading={loading}
                onGenerate={handleGenerateQuiz}
                onRecordResult={handleRecordQuizResult}
                onFinish={handleQuizFinish}
                errorCount={errorNotebook.length}
            />
          )}

          {activeMode === AppMode.ERRORS && (
             <ErrorNotebookViewer 
               errors={errorNotebook}
               onStartReview={handleStartErrorReview}
             />
          )}

          {activeMode === AppMode.RESEARCH && (
            <ResearchAssistant
                onSearch={handleLocalSearch}
                searchResult={searchResult}
                loading={loading}
                files={MOCK_DRIVE_FILES}
                onFileClick={handleSearchResultClick}
            />
          )}

          {activeMode === AppMode.ANALYTICS && (
            <Analytics results={quizResults} />
          )}
        </div>
      </main>
    </div>
  );
}
