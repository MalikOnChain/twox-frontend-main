import React from 'react'

import AffiliateBanner from '@/components/pages/(other)/affiliate/affiliate-banner'
import AffiliateClaimCard from '@/components/pages/(other)/affiliate/affiliate-claim-card'
import AffiliateDepositorsTable from '@/components/pages/(other)/affiliate/affiliate-depositors-table'

const AffiliatePage = () => {
  return (
    <div className='flex flex-col gap-4'>
      <AffiliateBanner className='flex-1' />
      <div className='flex flex-col gap-4 md:flex-row'>
        <AffiliateClaimCard />
        <AffiliateDepositorsTable />
      </div>
    </div>
  )
}

export default AffiliatePage
