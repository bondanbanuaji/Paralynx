import React, { useState, useEffect } from 'react';
import { getCpuInfo } from '../utils/parallel';

const SystemInfo = () => {
  const [cpuInfo, setCpuInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCpuInfo = async () => {
      try {
        setIsLoading(true);
        // Simulate a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 100));
        const info = getCpuInfo();
        setCpuInfo(info);
      } catch (error) {
        console.error('Error loading CPU info:', error);
        setCpuInfo({
          cores: 'Unknown',
          optimalWorkers: 'Unknown',
          info: 'Could not detect CPU information'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCpuInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
          <p className="text-blue-800 dark:text-blue-200">Detecting system information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
              <p className="text-gray-600 dark:text-gray-300">CPU Cores Detected</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{cpuInfo?.cores}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border">
              <p className="text-gray-600 dark:text-gray-300">Optimal Workers</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{cpuInfo?.optimalWorkers}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border md:col-span-2">
              <p className="text-gray-600 dark:text-gray-300">Parallel Processing</p>
              <p className="text-gray-800 dark:text-white">{cpuInfo?.info}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-800/30 rounded text-sm">
            <p className="text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Note:</span> Parallel processing uses Web Workers to distribute 
              computation across multiple CPU cores, significantly improving performance for large datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;