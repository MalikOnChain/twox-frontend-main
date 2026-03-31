import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import useTrivia from '@/context/features/trivia-context'

import { QUESTION_TYPE } from '@/lib/trivia'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'

interface TriviaProps {
  setIsTriviaVisible: (visible: boolean) => void
  className?: string
}

// -- Subcomponents for each question type --

const FillInTheBlank = ({
  answer,
  onChange,
  disabled,
}: {
  answer: string
  onChange: (value: string) => void
  disabled?: boolean
}) => (
  <Input
    id='trivia-fill'
    type='text'
    value={answer}
    onChange={(e) => onChange(e.target.value)}
    placeholder='Enter your answer'
    className='flex-1 rounded border p-2'
    wrapperClassName='md:h-9'
    disabled={disabled}
    autoComplete='off'
    autoCorrect='off'
    autoCapitalize='none'
    spellCheck='false'
  />
)

const MultipleChoice = ({
  options,
  selected,
  onToggle,
  disabled,
}: {
  options: string[]
  selected: number[]
  onToggle: (option: number, checked: boolean) => void
  disabled?: boolean
}) => (
  <>
    {options.map((opt, i) => {
      return (
        <div key={opt} className='flex items-center gap-2'>
          <input
            id={`opt-${opt}`}
            type='checkbox'
            checked={selected.includes(i)}
            onChange={(e) => onToggle(i, e.target.checked)}
            className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500'
            disabled={disabled}
          />
          <label
            htmlFor={`opt-${opt}`}
            className='text-sm text-muted-foreground'
          >
            {opt}
          </label>
        </div>
      )
    })}
  </>
)

const TrueFalse = ({
  selected,
  onSelect,
  disabled,
}: {
  selected: string
  onSelect: (value: string) => void
  disabled?: boolean
}) => (
  <div className='flex items-center gap-4'>
    {['True', 'False'].map((val) => (
      <div key={val} className='flex items-center gap-1'>
        <input
          id={`tf-${val}`}
          type='radio'
          name='trivia-true-false'
          value={val}
          checked={selected === val}
          onChange={() => onSelect(val)}
          className='h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500'
          disabled={disabled}
        />
        <label htmlFor={`tf-${val}`} className='text-sm text-muted-foreground'>
          {val}
        </label>
      </div>
    ))}
  </div>
)

// -- Main component --

export default function Trivia({ className, setIsTriviaVisible }: TriviaProps) {
  const { launchedTrivia, sendAnswer } = useTrivia()
  const [answers, setAnswers] = useState<(string | number)[]>([])
  const [{ startIn, timeLeft }, setTimer] = useState({
    startIn: 0,
    timeLeft: 0,
  })

  useEffect(() => {
    if (!launchedTrivia) {
      // No question, nothing to do
      return
    }

    if (launchedTrivia.expired) {
      // Already expired on server
      setTimer({ startIn: 0, timeLeft: 0 })
      return
    }

    // Compute seconds passed since launch
    const launchedAtTs = Date.parse(launchedTrivia.launchedAt)
    const nowTs = Date.now()
    const passedTime = Math.floor((nowTs - launchedAtTs) / 1000)

    // Configured cooldown & time limit
    const cooldown = launchedTrivia.cooldown ?? 0
    const limit = launchedTrivia.timeLimit ?? 0

    // Calculate remaining “start in” and remaining answer time
    const remainingStart = Math.max(0, cooldown - passedTime)
    const remainingLimit =
      passedTime < cooldown
        ? limit
        : Math.max(0, limit - (passedTime - cooldown))

    setTimer({ startIn: remainingStart, timeLeft: remainingLimit })

    // Single interval handles both phases
    const intervalId = window.setInterval(() => {
      setTimer(({ startIn, timeLeft }) => {
        if (launchedTrivia.result) {
          clearInterval(intervalId)
          if (
            launchedTrivia.result === 'closed' ||
            launchedTrivia.result === 'expired'
          ) {
            return { startIn: 0, timeLeft: 0 }
          } else {
            return { startIn, timeLeft }
          }
        }
        if (startIn > 0) {
          return { startIn: startIn - 1, timeLeft }
        } else if (timeLeft > 0) {
          return { startIn: 0, timeLeft: timeLeft - 1 }
        } else {
          clearInterval(intervalId)
          return { startIn: 0, timeLeft: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [launchedTrivia])

  const handleSubmit = async () => {
    if (!launchedTrivia) return
    await sendAnswer(answers)
    setAnswers([])
    setIsTriviaVisible(false)
  }

  const renderInputs = () => {
    if (!launchedTrivia) return null
    const { questionType, questionTypeOptions = [] } = launchedTrivia

    switch (questionType) {
      case QUESTION_TYPE.FILL_IN_THE_BLANK:
        return (
          <FillInTheBlank
            answer={String(answers[0] ?? '')}
            onChange={(val) => setAnswers([val])}
            disabled={launchedTrivia.result !== undefined}
          />
        )
      case QUESTION_TYPE.MULTIPLE_CHOICE:
        return (
          <MultipleChoice
            options={questionTypeOptions}
            selected={answers.map(Number)}
            onToggle={(opt, checked) =>
              setAnswers((prev) =>
                checked ? [...prev, opt] : prev.filter((a) => a !== opt)
              )
            }
            disabled={launchedTrivia.result !== undefined}
          />
        )
      case QUESTION_TYPE.TRUE_FALSE:
        return (
          <TrueFalse
            selected={String(answers[0] ?? '')}
            onSelect={(val) => setAnswers([val])}
            disabled={launchedTrivia.result !== undefined}
          />
        )
      default:
        return (
          <p className='text-sm text-muted-foreground'>
            Unknown question type.
          </p>
        )
    }
  }

  return (
    <div className={cn('relative w-full p-4', className)}>
      <X
        size={14}
        onClick={() => setIsTriviaVisible(false)}
        className='absolute right-2 top-1 z-50 cursor-pointer opacity-70 transition-opacity hover:opacity-100'
      />

      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-bold'>Trivia</h1>

        {launchedTrivia &&
        (startIn > 0 ||
          timeLeft > 0 ||
          Number(launchedTrivia.timeLimit) === 0) ? (
          <div className='flex flex-col items-center gap-2'>
            <p className='text-sm text-muted-foreground'>
              {launchedTrivia.questionText}
            </p>
            <div className='flex flex-col gap-2'>{renderInputs()}</div>
            {startIn > 0 && (
              <div className='absolute inset-0 flex items-center justify-center rounded-md bg-gray-500/70'>
                <p className='text-sm font-bold text-white'>
                  Starts in {startIn}s
                </p>
              </div>
            )}

            {!launchedTrivia.result &&
              startIn === 0 &&
              timeLeft > 0 &&
              Number(launchedTrivia.timeLimit) !== 0 && (
                <p className='text-sm text-muted-foreground'>
                  Time left: {timeLeft}s
                </p>
              )}
            {launchedTrivia.result && (
              <p className='text-xs text-red-500'>You answered already</p>
            )}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            No trivia question available at the moment.
          </p>
        )}

        <div className='mt-4 flex justify-center'>
          <button
            onClick={handleSubmit}
            disabled={!launchedTrivia || launchedTrivia.result !== undefined}
            className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50'
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  )
}
