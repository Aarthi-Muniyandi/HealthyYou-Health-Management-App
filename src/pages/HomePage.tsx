import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { calculateBMI, getBMICategory } from '../utils/dietUtils';
import { Bell, Award, Utensils, Activity, Dumbbell } from 'lucide-react';

const HomePage: React.FC = () => {
  const { userProfile, medications, points } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile) {
      navigate('/profile');
    }
  }, [userProfile, navigate]);

  if (!userProfile) {
    return <div className="p-4">Loading...</div>;
  }

  const bmi = calculateBMI(userProfile.height, userProfile.weight);
  const bmiCategory = getBMICategory(bmi);
  
  const todayMedications = medications.filter(med => {
    const today = new Date().toISOString().split('T')[0];
    return !med.taken[today] || med.taken[today].some(taken => !taken);
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to HealthyYou</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Health Summary</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">BMI</p>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{bmi.toFixed(1)}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {bmiCategory}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-gray-600">Health Goal</p>
              <p className="font-semibold capitalize">{userProfile.healthGoal.replace('-', ' ')}</p>
            </div>
            
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-semibold">{userProfile.age} years</p>
              </div>
              <div>
                <p className="text-gray-600">Height</p>
                <p className="font-semibold">{userProfile.height} cm</p>
              </div>
              <div>
                <p className="text-gray-600">Weight</p>
                <p className="font-semibold">{userProfile.weight} kg</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/profile')} 
            className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
          >
            Update Profile
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold">Medication Reminders</h2>
          </div>
          
          {todayMedications.length > 0 ? (
            <div className="space-y-3">
              {todayMedications.slice(0, 3).map(med => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/medications')}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition"
                  >
                    View
                  </button>
                </div>
              ))}
              
              {todayMedications.length > 3 && (
                <p className="text-sm text-gray-600 text-center">
                  +{todayMedications.length - 3} more medications
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No medication reminders for today.</p>
          )}
          
          <button 
            onClick={() => navigate('/medications')} 
            className="mt-4 w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition"
          >
            Manage Medications
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Utensils className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">Diet Suggestions</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Get personalized diet suggestions based on your health profile and preferences using AI.
          </p>
          
          <button 
            onClick={() => navigate('/diet')} 
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
          >
            View Diet Plans
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Dumbbell className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Workout Plans</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Discover personalized workout routines tailored to your fitness level and health goals.
          </p>
          
          <button 
            onClick={() => navigate('/workout')} 
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
          >
            View Workout Plans
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Rewards</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600">Current Points</p>
            <p className="text-2xl font-bold text-yellow-600">{points}</p>
          </div>
          
          <p className="text-gray-600 mb-4">
            Earn points by taking your medications regularly, completing workouts, and maintaining a healthy lifestyle. Redeem them for discounts on medications.
          </p>
          
          <button 
            onClick={() => navigate('/rewards')} 
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
          >
            View Rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;