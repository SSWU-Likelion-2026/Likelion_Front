interface Props {
  page: string
}

export default function Banner({ page }: Props) {
  return (
    <div className="w-full h-[258px] relative bg-gradient-to-b from-[#5D23E3] to-accent-100">
      <h1 className="absolute left-6 lg:left-30 bottom-16 text-[45px] lg:text-[95px] font-semibold leading-none text-white font-montserrat">
        {page}
      </h1>
    </div>
  )
}
