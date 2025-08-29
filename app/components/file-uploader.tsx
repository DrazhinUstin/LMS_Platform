/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { toast } from 'sonner';
import { CircleAlertIcon, LoaderIcon } from 'lucide-react';

interface UploadState {
  isUploading: boolean;
  isError: boolean;
  file: File | null;
  objectURL: string | null;
  s3key?: string;
}

const initialUploadState: UploadState = {
  isUploading: false,
  isError: false,
  file: null,
  objectURL: null,
};

export default function FileUploader() {
  const [uploadState, setUploadState] = useState(initialUploadState);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      return;
    }

    const file = acceptedFiles[0];

    setUploadState({
      ...initialUploadState,
      isUploading: true,
      file,
      objectURL: URL.createObjectURL(file),
    });

    try {
      const response = await fetch('/api/s3/upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, filetype: file.type }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch a presigned URL!');
      }

      const { presignedUrl, key } = await response.json();

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload a file with the presigned url!');
      }

      setUploadState((prev) => ({ ...prev, isUploading: false, s3key: key }));

      toast('File uploaded successfully!');
    } catch (error) {
      console.error(error);

      setUploadState((prev) => ({ ...prev, isError: true, isUploading: false }));

      toast.error(`Failed to upload a file <${file.name}>. Please try again.`);
    }
  }, []);

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      const errorCode = errors[0].code;

      if (errorCode === 'file-invalid-type') {
        toast.error(
          `Unable to upload a file <${file.name}>. Invalid type. Only images are allowed.`
        );
        return;
      }

      if (errorCode === 'file-too-large') {
        toast.error(
          `Unable to upload a file <${file.name}>. File is too big. Max file size is 5MB.`
        );
        return;
      }

      if (errorCode === 'too-many-files') {
        toast.error(
          `Unable to upload a file <${file.name}>. Too many files were selected. Only 1 file is allowed.`
        );
        return;
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    noClick: true,
    accept: {
      'image/*': [],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    disabled: uploadState.isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex h-60 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-2',
        isDragActive && 'border-primary bg-primary/10'
      )}
    >
      <input {...getInputProps()} />
      <FilePreview uploadState={uploadState} open={open} />
    </div>
  );
}

function FilePreview({ uploadState, open }: { uploadState: UploadState; open: () => void }) {
  const { isUploading, isError, objectURL, s3key } = uploadState;

  useEffect(() => {
    if (!objectURL) return;
    return () => URL.revokeObjectURL(objectURL);
  }, [objectURL]);

  if (isUploading) {
    return (
      <div className="relative grid place-items-center bg-black/25">
        <img src={objectURL as string} alt="File preview" className="max-h-full max-w-full" />
        <LoaderIcon className="absolute size-5 animate-spin text-white" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive relative grid place-items-center border bg-black/25">
        <img src={objectURL as string} alt="File preview" className="max-h-full max-w-full" />
        <CircleAlertIcon className="text-destructive absolute size-5" />
      </div>
    );
  }

  if (s3key) {
    return <img src={objectURL as string} alt="File preview" className="max-h-full max-w-full" />;
  }

  return (
    <>
      <p>Drag &apos;n&apos; drop file here, or click the button below</p>
      <Button type="button" onClick={open}>
        Select files
      </Button>
    </>
  );
}
