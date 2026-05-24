import * as tf from '@tensorflow/tfjs';
import { load as loadEncoder } from '@tensorflow-models/universal-sentence-encoder';

let encoder: any = null;
let dietDescriptions: string[] = [];
let dietIndices: string[] = [];

// Initialize the BERT model
export const initBertModel = async () => {
  try {
    console.log('Loading Universal Sentence Encoder...');
    encoder = await loadEncoder();
    console.log('Universal Sentence Encoder loaded successfully');
    
    // Prepare diet descriptions for similarity matching
    prepareDietDescriptions();
    return true;
  } catch (error) {
    console.error('Error loading Universal Sentence Encoder:', error);
    return false;
  }
};

// Prepare diet descriptions for embedding
const prepareDietDescriptions = () => {
  // These are the descriptions of our diet plans that will be used for similarity matching
  dietDescriptions = [
    "weight loss diet with low calories and high protein",
    "weight gain diet with high calories and balanced macros",
    "diabetes friendly diet with low glycemic index foods",
    "heart healthy diet low in sodium and saturated fats",
    "gluten free diet for celiac disease or gluten sensitivity",
    "muscle building diet high in protein for recovery and growth"
  ];
  
  // Corresponding indices in our diet suggestions array
  dietIndices = ['1', '2', '3', '4', '5', '6'];
};

// Get diet suggestions using BERT embeddings for semantic similarity
export const getBertDietSuggestions = async (userProfile: any, userPreferences: string): Promise<string[]> => {
  if (!encoder) {
    await initBertModel();
  }
  
  if (!encoder) {
    console.error('BERT model not loaded');
    return [];
  }
  
  try {
    // Create a query combining user profile and preferences
    const healthGoalText = userProfile.healthGoal.replace('-', ' ');
    const medicalConditionsText = userProfile.medicalConditions.join(', ');
    const allergiesText = userProfile.allergies.join(', ');
    
    let query = `${healthGoalText} diet`;
    
    if (medicalConditionsText) {
      query += ` for someone with ${medicalConditionsText}`;
    }
    
    if (allergiesText) {
      query += ` avoiding ${allergiesText}`;
    }
    
    if (userPreferences) {
      query += ` with preferences for ${userPreferences}`;
    }
    
    console.log('Query for diet matching:', query);
    
    // Get embeddings for the query and all diet descriptions
    const queryEmbedding = await encoder.embed(query);
    const descriptionEmbeddings = await encoder.embed(dietDescriptions);
    
    // Calculate cosine similarity between query and each description
    const querySimilarities = await calculateCosineSimilarity(queryEmbedding, descriptionEmbeddings);
    
    // Get indices of top 3 most similar diets
    const topIndices = getTopKIndices(querySimilarities, 3);
    
    // Map indices to diet IDs
    return topIndices.map(index => dietIndices[index]);
  } catch (error) {
    console.error('Error in BERT diet suggestion:', error);
    return [];
  }
};

// Calculate cosine similarity between embeddings
const calculateCosineSimilarity = async (queryEmbedding: any, descriptionEmbeddings: any) => {
  // Get the raw tensor data
  const queryTensor = queryEmbedding.arraySync()[0];
  const descriptionTensors = descriptionEmbeddings.arraySync();
  
  // Calculate similarities
  const similarities = descriptionTensors.map((descTensor: number[]) => {
    return cosineSimilarity(queryTensor, descTensor);
  });
  
  return similarities;
};

// Cosine similarity implementation
const cosineSimilarity = (a: number[], b: number[]): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  return dotProduct / (normA * normB);
};

// Get indices of top K values in array
const getTopKIndices = (arr: number[], k: number): number[] => {
  return arr
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, k)
    .map(item => item.index);
};