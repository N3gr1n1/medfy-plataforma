import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, MindMapNode, QuizQuestion, DriveFile, SearchResults, QuizFilters, SummaryData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getModel = (complex: boolean = false) => {
  return complex ? 'gemini-2.5-flash' : 'gemini-2.5-flash';
};

const safeParseJSON = <T>(text: string | undefined, fallback: T): T => {
  if (!text) return fallback;
  let cleaned = text.replace(/```json\n?|```/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    try {
      if (cleaned.endsWith('"')) cleaned += '}]}'; 
      else if (cleaned.endsWith('}')) cleaned += ']}';
      else if (cleaned.endsWith(']')) cleaned += '}';
      return JSON.parse(cleaned) as T;
    } catch (retryError) {
      return fallback;
    }
  }
};

export const generateSummary = async (context: string): Promise<SummaryData | null> => {
  if (!context) return null;
  try {
    const response = await ai.models.generateContent({
      model: getModel(true),
      contents: `Atue como tutor. Resumo JSON. Texto: ${context.substring(0, 3500)}`, 
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            topic: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['concept', 'clinical', 'diagnosis', 'treatment', 'warning'] },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "type", "content"]
              }
            },
            examPearls: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "topic", "sections", "examPearls"]
        }
      }
    });
    return safeParseJSON<SummaryData | null>(response.text, null);
  } catch (error) { return null; }
};

export const generateFlashcards = async (context: string): Promise<Flashcard[]> => {
  if (!context) return [];
  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: `5 flashcards difíceis residência. JSON. Texto: ${context.substring(0, 3500)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { front: { type: Type.STRING }, back: { type: Type.STRING } },
            required: ["front", "back"]
          }
        }
      }
    });
    const data = safeParseJSON<any[]>(response.text, []);
    return data.map((item: any, index: number) => ({
      id: `fc-${Date.now()}-${index}`, front: item.front, back: item.back, status: 'new'
    }));
  } catch (error) { return []; }
};

export const generateMindMap = async (context: string): Promise<MindMapNode | null> => {
  if (!context) return null;
  try {
    const response = await ai.models.generateContent({
      model: getModel(),
      contents: `Mapa mental hierárquico JSON. Texto: ${context.substring(0, 3500)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            children: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: {type: Type.STRING} } } } 
                }
              }
            }
          },
          required: ["label", "children"]
        }
      }
    });
    const data = safeParseJSON<any>(response.text, null);
    const addIds = (node: any): MindMapNode => ({
        id: `mm-${Math.random().toString(36).substr(2, 9)}`, label: node.label, children: node.children ? node.children.map(addIds) : []
    });
    return data ? addIds(data) : null;
  } catch (error) { return null; }
};

export const generateQuizQuestions = async (context: string | null, cats: string[], filters?: QuizFilters): Promise<QuizQuestion[]> => {
  const total = filters?.count || 5;
  const prompt = filters 
    ? `Crie ${total} questões residência INÉDITAS banca ${filters.institution}. Foco: ${filters.specialty}.`
    : `Crie ${total} questões baseadas no texto: ${context?.substring(0, 1000)}`;

  try {
    const response = await ai.models.generateContent({
      model: getModel(true), 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              institution: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["category", "question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });
    const data = safeParseJSON<any[]>(response.text, []);
    return data.map((q: any, i: number) => ({ ...q, id: `qz-${Date.now()}-${i}`, institution: q.institution || (filters?.institution || 'Geral') }));
  } catch (error) { return []; }
};

export const searchMedicalTopic = async (query: string, files: DriveFile[]): Promise<SearchResults> => {
  try {
    const fileContext = files.map(f => ({ id: f.id, name: f.name, snippet: f.transcript?.substring(0, 500) }));
    const response = await ai.models.generateContent({
      model: getModel(true),
      contents: `Busca interna. Query: "${query}". Conteúdo: ${JSON.stringify(fileContext)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { explanation: { type: Type.STRING }, relevantFileIds: { type: Type.ARRAY, items: { type: Type.STRING } } },
          required: ["explanation", "relevantFileIds"]
        }
      }
    });
    const data = safeParseJSON<any>(response.text, {});
    return { explanation: data.explanation || "Nada encontrado.", relevantFileIds: data.relevantFileIds || [] };
  } catch (error) { return { explanation: "Erro.", relevantFileIds: [] }; }
};