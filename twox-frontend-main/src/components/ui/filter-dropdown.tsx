import { Check, ChevronDown } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface ProviderItem {
  _id: string
  code: string
  name: string
  gamesCount: number
  status: number
  type: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface FilterItem {
  _id: string
  code: string
  name: string
  gamesCount?: number
}

interface FilterDropdownProps {
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  items: ProviderItem[] | FilterItem[]
  allText?: string
  width?: string
  minWidth?: string
  label?: string
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onValueChange,
  placeholder = 'Select options',
  items,
  allText = 'All',
  width = 'w-[200px]',
  minWidth = '!min-w-[220px]',
  label,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>(
    'left'
  )
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Calculate dropdown position to prevent overflow
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const dropdownWidth = 220 // min-width value in pixels
      const viewportWidth = window.innerWidth
      const spaceOnRight = viewportWidth - triggerRect.left

      // If there's not enough space on the right, position it to the right edge
      if (spaceOnRight < dropdownWidth) {
        setDropdownPosition('right')
      } else {
        setDropdownPosition('left')
      }
    }
  }, [isOpen])

  const handleItemSelect = (itemValue: string): void => {
    let newValues: string[]

    if (itemValue === 'all') {
      // If "All" is selected, clear all other selections
      newValues = value.includes('all') ? [] : ['all']
    } else {
      // Remove "all" if it exists when selecting specific items
      const filteredValues = value.filter((v) => v !== 'all')

      if (filteredValues.includes(itemValue)) {
        // Remove the item if it's already selected
        newValues = filteredValues.filter((v) => v !== itemValue)
      } else {
        // Add the item if it's not selected
        newValues = [...filteredValues, itemValue]
      }
    }

    onValueChange(newValues)
  }

  const isSelected = (itemValue: string): boolean => {
    return value.includes(itemValue)
  }

  const getDisplayText = (): string => {
    if (value.length === 0) return placeholder
    if (value.includes('all')) return allText
    if (value.length === 1) {
      const selectedItem = items.find((item) => item.code === value[0])
      return selectedItem ? selectedItem.name : placeholder
    }
    return `${value.length} selected`
  }

  // Filter out inactive providers if needed (status !== 1)
  const activeItems = items.filter((item) =>
    'status' in item ? item.status === 1 : true
  )

  return (
    <div className='space-y-2 font-satoshi'>
      {label && (
        <label className='block text-sm font-medium text-white'>{label}</label>
      )}
      <div className='relative' ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`${width} flex h-10 min-w-[126px] items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors`}
        >
          <span className='truncate text-white'>{getDisplayText()}</span>
          <ChevronDown
            className={`ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full z-50 mt-1 rounded-lg border border-mirage bg-cinder shadow-lg ${minWidth} max-w-[calc(100vw-1rem)] ${
              dropdownPosition === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            <div className='max-h-64 overflow-y-auto'>
              <div
                onClick={() => handleItemSelect('all')}
                className='flex cursor-pointer items-center justify-between border-b border-mirage px-4 py-2 text-sm hover:bg-custom-dual-gradient'
              >
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <div
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors ${
                        isSelected('all')
                          ? 'border-mulberry bg-mulberry'
                          : 'border-[#3B3D46] bg-transparent'
                      }`}
                    >
                      {isSelected('all') && (
                        <Check className='h-3 w-3 text-white' />
                      )}
                    </div>
                  </div>
                  <span className='font-medium text-white'>{allText}</span>
                </div>
              </div>

              {activeItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleItemSelect(item.code)}
                  className='flex cursor-pointer items-center justify-between px-4 py-1.5 text-sm hover:bg-custom-dual-gradient'
                >
                  <div className='flex flex-1 items-center gap-3'>
                    <div className='relative'>
                      <div
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors ${
                          isSelected(item.code)
                            ? 'border-mulberry bg-mulberry'
                            : 'border-[#3B3D46] bg-transparent'
                        }`}
                      >
                        {isSelected(item.code) && (
                          <Check className='h-3 w-3 text-white' />
                        )}
                      </div>
                    </div>
                    <div className='flex w-full flex-1 flex-row items-center justify-between gap-4'>
                      <div className='flex-1 text-white'>{item.name}</div>
                      {item.gamesCount && (
                        <div className='min-w-8 rounded-full bg-mulberry px-2.5 py-0.5 text-center font-satoshi text-xs font-normal text-white'>
                          {item.gamesCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex gap-2 border-t border-gray-600 p-4'>
              <button
                onClick={() => onValueChange([])}
                className='flex-1 rounded-lg bg-[#FFFFFF80] px-2 py-1.5 text-xs font-normal text-white transition-colors hover:bg-gray-500'
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className='flex-1 rounded-lg bg-white px-2 py-1.5 text-xs font-normal text-gray-900 transition-colors hover:bg-gray-100'
              >
                Ok
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterDropdown

export type { FilterItem, ProviderItem }
