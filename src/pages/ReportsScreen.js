import React from 'react';

const ReportsScreen = () => {
  const reports = [
    {
      id: 3,
      message: "xvcgfdgdfg",
      date: "2 years ago"
    },
    {
      id: 2,
      message: "this is abusive reports",
      date: "2 years ago"
    },
    {
      id: 1,
      message: "this is a abusive report",
      date: "2 years ago"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Logo Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center">
          <img 
            src="/api/placeholder/40/40" 
            alt="PetDoc Logo" 
            className="h-10"
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Reports</h1>
        
        {/* Reports Table */}
        <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200">
            <div className="col-span-2 text-gray-700 font-medium">ID</div>
            <div className="col-span-7 text-gray-700 font-medium">Message</div>
            <div className="col-span-3 text-gray-700 font-medium">Date</div>
          </div>
          
          {/* Table Rows */}
          {reports.map((report) => (
            <div 
              key={report.id}
              className="grid grid-cols-12 gap-4 p-4 bg-white border-b border-gray-100 last:border-b-0"
            >
              <div className="col-span-2 text-gray-600">{report.id}</div>
              <div className="col-span-7 text-gray-600">{report.message}</div>
              <div className="col-span-3 text-gray-600">{report.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsScreen;