import { UserProfile, DietSuggestion } from '../types';
import { getBertDietSuggestions } from './bertUtils';

// Sample diet suggestions database
const dietSuggestions: DietSuggestion[] = [
  {
    id: '1',
    title: 'Weight Loss Plan',
    description: 'A calorie-deficit diet focused on lean proteins and vegetables.',
    meals: {
      breakfast: ['Greek yogurt with berries', 'Vegetable omelette', 'Overnight oats with chia seeds'],
      lunch: ['Grilled chicken salad', 'Quinoa bowl with roasted vegetables', 'Lentil soup with side salad'],
      dinner: ['Baked salmon with steamed broccoli', 'Turkey stir-fry with mixed vegetables', 'Zucchini noodles with lean meat sauce'],
      snacks: ['Apple slices with almond butter', 'Carrot sticks with hummus', 'Handful of mixed nuts']
    },
    calories: 1500,
    protein: 100,
    carbs: 125,
    fat: 50,
    suitableFor: {
      healthGoals: ['weight-loss'],
      medicalConditions: [],
      allergies: []
    }
  },
  {
    id: '2',
    title: 'Weight Gain Plan',
    description: 'A calorie-surplus diet rich in healthy fats and proteins.',
    meals: {
      breakfast: ['Protein smoothie with banana and peanut butter', 'Avocado toast with eggs', 'Oatmeal with nuts and dried fruits'],
      lunch: ['Chicken wrap with avocado', 'Tuna sandwich with whole grain bread', 'Rice bowl with beans and grilled meat'],
      dinner: ['Pasta with meat sauce', 'Steak with sweet potato', 'Salmon with quinoa and roasted vegetables'],
      snacks: ['Trail mix', 'Protein bars', 'Peanut butter and banana sandwich']
    },
    calories: 2800,
    protein: 150,
    carbs: 300,
    fat: 90,
    suitableFor: {
      healthGoals: ['weight-gain'],
      medicalConditions: [],
      allergies: []
    }
  },
  {
    id: '3',
    title: 'Diabetes-Friendly Plan',
    description: 'A balanced diet with controlled carbohydrates and focus on low glycemic index foods.',
    meals: {
      breakfast: ['Steel-cut oats with cinnamon', 'Vegetable egg white omelette', 'Greek yogurt with berries'],
      lunch: ['Grilled chicken with quinoa', 'Mediterranean salad with olive oil dressing', 'Lentil soup'],
      dinner: ['Baked fish with steamed vegetables', 'Turkey and vegetable stir-fry', 'Tofu with brown rice and vegetables'],
      snacks: ['Cucumber slices', 'Hard-boiled egg', 'Small apple with cheese']
    },
    calories: 1800,
    protein: 110,
    carbs: 150,
    fat: 60,
    suitableFor: {
      healthGoals: ['maintenance', 'general-health'],
      medicalConditions: ['diabetes', 'insulin resistance'],
      allergies: []
    }
  },
  {
    id: '4',
    title: 'Heart-Healthy Plan',
    description: 'A diet low in sodium and saturated fats, rich in omega-3s and fiber.',
    meals: {
      breakfast: ['Oatmeal with berries', 'Whole grain toast with avocado', 'Fruit smoothie with flaxseeds'],
      lunch: ['Spinach salad with grilled chicken', 'Quinoa bowl with vegetables', 'Bean soup with side salad'],
      dinner: ['Baked salmon with asparagus', 'Grilled vegetables with brown rice', 'Lentil stew'],
      snacks: ['Unsalted nuts', 'Fresh fruit', 'Yogurt']
    },
    calories: 1700,
    protein: 90,
    carbs: 180,
    fat: 55,
    suitableFor: {
      healthGoals: ['maintenance', 'general-health'],
      medicalConditions: ['hypertension', 'high cholesterol', 'heart disease'],
      allergies: []
    }
  },
  {
    id: '5',
    title: 'Gluten-Free Plan',
    description: 'A balanced diet excluding all sources of gluten.',
    meals: {
      breakfast: ['Gluten-free oats with fruit', 'Smoothie bowl', 'Eggs with vegetables'],
      lunch: ['Rice bowl with grilled chicken', 'Corn tortilla wraps with beans', 'Quinoa salad'],
      dinner: ['Grilled fish with potatoes', 'Stir-fry with rice noodles', 'Stuffed bell peppers with rice and ground turkey'],
      snacks: ['Rice cakes with nut butter', 'Fruit and cheese', 'Vegetable sticks with hummus']
    },
    calories: 2000,
    protein: 100,
    carbs: 220,
    fat: 65,
    suitableFor: {
      healthGoals: ['maintenance', 'weight-loss', 'weight-gain', 'general-health'],
      medicalConditions: ['celiac disease'],
      allergies: ['gluten', 'wheat']
    }
  },
  {
    id: '6',
    title: 'Muscle Building Plan',
    description: 'High protein diet designed to support muscle growth and recovery.',
    meals: {
      breakfast: ['Protein pancakes', 'Egg white omelette with vegetables and cheese', 'Greek yogurt with granola and fruit'],
      lunch: ['Grilled chicken breast with sweet potato', 'Tuna salad sandwich on whole grain bread', 'Turkey and avocado wrap'],
      dinner: ['Steak with roasted vegetables', 'Salmon with quinoa', 'Chicken stir-fry with brown rice'],
      snacks: ['Protein shake', 'Cottage cheese with fruit', 'Greek yogurt with honey']
    },
    calories: 2500,
    protein: 180,
    carbs: 250,
    fat: 70,
    suitableFor: {
      healthGoals: ['muscle-building', 'weight-gain'],
      medicalConditions: [],
      allergies: []
    }
  }
];

