'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedFile {
  file: File;
  preview: string;
  name: string;
  size: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function UploadZone() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: UploadedFile[] = accepted.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatBytes(file.size),
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.raw'] },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true,
  });

  const uploadAll = async () => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading', progress: 0 } : f));

      const formData = new FormData();
      formData.append('file', files[i].file);

      try {
        // Simulate progress
        for (let p = 0; p <= 100; p += 20) {
          await new Promise(r => setTimeout(r, 80));
          setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: p } : f));
        }

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');

        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'done', progress: 100 } : f));
      } catch {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
      }
    }
    setUploading(false);
  };

  const removeFile = (i: number) => {
    setFiles(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`upload-zone rounded-sm p-12 md:p-20 text-center cursor-pointer transition-all ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ scale: isDragActive ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 mx-auto mb-6 border border-[#1c1c1c] flex items-center justify-center">
            <span className="text-[#bfa882] text-xl">+</span>
          </div>
          <p className="font-display italic text-2xl text-[#eeeae3] mb-2">
            {isDragActive ? 'Release to add' : 'Drop images here'}
          </p>
          <p className="caption-text text-[#3d3835] mb-1">or click to browse</p>
          <p className="caption-text text-[#3d3835]">JPG · PNG · WEBP · TIFF · RAW · max 50MB each</p>
        </motion.div>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {files.map((f, i) => (
              <motion.div
                key={f.name + i}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-4 p-3 border border-[#1c1c1c] bg-[#0e0e0e]"
              >
                {/* Thumbnail */}
                <div
                  className="w-12 h-12 flex-shrink-0 bg-[#161616] bg-cover bg-center"
                  style={{ backgroundImage: `url(${f.preview})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="caption-text text-[#eeeae3] truncate">{f.name}</p>
                  <p className="caption-text text-[#3d3835]">{f.size}</p>
                  {/* Progress bar */}
                  {f.status === 'uploading' && (
                    <div className="mt-1 h-[1px] bg-[#1c1c1c] w-full">
                      <motion.div
                        className="h-full bg-[#bfa882]"
                        animate={{ width: `${f.progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {f.status === 'done' && <span className="caption-text text-[#bfa882]">Done</span>}
                  {f.status === 'error' && <span className="caption-text text-red-500">Error</span>}
                  {f.status === 'uploading' && <span className="caption-text text-[#7a746e]">{f.progress}%</span>}
                  {f.status === 'pending' && (
                    <button
                      onClick={() => removeFile(i)}
                      className="caption-text text-[#3d3835] hover:text-[#7a746e]"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {pendingCount > 0 && (
              <div className="flex items-center justify-between pt-2">
                <span className="caption-text text-[#7a746e]">{pendingCount} image{pendingCount !== 1 ? 's' : ''} ready</span>
                <button
                  onClick={uploadAll}
                  disabled={uploading}
                  className="caption-text text-[#bfa882] hover:text-[#eeeae3] disabled:opacity-50 transition-colors border border-[#bfa882]/30 hover:border-[#bfa882] px-4 py-2"
                >
                  {uploading ? 'Uploading...' : 'Upload All'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
