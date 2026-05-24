export interface UserProfile {
  age: number;
  height: number; // in cm
  weight: number; // in kg
  healthGoal: 'weight-loss' | 'weight-gain' | 'maintenance' | 'muscle-building' | 'general-health';
  medicalConditions: string[];
  allergies: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  taken: Record<string, boolean[]>;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discount: number; // percentage
  image: string;
}

export interface DietSuggestion {
  id: string;
  title: string;
  description: string;
  meals: {
    breakfast: <boltArtifact id="health-app-improvements-continued" title="Continue improving HealthyYou app with login, BERT diet suggestions, and workout plans">
  }
}