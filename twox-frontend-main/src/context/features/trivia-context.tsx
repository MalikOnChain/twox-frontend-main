import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'

import { useSocket } from '@/context/socket-context'

import { SOCKET_NAMESPACES } from '@/lib/socket'
import { QUESTION_TYPE, TRIVIA_RESULT_MESSAGE } from '@/lib/trivia'

export interface Trivia {
  launchId: string
  questionId: string
  questionText: string
  questionType: QUESTION_TYPE
  answers?: (string | number)[]
  launchedBy: string
  questionTypeOptions?: string[]
  result?: string
  expired?: boolean
  cooldown: number
  timeLimit?: number
  launchedAt: string
}

interface TriviaContextType {
  launchedTrivia?: Trivia
  sendAnswer: (answer: (string | number)[]) => void
}

const TriviaContext = createContext<TriviaContextType | undefined>(undefined)

interface TriviaProviderProps {
  children: React.ReactNode
}

export const TriviaProvider: React.FC<TriviaProviderProps> = ({ children }) => {
  const { socket } = useSocket(SOCKET_NAMESPACES.TRIVIA)
  const [launchedTrivia, setLaunchedTrivia] = useState<Trivia>()

  const handleError = useCallback(
    (error: { message: string; code: number }) => {
      toast.error(error.message)
    },
    []
  )

  const handleStartTrivia = useCallback(
    (trivia: Trivia) => {
      setLaunchedTrivia(trivia)
    },
    [setLaunchedTrivia]
  )

  const handleTriviaResult = useCallback(
    ({ result, launchId }: { result: string; launchId: string }) => {
      if (launchedTrivia?.launchId === launchId) {
        setLaunchedTrivia((prev) => (prev ? { ...prev, result } : prev))
        toast.info(
          TRIVIA_RESULT_MESSAGE[result as keyof typeof TRIVIA_RESULT_MESSAGE]
        )
      }
    },
    [setLaunchedTrivia, launchedTrivia]
  )

  const handleEndTrivia = useCallback(
    (launchId: string) => {
      if (launchedTrivia?.launchId === launchId) {
        setLaunchedTrivia((prev) =>
          prev ? { ...prev, expired: true, result: 'closed' } : prev
        )
        toast.info(TRIVIA_RESULT_MESSAGE.closed)
      }
    },
    [setLaunchedTrivia, launchedTrivia]
  )

  const sendAnswer = useCallback(
    (answers: (string | number)[]) => {
      if (!socket) {
        toast.error('Socket connection not available')
        return
      }

      if (launchedTrivia?.expired) {
        toast.error('Trivia is expired')
        return
      }

      if (launchedTrivia) {
        socket.emit('answer-trivia', {
          answers,
          launchId: launchedTrivia.launchId,
          questionId: launchedTrivia.questionId,
        })
      }
    },
    [launchedTrivia, socket]
  )

  useEffect(() => {
    if (!socket) return

    socket.on('start-trivia', handleStartTrivia)
    socket.on('trivia-result', handleTriviaResult)
    socket.on('end-trivia', handleEndTrivia)
    socket.on('error', handleError)

    return () => {
      socket.off('start-trivia')
      socket.off('trivia-result')
      socket.off('end-trivia')
      socket.off('error')
    }
  }, [
    socket,
    handleError,
    handleStartTrivia,
    handleTriviaResult,
    handleEndTrivia,
  ])

  const value = useMemo(
    () => ({
      launchedTrivia,
      sendAnswer,
    }),
    [launchedTrivia, sendAnswer]
  )

  return (
    <TriviaContext.Provider value={value}>{children}</TriviaContext.Provider>
  )
}

export const useTrivia = () => {
  const context = useContext(TriviaContext)
  if (context === undefined) {
    throw new Error('useTrivia must be used within a TriviaProvider')
  }
  return context
}

export default useTrivia
