'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Send, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  uploadedBy: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  dislikes: number;
  duration: number;
  createdAt: string;
  tags: string[];
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

export default function WatchVideo() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      fetchComments();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}`);
      if (response.ok) {
        const data = await response.json();
        setVideo(data.video);
      } else {
        setError('Video not found');
      }
    } catch (error) {
      setError('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLike = async () => {
    if (!video) return;
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(!isLiked);
        if (isDisliked) setIsDisliked(false);
        setVideo({
          ...video,
          likes: data.likes,
          dislikes: data.dislikes,
        });
      }
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  const handleDislike = async () => {
    if (!video) return;
    
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`/api/videos/${videoId}/dislike`, {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsDisliked(!isDisliked);
        if (isLiked) setIsLiked(false);
        setVideo({
          ...video,
          likes: data.likes,
          dislikes: data.dislikes,
        });
      }
    } catch (error) {
      console.error('Failed to dislike video:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setNewComment('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      setError('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video not found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              <video
                controls
                className="w-full h-full"
                poster={video.thumbnailUrl}
                src={video.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{formatNumber(video.views)} views</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${
                      isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{formatNumber(video.likes)}</span>
                  </button>
                  
                  <button
                    onClick={handleDislike}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${
                      isDisliked ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                    <span>{formatNumber(video.dislikes)}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  
                  <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {video.uploadedBy.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Link 
                      href={`/channel/${video.uploadedBy.id}`}
                      className="font-semibold text-gray-900 hover:text-red-600"
                    >
                      {video.uploadedBy.displayName}
                    </Link>
                    <p className="text-sm text-gray-600">@{video.uploadedBy.username}</p>
                  </div>
                </div>
                
                <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
                  Subscribe
                </button>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-sm font-medium text-gray-900 hover:text-red-600 mb-2"
                >
                  {showDescription ? 'Show less' : 'Show more'}
                </button>
                
                <div className={`text-sm text-gray-700 ${showDescription ? '' : 'line-clamp-3'}`}>
                  <p className="whitespace-pre-wrap">{video.description}</p>
                  
                  {video.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg p-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">{comments.length} Comments</h3>
              
              {/* Comment Form */}
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-2 border-b border-gray-300 focus:border-red-500 outline-none resize-none"
                      rows={1}
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => setNewComment('')}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newComment.trim() || commentLoading}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {commentLoading ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.author.displayName}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-red-600">
                          <Heart className="h-3 w-3" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="hover:text-red-600">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
              <div className="space-y-3">
                {/* Placeholder for related videos */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">
                        Sample Video Title {i}
                      </h4>
                      <p className="text-xs text-gray-500">Channel Name</p>
                      <p className="text-xs text-gray-500">100K views • 2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
