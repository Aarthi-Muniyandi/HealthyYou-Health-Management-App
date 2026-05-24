import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserProfile } from '../types';
import { X, Plus } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<UserProfile>({
    age: 30,
    height: 170,
    weight: 70,
    healthGoal: 'general-health',
    medicalConditions: [],
    allergies: []
  });
  
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  
  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' 
        ? parseInt(value, 10) 
        : value
    }));
  };
  
  const handleAddCondition = () => {
    if (newCondition.trim() && !formData.medicalConditions.includes(newCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  };
  
  const handleRemoveCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter(c => c !== condition)
    }));
  };
  
  const handleAddAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };
  
  const handleRemoveAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    navigate('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Health Profile</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age (years)
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              min="50"
              max="250"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="1"
              max="500"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="healthGoal" className="block text-sm font-medium text-gray-700 mb-1">
              Health Goal
            </label>
            <select
              id="healthGoal"
              name="healthGoal"
              value={formData.healthGoal}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="weight-loss">Weight Loss</option>
              <option value="weight-gain">Weight Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="muscle-building">Muscle Building</option>
              <option value="general-health">General Health</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical Conditions
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.medicalConditions.map((condition, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                <span>{condition}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveCondition(condition)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add a medical condition"
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddCondition}
              className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Examples: Diabetes, Hypertension, Heart Disease, etc.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allergies
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.allergies.map((allergy, index) => (
              <div key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center">
                <span>{allergy}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add an allergy"
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddAllergy}
              className="bg-red-500 text-white px-3 py-2 rounded-r-md hover:bg-red-600 transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Examples: Peanuts, Gluten, Dairy, Shellfish, etc.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;