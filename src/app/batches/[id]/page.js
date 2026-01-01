'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MobileLayout from '@/components/MobileLayout';

export default function BatchDetails() {
  const params = useParams();
  const batchId = decodeURIComponent(params.id);
  
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('/api/stats/details')
      .then(res => res.json())
      .then(data => {
        let filtered = [];
        
        if (batchId === 'External Sponsors') {
          filtered = data.filter(item => item.sourceType === 'EXTERNAL');
        } else {
          filtered = data.filter(item => item.batchName === batchId);
        }

        setDetails(filtered);
        // Total calculation includes everything visible in the list
        setTotal(filtered.reduce((sum, item) => sum + item.amount, 0));
        setLoading(false);
      });
  }, [batchId]);

  return (
    <MobileLayout title={batchId} showBack={true}>
      
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg shadow-blue-200 text-center mb-6 text-white">
        <p className="text-blue-100 text-xs uppercase tracking-widest font-bold">Total Collection</p>
        <h2 className="text-3xl font-extrabold mt-2">
          {loading ? '...' : `৳ ${total.toLocaleString()}`}
        </h2>
        <div className="mt-3 inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-bold border border-white/30">
          {details.length} Entries
        </div>
      </div>

      {/* Contributors List */}
      <div className="space-y-3 pb-10">
        <h3 className="text-gray-500 font-bold text-sm px-2 uppercase tracking-wide">Breakdown</h3>
        
        {loading ? (
           <div className="text-center py-10 text-gray-400">Loading details...</div>
        ) : (
          details.map((item, idx) => (
            <div key={idx} className={`bg-white p-4 rounded-2xl shadow-sm border flex justify-between items-center ${
              // Highlight "Collective Total" or big amounts specially
              item.name.toLowerCase().includes('total') 
                ? 'border-orange-200 bg-orange-50' 
                : 'border-gray-50'
            }`}>
              <div>
                <h4 className={`font-bold text-sm ${item.name.toLowerCase().includes('total') ? 'text-orange-700' : 'text-gray-800'}`}>
                  {item.name}
                </h4>
                <div className="flex gap-2 mt-1">
                    {item.paymentMethod && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                        {item.paymentMethod}
                      </span>
                    )}
                </div>
              </div>
              <div className="text-right">
                <span className={`block font-bold ${item.name.toLowerCase().includes('total') ? 'text-orange-700' : 'text-gray-800'}`}>
                  ৳{item.amount.toLocaleString()}
                </span>
                {item.receivedBy && (
                  <span className="text-[10px] text-gray-400 block max-w-[100px] truncate ml-auto">
                    {item.receivedBy}
                  </span>
                )}
              </div>
            </div>
          ))
        )}

        {!loading && details.length === 0 && (
            <div className="text-center text-gray-400 py-10">No records found.</div>
        )}
      </div>
    </MobileLayout>
  );
}