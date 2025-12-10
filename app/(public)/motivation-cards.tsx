import { BlocksIcon, GraduationCapIcon, TargetIcon } from 'lucide-react';

export default function MotivationCards() {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Invest in your career</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="flex flex-col items-center gap-y-2 rounded-md border p-4 text-center shadow-md">
          <span className="bg-primary/20 text-primary grid size-12 place-items-center rounded-full">
            <TargetIcon />
          </span>
          <h4 className="font-semibold">Explore new skills</h4>
          <p className="text-sm">Access 10,000+ courses in AI, business, technology, and more.</p>
        </article>
        <article className="flex flex-col items-center gap-y-2 rounded-md border p-4 text-center shadow-md">
          <span className="bg-primary/20 text-primary grid size-12 place-items-center rounded-full">
            <BlocksIcon />
          </span>
          <h4 className="font-semibold">Learn by building</h4>
          <p className="text-sm">
            Gain job-ready skills through real projects, created with top tech companies to reflect
            what the industry actually needs.
          </p>
        </article>
        <article className="flex flex-col items-center gap-y-2 rounded-md border p-4 text-center shadow-md">
          <span className="bg-primary/20 text-primary grid size-12 place-items-center rounded-full">
            <GraduationCapIcon />
          </span>
          <h4 className="font-semibold">Earn valuable credentials</h4>
          <p className="text-sm">
            Start applying your skills from day one, build your portfolio, and achieve your career
            goals.
          </p>
        </article>
      </div>
    </div>
  );
}
