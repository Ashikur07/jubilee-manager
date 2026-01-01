'use client';

import { useEffect, useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <MobileLayout title="Dashboard">
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 text-sm font-medium">Fetching Financial Data...</p>
      </div>
    </MobileLayout>
  );

  // Chart Data Preparation
  const chartData = [
    { name: 'Batch', value: data.summary.batch, color: '#3B82F6' }, // Blue
    { name: 'External', value: data.summary.external, color: '#10B981' }, // Emerald
    { name: 'Registration', value: data.summary.regTotal || 0, color: '#F59E0B' }, // Amber
  ];

  return (
    <MobileLayout title="Overview">
      
      {/* 1. Hero Card: Glassmorphism + Gradient */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 overflow-hidden mb-8">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 text-center">
          <p className="text-indigo-100 text-xs font-medium uppercase tracking-widest mb-1">Total Balance</p>
          <h1 className="text-4xl font-extrabold mb-1 tracking-tight">
            ৳ {data.summary.total.toLocaleString()}
          </h1>
          <p className="text-indigo-200 text-xs">Updated just now</p>
        </div>
      </div>

      {/* 2. Visual Breakdown (Chart) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-gray-800 font-bold text-lg">Fund Source</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value) => `৳ ${value.toLocaleString()}`}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="flex gap-4 mt-2 justify-center w-full">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">{item.name}</span>
                  <span className="text-xs font-bold text-gray-700">{(item.value / data.summary.total * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Account Stats Grid */}
      <div className="mb-8">
        <h3 className="text-gray-800 font-bold text-lg mb-4 px-2">Accounts</h3>
        <div className="grid grid-cols-2 gap-3">
          {data.accountStats.map((acc, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-28">
              <div className="bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium truncate">{acc._id || 'Unknown'}</p>
                <p className="text-gray-900 font-bold text-sm">৳ {acc.total.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Top Contributors List */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-gray-800 font-bold text-lg">Top Heroes</h3>
          <button className="text-blue-600 text-xs font-bold">View All</button>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2">
          {data.topContributors.map((person, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                  idx === 1 ? 'bg-gray-100 text-gray-700' : 
                  idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{person.name}</h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {person.sourceType === 'BATCH' ? person.batchName : 'External Sponsor'}
                  </p>
                </div>
              </div>
              <span className="font-bold text-gray-800 text-sm">৳{person.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

    </MobileLayout>
  );
}