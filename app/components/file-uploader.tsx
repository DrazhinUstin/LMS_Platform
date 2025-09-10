/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { type FileRejection, useDropzone } from 'react-dropzone';
import { Button } from '@/app/components/ui/button';
import { cn, getS3ObjectUrl } from '@/app/lib/utils';
import { toast } from 'sonner';
import { CircleAlertIcon, Loader2Icon, LoaderIcon, Trash2Icon } from 'lucide-react';

interface UploadState {
  isUploading: boolean;
  isError: boolean;
  isDeleting: boolean;
  file: File | null;
  objectURL: string | null;
  s3key?: string;
}

const initialUploadState: UploadState = {
  isUploading: false,
  isError: false,
  isDeleting: false,
  file: null,
  objectURL: null,
};

export default function FileUploader({
  s3key,
  onFileUploaded,
}: {
  s3key?: string;
  onFileUploaded: (s3key: string) => void;
}) {
  const [uploadState, setUploadState] = useState({
    ...initialUploadState,
    ...(s3key ? { s3key, objectURL: getS3ObjectUrl(s3key) } : {}),
  });

  const onDrop = async (acceptedFiles: File[]) => {
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

      onFileUploaded(key);

      toast('File uploaded successfully!');
    } catch (error) {
      console.error(error);

      setUploadState((prev) => ({ ...prev, isError: true, isUploading: false }));

      toast.error(`Failed to upload a file <${file.name}>. Please try again.`);
    }
  };

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

  const onDelete = async () => {
    if (!uploadState.s3key) return;

    setUploadState((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: uploadState.s3key }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete a file!');
      }

      setUploadState(initialUploadState);

      onFileUploaded('');

      toast('File deleted successfully!');
    } catch (error) {
      console.error(error);

      setUploadState((prev) => ({ ...prev, isDeleting: false }));

      toast.error(`Failed to delete a file <${uploadState.file?.name}>. Please try again.`);
    }
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
    disabled: uploadState.isUploading || !!uploadState.s3key,
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
      <FilePreview uploadState={uploadState} open={open} onDelete={onDelete} />
    </div>
  );
}

function FilePreview({
  uploadState,
  open,
  onDelete,
}: {
  uploadState: UploadState;
  open: () => void;
  onDelete: () => void;
}) {
  const { isUploading, isError, isDeleting, objectURL, s3key } = uploadState;

  useEffect(() => {
    if (!objectURL) return;
    return () => URL.revokeObjectURL(objectURL);
  }, [objectURL]);

  if (isUploading) {
    return (
      <div className="relative max-h-full max-w-full">
        <img src={objectURL as string} alt="File preview" className="h-full w-full" />
        <LoaderIcon className="absolute top-1/2 left-1/2 z-50 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
        <div className="absolute inset-0 h-full w-full bg-black/20" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive relative max-h-full max-w-full border">
        <img src={objectURL as string} alt="File preview" className="h-full w-full" />
        <CircleAlertIcon className="text-destructive absolute top-1/2 left-1/2 z-50 size-5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 h-full w-full bg-black/20" />
      </div>
    );
  }

  if (s3key) {
    return (
      <div className="relative max-h-full max-w-full">
        <img src={objectURL as string} alt="File preview" className="h-full w-full" />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
        </Button>
        <div className="absolute inset-0 h-full w-full bg-black/20" />
      </div>
    );
  }

  return (
    <>
      <p>Drag &apos;n&apos; drop file here, or click the button below</p>
      <Button type="button" onClick={open}>
        Select file
      </Button>
    </>
  );
}
