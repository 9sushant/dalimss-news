
import React, { useState, useCallback, useMemo } from 'react';
import { Article } from '../types';
import * as HeroIcons from '@heroicons/react/24/solid';

// Safely access HeroIcons to prevent runtime errors if the module structure is unexpected.
// This pattern ensures we only attempt to render valid function components, fixing React error #31.
const getIconComponent = (iconName: string) => {
    const icon = (HeroIcons as any)[iconName] ?? (HeroIcons as any).default?.[iconName];
    return typeof icon === 'function' ? icon : null;
};

const PhotoIcon = getIconComponent('PhotoIcon');
const CloudArrowUpIcon = getIconComponent('CloudArrowUpIcon');
const XCircleIcon = getIconComponent('XCircleIcon');
const ExclamationTriangleIcon = getIconComponent('ExclamationTriangleIcon');


interface NewArticlePageProps {
    onAddArticle: (article: Omit<Article, 'id' | 'slug' | 'createdAt' | 'authorName' | 'authorAvatarUrl' | 'readTimeInMinutes' | 'claps' | 'commentsCount'>) => void;
}

const NewArticlePage: React.FC<NewArticlePageProps> = ({ onAddArticle }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (mediaFile) {
      return URL.createObjectURL(mediaFile);
    }
    return null;
  }, [mediaFile]);

  // Cleanup object URL to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'video/quicktime'].includes(file.type) || file.size > 50 * 1024 * 1024) {
        setError('Unsupported file type or size. Use PNG, JPG, GIF, MP4, MOV up to 50MB.');
        return;
      }
      setError(null);
      setMediaFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] ?? null);
  };
  
  const handleRemoveMedia = () => {
    setMediaFile(null);
    const fileInput = document.getElementById('media-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files?.[0] ?? null);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
        setError("Title and content are required.");
        return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const mediaUrl = previewUrl;
      const mediaType = mediaFile ? (mediaFile.type.startsWith('image') ? 'image' : 'video') : null;

      onAddArticle({ title, content, mediaUrl, mediaType });
      // Navigation is now handled by the parent App component.
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-red-900/20 border border-red-600 text-red-300 px-4 py-3 rounded-lg relative flex items-center" role="alert">
                {ExclamationTriangleIcon && <ExclamationTriangleIcon className="h-5 w-5 mr-3" />}
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                Title
            </label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500"
                placeholder="Article Title"
            />
        </div>

        <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1">
                Content (Markdown supported)
            </label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={15}
                className="mt-1 block w-full rounded-md bg-slate-900 border border-slate-700 p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base text-slate-300 placeholder-slate-500 font-serif"
                placeholder="Tell your story..."
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Cover Media
          </label>
          {!mediaFile ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 px-6 py-10"
            >
              <div className="text-center">
                <p className="mb-2 text-slate-400">Upload a file</p>
                <input id="media-upload" name="media" type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900 file:text-blue-300 hover:file:bg-blue-800" onChange={handleFileChange} accept="image/png,image/jpeg,image/gif,video/mp4,video/quicktime" />
                <p className="mt-2 text-slate-400">or drag and drop</p>
                <p className="mt-2 text-xs text-slate-500">PNG, JPG, GIF; MP4, MOV up to 50MB</p>
              </div>
            </div>
          ) : (
            <div className="mt-2 relative rounded-lg overflow-hidden group">
                {mediaFile.type.startsWith('image/') && previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover rounded-lg" />
                )}
                {mediaFile.type.startsWith('video/') && previewUrl && (
                    <video src={previewUrl} controls className="w-full h-auto rounded-lg bg-black" />
                )}
                <div className="absolute top-2 right-2">
                    <button
                        type="button"
                        onClick={handleRemoveMedia}
                        className="p-1.5 bg-black/50 rounded-full text-white hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove media"
                    >
                        {XCircleIcon && <XCircleIcon className="h-6 w-6" />}
                    </button>
                </div>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewArticlePage;
