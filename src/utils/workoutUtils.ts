import { UserProfile, Workout } from '../types';

// Sample workout plans database
const workoutPlans: Workout[] = [
  {
    id: '1',
    title: 'Weight Loss Circuit',
    description: 'High-intensity circuit training designed for maximum calorie burn.',
    difficulty: 'intermediate',
    duration: 30,
    caloriesBurned: 300,
    exercises: [
      {
        name: 'Jumping Jacks',
        sets: 3,
        reps: '30 seconds',
        rest: 15,
        instructions: 'Stand with feet together, arms at sides, then jump feet out and arms up, then return to starting position.'
      },
      {
        name: 'Mountain Climbers',
        sets: 3,
        reps: '30 seconds',
        rest: 15,
        instructions: 'Start in a plank position, then alternate bringing knees to chest in a running motion.'
      },
      {
        name: 'Burpees',
        sets: 3,
        reps: '10',
        rest: 30,
        instructions: 'Begin standing, drop to a squat, kick feet back to plank, return to squat, then jump up with arms extended.'
      },
      {
        name: 'Bodyweight Squats',
        sets: 3,
        reps: '15',
        rest: 30,
        instructions: 'Stand with feet shoulder-width apart, lower body until thighs are parallel to floor, then return to standing.'
      },
      {
        name: 'Push-ups',
        sets: 3,
        reps: '10-15',
        rest: 30,
        instructions: 'Start in plank position with hands shoulder-width apart, lower chest to floor, then push back up.'
      }
    ],
    suitableFor: {
      healthGoals: ['weight-loss'],
      fitnessLevels: ['beginner', 'intermediate']
    }
  },
  {
    id: '2',
    title: 'Muscle Building Basics',
    description: 'Fundamental resistance training to build muscle mass and strength.',
    difficulty: 'intermediate',
    duration: 45,
    caloriesBurned: 350,
    exercises: [
      {
        name: 'Push-ups',
        sets: 4,
        reps: '12-15',
        rest: 60,
        instructions: 'Start in plank position with hands shoulder-width apart, lower chest to floor, then push back up.'
      },
      {
        name: 'Bodyweight Squats',
        sets: 4,
        reps: '15-20',
        rest: 60,
        instructions: 'Stand with feet shoulder-width apart, lower body until thighs are parallel to floor, then return to standing.'
      },
      {
        name: 'Dumbbell Rows',
        sets: 3,
        reps: '12 each arm',
        rest: 60,
        instructions: 'With one knee and hand on bench, pull dumbbell to hip, keeping back flat and elbow close to body.'
      },
      {
        name: 'Lunges',
        sets: 3,
        reps: '10 each leg',
        rest: 60,
        instructions: 'Step forward with one leg, lowering hips until both knees are bent at 90 degrees, then return to standing.'
      },
      {
        name: 'Plank',
        sets: 3,
        reps: '30-60 seconds',
        rest: 45,
        instructions: 'Hold a forearm plank position with body in a straight line from head to heels.'
      }
    ],
    suitableFor: {
      healthGoals: ['muscle-building', 'weight-gain'],
      fitnessLevels: ['beginner', 'intermediate']
    }
  },
  {
    id: '3',
    title: 'Heart Health Cardio',
    description: 'Cardiovascular workout designed to improve heart health and endurance.',
    difficulty: 'beginner',
    duration: 25,
    caloriesBurned: 200,
    exercises: [
      {
        name: 'Brisk Walking',
        sets: 1,
        reps: '5 minutes',
        rest: 0,
        instructions: 'Walk at a pace that elevates your heart rate but still allows you to hold a conversation.'
      },
      {
        name: 'Marching in Place',
        sets: 3,
        reps: '1 minute',
        rest: 30,
        instructions: 'March in place, lifting knees high and swinging arms naturally.'
      },
      {
        name: 'Step Touches',
        sets: 3,
        reps: '1 minute',
        rest: 30,
        instructions: 'Step to the side with one foot, then bring the other foot to touch beside it. Alternate sides.'
      },
      {
        name: 'Arm Circles',
        sets: 2,
        reps: '30 seconds each direction',
        rest: 15,
        instructions: 'Extend arms out to sides and make small circles, then reverse direction.'
      },
      {
        name: 'Cool Down Walk',
        sets: 1,
        reps: '3 minutes',
        rest: 0,
        instructions: 'Walk slowly to gradually bring your heart rate down.'
      }
    ],
    suitableFor: {
      healthGoals: ['general-health'],
      fitnessLevels: ['beginner'],
      medicalConditions: ['hypertension', 'heart disease']
    }
  },
  {
    id: '4',
    title: 'Diabetes-Friendly Fitness',
    description: 'Safe and effective exercises for managing blood sugar levels.',
    difficulty: 'beginner',
    duration: 20,
    caloriesBurned: 150,
    exercises: [
      {
        name: 'Seated Marching',
        sets: 3,
        reps: '30 seconds',
        rest: 30,
        instructions: 'Sit tall in a chair and march your feet, lifting knees as high as comfortable.'
      },
      {
        name: 'Chair Squats',
        sets: 3,
        reps: '10',
        rest: 45,
        instructions: 'Stand in front of a chair, lower to barely touch the seat, then stand back up.'
      },
      {
        name: 'Wall Push-ups',
        sets: 3,
        reps: '10',
        rest: 45,
        instructions: 'Stand facing a wall, place hands on wall at shoulder height, bend elbows to bring chest toward wall, then push back.'
      },
      {
        name: 'Seated Leg Extensions',
        sets: 3,
        reps: '10 each leg',
        rest: 30,
        instructions: 'Sit tall in a chair, extend one leg until straight, hold briefly, then lower. Repeat with other leg.'
      },
      {
        name: 'Gentle Walking',
        sets: 1,
        reps: '5 minutes',
        rest: 0,
        instructions: 'Walk at a comfortable pace to finish your workout.'
      }
    ],
    suitableFor: {
      healthGoals: ['general-health'],
      fitnessLevels: ['beginner'],
      medicalConditions: ['diabetes', 'insulin resistance']
    }
  },
  {
    id: '5',
    title: 'Full Body Strength',
    description: 'Comprehensive strength training routine targeting all major muscle groups.',
    difficulty: 'advanced',
    duration: 60,
    caloriesBurned: 450,
    exercises: [
      {
        name: 'Push-ups',
        sets: 4,
        reps: '15-20',
        rest: 60,
        instructions: 'Perform standard push-ups or modify by doing them from knees if needed.'
      },
      {
        name: 'Bodyweight Squats',
        sets: 4,
        reps: '20',
        rest: 60,
        instructions: 'Perform deep squats with proper form, keeping chest up and knees tracking over toes.'
      },
      {
        name: 'Pull-ups or Inverted Rows',
        sets: 4,
        reps: '8-12',
        rest: 60,
        instructions: 'Use a pull-up bar or perform inverted rows using a sturdy table or bar.'
      },
      {
        name: 'Walking Lunges',
        sets: 3,
        reps: '20 steps total',
        rest: 60,
        instructions: 'Take alternating lunge steps forward, maintaining proper alignment.'
      },
      {
        name: 'Plank Variations',
        sets: 3,
        reps: '45-60 seconds',
        rest: 45,
        instructions: 'Hold standard plank, then try side planks for additional challenge.'
      },
      {
        name: 'Bicycle Crunches',
        sets: 3,
        reps: '20 each side',
        rest: 45,
        instructions: 'Lie on back, hands behind head, alternate bringing elbow to opposite knee.'
      }
    ],
    suitableFor: {
      healthGoals: ['muscle-building', 'maintenance'],
      fitnessLevels: ['intermediate', 'advanced']
    }
  }
];

