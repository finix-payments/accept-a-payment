'use client';

import { useState, useEffect } from 'react';

export default function ManagementPage() {
  const [isTestMode, setIsTestMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Test mode credentials
  const [testApiKey, setTestApiKey] = useState('');
  const [testPublishableKey, setTestPublishableKey] = useState('');
  const [testMerchantId, setTestMerchantId] = useState('');
  
  // Live mode credentials
  const [liveApiKey, setLiveApiKey] = useState('');
  const [livePublishableKey, setLivePublishableKey] = useState('');
  const [liveMerchantId, setLiveMerchantId] = useState('');
  
  // Connection status
  const [isTestConnected, setIsTestConnected] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  
  // Load saved configuration on mount
  useEffect(() => {
    // In a production app, you would fetch the configuration from your backend
    // For demo purposes, we'll use localStorage
    const savedConfig = localStorage.getItem('myFiguresConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        
        // Test mode config
        setTestApiKey(config.test?.apiKey || '');
        setTestPublishableKey(config.test?.publishableKey || '');
        setTestMerchantId(config.test?.merchantId || '');
        setIsTestConnected(!!config.test?.connected);
        
        // Live mode config
        setLiveApiKey(config.live?.apiKey || '');
        setLivePublishableKey(config.live?.publishableKey || '');
        setLiveMerchantId(config.live?.merchantId || '');
        setIsLiveConnected(!!config.live?.connected);
        
      } catch (error) {
        console.error('Error loading saved configuration:', error);
      }
    }
  }, []);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // In a production app, you would send this data to your backend
      const mode = isTestMode ? 'test' : 'live';
      const apiKey = isTestMode ? testApiKey : liveApiKey;
      const publishableKey = isTestMode ? testPublishableKey : livePublishableKey;
      const merchantId = isTestMode ? testMerchantId : liveMerchantId;
      
      if (!apiKey || !publishableKey || !merchantId) {
        throw new Error('Please fill in all fields');
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update connection status
      if (isTestMode) {
        setIsTestConnected(true);
      } else {
        setIsLiveConnected(true);
      }
      
      // Save configuration
      const existingConfig = localStorage.getItem('myFiguresConfig');
      const config = existingConfig ? JSON.parse(existingConfig) : {};
      
      config[mode] = {
        apiKey,
        publishableKey,
        merchantId,
        connected: true
      };
      
      localStorage.setItem('myFiguresConfig', JSON.stringify(config));
      
      // Show success message
      setSuccessMessage(`${mode === 'test' ? 'Test' : 'Live'} mode configuration saved successfully`);
      
      // In a production app, you would also notify GHL about the config update
      // await updateGhlConfig(mode, apiKey, publishableKey);
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error saving configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSetDefault = async () => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // In a production app, you would send this to your backend to set as default in GHL
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage('My Figures Payments set as default payment provider');
    } catch (error) {
      console.error('Error setting as default:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error setting as default');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Figures Payments</h1>
            <p className="text-gray-600">Configure your white-label payment provider powered by Finix</p>
          </div>
          
          {/* Mode toggle */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              className={`py-4 px-6 font-medium text-sm ${isTestMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setIsTestMode(true)}
            >
              Test Mode
            </button>
            <button
              type="button"
              className={`py-4 px-6 font-medium text-sm ${!isTestMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setIsTestMode(false)}
            >
              Live Mode
            </button>
          </div>
          
          {/* Status messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{successMessage}</p>
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{errorMessage}</p>
            </div>
          )}
          
          {/* Connection status */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isTestMode ? (isTestConnected ? 'bg-green-500' : 'bg-red-500') : (isLiveConnected ? 'bg-green-500' : 'bg-red-500')}`}></div>
              <span className="text-gray-700">
                {isTestMode ? (isTestConnected ? 'Test mode connected' : 'Test mode not connected') : (isLiveConnected ? 'Live mode connected' : 'Live mode not connected')}
              </span>
            </div>
          </div>
          
          {/* Configuration form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={isTestMode ? testApiKey : liveApiKey}
                  onChange={(e) => isTestMode ? setTestApiKey(e.target.value) : setLiveApiKey(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Finix API key"
                />
              </div>
              
              <div>
                <label htmlFor="publishableKey" className="block text-sm font-medium text-gray-700">
                  Publishable Key
                </label>
                <input
                  type="text"
                  id="publishableKey"
                  value={isTestMode ? testPublishableKey : livePublishableKey}
                  onChange={(e) => isTestMode ? setTestPublishableKey(e.target.value) : setLivePublishableKey(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Finix publishable key"
                />
              </div>
              
              <div>
                <label htmlFor="merchantId" className="block text-sm font-medium text-gray-700">
                  Merchant ID
                </label>
                <input
                  type="text"
                  id="merchantId"
                  value={isTestMode ? testMerchantId : liveMerchantId}
                  onChange={(e) => isTestMode ? setTestMerchantId(e.target.value) : setLiveMerchantId(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your Finix merchant ID"
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Saving...' : 'Save Configuration'}
              </button>
              
              <button
                type="button"
                onClick={handleSetDefault}
                disabled={isLoading || (isTestMode ? !isTestConnected : !isLiveConnected)}
                className={`py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white ${isLoading || (isTestMode ? !isTestConnected : !isLiveConnected) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                Set as Default Payment Provider
              </button>
            </div>
          </form>
          
          {/* Documentation */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900">Documentation</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Getting Started</h3>
                <p className="mt-1 text-sm text-gray-500">
                  To start accepting payments, first configure your API credentials above. Once configured, you can enable test mode to process test payments.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700">Test Cards</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Use the following test cards to simulate different payment scenarios:
                </p>
                <ul className="mt-2 pl-5 text-sm text-gray-500 list-disc space-y-1">
                  <li>4111 1111 1111 1111 - Successful payment</li>
                  <li>4000 0000 0000 0002 - Declined payment</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700">Support</h3>
                <p className="mt-1 text-sm text-gray-500">
                  For support, contact us at support@myfigures.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 