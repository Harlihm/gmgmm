import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi';
// import { config } from '~/components/providers/WagmiProvider';
import sdk, { type Context } from '@farcaster/frame-sdk';
import Image from 'next/image';

type UserWithPfp = {
  pfpUrl?: string;
  pfp?: { url?: string };
  profileImageUrl?: string;
  avatar?: string;
  profile?: { imageUrl?: string; avatar?: string };
};

const gmgm = "0x6C1B2176d4a2eF26024c896D93f86619C5E0cE5d";






export default function App() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  
  const [context, setContext] = useState<Context.FrameContext>();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [fid, setFid] = useState<number | null>(null);
  const [score] = useState<number | null>(null);
  const [eligible] = useState<number>(0);
  
  const [profile, setProfile] = useState({
    username: 'user.eth',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  });



  // Load frame SDK and context
  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  // Update profile when connected and context is available
  useEffect(() => {
    if (isConnected && context?.user) {
      const user = context.user;
      console.log('User context:', user); // Debug log
      
      // Try different possible PFP properties
      const userWithPfp = user as UserWithPfp;
      const pfpUrl = userWithPfp.pfpUrl || 
                    userWithPfp.pfp?.url || 
                    userWithPfp.profileImageUrl || 
                    userWithPfp.avatar || 
                    userWithPfp.profile?.imageUrl ||
                    userWithPfp.profile?.avatar;
      
      console.log('PFP URL:', pfpUrl); // Debug log 
      
      setProfile({
        username: user.displayName || user.username || 'user.eth',
        avatar: pfpUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      });
      if (user.fid) {
        setFid(user.fid as number);
      }
    } else if (!isConnected) {
      setProfile({
        username: 'user.eth',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      });
      setFid(null);
    }
  }, [isConnected, context]);

  const handleConnectFarcaster = async () => {
    try {
      if (isConnected) {
        disconnect();
        return;
      }
      const preferredConnector = connectors?.[0];
      if (preferredConnector) {
        await connectAsync({ connector: preferredConnector });
      } else {
        console.warn('No wallet connectors available');
      }
    } catch (error) {
      console.error('Failed to connect/disconnect:', error);
    }
  };

  const handleSayGM = async () => {
    try {
      if (!isConnected) {
        alert('Please connect your wallet first');
        return;
      }

      console.log('Saying GM to blockchain...');
      
      // Call the sayGM function on the smart contract
      const hash = await writeContractAsync({
        address: gmgm as `0x${string}`,
        abi: [
          {
            "inputs": [],
            "name": "sayGM",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'sayGM',
      });

      console.log('GM transaction hash:', hash);
      alert(`GM sent to blockchain! Transaction: ${hash}`);
    } catch (error) {
      console.error('Failed to say GM:', error);
      alert('Failed to say GM. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Timer Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">gmgmm onchain</h2>
          </div>

        
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Profile</h2>
          <div className="flex items-center space-x-4">
            <Image 
              src={profile.avatar} 
              alt="avatar" 
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-4 border-purple-200 dark:border-purple-800"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800 dark:text-white">{profile.username}</p>
              <p className={`text-sm ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isConnected ? '🟢 Connected' : '🔴 Not Connected'}
              </p>
              {address && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              )}
              {context?.user?.fid && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  FID: {context.user.fid}
                </p>
              )}
              {fid && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Neynar FID: {fid}
                </p>
              )}
              {score !== null && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Score: {score}
                </p>
              )}
              {eligible > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  Eligible: {eligible} tokens
                </p>
              )}
            </div>
            <button 
              onClick={handleConnectFarcaster}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                isConnected 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>

        {/* GM Button Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Say GM</h2>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Click the button below to say &quot;gm&quot; to the blockchain!
            </p>
            <button
              onClick={handleSayGM}
              disabled={!isConnected}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                isConnected
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isConnected ? '🚀 Say GM' : 'Connect Wallet to GM'}
            </button>
            {isConnected && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This will write &quot;gm&quot; to the blockchain
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
