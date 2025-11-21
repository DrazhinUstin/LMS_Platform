import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import work_table from '@/public/work_table.jpg';
import girl_studying from '@/public/girl_studying.jpg';

const data: {
  title: string;
  description: string;
  imageSrc: ImageProps['src'];
  linkHref: string;
  linkLabel: string;
}[] = [
  {
    title: 'Study with us!',
    description: 'Choose your desired course from a wide range!',
    imageSrc: work_table,
    linkHref: '/courses',
    linkLabel: 'View courses',
  },
  {
    title: 'Learn more, spend less!',
    description: 'Buy courses at the best prices!',
    imageSrc: girl_studying,
    linkHref: '/courses',
    linkLabel: 'Check now!',
  },
];

export default function Hero() {
  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent className="-ml-0">
        {data.map(({ title, description, imageSrc, linkHref, linkLabel }) => (
          <CarouselItem key={title} className="pl-0">
            <div className="relative aspect-video max-h-[500px] w-full select-none">
              <Image
                src={imageSrc}
                alt="Hero image"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              <div className="absolute top-1/2 left-1/2 z-20 max-w-md -translate-x-1/2 -translate-y-1/2 p-2 lg:top-auto lg:bottom-8 lg:left-8 lg:translate-x-0 lg:translate-y-0">
                <h2 className="text-2xl font-bold text-white lg:text-4xl">{title}</h2>
                <p className="mt-2 text-white lg:text-lg">{description}</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={linkHref}>{linkLabel}</Link>
                </Button>
              </div>
              <div className="absolute inset-0 z-10 bg-black/40 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/80 lg:to-black/10" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
