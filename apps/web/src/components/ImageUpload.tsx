"use client";

import React, { useState, useRef } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { showSuccess, showError } from "@/utils/toast";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const presignRes = await fetch('/api/uploads/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          userId: 'mock-user-id'
        })
      });
      if (!presignRes.ok) throw new Error('presign failed');
      const { signedUrl, publicUrl, key } = await presignRes.json();

      await new Promise(resolve => setTimeout(resolve, 1500));

      await fetch('/api/uploads/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, publicUrl, journalId: 'temp-id' })
      });

      showSuccess("Image uploaded and processing started");
      onUploadComplete(publicUrl);
    } catch (err) {
      showError("Failed to upload image");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
      />

      {!preview ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Add a photo to your journal</span>
        </button>
      ) : (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">Processing...</span>
            </div>
          )}
          <button
            onClick={() => { setPreview(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
