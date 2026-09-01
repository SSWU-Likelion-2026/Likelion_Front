import { useState } from 'react'
import ToggleGroup from '../ToggleGroup'
import chevronUp from '../../img/recruiting/up.png'
import chevronDown from '../../img/recruiting/down.png'
import type { FaqInfo, PartInfo } from '../../api/recruit'

type Props = {
  parts: PartInfo[]
  faqs: FaqInfo[]
}

export default function FaqSection({ parts, faqs }: Props) {
  const [partName, setPartName] = useState(parts[0]?.name ?? '')
  const [openId, setOpenId] = useState<number | null>(null)

  const selectedPartId = parts.find((p) => p.name === partName)?.partId ?? null

  const items = faqs.filter(
    (f) => f.partId === selectedPartId || f.partId == null,
  )

  return (
    <section className="flex flex-col items-center w-full py-20">
      <p className="text-[32px] font-semibold text-black font-montserrat">FAQ</p>

      <div className="mt-10 text-[18px] font-regular">
        <ToggleGroup
          options={parts.map((p) => p.name)}
          value={partName}
          onChange={(v) => {
            setPartName(v)
            setOpenId(null)
          }}
        />
      </div>

      <ul className="mt-10 flex w-full max-w-[1200px] flex-col gap-8">
        {items.map((item) => {
          const open = openId === item.faqId
          return (
            <li
              key={item.faqId}
              className="rounded-[12px] border border-gray-9 bg-white px-8 py-6"
            >
              <button
                onClick={() => setOpenId(open ? null : item.faqId)}
                className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
              >
                <span className="text-[24px] text-black">
                  Q. {item.question}
                </span>
                <img
                  src={open ? chevronUp : chevronDown}
                  alt=""
                  className="h-[9.4px] w-[22px] shrink-0"
                />
              </button>

              {open && (
                <div className="mt-5 border-t border-gray-9 pt-5">
                  <p className="text-[24px] leading-relaxed text-gray-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