export const generateDietSuggestions = async (profile: UserProfile, userPreferences: string = ''): Promise<DietSuggestion[]> => {
  if (!profile) return [];

  try {
    // Try to get BERT-based suggestions first
    const bertSuggestionIds = await getBertDietSuggestions(profile, userPreferences);
    
    if (bertSuggestionIds && bertSuggestionIds.length > 0) {
      console.log('Using BERT suggestions:', bertSuggestionIds);
      // Get the diet suggestions based on the IDs returned by BERT
      const bertSuggestions = bertSuggestionIds
        .map(id => dietSuggestions.find(diet => diet.id === id))
        .filter(diet => diet !== undefined) as DietSuggestion[];
      
      if (bertSuggestions.length > 0) {
        return bertSuggestions;
      }
    }
  } catch (error) {
    console.error('Error getting BERT suggestions:', error);
  }
  
  // Fallback to rule-based filtering if BERT fails or returns no results
  console.log('Falling back to rule-based diet suggestions');
  
  // Filter suggestions based on health goal
  let suggestions = dietSuggestions.filter(suggestion => 
    suggestion.suitableFor.healthGoals.includes(profile.healthGoal)
  );

  // Further filter based on medical conditions if any
  if (profile.medicalConditions.length > 0) {
    const medicalConditionSuggestions = suggestions.filter(suggestion => 
      profile.medicalConditions.some(condition => 
        suggestion.suitableFor.medicalConditions.includes(condition.toLowerCase())
      )
    );
    
    // If we have specific suggestions for medical conditions, prioritize those
    if (medicalConditionSuggestions.length > 0) {
      suggestions = medicalConditionSuggestions;
    }
  }

  // Filter out suggestions that contain allergens
  if (profile.allergies.length > 0) {
    suggestions = suggestions.filter(suggestion => 
      !profile.allergies.some(allergy => 
        suggestion.suitableFor.allergies.includes(allergy.toLowerCase())
      )
    );
  }

  // If no suggestions match after filtering, return general suggestions
  if (suggestions.length === 0) {
    return dietSuggestions.filter(suggestion => 
      suggestion.suitableFor.healthGoals.includes('general-health')
    );
  }

  return suggestions;
};

export const calculateBMI = (height: number, weight: number): number => {
  // Height in meters (convert from cm)
  const heightInMeters = height / 100;
  // BMI formula: weight (kg) / (height (m))^2
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateCalorieNeeds = (profile: UserProfile): number => {
  // Basic BMR calculation using Harris-Benedict Equation
  // This is a simplified version and doesn't account for activity level
  let bmr = 0;
  
  // Assuming biological sex based on average values since we don't collect that data
  // For a more accurate calculation, you would need to collect sex information
  bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  
  // Adjust based on health goal
  switch (profile.healthGoal) {
    case 'weight-loss':
      return Math.round(bmr * 0.8); // 20% deficit
    case 'weight-gain':
      return Math.round(bmr * 1.2); // 20% surplus
    case 'muscle-building':
      return Math.round(bmr * 1.15); // 15% surplus
    default:
      return Math.round(bmr); // maintenance
  }
};