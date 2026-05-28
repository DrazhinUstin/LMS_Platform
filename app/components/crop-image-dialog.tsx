'use client';

import { useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

export default function CropImageDialog({
  imageUrl,
  handleBlob,
  onClose,
}: {
  imageUrl: string;
  handleBlob: (blob: Blob) => void;
  onClose: () => void;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => blob && handleBlob(blob), 'image/webp', 0.8);

    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
          <DialogDescription>
            Select an area to crop. Click crop when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Cropper
            src={imageUrl}
            className="m-auto size-fit"
            initialAspectRatio={1}
            guides={false}
            ref={cropperRef}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onCrop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
