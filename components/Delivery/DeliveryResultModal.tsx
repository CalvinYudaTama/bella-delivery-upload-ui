'use client';

import React, { useState } from 'react';

export type DeliveryResultModalType = 'accept' | 'reject' | 'approveAll' | null;

interface DeliveryResultModalProps {
  isOpen: boolean;
  type: DeliveryResultModalType;
  onClose: () => void;
  onSubmit: (data: { rating?: number; comment: string; action: 'accept' | 'reject' | 'skip' | 'acceptAll' }) => void;
}

export const DeliveryResultModal: React.FC<DeliveryResultModalProps> = ({
  isOpen,
  type,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showCommentError, setShowCommentError] = useState(false);

  if (!isOpen || !type) return null;

  const handleSubmit = (action: 'accept' | 'reject' | 'skip' | 'acceptAll') => {
    // Accept doesn't require rating anymore
    // Reject validation is handled by button disabled state
    
    onSubmit({
      rating: type === 'accept' ? (rating || 0) : undefined,
      comment: comment.trim(),
      action,
    });

    // Reset form
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setShowCommentError(false);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setShowCommentError(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="delivery-result-modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        style={{
          minHeight: '400px',
          maxHeight: '600px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {type === 'accept' ? (
          // Accept Modal Content
          <div className="flex flex-col h-full">
            {/* Header Row - Close Button and Title */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                alignSelf: 'stretch',
                position: 'relative',
                marginBottom: '8px',
              }}
            >
              <h3
                style={{
                  color: 'var(--333333, #333)',
                  textAlign: 'center',
                  fontFamily: 'Montserrat',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '130%',
                }}
              >
                We are happy you like our work!
              </h3>
              {/* Close Button - Top Right */}
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 0,
                }}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: '#666' }}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2 my-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="31"
                      height="29"
                      viewBox="0 0 31 29"
                      fill="none"
                    >
                      <path
                        d="M15.2168 0L19.4489 10.1751L30.4337 11.0557L22.0644 18.2249L24.6214 28.9443L15.2168 23.2L5.81223 28.9443L8.36919 18.2249L-0.000107765 11.0557L10.9847 10.1751L15.2168 0Z"
                        fill={star <= (hoveredRating || rating) ? '#FFD772' : '#E5E7EB'}
                      />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Comment Input */}
              <div className="mt-6">
                <label
                  style={{
                    color: 'var(--333333, #333)',
                    fontFamily: 'Montserrat',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '150%',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Leave a comment(Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={4}
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '135%',
                  }}
                />
                <style jsx>{`
                  textarea::placeholder {
                    color: var(--Neutral-Dark400, #C1C2C3);
                    font-family: Inter;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 135%;
                  }
                `}</style>
              </div>
            </div>

            {/* Action Buttons - Bottom Right */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  handleSubmit('accept');
                  handleClose();
                }}
                style={{
                  display: 'flex',
                  width: '140px',
                  height: '42px',
                  padding: '10px 24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '6px',
                  border: '1.5px solid #2BC556',
                  background: 'transparent',
                  color: '#2BC556',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  cursor: 'pointer',
                }}
              >
                Approve
              </button>
            </div>
          </div>
        ) : type === 'reject' ? (
          // Reject Modal Content
          <div className="flex flex-col h-full">
            {/* Header Row - Close Button and Title */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                alignSelf: 'stretch',
                position: 'relative',
                marginBottom: '8px',
              }}
            >
              <h3
                style={{
                  color: 'var(--333333, #333)',
                  textAlign: 'center',
                  fontFamily: 'Montserrat',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '130%',
                }}
              >
                We are always listening
              </h3>
              {/* Close Button - Top Right */}
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 0,
                }}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: '#666' }}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              {/* Description Text - Replaces Star Rating */}
              <div className="my-6">
                <p
                  style={{
                    color: 'var(--333333, #333)',
                    fontFamily: 'Montserrat',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '150%',
                    textAlign: 'center',
                  }}
                >
                  Provide us with suggestions for the changes, and our customer service team will assist you.
                </p>
              </div>

              {/* Comment Input */}
              <div className="mt-6">
                <label
                  style={{
                    color: 'var(--333333, #333)',
                    fontFamily: 'Montserrat',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '150%',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Leave a comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    // Hide error message when user starts typing
                    if (showCommentError && e.target.value.trim()) {
                      setShowCommentError(false);
                    }
                  }}
                  placeholder="Share your thoughts: tell us how should we refine this image"
                  className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={4}
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '135%',
                  }}
                />
                <style jsx>{`
                  textarea::placeholder {
                    color: var(--Neutral-Dark400, #C1C2C3);
                    font-family: Inter;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 135%;
                  }
                `}</style>
              </div>
            </div>

            {/* Action Buttons - Bottom Right */}
            <div className="flex flex-col items-end gap-3 mt-6">
              {/* Error message when trying to submit without comment */}
              {showCommentError && (
                <p
                  style={{
                    color: '#D02B20',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '18px',
                    margin: 0,
                    alignSelf: 'flex-end',
                  }}
                >
                  You must leave your comment before submitted
                </p>
              )}
              <button
                onClick={() => {
                  if (comment.trim()) {
                    handleSubmit('reject');
                    handleClose();
                  } else {
                    // Show error message when clicking disabled button
                    setShowCommentError(true);
                  }
                }}
                disabled={!comment.trim()}
                style={{
                  display: 'flex',
                  width: '140px',
                  height: '42px',
                  padding: '10px 24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: comment.trim() ? '#2BC556' : '#C1C2C3',
                  color: '#FFF',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  cursor: comment.trim() ? 'pointer' : 'not-allowed',
                  opacity: comment.trim() ? 1 : 0.6,
                }}
              >
                Submit
              </button>
            </div>
          </div>
        ) : type === 'approveAll' ? (
          // Approve All Modal Content
          <div className="flex flex-col h-full">
            {/* Header Row - Close Button and Title */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                alignSelf: 'stretch',
                position: 'relative',
                marginBottom: '8px',
              }}
            >
              <h3
                style={{
                  color: 'var(--333333, #333)',
                  textAlign: 'center',
                  fontFamily: 'Montserrat',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '130%',
                }}
              >
                You are all set!
              </h3>
              {/* Close Button - Top Right */}
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 0,
                }}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: '#666' }}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              {/* Check Icon */}
              <div className="flex items-center justify-center my-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: '#2BC556',
                    flexShrink: 0,
                    aspectRatio: '1/1',
                  }}
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              {/* Description Text */}
              <div className="my-6">
                <p
                  style={{
                    color: 'var(--333333, #333)',
                    fontFamily: 'Montserrat',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '150%',
                    textAlign: 'center',
                  }}
                >
                  Thank you for approve all the work we delivered! Do not forget to download all photos
                </p>
              </div>
            </div>

            {/* Action Buttons - Center */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  handleSubmit('acceptAll');
                  handleClose();
                }}
                style={{
                  display: 'flex',
                  width: '140px',
                  height: '42px',
                  padding: '10px 24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#2BC556',
                  color: '#FFF',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '20px',
                  letterSpacing: '0.1px',
                  cursor: 'pointer',
                }}
              >
                OK
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

