'use client'

import { motion } from 'framer-motion'
import { InfoIcon } from 'lucide-react'

export default function MigrationNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <InfoIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-300">
            🎉 Cryptocurrency Payment System
          </h4>
          <p className="text-xs text-blue-200 leading-relaxed">
            Deposit with <strong>multiple cryptocurrencies</strong> 
            including Bitcoin, Ethereum, USDC, and many more. The system provides:
          </p>
          <ul className="text-xs text-blue-200 space-y-1 ml-4">
            <li>• Real-time pricing and instant confirmations</li>
            <li>• Support for multiple cryptocurrencies</li>
            <li>• Secure payment processing</li>
            <li>• Better user experience</li>
          </ul>
          <p className="text-xs text-blue-200">
            <strong>Legacy wallet options are now deprecated</strong> in favor of this improved system.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
