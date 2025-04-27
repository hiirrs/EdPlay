'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadDropzoneProps {
  onSuccess: (files: { id: string; name: string }[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export function UploadDropzone({
  onSuccess,
  multiple = false,
  disabled = false,
}: UploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Simulasi upload langsung sukses
      const uploaded = acceptedFiles.map((file) => ({
        id: `${Date.now()}-${file.name}`, // Random ID
        name: file.name,
      }));
      onSuccess(uploaded);
    },
    [onSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
        disabled ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Lepaskan file di sini ...</p>
      ) : (
        <p>Drag & drop file atau klik untuk upload</p>
      )}
    </div>
  );
}
