interface Props {
  message: string
}

export default function EmptyState({ message }: Props) {
  return (
    <div className="flex min-h-[300px] w-full items-start justify-center pt-[20px]">
      <p className="text-center text-[34px] font-semibold leading-[50px] text-black">{message}</p>
    </div>
  )
}
