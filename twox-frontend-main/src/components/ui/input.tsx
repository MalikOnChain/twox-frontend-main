'use client'
import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'prefix' | 'suffix'> {
  startAddon?: React.ReactNode
  endAddon?: React.ReactNode
  wrapperClassName?: string
  containerClassName?: string
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type: initialType,
      startAddon,
      endAddon,
      wrapperClassName,
      defaultValue,
      containerClassName,
      value,
      label,
      error,
      ...props
    },
    ref
  ) => {
    // Create an internal ref to track the current value
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    // Combine refs (from react-hook-form and our internal ref)
    const combinedRef = (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    // Track if input has value
    const [hasValue, setHasValue] = React.useState<boolean>(
      Boolean(defaultValue || value || (inputRef.current?.value ?? ''))
    )

    // Update hasValue for both controlled and uncontrolled inputs
    React.useEffect(() => {
      const currentValue = value ?? inputRef.current?.value ?? ''
      setHasValue(Boolean(currentValue))
    }, [value])

    // Password visibility state
    const [showPassword, setShowPassword] = React.useState(false)
    const type =
      initialType === 'password' && showPassword ? 'text' : initialType

    // Start Addon Ref
    const startAddonRef = React.useRef<HTMLDivElement>(null)

    // Track focus state
    const [isFocused, setIsFocused] = React.useState(false)

    // Handle controlled and uncontrolled input value changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const togglePassword = () => {
      setShowPassword(!showPassword)
    }

    const renderPasswordToggle = () => {
      if (initialType !== 'password') return null

      return (
        <button
          type='button'
          onClick={togglePassword}
          className='flex items-center px-3 pl-2 text-muted-foreground transition-colors duration-200 hover:text-foreground'
        >
          {showPassword ? (
            <EyeOff className='h-4 w-4' />
          ) : (
            <Eye className='h-4 w-4' />
          )}
        </button>
      )
    }

    const renderInput = () => (
      <input
        type={type}
        className={cn(
          'peer h-full w-full rounded-none border-none bg-transparent font-satoshi text-sm outline-none file:bg-transparent file:text-sm file:font-medium',
          'transition-all duration-300',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-90 disabled:placeholder:text-muted-foreground',
          'placeholder:text-muted-foreground',
          // Autofill override styles
          'autofill:bg-cinder autofill:text-foreground',
          'autofill:shadow-[inset_0_0_0px_1000px_theme(colors.cinder)]',
          'autofill:[-webkit-text-fill-color:theme(colors.foreground)]',
          startAddon ? 'pl-0' : 'pl-3',
          initialType === 'password' || endAddon ? 'pr-0' : 'pr-3',
          'py-2',
          (endAddon || initialType === 'password') && 'border-none',
          className
        )}
        ref={combinedRef}
        defaultValue={defaultValue}
        value={value}
        placeholder={props.placeholder}
        {...props}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={handleChange}
      />
    )

    const renderLabel = () => {
      if (!label) return null

      return (
        <label
          htmlFor={props.id}
          className={cn(
            'mb-2 block font-satoshi text-xs font-bold text-foreground',
            error && 'text-destructive'
          )}
        >
          {label}
        </label>
      )
    }

    const renderError = () => {
      if (!error) return null

      return <span className='mt-1.5 text-xs text-destructive'>{error}</span>
    }

    // If no addons and not password type, wrap input in the styled container
    if (!startAddon && !endAddon && initialType !== 'password') {
      return (
        <div className={cn('flex flex-col', containerClassName)}>
          {renderLabel()}
          <div
            className={cn(
              'relative flex h-10 w-full items-center overflow-hidden rounded-lg bg-cinder',
              // { 'border-mulberry border': isFocused && !error },
              props.disabled && 'cursor-not-allowed bg-cinder',
              error && 'border-destructive',
              wrapperClassName
            )}
            aria-disabled={props.disabled}
            data-disabled={props.disabled}
          >
            {renderInput()}
          </div>
          {renderError()}
        </div>
      )
    }

    // Return input with addons or password toggle
    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {renderLabel()}
        <div
          className={cn(
            'relative flex h-10 w-full items-center overflow-hidden rounded-lg bg-cinder',
            // { 'border border-success-100': isFocused && !error },
            props.disabled && 'cursor-not-allowed *:text-muted-foreground',
            error && initialType !== 'password' && 'border-destructive',
            (endAddon || initialType === 'password') && '',
            wrapperClassName
          )}
          aria-disabled={props.disabled}
          data-disabled={props.disabled}
        >
          {startAddon && (
            <div
              className={cn(
                'flex items-center px-3 pr-2',
                hasValue ? 'text-foreground' : 'text-muted-foreground',
                'transition-colors duration-200'
              )}
              ref={startAddonRef}
            >
              {startAddon}
            </div>
          )}

          {renderInput()}

          {renderPasswordToggle()}

          {endAddon && (
            <div
              className={cn(
                'flex items-center px-3 pl-2',
                hasValue ? 'text-foreground' : 'text-muted-foreground',
                'transition-colors duration-200'
              )}
            >
              {endAddon}
            </div>
          )}
        </div>
        {renderError()}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
