interface Props {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function ToggleGroup({ options, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-8">
      {options.map((option) => {
        const selected = option === value
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-6 py-3 rounded-full text-[17px] cursor-pointer transition-colors duration-150 ${
              selected
                ? 'bg-[#2b2b2b] text-white font-medium'
                : 'text-gray-5 hover:text-gray-2'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
