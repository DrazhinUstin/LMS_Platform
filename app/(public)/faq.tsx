import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

const data: Array<{ id: string; title: string; content: React.ReactNode }> = [
  {
    id: '1',
    title: 'What is LMS Platform?',
    content: (
      <>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quae quam quaerat
          architecto eum quod optio nemo ipsam velit laboriosam blanditiis impedit maiores,
          accusantium nihil rerum autem laudantium corrupti perspiciatis obcaecati incidunt cum sed
          molestiae. Laudantium ad provident deleniti! Quidem iste similique sunt quae reiciendis
          aut ducimus adipisci quibusdam doloremque.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est animi facilis sequi corrupti
          quisquam illum reiciendis fugiat esse atque recusandae quidem optio dolores deserunt,
          voluptates eos veniam eligendi cum neque quod molestiae illo numquam provident! Accusamus
          quibusdam ullam, maxime nihil, facere maiores eos impedit, quae veniam voluptates
          recusandae? Deleniti, hic?
        </p>
      </>
    ),
  },
  {
    id: '2',
    title: 'What can I learn from LMS Platform?',
    content: (
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quae quam quaerat
        architecto eum quod optio nemo ipsam velit laboriosam blanditiis impedit maiores,
        accusantium nihil rerum autem laudantium corrupti perspiciatis obcaecati incidunt cum sed
        molestiae. Laudantium ad provident deleniti! Quidem iste similique sunt quae reiciendis aut
        ducimus adipisci quibusdam doloremque.
      </p>
    ),
  },
  {
    id: '3',
    title: 'Will LMS Platform motivate me to learn?',
    content: (
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quae quam quaerat
        architecto eum quod optio nemo ipsam velit laboriosam blanditiis impedit maiores,
        accusantium nihil rerum autem laudantium corrupti perspiciatis obcaecati incidunt cum sed
        molestiae. Laudantium ad provident deleniti! Quidem iste similique sunt quae reiciendis aut
        ducimus adipisci quibusdam doloremque.
      </p>
    ),
  },
  {
    id: '4',
    title: 'What is included in my LMS Platform membership?',
    content: (
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quae quam quaerat
        architecto eum quod optio nemo ipsam velit laboriosam blanditiis impedit maiores,
        accusantium nihil rerum autem laudantium corrupti perspiciatis obcaecati incidunt cum sed
        molestiae. Laudantium ad provident deleniti! Quidem iste similique sunt quae reiciendis aut
        ducimus adipisci quibusdam doloremque.
      </p>
    ),
  },
];

export default function FAQ() {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        {data.map(({ id, title, content }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-y-2">{content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
