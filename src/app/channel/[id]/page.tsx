'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Video, Users, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import VideoCard from '@/components/VideoCard';

interface Channel {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  subscribersCount: number;
  videosCount: number;
  createdAt: string;
}

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  duration: number;
  createdAt: string;
  uploaderId: string;
  uploader: {
    displayName: string;
    username: string;
    avatar?: string;
  };
}

type TabType = 'videos' | 'about';

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.id as string;
  
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('videos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (channelId) {
      fetchChannel();
      fetchChannelVideos();
    }
  }, [channelId]);

  const fetchChannel = async () => {
    try {
      const response = await fetch(`/api/users/${channelId}`);
      if (response.ok) {
        const data = await response.json();
        setChannel(data.user);
      } else {
        setError('Channel not found');
      }
    } catch (error) {
      setError('Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      const response = await fetch(`/api/users/${channelId}/videos`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to load channel videos:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`/api/users/${channelId}/subscribe`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsSubscribed(!isSubscribed);
        if (channel) {
          setChannel({
            ...channel,
            subscribersCount: isSubscribed 
              ? channel.subscribersCount - 1 
              : channel.subscribersCount + 1,
          });
        }
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
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
          <p className="mt-4 text-gray-600">Loading channel...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Channel not found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Channel Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 h-32 sm:h-48">
        {channel.banner && (
          <img
            src={channel.banner}
            alt="Channel banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Channel Info */}
        <div className="bg-white rounded-lg shadow-md -mt-16 relative z-10 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-red-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold flex-shrink-0">
              {channel.avatar ? (
                <img
                  src={channel.avatar}
                  alt={channel.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                channel.displayName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Channel Details */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {channel.displayName}
              </h1>
              <p className="text-gray-600 mb-2">@{channel.username}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {formatNumber(channel.subscribersCount)} subscribers
                </span>
                <span className="flex items-center">
                  <Video className="h-4 w-4 mr-1" />
                  {channel.videosCount} videos
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {formatDistanceToNow(new Date(channel.createdAt))} ago
                </span>
              </div>

              {channel.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl">{channel.bio}</p>
              )}
            </div>

            {/* Subscribe Button */}
            <div className="flex space-x-2">
              <button
                onClick={handleSubscribe}
                className={`px-6 py-2 rounded-full font-medium ${
                  isSubscribed
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
              
              <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'videos'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-12">
          {activeTab === 'videos' && (
            <div>
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No videos yet
                  </h3>
                  <p className="text-gray-600">
                    This channel hasn't uploaded any videos.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {channel.bio || 'No description available.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Location:</span>
                      <span className="text-gray-600 ml-2">Not specified</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Joined:</span>
                      <span className="text-gray-600 ml-2">
                        {new Date(channel.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Total views:</span>
                      <span className="text-gray-600 ml-2">
                        {formatNumber(videos.reduce((total, video) => total + video.views, 0))}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Videos:</span>
                      <span className="text-gray-600 ml-2">{channel.videosCount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Stats</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatNumber(channel.subscribersCount)}
                      </div>
                      <div className="text-sm text-gray-600">Subscribers</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatNumber(videos.reduce((total, video) => total + video.views, 0))}
                      </div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {channel.videosCount}
                      </div>
                      <div className="text-sm text-gray-600">Videos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