export const generateWorkoutPlans = (profile: UserProfile): Workout[] => {
  if (!profile) return [];

  // Filter suggestions based on health goal
  let suggestions = workoutPlans.filter(workout => 
    workout.suitableFor.healthGoals.includes(profile.healthGoal)
  );

  // Determine fitness level based on BMI and age
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  let fitnessLevel: string;
  
  if (profile.age > 60 || bmi > 30 || bmi < 18.5) {
    fitnessLevel = 'beginner';
  } else if (profile.age > 40 || bmi > 25) {
    fitnessLevel = 'intermediate';
  } else {
    fitnessLevel = 'advanced';
  }
  
  // Filter by fitness level
  suggestions = suggestions.filter(workout => 
    workout.suitableFor.fitnessLevels.includes(fitnessLevel)
  );

  // Further filter based on medical conditions if any
  if (profile.medicalConditions.length > 0) {
    const medicalConditionWorkouts = workoutPlans.filter(workout => 
      workout.suitableFor.medicalConditions && 
      profile.medicalConditions.some(condition => 
        workout.suitableFor.medicalConditions?.includes(condition.toLowerCase())
      )
    );
    
    // If we have specific workouts for medical conditions, add those
    if (medicalConditionWorkouts.length > 0) {
      // Add medical condition specific workouts to suggestions
      const medicalIds = medicalConditionWorkouts.map(w => w.id);
      suggestions = [...suggestions.filter(s => !medicalIds.includes(s.id)), ...medicalConditionWorkouts];
    }
  }

  // If no suggestions match after filtering, return general beginner workouts
  if (suggestions.length === 0) {
    return workoutPlans.filter(workout => 
      workout.suitableFor.fitnessLevels.includes('beginner') &&
      workout.suitableFor.healthGoals.includes('general-health')
    );
  }

  return suggestions;
};