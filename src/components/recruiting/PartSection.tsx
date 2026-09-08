import type { PartInfo } from '../../api/recruiting/recruit'
import { partImageByName } from '../../lib/recruit-format'

type Props = {
  parts: PartInfo[]
}

export default function PartSection({ parts }: Props) {
  return (
    <section className="flex flex-col items-center w-full py-20">
      <p className="text-[18px] font-semibold text-black font-montserrat">
        Part
      </p>
      <h2 className="mt-2 text-[32px] font-semibold text-black">모집 분야</h2>

      <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {parts.map((part) => (
          <div
            key={part.partId}
            className="overflow-hidden rounded-[20px] border border-primary-65 bg-white shadow-card"
          >
            <img
              src={partImageByName(part.name)}
              alt=""
              className="aspect-[384/241] w-full object-cover"
            />
            <div className="flex flex-col gap-2 px-6 py-6">
              <p className="text-[20px] font-semibold text-black font-montserrat">
                {part.name}
              </p>
              <p className="text-[15px] leading-relaxed text-gray-4">
                {part.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
