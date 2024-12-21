import React, { useState } from 'react';
import Header from '../components/Header';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We have a flexible return policy. If you're not satisfied with your purchase, you can return most items within 30 days for a full refund or exchange. Please review our Return Policy for more details."
    },
    {
      question: "Can I track my order?",
      answer: ""
    },
    {
      question: "How long will it take to receive my order?",
      answer: ""
    },
    {
      question: "What payment methods do you accept?",
      answer: ""
    },
    {
      question: "How can I place an order?",
      answer: ""
    },
    {
      question: "How long will it take to receive my order?",
      answer: ""
    },
    {
      question: "How long will it take to receive my order?",
      answer: ""
    },
    {
      question: "How long will it take to receive my order?",
      answer: ""
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 pt-8 pb-20">
      {/* Header */}
      <Header />
      <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-8">
        FAQs
      </h1>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex justify-between items-center p-6 text-left"
            >
              <span className="text-[#1a1a1a] text-lg font-medium">
                {faq.question}
              </span>
              <span className="text-2xl ml-4">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            
            {openIndex === index && faq.answer && (
              <div className="px-6 pb-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;