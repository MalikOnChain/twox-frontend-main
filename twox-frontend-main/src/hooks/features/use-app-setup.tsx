import { useEffect } from 'react'
import Modal from 'react-modal'

export const useAppSetup = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#Twox_Project')
    }
  }, [])
}
