import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import QuestionMark from '@/assets/question-mark.svg'

interface FaqProps {
  titleClass?: string
  data: {
    question: string
    answer: string
  }[]
}

const Faq = ({ data, titleClass }: FaqProps) => {
  return (
    <div>
      <div className={cn('flex items-center', titleClass)}>
        <QuestionMark className='mr-3 h-[22px] w-[22px] text-gold drop-shadow-0-12-0-gold' />
        <span className='text-2xl font-bold text-foreground sm:text-[22px]'>
          FAQ
        </span>
      </div>
      <div className='flex flex-col gap-4'>
        <Accordion type='single' collapsible className='space-y-2'>
          {data.map((item, index) => (
            <AccordionItem value={item.question} key={index} variant='primary'>
              <AccordionTrigger
                variant='primary'
                expandIcon={
                  <div className='expand-icon group-data-[state=open]/trigger:bg-secondary-650 absolute -top-[6px] right-0 rounded-[6px] bg-secondary-600 p-1 text-secondary-text group-data-[state=open]/trigger:text-foreground'>
                    <ChevronDown className='w-6' />
                  </div>
                }
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent variant='primary'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default Faq
