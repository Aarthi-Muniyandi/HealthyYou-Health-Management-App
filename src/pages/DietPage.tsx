import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DietSuggestion } from '../types';
import { generateDietSuggestions, calculateCalorieNeeds } from '../utils/dietUtils';
import { ChevronDown, ChevronUp, Utensils, Search } from 'lucide-react';
import { initBertModel } from '../utils/bertUtils';

const DietPage: React.FC = () => {
  const { userProfile } = useAppContext();
  const navigate = useNavigate();
  const [dietSuggestions, setDietSuggestions] = useState<DietSuggestion[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [calorieNeeds, setCalorieNeeds] = useState<number>(0);
  const [userPreferences, setUserPreferences] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Initialize BERT model
    const loadModel = async () => {
      const loaded = await initBertModel();
      setModelLoaded(loaded);
    };
    
    loadModel();
  }, []);
  
  useEffect(() => {
    if (!userProfile) {
      navigate('/profile');
      return;
    }
    
    setCalorieNeeds(calculateCalorieNeeds(userProfile));
    
    // Load initial diet suggestions
    const loadSuggestions = async () => {
      setIsLoading(true);
      const suggestions = await generateDietSuggestions(userProfile);
      setDietSuggestions(suggestions);
      setIsLoading(false);
    };
    
    loadSuggestions();
  }, [userProfile, navigate]);
  
  const handleSearch = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    const suggestions = await generateDietSuggestions(userProfile, userPreferences);
    setDietSuggestions(suggestions);
    setIsLoading(false);
  };
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  if (!userProfile) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">Your Diet Suggestions</h1>
      <p className="text-gray-600 mb-6">
        Based on your health profile, we recommend approximately {calorieNeeds} calories per day.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Preferences or Restrictions
            </label>
            <input
              type="text"
              id="preferences"
              value={userPreferences}
              onChange={(e) => setUserPreferences(e.target.value)}
              placeholder="e.g., vegetarian, low carb, high protein, etc."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="md:self-end">
            <button
              onClick={handleSearch}
              disabled={isLoading || !modelLoaded}
              className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-1" />
                  Get Personalized Diet
                </>
              )}
            </button>
          </div>
        </div>
        {!modelLoaded && (
          <p className="text-sm text-yellow-600 mt-2">
            AI model is loading. Basic diet suggestions are available, but personalized recommendations will be enabled soon.
          </p>
        )}
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ) : dietSuggestions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No diet suggestions available. Please update your health profile.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {dietSuggestions.map((diet) => (
            <div key={diet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(diet.id)}
              >
                <div>
                  <h2 className="text-xl font-semibold">{diet.title}</h2>
                  <p className="text-gray-600">{diet.description}</p>
                </div>
                {expandedId === diet.id ? (
                  <ChevronUp className="h-6 w-6 text-gray-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                )}
              </div>
              
              {expandedId === diet.id && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Calories</p>
                      <p className="font-bold">{diet.calories} kcal</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Protein</p>
                      <p className="font-bold">{diet.protein}g</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Carbs</p>
                      <p className="font-bold">{diet.carbs}g</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Fat</p>
                      <p className="font-bold">{diet.fat}g</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Breakfast Options</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {diet.meals.breakfast.map((meal, index) => (
                          <li key={index} className="text-gray-700">{meal}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Lunch Options</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {diet.meals.lunch.map((meal, index) => (
                          <li key={index} className="text-gray-700">{meal}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Dinner Options</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {diet.meals.dinner.map((meal, index) => (
                          <li key={index} className="text-gray-700">{meal}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Snack Options</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {diet.meals.snacks.map((meal, index) => (
                          <li key={index} className="text-gray-700">{meal}</li>
                        ))}
                      </ul>
                    </div>
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

export default DietPage;