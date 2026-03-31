import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { makePayment } from '@/api/pix'

import { useUser } from '@/context/user-context'

import DepositContent from './deposit-content'
import QrCodeContainer from './qrcode-container'
interface DepositProps {
  step: number
  setStep: (step: number) => void
  onClose: () => void
}

const Deposit = ({ step, setStep, onClose }: DepositProps) => {
  const { user } = useUser()
  const router = useRouter()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  const handleStepChange = (step: number) => {
    setStep(step)
  }

  const handlePayment = async (amount: number) => {
    setLoading(true)

    if (!user?.CPFNumber) {
      toast.error('Please enter your CPF number')
      setLoading(false)
      router.push('/settings/general')
      onClose()
      return
    }

    try {
      const response = await makePayment({
        amount,
        currency: 'BRL',
        cpf_number: user?.CPFNumber || '',
      })
      setPaymentData(response)
      setStep(2)
    } catch (error) {
      toast.error((error as any).message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {step === 1 && (
        <motion.div
          key='step1'
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className='inset-0'
        >
          <DepositContent onNext={handlePayment} loading={loading} />
        </motion.div>
      )}
      {step === 2 && (
        <motion.div
          key='step2'
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className='inset-0'
        >
          <QrCodeContainer
            onBack={() => handleStepChange(1)}
            onNext={() => handleStepChange(3)}
            paymentData={paymentData}
          />
        </motion.div>
      )}
    </>
  )
}

export default Deposit
