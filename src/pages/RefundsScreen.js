import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';

const RefundsScreen = () => {
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://pawsome.soluzent.com/api/refunds', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRefunds(response.data);
      } catch (error) {
        console.error('Error fetching refunds:', error);
      }
    };

    fetchRefunds();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Logo Header */}
      {/* <div className="border-b border-gray-200 p-4">
        <img
          src="/api/placeholder/40/40"
          alt="PetDoc Logo"
          className="h-10"
        />
      </div> */}
      <Header />

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Refunds</h1>

        {/* Refunds Table */}
        <div className="shadow-sm rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b border-gray-200">
            <div className="text-gray-700 font-medium">ID</div>
            <div className="text-gray-700 font-medium">Refund Reason</div>
          </div>

          {/* Table Rows */}
          {refunds.map((refund) => (
            <div key={refund.id} className="grid grid-cols-2 gap-4 p-4 bg-white">
              <div className="text-gray-600">{refund.id}</div>
              <div className="text-gray-600">{refund.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefundsScreen;