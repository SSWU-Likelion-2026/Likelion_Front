import { useState } from 'react'
import ToggleGroup from '../ToggleGroup'
import chevronUp from '../../img/recruiting/up.png'
import chevronDown from '../../img/recruiting/down.png'

/* ------------------------------------------------------------------ *
 * FAQ 내용 
 * ------------------------------------------------------------------ */

type FaqItem = {
  question: string
  answer: string
}

type FaqGroup = {
  category: string
  items: FaqItem[]
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    category: '기획/디자인',
    items: [
      {
        question: '디자인을 한 번도 해본 적 없어도 지원할 수 있나요?',
        answer:
          '네. 디자인 경험이 없어도 괜찮습니다. 기초부터 차근차근 배우며 프로젝트를 통해 실력을 키울 수 있습니다.',
      },
      {
        question: '기획과 디자인을 둘 다 배우나요?',
        answer:
          '네. 서비스 기획과 UX/UI 디자인을 함께 경험하며 사용자 중심의 서비스를 만드는 과정을 배우게 됩니다.',
      },
      {
        question: '어떤 툴을 사용하나요?',
        answer: '주로 노션과 피그마를 사용하며 협업을 위한 다양한 툴도 함께 익히게 됩니다.',
      },
      {
        question: '프로젝트에서는 어떤 역할을 맡나요?',
        answer:
          '서비스 기획, 사용자 리서치, 와이어프레임 제작, UI 디자인 등 서비스의 방향을 설계하는 역할을 담당합니다.',
      },
    ],
  },
  {
    category: '프론트엔드',
    items: [
      {
        question: '개발을 처음 시작해도 괜찮나요?',
        answer:
          '네. 프로그래밍 기초부터 차근차근 학습하기 때문에 처음 시작하는 분도 참여할 수 있습니다.',
      },
      {
        question: '어떤 언어를 배우나요?',
        answer: 'HTML, CSS, JavaScript를 기반으로 React 등 최신 프론트엔드 기술을 학습합니다.',
      },
      {
        question: '프로젝트에서는 어떤 일을 하나요?',
        answer: '사용자가 사용하는 웹 화면을 구현하고, 서버와 연동하여 실제 서비스를 완성합니다.',
      },
      {
        question: '프론트엔드를 배우면 어떤 분야로 이어질 수 있나요?',
        answer: '웹 개발, 앱 개발, 인터랙션 개발 등 다양한 프론트엔드 분야로 확장할 수 있습니다.',
      },
    ],
  },
  {
    category: '백엔드',
    items: [
      {
        question: '백엔드는 어떤 일을 하나요?',
        answer:
          '사용자의 요청을 처리하고 데이터를 저장·관리하며, 서비스가 안정적으로 동작하도록 서버를 개발합니다.',
      },
      {
        question: '서버 배포도 경험할 수 있나요?',
        answer:
          '네. 해커톤과 프로젝트 등을 통해서 서비스를 실제로 배포하고 운영하는 과정까지 경험할 수 있습니다.',
      },
      {
        question: '프로젝트에서는 어떤 역할을 하나요?',
        answer:
          'API 개발, 데이터베이스 설계, 인증 기능 구현, 서버 운영 등 서비스의 핵심 기능을 개발합니다.',
      },
      {
        question: '백엔드를 배우면 어떤 분야로 이어질 수 있나요?',
        answer:
          '웹 서버 개발, 클라우드, DevOps, 데이터 엔지니어링 등 다양한 분야로 확장할 수 있습니다.',
      },
    ],
  },
]

export default function FaqSection() {
  const [category, setCategory] = useState(FAQ_GROUPS[0].category)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = FAQ_GROUPS.find((g) => g.category === category)?.items ?? []

  return (
    <section className="flex flex-col items-center w-full py-20">
      <p className="text-[38px] font-semibold text-black font-montserrat">FAQ</p>

      <div className="mt-10 text-[18px] font-regular">
        <ToggleGroup
          options={FAQ_GROUPS.map((g) => g.category)}
          value={category}
          onChange={(v) => {
            setCategory(v)
            setOpenIndex(null)
          }}
        />
      </div>

      <ul className="mt-10 flex w-full max-w-[1200px] flex-col gap-8">
        {items.map((item, index) => {
          const open = openIndex === index
          return (
            <li
              key={item.question}
              className={`w-[1200px] max-w-full rounded-[20px] border border-gray-9 bg-white px-8 py-6 ${
                open ? 'h-[226px]' : ''
              }`}
            >
              <button
                onClick={() => setOpenIndex(open ? null : index)}
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
                <div className="mt-[38px] border-t border-[#D0D6DD] pt-[38px]">
                  <p className="text-[24px] leading-relaxed text-[#D0D6DD]">
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
