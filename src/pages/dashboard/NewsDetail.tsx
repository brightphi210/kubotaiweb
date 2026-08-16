import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiArrowLeft, FiHeart, FiShare2, FiX } from 'react-icons/fi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingOverlay from '../../components/LoadingOverlay';

import { useLikePost, usePostComment } from '../../hooks/mutations/allMutation';
import { useGetSingleNewsComment } from '../../hooks/queries/allQueries';

interface NewsDetailProps {
  id?: string;
}

interface Comment {
  id: string;
  word: string;
  created_at: string;
  owner: {
    username: string;
    profile?: {
      image?: string;
    };
  };
}

const NewsDetail: React.FC<NewsDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ word: '' });
  const [commentErrors, setCommentErrors] = useState<{ [key: string]: string }>({});

  // Get news data from location state or fetch if needed
  const newsData = location.state?.newsData;

  // Use actual hooks
  const { getSingleNewsComment: commentsData, isLoading: commentsLoading, refetch: refetchComments } =
    useGetSingleNewsComment(newsData?.id);
  const { mutate: commentMutate, isPending: commentMutating } =
    usePostComment(newsData?.id);
  const { mutate: likeMutate, isPending: likeMutating } =
    useLikePost(newsData?.id);

  useEffect(() => {
    if (!newsData) {
      console.log('Fetching news with ID:', id);
    } else {
      setComments(commentsData?.data || []);
      setLikesCount(newsData.likes_count || 0);
    }
  }, [id, newsData, commentsData]);


  const validateCommentForm = () => {
    const errors: { [key: string]: string } = {};

    if (!commentForm.word || commentForm.word.trim() === '') {
      errors.word = 'Comment cannot be empty';
    } else if (commentForm.word.trim().length < 1) {
      errors.word = 'Comment must have at least 1 character';
    }

    setCommentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── SUBMIT COMMENT ───
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCommentForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('word', commentForm.word);

    commentMutate(formData, {
      onSuccess: () => {
        toast.success('Comment added successfully!');
        setCommentForm({ word: '' });
        setCommentErrors({});
        setIsModalVisible(false);
        refetchComments?.();
      },
      onError: (error: any) => {
        console.error('Comment error:', error);
        let errorMessage = 'Failed to add comment. Please try again.';

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    });
  };

  const handleCancel = () => {
    setCommentForm({ word: '' });
    setCommentErrors({});
    setIsModalVisible(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsData?.title,
        text: newsData?.description || newsData?.title,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // ─── LIKE HANDLER ───
  const handleLike = async () => {
    if (likeMutating) return;

    likeMutate(undefined, {
      onSuccess: () => {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        toast.success(liked ? 'Post unliked!' : 'Post liked!');
      },
      onError: (error: any) => {
        console.error('Like error:', error);
        let errorMessage = 'Failed to like post. Please try again.';

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    });
  };

  if (!newsData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4">No news data available</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl bg-[#FBC607] text-black font-bold hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .slide-down { animation: slide-down 0.4s ease both; }
        .fade-in { animation: fade-in 0.3s ease both; }
        .slide-up { animation: slide-up 0.3s ease both; }
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .dm-mono { font-family: 'DM Mono', monospace; }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1.25rem;
          animation: fade-in 0.3s ease both;
        }

        .modal-content {
          background: white;
          border-radius: 1.5rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: slide-up 0.3s ease both;
        }

        .fab-button {
          position: fixed;
          bottom: 100px;
          right: 1.5rem;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: #FBC607;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(251, 198, 7, 0.4);
          transition: all 0.3s ease;
          z-index: 40;
          border: none;
          animation: slide-up 0.4s ease both;
        }

        .fab-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(251, 198, 7, 0.6);
        }

        .fab-button:active {
          transform: scale(0.95);
        }

        .fab-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .fab-button {
            bottom: 120px;
            right: 1rem;
            width: 56px;
            height: 56px;
          }
        }
      `}</style>

      <LoadingOverlay visible={commentsLoading || likeMutating || commentMutating} />

      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white dm-sans">
        {/* ─── Header with Back & Share ─── */}
        <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center hover:bg-white/[0.12] transition-all duration-200"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.15] flex items-center justify-center hover:bg-white/[0.12] transition-all duration-200"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="max-w-3xl mx-auto px-5 py-8 slide-down pb-40">
          {/* ─── Featured Image ─── */}
          {newsData.image_url && (
            <div className="relative h-80 rounded-2xl overflow-hidden mb-8 bg-[#C9A876]">
              <img
                src={newsData.image_url}
                alt={newsData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          {/* ─── Title ─── */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {newsData.title}
          </h1>

          {/* ─── Meta Info ─── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-8 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A876] flex items-center justify-center text-sm font-bold">
                {newsData.author?.charAt(0).toUpperCase() || 'K'}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {newsData.author || 'Kubot'}
                </p>
                <p className="text-xs text-white/40">
                  {new Date(newsData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* ─── Like Button ─── */}
            <button
              onClick={handleLike}
              disabled={likeMutating}
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${liked
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/[0.05] text-white/60 border border-white/10 hover:bg-white/[0.08]'
                } ${likeMutating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {likeMutating ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiHeart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              )}
              <span className="text-sm font-medium">{likesCount || newsData.likes_count || 0}</span>
            </button>
          </div>

          {/* ─── Article Content ─── */}
          <div className="prose prose-invert max-w-none mb-12">
            {/* Description/Excerpt */}
            {newsData.description && (
              <p className="text-lg text-white/80 leading-relaxed mb-6 italic">
                {newsData.description}
              </p>
            )}

            {/* Content - Handle if it's HTML or plain text */}
            {newsData.content ? (
              <div
                className="text-white/70 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: newsData.content.replace(/\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>')
                }}
              />
            ) : (
              // Default content if no content provided
              <div className="text-white/70 leading-relaxed space-y-4">
                <p>
                  As blockchain technology matures, only projects that deliver real value,
                  practical use cases, and scalable adoption will endure. Kubot AI and the KU
                  Network are built with a clear mission: to create the world's most accessible
                  AI-powered crypto ecosystem, driven by utility, transparency, and global inclusion.
                </p>

                <p>
                  This vision is anchored by the KU Token—designed not for speculation, but for
                  real-world usage across a growing digital economy.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-3">The Future of KU Token: Real-World Utility</h2>
                <p>
                  The KU Token is engineered for active participation within the Kubot AI ecosystem.
                  Its use cases include ecosystem payments, AI automation credits and subscriptions,
                  marketplace transactions, governance voting, and cross-border micro-payments and
                  remittances. As AI automation becomes central to global productivity, KU functions
                  as digital fuel—powering transactions of knowledge, creativity, and value across borders.
                </p>

                <h2 className="text-xl font-bold mt-6 mb-3">Accelerating Global Adoption</h2>
                <p>
                  Earlier Web3 projects struggled with slow adoption due to complexity, high costs,
                  and limited education. Kubot AI removes these barriers through electricity-free
                  mining, mobile-first onboarding, AI guided user education, and reward-based
                  participation. By eliminating cost and technical friction, the KU Network accelerates
                  adoption, particularly across emerging markets where innovation is driven by necessity.
                </p>

                <p className="text-white/50 italic text-sm">
                  AI as the Backbone of Mass Adoption...
                </p>
              </div>
            )}
          </div>

          {/* ─── Comments Section ─── */}
          <div className="border-t border-white/[0.08] pt-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Comments <span className="text-white/50 text-lg">({comments.length})</span>
            </h2>

            {commentsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-2 border-[#FBC607] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="pb-4 border-b border-white/[0.05] last:border-b-0">
                    <div className="flex items-center gap-3 mb-3">
                      {comment.owner.profile?.image ? (
                        <img
                          src={comment.owner.profile.image}
                          alt={comment.owner.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#C9A876] flex items-center justify-center text-xs font-bold">
                          {comment.owner.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">@{comment.owner.username}</p>
                      </div>
                      <p className="text-xs text-white/40">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {comment.word}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Floating Action Button ─── */}
        <button
          onClick={() => setIsModalVisible(true)}
          disabled={commentMutating}
          className="fab-button"
          title="Add comment"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* ─── Add Comment Modal ─── */}
        {isModalVisible && (
          <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add Comment</h2>
                <button
                  onClick={handleCancel}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmitComment} className="px-6 py-6">
                {/* Comment Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={commentForm.word}
                    onChange={(e) => {
                      setCommentForm({ word: e.target.value });
                      if (commentErrors.word) {
                        setCommentErrors({ ...commentErrors, word: '' });
                      }
                    }}
                    onBlur={() => validateCommentForm()}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBC607] focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                {/* Error Message */}
                {commentErrors.word && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{commentErrors.word}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={commentMutating}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#FBC607] text-black font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {commentMutating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── Bottom Action Bar (with spacing for mobile nav) ─── */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-6 pb-6 px-5 border-t border-white/[0.08] z-30">
          <div className="max-w-3xl mx-auto flex gap-3">
            <button
              onClick={handleLike}
              disabled={likeMutating}
              className={`flex-1 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${liked
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/[0.05] text-white border border-white/10 hover:bg-white/[0.08]'
                } ${likeMutating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {likeMutating ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              )}
              <span>{liked ? 'Liked' : 'Like'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl bg-[#FBC607] text-black font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FiShare2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;