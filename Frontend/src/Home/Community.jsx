import React, { useEffect, useState } from 'react';
import { Users, MessageCircle, Star } from 'lucide-react';

const Community = () => {
  const [poll, setPoll] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pollRes, reviewsRes] = await Promise.all([
          fetch('/api/poll'),
          fetch('/api/reviews'),
        ]);
        const pollData = await pollRes.json();
        const reviewsData = await reviewsRes.json();
        setPoll(pollData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching community data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 text-white">Loading Community Hub...</div>;

  const totalVotes = poll?.options.reduce((acc, o) => acc + o.votes, 0);

  return (
    <div>
      <section className="space-y-6">
        <h2 className="text-4xl font-bold flex items-center gap-3">
          <Users className="text-pink-400" /> Community Hub
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Weekly Poll */}
          <div className="bg-gray-900 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="text-pink-400" />
              Weekly Poll
            </h3>
            <h4 className="text-xl font-semibold mb-4">{poll?.question}</h4>
            <div className="space-y-3">
              {poll?.options.map((option, idx) => {
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                return (
                  <div key={idx} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      <span className="text-pink-400 font-bold">{percentage}%</span>
                    </div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-gray-900 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-yellow-400" />
              Recent Reviews
            </h3>
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: review.avatarColor }}></div>
                    <span className="font-semibold">{review.user}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Community;
