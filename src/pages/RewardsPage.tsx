import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Award, Check, AlertCircle } from 'lucide-react';

const RewardsPage: React.FC = () => {
  const { rewards, points, usePoints } = useAppContext();
  const [redeemSuccess, setRedeemSuccess] = React.useState<string | null>(null);
  const [redeemError, setRedeemError] = React.useState<string | null>(null);
  
  const handleRedeem = (rewardId: string, pointsCost: number) => {
    setRedeemSuccess(null);
    setRedeemError(null);
    
    const success = usePoints(pointsCost);
    
    if (success) {
      const reward = rewards.find(r => r.id === rewardId);
      setRedeemSuccess(`You've successfully redeemed ${reward?.name}! Your discount code is HEALTH${reward?.id}${Date.now().toString().slice(-4)}`);
    } else {
      setRedeemError("You don't have enough points to redeem this reward.");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rewards</h1>
        <div className="bg-yellow-100 px-4 py-2 rounded-full flex items-center">
          <Award className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="font-medium text-yellow-700">{points} points available</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">How to Earn Points</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Take Your Medications</h3>
              <p className="text-gray-600">Earn 5 points each time you mark a medication as taken.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Consistent Usage</h3>
              <p className="text-gray-600">Earn bonus points for using the app consistently.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Complete Your Profile</h3>
              <p className="text-gray-600">Keep your health profile up to date to earn additional points.</p>
            </div>
          </div>
        </div>
      </div>
      
      {(redeemSuccess || redeemError) && (
        <div className={`mb-6 p-4 rounded-md ${redeemSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <div className="flex items-center">
            {redeemSuccess ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <p>{redeemSuccess || redeemError}</p>
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={reward.image} 
              alt={reward.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{reward.name}</h3>
              <p className="text-gray-600 mb-4">{reward.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-yellow-600">{reward.pointsCost} points</span>
                <button
                  onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                  disabled={points < reward.pointsCost}
                  className={`px-4 py-2 rounded-md ${
                    points >= reward.pointsCost
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition`}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;