import React, { useState, useEffect } from 'react';
import { resolveAssetUrl } from '../services/storageService';
import { Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface AsyncAssetProps {
    url?: string;
    type: 'image' | 'video';
    className?: string;
    alt?: string;
}

const AsyncAsset: React.FC<AsyncAssetProps> = ({ url, type, className, alt }) => {
    const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!url) {
            setResolvedUrl(null);
            return;
        }

        if (url.startsWith('drive://')) {
            setLoading(true);
            resolveAssetUrl(url)
                .then(u => {
                    setResolvedUrl(u);
                    setLoading(false);
                })
                .catch(() => {
                    setError(true);
                    setLoading(false);
                });
        } else {
            setResolvedUrl(url);
        }
    }, [url]);

    if (!url) {
        return (
            <div className={`flex items-center justify-center bg-slate-900 text-slate-700 ${className}`}>
                <ImageIcon size={24} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`flex items-center justify-center bg-slate-900 text-slate-500 ${className}`}>
                <Loader2 className="animate-spin" size={24} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-slate-900 text-red-500 ${className}`}>
                <AlertTriangle size={24} />
            </div>
        );
    }

    if (type === 'video') {
        // Note: Videos might need controls or specific handling
        return <video src={resolvedUrl!} className={className} controls playsInline loop autoPlay muted />;
    }

    return <img src={resolvedUrl!} className={className} alt={alt || 'Asset'} />;
};

export default AsyncAsset;
