import React, { useRef, useState, useEffect } from 'react';
import { GripHorizontal, Check, X, Crop } from 'lucide-react';

interface EvidenceEditorProps {
    imageUrl: string;
    initialCrop?: { x: number, y: number, width: number, height: number };
    onSave: (crop: { x: number, y: number, width: number, height: number }) => void;
    onCancel: () => void;
}

export default function EvidenceEditor({ imageUrl, initialCrop, onSave, onCancel }: EvidenceEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentCrop, setCurrentCrop] = useState<{ x: number, y: number, width: number, height: number } | null>(initialCrop || null);

    // Coordinate conversion helper
    const getRelativeCoords = (e: React.MouseEvent) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            imgWidth: rect.width,
            imgHeight: rect.height
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getRelativeCoords(e);
        setIsDrawing(true);
        setStartPos({ x, y });
        setCurrentCrop({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !startPos) return;
        const { x, y } = getRelativeCoords(e);

        const width = x - startPos.x;
        const height = y - startPos.y;

        // Allow drawing in any direction by normalizing
        const newCrop = {
            x: width > 0 ? startPos.x : x,
            y: height > 0 ? startPos.y : y,
            width: Math.abs(width),
            height: Math.abs(height)
        };
        setCurrentCrop(newCrop);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleSave = () => {
        if (currentCrop) {
            onSave(currentCrop);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 text-white animate-fade-in">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-slate-900">
                <div className="flex items-center gap-2">
                    <Crop className="text-indigo-400" size={20} />
                    <span className="font-bold text-lg">Highlight Evidence</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={onCancel} className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                        <X size={18} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!currentCrop}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check size={18} /> Confirm Highlight
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-950 relative">
                <div
                    ref={containerRef}
                    className="relative cursor-crosshair select-none shadow-2xl shadow-black/50 border border-slate-700 inline-block max-w-full max-h-full"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <img
                        src={imageUrl}
                        alt="Evidence Source"
                        className="max-h-[80vh] w-auto h-auto object-contain pointer-events-none"
                    />

                    {/* The Crop Overlay */}
                    {currentCrop && (
                        <>
                            {/* Backdrop Dimming (Inverse Mask) - Simple solution: 4 divs around the crop */}
                            {/* Too complex to do perfect inverse mask with simple divs, using simple semi-transparent yellow overlay for the selection instead */}

                            {/* The Highlight Box */}
                            <div
                                className="absolute border-2 border-yellow-400 bg-yellow-400/20 shadow-[0_0_100px_rgba(0,0,0,0.5)_inset]"
                                style={{
                                    left: currentCrop.x,
                                    top: currentCrop.y,
                                    width: currentCrop.width,
                                    height: currentCrop.height
                                }}
                            >
                                {/* Dimensions Label */}
                                <div className="absolute -top-6 left-0 bg-yellow-400 text-black text-[10px] font-bold px-1 rounded">
                                    {Math.round(currentCrop.width)} x {Math.round(currentCrop.height)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Instruction Footer */}
            <div className="h-12 bg-slate-900 border-t border-white/10 flex items-center justify-center text-slate-400 text-sm gap-2">
                <GripHorizontal size={16} />
                <span>Click and drag to highlight the text or chart you want to show in the video.</span>
            </div>
        </div>
    );
}
