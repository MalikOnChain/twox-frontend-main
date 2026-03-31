'use client'

import { Check, ChevronDown, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import Filter from '@/assets/icons/filter.svg'

interface ProviderItem {
  _id: string
  code: string
  name: string
  gamesCount: number
}

interface FilterItem {
  _id: string
  code: string
  name: string
  gamesCount?: number
}

interface ResponsiveFilterProps {
  providers: ProviderItem[]
  categories: FilterItem[]
  onFiltersChange: (providers: string[], categories: string[]) => void
  selectedProviders?: string[]
  selectedCategories?: string[]
}

const ResponsiveFilter: React.FC<ResponsiveFilterProps> = ({
  providers,
  categories,
  onFiltersChange,
  selectedProviders = [],
  selectedCategories = [],
}) => {
  // State for mobile modal
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'providers' | 'categories'>(
    'providers'
  )
  const [tempSelectedProviders, setTempSelectedProviders] =
    useState<string[]>(selectedProviders)
  const [tempSelectedCategories, setTempSelectedCategories] =
    useState<string[]>(selectedCategories)

  // State for desktop dropdowns
  const [isProvidersOpen, setIsProvidersOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [providersDropdownPosition, setProvidersDropdownPosition] = useState<
    'left' | 'right'
  >('left')
  const [categoriesDropdownPosition, setCategoriesDropdownPosition] = useState<
    'left' | 'right'
  >('left')

  // Refs for desktop dropdowns
  const providersDropdownRef = useRef<HTMLDivElement>(null)
  const providersTriggerRef = useRef<HTMLButtonElement>(null)
  const categoriesDropdownRef = useRef<HTMLDivElement>(null)
  const categoriesTriggerRef = useRef<HTMLButtonElement>(null)

  // Filter out inactive providers
  const activeProviders = providers.filter(
    (provider) => provider.code !== 'all'
  )

  // Update temp state when props change
  useEffect(() => {
    setTempSelectedProviders(selectedProviders)
    setTempSelectedCategories(selectedCategories)
  }, [selectedProviders, selectedCategories])

  // Handle click outside for desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        providersDropdownRef.current &&
        !providersDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProvidersOpen(false)
      }
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Calculate dropdown positions
  useEffect(() => {
    if (isProvidersOpen && providersTriggerRef.current) {
      const triggerRect = providersTriggerRef.current.getBoundingClientRect()
      const dropdownWidth = 220
      const viewportWidth = window.innerWidth
      const spaceOnRight = viewportWidth - triggerRect.left

      setProvidersDropdownPosition(
        spaceOnRight < dropdownWidth ? 'right' : 'left'
      )
    }
  }, [isProvidersOpen])

  useEffect(() => {
    if (isCategoriesOpen && categoriesTriggerRef.current) {
      const triggerRect = categoriesTriggerRef.current.getBoundingClientRect()
      const dropdownWidth = 220
      const viewportWidth = window.innerWidth
      const spaceOnRight = viewportWidth - triggerRect.left

      setCategoriesDropdownPosition(
        spaceOnRight < dropdownWidth ? 'right' : 'left'
      )
    }
  }, [isCategoriesOpen])

  // Mobile handlers
  const handleMobileProviderSelect = (providerCode: string) => {
    let newValues: string[]

    if (providerCode === 'all') {
      newValues = tempSelectedProviders.includes('all') ? [] : ['all']
    } else {
      const filteredValues = tempSelectedProviders.filter((v) => v !== 'all')

      if (filteredValues.includes(providerCode)) {
        newValues = filteredValues.filter((v) => v !== providerCode)
      } else {
        newValues = [...filteredValues, providerCode]
      }
    }

    setTempSelectedProviders(newValues)
  }

  const handleMobileCategorySelect = (categoryCode: string) => {
    let newValues: string[]

    if (categoryCode === 'all') {
      newValues = tempSelectedCategories.includes('all') ? [] : ['all']
    } else {
      const filteredValues = tempSelectedCategories.filter((v) => v !== 'all')

      if (filteredValues.includes(categoryCode)) {
        newValues = filteredValues.filter((v) => v !== categoryCode)
      } else {
        newValues = [...filteredValues, categoryCode]
      }
    }

    setTempSelectedCategories(newValues)
  }

  const handleMobileClearAll = () => {
    setTempSelectedProviders([])
    setTempSelectedCategories([])
  }

  const handleMobileApply = () => {
    onFiltersChange(tempSelectedProviders, tempSelectedCategories)
    setIsMobileModalOpen(false)
  }

  // Desktop handlers
  const handleDesktopProviderSelect = (providerCode: string) => {
    let newValues: string[]

    if (providerCode === 'all') {
      newValues = selectedProviders.includes('all') ? [] : ['all']
    } else {
      const filteredValues = selectedProviders.filter((v) => v !== 'all')

      if (filteredValues.includes(providerCode)) {
        newValues = filteredValues.filter((v) => v !== providerCode)
      } else {
        newValues = [...filteredValues, providerCode]
      }
    }

    onFiltersChange(newValues, selectedCategories)
  }

  const handleDesktopCategorySelect = (categoryCode: string) => {
    let newValues: string[]

    if (categoryCode === 'all') {
      newValues = selectedCategories.includes('all') ? [] : ['all']
    } else {
      const filteredValues = selectedCategories.filter((v) => v !== 'all')

      if (filteredValues.includes(categoryCode)) {
        newValues = filteredValues.filter((v) => v !== categoryCode)
      } else {
        newValues = [...filteredValues, categoryCode]
      }
    }

    onFiltersChange(selectedProviders, newValues)
  }

  // Helper functions
  const getProvidersDisplayText = () => {
    if (selectedProviders.length === 0) return 'Providers'
    if (selectedProviders.includes('all')) return 'All'
    if (selectedProviders.length === 1) {
      const selectedProvider = activeProviders.find(
        (provider) => provider.code === selectedProviders[0]
      )
      return selectedProvider ? selectedProvider.name : 'Providers'
    }
    return `${selectedProviders.length} selected`
  }

  const getCategoriesDisplayText = () => {
    if (selectedCategories.length === 0) return 'Categories'
    if (selectedCategories.includes('all')) return 'All'
    if (selectedCategories.length === 1) {
      const selectedCategory = categories.find(
        (category) => category.code === selectedCategories[0]
      )
      return selectedCategory ? selectedCategory.name : 'Categories'
    }
    return `${selectedCategories.length} selected`
  }

  const getSelectedCount = () => {
    const providerCount = selectedProviders.includes('all')
      ? 0
      : selectedProviders.length
    const categoryCount = selectedCategories.includes('all')
      ? 0
      : selectedCategories.length
    return providerCount + categoryCount
  }

  const isProviderSelected = (code: string) =>
    tempSelectedProviders.includes(code)
  const isCategorySelected = (code: string) =>
    tempSelectedCategories.includes(code)

  return (
    <>
      {/* Mobile View */}
      <div className='sm:hidden'>
        <button
          onClick={() => setIsMobileModalOpen(true)}
          className='relative flex items-center gap-2 px-4 py-2 font-satoshi text-sm font-bold text-white transition-colors'
        >
          <Filter className='h-5 w-5' />
          <span>Filters</span>
          {getSelectedCount() > 0 && (
            <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-arty-red text-xs text-black'>
              {getSelectedCount()}
            </span>
          )}
        </button>

        {/* Mobile Modal */}
        {isMobileModalOpen && (
          <div className='fixed inset-0 z-50 flex items-end bg-black bg-opacity-50'>
            <div className='flex h-full w-full flex-col bg-dark-gradient'>
              {/* Header */}
              <div className='flex items-center justify-between border-b border-gray-700 p-4'>
                <h2 className='font-satoshi text-lg font-semibold text-white'>
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileModalOpen(false)}
                  className='rounded-lg p-2 transition-colors hover:bg-gray-800'
                >
                  <X className='h-5 w-5 text-gray-400' />
                </button>
              </div>

              {/* Tabs */}
              <div className='mx-4 mt-4 flex gap-2 rounded-lg border border-mirage bg-dark-grey-gradient px-2 py-1'>
                <Button
                  onClick={() => setActiveTab('providers')}
                  variant={activeTab === 'providers' ? 'secondary2' : 'none'}
                  className='flex-1 rounded-md px-4 py-2 font-satoshi text-sm font-semibold transition-colors'
                >
                  Providers
                </Button>
                <Button
                  onClick={() => setActiveTab('categories')}
                  variant={activeTab === 'categories' ? 'secondary2' : 'none'}
                  className='flex-1 rounded-md px-4 py-2 font-satoshi text-sm font-semibold transition-colors'
                >
                  Categories
                </Button>
              </div>

              {/* Content */}
              <div className='flex-1 overflow-y-auto p-4'>
                {activeTab === 'providers' ? (
                  <div className='space-y-1'>
                    {/* All Providers Option */}
                    <div
                      onClick={() => handleMobileProviderSelect('all')}
                      className='flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-800'
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                            isProviderSelected('all')
                              ? 'border-arty-red bg-arty-red'
                              : 'border-gray-600 bg-transparent'
                          }`}
                        >
                          {isProviderSelected('all') && (
                            <Check className='h-3 w-3 text-black' />
                          )}
                        </div>
                        <span className='font-satoshi text-sm font-normal text-white'>
                          All Providers
                        </span>
                      </div>
                    </div>

                    {/* Individual Providers */}
                    {activeProviders.map((provider) => (
                      <div
                        key={provider._id}
                        onClick={() =>
                          handleMobileProviderSelect(provider.code)
                        }
                        className='flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-800'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                              isProviderSelected(provider.code)
                                ? 'border-arty-red bg-arty-red'
                                : 'border-gray-600 bg-transparent'
                            }`}
                          >
                            {isProviderSelected(provider.code) && (
                              <Check className='h-3 w-3 text-black' />
                            )}
                          </div>
                          <span className='font-satoshi text-sm font-normal text-white'>
                            {provider.name}
                          </span>
                        </div>
                        {provider.gamesCount > 0 && (
                          <span className='rounded-full bg-arty-red px-2 py-1 text-xs text-white'>
                            {provider.gamesCount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='space-y-1'>
                    {/* All Categories Option */}
                    <div
                      onClick={() => handleMobileCategorySelect('all')}
                      className='flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-800'
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                            isCategorySelected('all')
                              ? 'border-arty-red bg-arty-red'
                              : 'border-gray-600 bg-transparent'
                          }`}
                        >
                          {isCategorySelected('all') && (
                            <Check className='h-3 w-3 text-black' />
                          )}
                        </div>
                        <span className='font-satoshi text-sm font-normal text-white'>
                          All Categories
                        </span>
                      </div>
                    </div>

                    {/* Individual Categories */}
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        onClick={() =>
                          handleMobileCategorySelect(category.code)
                        }
                        className='flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-800'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                              isCategorySelected(category.code)
                                ? 'border-arty-red bg-arty-red'
                                : 'border-gray-600 bg-transparent'
                            }`}
                          >
                            {isCategorySelected(category.code) && (
                              <Check className='h-3 w-3 text-black' />
                            )}
                          </div>
                          <span className='font-satoshi text-sm font-normal text-white'>
                            {category.name}
                          </span>
                        </div>
                        {category.gamesCount && category.gamesCount > 0 && (
                          <span className='rounded-full bg-arty-red px-2 py-1 font-satoshi text-xs text-white'>
                            {category.gamesCount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className='flex gap-3 border-t border-gray-700 p-4'>
                <button
                  onClick={handleMobileClearAll}
                  className='flex-1 rounded-lg bg-gray-700 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-600'
                >
                  Clear Filter
                </button>
                <button
                  onClick={handleMobileApply}
                  className='flex-1 rounded-lg bg-white px-4 py-3 font-medium text-black transition-colors hover:bg-gray-100'
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className='hidden gap-4 font-satoshi sm:flex'>
        {/* Providers Dropdown */}
        <div className='space-y-2'>
          <div className='relative' ref={providersDropdownRef}>
            <button
              ref={providersTriggerRef}
              onClick={() => setIsProvidersOpen(!isProvidersOpen)}
              className='flex h-10 min-w-[126px] items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors'
            >
              <span className='truncate font-bold text-white'>
                {getProvidersDisplayText()}
              </span>
              <ChevronDown
                className={`ml-2 h-4 w-4 flex-shrink-0 text-white transition-transform ${isProvidersOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isProvidersOpen && (
              <div
                className={`absolute top-full z-50 mt-1 !min-w-[220px] max-w-[calc(100vw-1rem)] rounded-lg border border-mirage bg-cinder shadow-lg ${
                  providersDropdownPosition === 'left' ? 'left-0' : 'right-0'
                }`}
              >
                <div className='max-h-64 overflow-y-auto'>
                  <div
                    onClick={() => handleDesktopProviderSelect('all')}
                    className='flex cursor-pointer items-center justify-between border-b border-mirage px-4 py-2 text-sm hover:bg-custom-dual-gradient'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='relative'>
                        <div
                          className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors ${
                            selectedProviders.includes('all')
                              ? 'border-arty-red bg-arty-red'
                              : 'border-[#3B3D46] bg-transparent'
                          }`}
                        >
                          {selectedProviders.includes('all') && (
                            <Check className='h-3 w-3 text-white' />
                          )}
                        </div>
                      </div>
                      <span className='font-satoshi font-medium text-white'>
                        All Providers
                      </span>
                    </div>
                  </div>

                  {activeProviders.map((provider) => (
                    <div
                      key={provider._id}
                      onClick={() => handleDesktopProviderSelect(provider.code)}
                      className='flex cursor-pointer items-center justify-between px-4 py-1.5 text-sm hover:bg-custom-dual-gradient'
                    >
                      <div className='flex flex-1 items-center gap-3'>
                        <div className='relative'>
                          <div
                            className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors ${
                              selectedProviders.includes(provider.code)
                                ? 'border-arty-red bg-arty-red'
                                : 'border-[#3B3D46] bg-transparent'
                            }`}
                          >
                            {selectedProviders.includes(provider.code) && (
                              <Check className='h-3 w-3 text-white' />
                            )}
                          </div>
                        </div>
                        <div className='flex w-full flex-1 flex-row items-center justify-between gap-4'>
                          <div className='flex-1 text-white'>
                            {provider.name}
                          </div>
                          {provider.gamesCount && (
                            <div className='min-w-8 rounded-full bg-arty-red px-2.5 py-0.5 text-center font-satoshi text-xs font-normal text-white'>
                              {provider.gamesCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex gap-2 border-t border-gray-600 p-4'>
                  <button
                    onClick={() => onFiltersChange([], selectedCategories)}
                    className='flex-1 rounded-lg bg-[#FFFFFF80] px-2 py-1.5 text-xs font-normal text-white transition-colors hover:bg-gray-500'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsProvidersOpen(false)}
                    className='flex-1 rounded-lg bg-white px-2 py-1.5 text-xs font-normal text-gray-900 transition-colors hover:bg-gray-100'
                  >
                    Ok
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories Dropdown */}
        <div className='space-y-2'>
          <div className='relative' ref={categoriesDropdownRef}>
            <button
              ref={categoriesTriggerRef}
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className='flex h-10 min-w-[126px] items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors'
            >
              <span className='truncate font-satoshi font-bold text-white'>
                {getCategoriesDisplayText()}
              </span>
              <ChevronDown
                className={`ml-2 h-4 w-4 flex-shrink-0 text-white transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCategoriesOpen && (
              <div
                className={`absolute top-full z-50 mt-1 !min-w-[220px] max-w-[calc(100vw-1rem)] rounded-lg border border-mirage bg-cinder shadow-lg ${
                  categoriesDropdownPosition === 'left' ? 'left-0' : 'right-0'
                }`}
              >
                <div className='max-h-64 overflow-y-auto'>
                  <div
                    onClick={() => handleDesktopCategorySelect('all')}
                    className='flex cursor-pointer items-center justify-between border-b border-mirage px-4 py-2 text-sm hover:bg-custom-dual-gradient'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='relative'>
                        <div
                          className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors ${
                            selectedCategories.includes('all')
                              ? 'border-arty-red bg-arty-red'
                              : 'border-[#3B3D46] bg-transparent'
                          }`}
                        >
                          {selectedCategories.includes('all') && (
                            <Check className='h-3 w-3 text-white' />
                          )}
                        </div>
                      </div>
                      <span className='font-satoshi font-medium text-white'>
                        All Categories
                      </span>
                    </div>
                  </div>

                  {categories.map((category) => (
                    <div
                      key={category._id}
                      onClick={() => handleDesktopCategorySelect(category.code)}
                      className='flex cursor-pointer items-center justify-between px-4 py-1.5 text-sm hover:bg-custom-dual-gradient'
                    >
                      <div className='flex flex-1 items-center gap-3'>
                        <div className='relative'>
                          <div
                            className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors ${
                              selectedCategories.includes(category.code)
                                ? 'border-arty-red bg-arty-red'
                                : 'border-[#3B3D46] bg-transparent'
                            }`}
                          >
                            {selectedCategories.includes(category.code) && (
                              <Check className='h-3 w-3 text-white' />
                            )}
                          </div>
                        </div>
                        <div className='flex w-full flex-1 flex-row items-center justify-between gap-4'>
                          <div className='flex-1 text-white'>
                            {category.name}
                          </div>
                          {category.gamesCount && (
                            <div className='min-w-8 rounded-full bg-arty-red px-2.5 py-0.5 text-center font-satoshi text-xs font-normal text-white'>
                              {category.gamesCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='flex gap-2 border-t border-gray-600 p-4'>
                  <button
                    onClick={() => onFiltersChange(selectedProviders, [])}
                    className='flex-1 rounded-lg bg-[#FFFFFF80] px-2 py-1.5 text-xs font-normal text-white transition-colors hover:bg-gray-500'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsCategoriesOpen(false)}
                    className='flex-1 rounded-lg bg-white px-2 py-1.5 text-xs font-normal text-gray-900 transition-colors hover:bg-gray-100'
                  >
                    Ok
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ResponsiveFilter
