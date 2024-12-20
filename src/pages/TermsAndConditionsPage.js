import React from 'react';

const TermsAndConditionsPage = () => {
  const policies = [
    {
      title: "Return Policy",
      content: "Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      title: "Return Policy",
      content: "Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      title: "Return Policy",
      content: "Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      title: "Return Policy",
      content: "Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      title: "Orders Policy",
      content: ""
    }
  ];

  return (
    <div className="min-h-screen bg-white px-4 pt-8 pb-20">
      {/* Main Header */}
      <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-12">
        Terms and Conditions
      </h1>

      {/* Policy Sections */}
      <div className="space-y-8">
        {policies.map((policy, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">
              {policy.title}
            </h2>
            {policy.content && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {policy.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;