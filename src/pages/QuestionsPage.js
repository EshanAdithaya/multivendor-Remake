import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

const QuestionsPage = () => {
  const questions = [
    {
      id: 1,
      product: "Stick snacks",
      currentPrice: 2.40,
      originalPrice: 3.00,
      question: "Does it have preservatives?",
      answer: "No, this one does not have any preservatives",
      date: "18 March, 2022",
      likes: 0,
      dislikes: 0,
      image: "/api/placeholder/60/60"
    },
    {
      id: 2,
      product: "Stick snacks",
      currentPrice: 2.40,
      originalPrice: 3.00,
      question: "Does it have preservatives?",
      answer: "No, this one does not have any preservatives",
      date: "18 March, 2022",
      likes: 0,
      dislikes: 0,
      image: "/api/placeholder/60/60"
    },
    {
      id: 3,
      product: "Wonderful Pomegranate Juice, 300 ml",
      currentPrice: 2.40,
      originalPrice: 3.00,
      image: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <img src="/api/placeholder/40/40" alt="PetDoc Logo" className="w-10 h-10" />
          <span className="ml-2 text-xl font-semibold text-gray-700">PetDoc</span>
        </div>
      </div>

      {/* Questions Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Questions</h1>
      </div>

      {/* Questions List */}
      <div className="px-4 space-y-4">
        {questions.map((item) => (
          <Card key={item.id} className="p-4 rounded-xl shadow-sm">
            <div className="flex space-x-4">
              {/* Product Image */}
              <div className="rounded-lg w-16 h-16 flex-shrink-0 overflow-hidden">
                <img src={item.image} alt={item.product} className="w-full h-full object-cover" />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{item.product}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg font-semibold">${item.currentPrice.toFixed(2)}</span>
                  <span className="text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                </div>

                {item.question && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">Q: {item.question}</p>
                    <p className="mt-2 text-gray-700">A: {item.answer}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-gray-400">Date: {item.date}</span>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-400">
                          <ThumbsUp className="w-5 h-5 mr-1" />
                          <span>{item.likes}</span>
                        </button>
                        <button className="flex items-center text-gray-400">
                          <ThumbsDown className="w-5 h-5 mr-1" />
                          <span>{item.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center">
        {/* Navigation items would go here */}
      </div>
    </div>
  );
};

export default QuestionsPage;