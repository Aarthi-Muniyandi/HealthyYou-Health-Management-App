import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile, Medication, Reward } from '../types';

interface AppContextType {
  userProfile: UserProfile | null;
  medications: Medication[];
  rewards: Reward[];
  points: number;
  updateUserProfile: (profile: UserProfile) => void;
  addMedication: (medication: Medication) => void;
  updateMedication: (id: string, medication: Medication) => void;
  deleteMedication: (id: string) => void;
  markMedicationTaken: (id: string, date: string, timeIndex: number) => void;
  addPoints: (amount: number) => void;
  usePoints: (amount: number) => boolean;
}

const defaultContext: AppContextType = {
  userProfile: null,
  medications: [],
  rewards: [],
  points: 0,
  updateUserProfile: () => {},
  addMedication: () => {},
  updateMedication: () => {},
  deleteMedication: () => {},
  markMedicationTaken: () => {},
  addPoints: () => {},
  usePoints: () => false,
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const [rewards] = useState<Reward[]>([
    {
      id: '1',
      name: 'Basic Discount',
      description: '10% off on your next medicine purchase',
      pointsCost: 100,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Silver Discount',
      description: '25% off on your next medicine purchase',
      pointsCost: 250,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'Gold Discount',
      description: '50% off on your next medicine purchase',
      pointsCost: 500,
      discount: 50,
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        
        // Load user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPoints(userData.points || 0);
            
            // Load profile if exists
            const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
            if (profileDoc.exists()) {
              setUserProfile(profileDoc.data() as UserProfile);
            }
            
            // Load medications
            const medsDoc = await getDoc(doc(db, 'medications', user.uid));
            if (medsDoc.exists()) {
              setMedications(medsDoc.data().medications || []);
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // User is signed out
        setUserId(null);
        setUserProfile(null);
        setMedications([]);
        setPoints(0);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Save data to Firestore when it changes
  useEffect(() => {
    const saveData = async () => {
      if (userId && userProfile) {
        try {
          await setDoc(doc(db, 'profiles', userId), userProfile);
        } catch (error) {
          console.error('Error saving profile:', error);
        }
      }
    };
    
    if (userProfile) {
      saveData();
    }
  }, [userProfile, userId]);

  useEffect(() => {
    const saveData = async () => {
      if (userId) {
        try {
          await setDoc(doc(db, 'medications', userId), { medications });
        } catch (error) {
          console.error('Error saving medications:', error);
        }
      }
    };
    
    if (userId) {
      saveData();
    }
  }, [medications, userId]);

  useEffect(() => {
    const saveData = async () => {
      if (userId) {
        try {
          await updateDoc(doc(db, 'users', userId), { points });
        } catch (error) {
          console.error('Error saving points:', error);
        }
      }
    };
    
    if (userId) {
      saveData();
    }
  }, [points, userId]);

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const addMedication = (medication: Medication) => {
    setMedications(prev => [...prev, medication]);
  };

  const updateMedication = (id: string, medication: Medication) => {
    setMedications(prev => prev.map(med => med.id === id ? medication : med));
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const markMedicationTaken = (id: string, date: string, timeIndex: number) => {
    setMedications(prev => 
      prev.map(med => {
        if (med.id === id) {
          const taken = { ...med.taken };
          if (!taken[date]) {
            taken[date] = med.time.map(() => false);
          }
          taken[date][timeIndex] = true;
          
          // Add points when medication is taken
          addPoints(5);
          
          return { ...med, taken };
        }
        return med;
      })
    );
  };

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const usePoints = (amount: number) => {
    if (points >= amount) {
      setPoints(prev => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        medications,
        rewards,
        points,
        updateUserProfile,
        addMedication,
        updateMedication,
        deleteMedication,
        markMedicationTaken,
        addPoints,
        usePoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};