import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { useMenu } from '@/context/menu-context'

import { LANGUAGES } from '@/lib/language'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import SpeakerIcon from '@/assets/speaker.png'
import i18n from '@/i18n'

const LanguageSelector = () => {
  const [selectedLang, setLang] = useState('pt')
  const selectedValue = LANGUAGES.find((lang) => lang.value === selectedLang)
  const { isExpanded } = useMenu()

  useEffect(() => {
    const lng = i18n.language
    setLang(lng)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    document.cookie = `i18next=${lng}; path=/`
    // router.refresh()

    setLang(lng)
  }

  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              'h-11 w-full justify-between bg-[#111014] bg-opacity-50 rounded-lg border border-charcoal-grey pl-4 max-md:px-3',
              '[&_svg]:size-4'
            )}
          >
            <span className='flex items-center gap-2 text-white'>
              {selectedValue?.flag && (
                <Image
                  src={selectedValue.flag}
                  width={0}
                  height={0}
                  sizes='100vw'
                  alt='flag'
                  className='h-auto w-5 rounded'
                />
              )}
              <span className='inline-block font-satoshi text-sm font-normal text-white'>
                {isExpanded && selectedValue?.name}
              </span>
            </span>
            {isExpanded && (
              <span className='flex size-6 items-center justify-center'>
                <ChevronDown size={16} />
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='bg-dark-grey-gradient'>
          {LANGUAGES.map((item) => (
            <DropdownMenuItem
              asChild
              key={item.value}
              onClick={() => changeLanguage(item.value)}
              className='cursor-pointer'
            >
              <div
                className={cn('my-1 flex w-60 items-center gap-2', {
                  'bg-background-fourth': selectedLang === item.value,
                })}
              >
                <Image
                  src={item.flag}
                  width={0}
                  height={0}
                  sizes='100vw'
                  alt='flag'
                  className='h-auto w-5'
                />
                <span className='inline-block font-satoshi text-sm font-normal text-white'>
                  {item.name}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className='h-11 bg-[#111014] bg-opacity-50 rounded-lg border border-charcoal-grey'>
        <Image
          src={SpeakerIcon}
          width={0}
          height={0}
          sizes='100vw'
          alt='speaker'
          className='h-auto w-5'
        />
      </Button>
    </div>
  )
}

export default LanguageSelector
