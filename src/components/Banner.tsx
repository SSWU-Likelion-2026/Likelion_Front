interface Props {
  page: string
}

export default function Banner({ page }: Props) {
  return (
    <div className="w-full h-70 relative bg-gradient-to-b from-[#5D23E3] to-[#B0E7D5]">
      <h1 className="absolute left-30 bottom-16 text-[95px] font-semibold leading-none text-white font-montserrat">
        {page}
      </h1>
    </div>
  )
}
