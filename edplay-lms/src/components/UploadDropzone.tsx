'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface UploadDropzoneProps {
  onSuccess: (files: { id: string; name: string; file: File }[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'image/jpeg',
  'image/png',
  'image/jpg',
];

export function UploadDropzone({
  onSuccess,
  multiple = false,
  disabled = false,
}: UploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles: { id: string; name: string; file: File }[] = [];
      let hasInvalidFile = false;

      acceptedFiles.forEach((file) => {
        if (allowedMimeTypes.includes(file.type)) {
          validFiles.push({
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            file: file,
          });
        } else {
          hasInvalidFile = true;
        }
      });

      if (hasInvalidFile) {
        toast.error('Hanya file PDF, DOCX, JPG, PNG yang diperbolehkan!');
      }

      if (validFiles.length > 0) {
        onSuccess(validFiles);
      }
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
      {disabled && <p></p>}
      {isDragActive ? (
        <p>Lepaskan file di sini ...</p>
      ) : (
        <p>Drag & drop file atau klik untuk upload</p>
      )}
    </div>
  );
}


{/* <a
  href={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
  target="_blank"
  rel="noopener noreferrer"
>
  Buka Dokumen Online
</a> */}