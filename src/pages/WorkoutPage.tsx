import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Workout } from '../types';
import { generateWorkoutPlans } from '../utils/workoutUtils';
import { ChevronDown, ChevronUp, Dumbbell, Clock, CheckCircle } from 'lucide-react';

const WorkoutPage: React.FC = () => {
  const { userProfile, addPoints } = useAppContext();
  const navigate = useNavigate();
  const [workoutPlans, setWorkoutPlans] = useState<Workout[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (!userProfile) {
      navigate('/profile');
      return;
    }
    
    const plans = generateWorkoutPlans(userProfile);
    setWorkoutPlans(plans);
    
    // Load completed workouts from localStorage
    const saved = localStorage.getItem('completedWorkouts');
    if (saved) {
      setCompletedWorkouts(JSON.parse(saved));
    }
  }, [userProfile, navigate]);
  
  useEffect(() => {
    // Save completed workouts to localStorage
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const markWorkoutCompleted = (workoutId: string) => {
    if (!completedWorkouts[workoutId]) {
      setCompletedWorkouts(prev => ({
        ...prev,
        [workoutId]: true
      }));
      
      // Award points for completing a workout
      addPoints(10);
    }
  };
  
  if (!userProfile) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">Your Workout Plans</h1>
      <p className="text-gray-600 mb-6">
        Personalized workout plans based on your health profile and goals.
      </p>
      
      {workoutPlans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No workout plans available. Please update your health profile.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {workoutPlans.map((workout) => (
            <div key={workout.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(workout.id)}
              >
                <div className="flex items-center">
                  <div className={`mr-3 p-2 rounded-full ${
                    completedWorkouts[workout.id] ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Dumbbell className={`h-6 w-6 ${
                      completedWorkouts[workout.id] ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{workout.title}</h2>
                    <p className="text-gray-600">{workout.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {completedWorkouts[workout.id] && (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  )}
                  {expandedId === workout.id ? (
                    <ChevronUp className="h-6 w-6 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-500" />
                  )}
                </div>
              </div>
              
              {expandedId === workout.id && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Difficulty</p>
                      <p className="font-bold capitalize">{workout.difficulty}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Duration</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-purple-600 mr-1" />
                        <p className="font-bold">{workout.duration} min</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Calories Burned</p>
                      <p className="font-bold">~{workout.caloriesBurned} kcal</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                        <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {exercise.sets} sets
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {exercise.reps} reps
                          </span>
                          {exercise.rest && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {exercise.rest}s rest
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{exercise.instructions}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => markWorkoutCompleted(workout.id)}
                      disabled={completedWorkouts[workout.id]}
                      className={`w-full py-2 rounded-md transition ${
                        completedWorkouts[workout.id]
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {completedWorkouts[workout.id] ? (
                        <span className="flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Completed
                        </span>
                      ) : (
                        'Mark as Completed'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPage;