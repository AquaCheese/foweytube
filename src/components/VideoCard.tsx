'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    views: number;
    uploaderId: string;
    uploader: {
      displayName: string;
      username: string;
      avatar?: string;
    };
    createdAt: string;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const timeAgo = formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      <Link href={`/watch/${video._id}`}>
        <div className="relative aspect-video bg-gray-200">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-300 w-full h-full"></div>
            </div>
          )}
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex">
          {/* Channel Avatar */}
          <Link href={`/channel/${video.uploaderId}`} className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {video.uploader.avatar ? (
                <img
                  src={video.uploader.avatar}
                  alt={video.uploader.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {video.uploader.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <Link href={`/watch/${video._id}`}>
              <h3 className="text-gray-900 font-medium text-sm line-clamp-2 leading-tight mb-1 hover:text-red-600 cursor-pointer">
                {video.title}
              </h3>
            </Link>
            
            <Link href={`/channel/${video.uploaderId}`}>
              <p className="text-gray-600 text-sm hover:text-gray-800 cursor-pointer mb-1">
                {video.uploader.displayName}
              </p>
            </Link>
            
            <div className="text-gray-500 text-sm">
              <span>{formatViews(video.views)}</span>
              <span className="mx-1">•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
