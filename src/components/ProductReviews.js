import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/product-reviews/product/${productId}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.trim() || rating === 0) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/product-reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review: newReview,
            rating,
            productId,
          }),
        }
      );

      if (response.ok) {
        setNewReview('');
        setRating(0);
        fetchReviews();
      } else if (response.status === 401) {
        alert('You need to login to review a product');
        navigate('/login'); // Replace history.push with navigate
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editText.trim() || editRating === 0) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/product-reviews/${reviewId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review: editText,
            rating: editRating,
          }),
        }
      );

      if (response.ok) {
        setIsEditing(null);
        fetchReviews();
      } else if (response.status === 401) {
        alert('You need to login to review a product');
        navigate('/login'); // Replace history.push with navigate
      }
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/product-reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchReviews();
      } else if (response.status === 401) {
        alert('You need to login to review a product');
        navigate('/login'); // Replace history.push with navigate
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const StarRating = ({ value, hoverValue, onRatingChange, onHoverChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="focus:outline-none"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => onHoverChange(star)}
          onMouseLeave={() => onHoverChange(0)}
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hoverValue || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Write a Review</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <StarRating
              value={rating}
              hoverValue={hoverRating}
              onRatingChange={setRating}
              onHoverChange={setHoverRating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows="3"
              placeholder="Write your review..."
            />
          </div>
          <button
            onClick={handleSubmitReview}
            disabled={!newReview.trim() || rating === 0}
            className="w-full py-2 bg-yellow-400 text-white rounded-lg font-medium disabled:opacity-50"
          >
            Submit Review
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg p-4 shadow-sm">
                {isEditing === review.id ? (
                  <div className="space-y-4">
                    <StarRating
                      value={editRating}
                      hoverValue={0}
                      onRatingChange={setEditRating}
                      onHoverChange={() => {}}
                    />
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateReview(review.id)}
                        className="px-4 py-2 bg-yellow-400 text-white rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(review.id);
                            setEditText(review.review);
                            setEditRating(review.rating);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.review}</p>
                    <div className="mt-2 text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;