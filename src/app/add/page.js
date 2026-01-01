'use client';

import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; 

export default function AddTransactionPage() {
  const router = useRouter();
  
  // 1. Transaction Type State
  const [transType, setTransType] = useState('INCOME'); 
  
  // 2. Income Category State
  const [activeTab, setActiveTab] = useState('BATCH'); 
  
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    amount: '', // Amount will be string initially to handle decimals properly in input
    paymentMethod: 'Bank Transfer', 
    receivedBy: 'Alumni Account',
    receiptNo: '',
    currentResidence: '',
    batchName: '', // Dropdown
    reference: '',
    regSource: 'SSL', 
  });

  // --- LISTS FOR DROPDOWNS ---
  const batchList = Array.from({ length: 25 }, (_, i) => `Batch ${i + 1}`);
  const paymentMethods = ["Bank Transfer", "Hand Cash", "Bkash", "Nagad"];
  const receivers = [
    "Alumni Account",
    "Tarek H A Mahmud",
    "Chairman Account",
    "Jashim Uddin"
  ];

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Amount validation (allow numbers and one dot)
    if (name === 'amount') {
      // Regex to allow positive decimal numbers
      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (transType === 'INCOME') {
      
      // Parse Amount carefully
      const floatAmount = parseFloat(formData.amount);
      
      if (isNaN(floatAmount) || floatAmount <= 0) {
        Swal.fire({
          title: 'Invalid Amount',
          text: 'Please enter a valid amount greater than 0.',
          icon: 'warning',
          confirmButtonColor: '#F59E0B',
          customClass: { popup: 'rounded-3xl' }
        });
        setLoading(false);
        return;
      }

      const payload = {
        sourceType: activeTab,
        name: activeTab === 'REGISTRATION' ? `Reg via ${formData.regSource}` : formData.name, 
        amount: floatAmount, // Send as Number
        paymentMethod: formData.paymentMethod,
        receivedBy: formData.receivedBy,
        receiptNo: formData.receiptNo,
        date: new Date(),
      };

      if (activeTab === 'BATCH') {
        if(!formData.batchName) {
           Swal.fire({ title: 'Batch Required', text: 'Please select a Batch.', icon: 'warning', customClass: { popup: 'rounded-3xl' } });
           setLoading(false);
           return;
        }
        payload.batchName = formData.batchName; 
        payload.currentResidence = formData.currentResidence;
      } else if (activeTab === 'EXTERNAL') {
        payload.reference = formData.reference;
      } else if (activeTab === 'REGISTRATION') {
        payload.regSource = formData.regSource;
      }

      try {
        const res = await fetch('/api/incomes/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          Swal.fire({
            title: 'Success!',
            text: 'Income added successfully 🎉',
            icon: 'success',
            confirmButtonColor: '#4F46E5',
            confirmButtonText: 'Great!',
            customClass: { popup: 'rounded-3xl', confirmButton: 'rounded-xl px-6 py-2 font-bold' }
          }).then(() => {
            setFormData({ 
              ...formData, 
              name: '', 
              amount: '', 
              receiptNo: '',
              batchName: '' 
            }); 
            router.refresh();
            router.push('/'); 
          });
        } else {
          Swal.fire({
            title: 'Oops...',
            text: 'Failed to add. Please try again.',
            icon: 'error',
            confirmButtonColor: '#EF4444',
            customClass: { popup: 'rounded-3xl' }
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Server Error.',
          icon: 'error',
          confirmButtonColor: '#EF4444',
          customClass: { popup: 'rounded-3xl' }
        });
      } finally {
        setLoading(false);
      }
    } else {
      Swal.fire({
        title: 'Coming Soon!',
        text: 'Expense tracking is under development.',
        icon: 'info',
        confirmButtonColor: '#EF4444',
        customClass: { popup: 'rounded-3xl' }
      });
      setLoading(false);
    }
  };

  return (
    <MobileLayout title="New Transaction" showBack={true}>
      
      {/* Toggle Type */}
      <div className="flex bg-gray-200 p-1 rounded-2xl mb-6">
        <button
          onClick={() => setTransType('INCOME')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            transType === 'INCOME' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
          Income
        </button>
        <button
          onClick={() => setTransType('EXPENSE')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            transType === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
          Expense
        </button>
      </div>

      {transType === 'INCOME' ? (
        <>
          {/* Sub-Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {['BATCH', 'EXTERNAL', 'REGISTRATION'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
              >
                {tab === 'EXTERNAL' ? 'Sponsor' : tab}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Field */}
              {activeTab !== 'REGISTRATION' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    {activeTab === 'BATCH' ? 'Member Name' : 'Sponsor Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Type Name..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Amount Field (Improved for Decimal) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Amount (BDT)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold">৳</span>
                  <input
                    type="text" // Input type 'text' to allow control over decimal input
                    inputMode="decimal" // Mobile keyboard will show numbers + dot
                    name="amount"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* --- BATCH DROPDOWN & DYNAMIC FIELDS --- */}
              {activeTab === 'BATCH' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Batch No.</label>
                    <div className="relative">
                      <select
                        name="batchName"
                        required
                        value={formData.batchName}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none appearance-none"
                      >
                        <option value="" disabled>Select Batch</option>
                        {batchList.map(batch => (
                          <option key={batch} value={batch}>{batch}</option>
                        ))}
                      </select>
                      {/* Arrow Icon */}
                      <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Country</label>
                    <input
                      type="text"
                      name="currentResidence"
                      value={formData.currentResidence}
                      onChange={handleChange}
                      placeholder="e.g. BD"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'EXTERNAL' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Reference By</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="Reference Name"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              )}

              {activeTab === 'REGISTRATION' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Reg Source</label>
                  <select
                    name="regSource"
                    value={formData.regSource}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none"
                  >
                    <option value="SSL">SSL Commerz (Online)</option>
                    <option value="ICTAA">ICTAA Office (Offline)</option>
                  </select>
                </div>
              )}

              {/* Payment & Receiver Dropdowns */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Payment Method</label>
                  <div className="relative">
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none appearance-none"
                    >
                      {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Received By</label>
                  <div className="relative">
                    <select
                      name="receivedBy"
                      value={formData.receivedBy}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none appearance-none"
                    >
                      {receivers.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Receipt / Trx ID</label>
                <input
                  type="text"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-200'
                }`}
              >
                {loading ? 'Processing...' : 'Save Income'}
              </button>
            </form>
          </div>
        </>
      ) : (
        // Expense Placeholder
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
           <div className="bg-red-50 p-6 rounded-full mb-4">
             <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
           </div>
           <h3 className="text-gray-800 font-bold">Expense Feature</h3>
           <p className="text-sm text-gray-500 mt-1">Coming soon...</p>
        </div>
      )}

    </MobileLayout>
  );
}