'use client';

import ButtonLoading from '@/app/components/button-loading';
import CropImageDialog from '@/app/components/crop-image-dialog';
import { Button } from '@/app/components/ui/button';
import { Session } from '@/app/lib/auth';
import { ImageIcon, Trash2Icon } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateUserImage } from './actions';

export default function AddPhotoForm({ user }: { user: Session['user'] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrlToCrop, setImageUrlToCrop] = useState<string | null>(null);

  const [fileToUpload, setFileToUpload] = useState<{ file: File; previewUrl: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  const uploadFile = () => {
    if (!fileToUpload) return;

    startTransition(async () => {
      try {
        const response = await fetch('/api/s3/upload/presigned-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: fileToUpload.file.name,
            filetype: fileToUpload.file.type,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch a presigned URL!');
        }

        const { presignedUrl, key } = await response.json();

        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: fileToUpload.file,
          headers: {
            'Content-Type': fileToUpload.file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload a file with the presigned url!');
        }

        await updateUserImage(key);

        URL.revokeObjectURL(fileToUpload.previewUrl);

        setFileToUpload(null);

        toast('Uploaded successfully!');
      } catch {
        toast.error('Oops! There was an error during the upload. Please try again.');
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-2 text-center">
      <h4 className="font-semibold">Image preview</h4>
      <div className="grid aspect-video place-items-center border">
        {!!fileToUpload && (
          <ImagePreview
            url={fileToUpload.previewUrl}
            onRemove={() => {
              URL.revokeObjectURL(fileToUpload.previewUrl);
              setFileToUpload(null);
            }}
            disabled={isPending}
          />
        )}
        {!fileToUpload && (
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="text-muted-foreground" />
            Select image
          </Button>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="sr-only hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file || !file.type.startsWith('image/')) return;
          setImageUrlToCrop(URL.createObjectURL(file));
        }}
      />
      {!!imageUrlToCrop && (
        <CropImageDialog
          imageUrl={imageUrlToCrop}
          handleBlob={(blob) => {
            const file = new File([blob], `${user.name}-${Date.now()}.webp`, {
              type: 'image/webp',
            });
            setFileToUpload({ file, previewUrl: URL.createObjectURL(file) });
          }}
          onClose={() => {
            URL.revokeObjectURL(imageUrlToCrop);
            setImageUrlToCrop(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />
      )}
      <ButtonLoading
        className="w-full"
        onClick={uploadFile}
        loading={isPending}
        disabled={!fileToUpload}
      >
        Upload
      </ButtonLoading>
    </div>
  );
}

function ImagePreview({
  url,
  onRemove,
  disabled,
}: {
  url: string;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <div className="relative flex aspect-video items-center justify-center">
      <img src={url} alt="Image preview" className="max-h-full max-w-full" />
      <Button
        variant="destructive"
        size="icon-sm"
        className="absolute"
        onClick={onRemove}
        disabled={disabled}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
