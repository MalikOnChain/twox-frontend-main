'use client'

interface ToggleRadioProps {
  label: string
  subLabel?: string
  isOn: boolean
  onChange: (isOn: boolean) => void
  name: string
}

const Radio = ({ label, isOn, onChange, name, subLabel }: ToggleRadioProps) => {
  return (
    <div className='flex items-center gap-2.5'>
      {/* Toggle Switch */}
      <div className='relative'>
        <input
          type='radio'
          name={name}
          checked={isOn}
          onChange={() => onChange(!isOn)}
          className='sr-only'
        />
        <div
          onClick={() => onChange(!isOn)}
          className={`relative flex h-6 w-[58px] cursor-pointer items-center rounded-full transition-all duration-300 ${
            isOn ? 'bg-arty-red' : 'bg-[#1f1f1f]'
          }`}
        >
          {/* ON/OFF Text */}
          <div className='absolute inset-0 flex items-center justify-between px-3'>
            <span
              className={`font-satoshi text-xs font-light text-white transition-opacity duration-300 ${
                isOn ? 'text-white opacity-100' : 'text-transparent opacity-0'
              }`}
            >
              ON
            </span>
            <span
              className={`font-satoshi text-xs font-light text-white transition-opacity duration-300 ${
                !isOn ? 'text-white opacity-100' : 'text-transparent opacity-0'
              }`}
            >
              OFF
            </span>
          </div>

          {/* Toggle Circle */}
          <div
            className={`absolute h-[18px] w-[18px] rounded-full bg-white shadow-lg transition-transform duration-300 ${
              isOn ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </div>
      </div>

      {/* Label */}
      <div>
        <p className='font-satoshi text-sm font-normal text-white'>{label}</p>
        {subLabel && (
          <p className='font-satoshi text-sm font-normal text-white'>
            {subLabel}
          </p>
        )}
      </div>
    </div>
  )
}

export default Radio
