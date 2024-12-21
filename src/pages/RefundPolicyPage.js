import React from 'react';
import Header from '../components/Header';

const RefundPolicyPage = () => {
  const policies = [
    {
      title: "Return Policy",
      content: "Our vendor return policy ensures that you can return products within 30 days of purchase if they are damaged or not as described."
    },
    {
      title: "Return Policy",
      content: "Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      title: "Return Policy",
      content: "Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veni."
    },
    {
      title: "Return Policy",
      content: "Dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      title: "Custom Orders Policy",
      content: ""
    }
  ];

  return (
    <div className="min-h-screen bg-white px-4 pt-8 pb-20">
      {/* Main Header */}
      <Header />
      <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-12">
        Refund Policy
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

export default RefundPolicyPage;