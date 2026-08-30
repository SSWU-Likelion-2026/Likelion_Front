import { useEffect, useRef, useState } from 'react'
import Banner from '../components/Banner'
import ToggleGroup from '../components/ToggleGroup'
import SessionFolder from '../components/session/SessionFolder'
import Toggle from '../img/session/toggle.svg'

const parts = ['기획/디자인', '프론트엔드', '백엔드']
const generations = ['14기', '13기', '12기']

const sessions: { variant?: 'default' | 'none'; week: string; title: string }[] = [
  { week: 'W01', title: '기획자의 사고방식 시작하기' },
  { week: 'W02', title: '기획자의 사고방식 시작하기' },
  { week: 'W03', title: '기획자의 사고방식 시작하기' },
  { week: 'W04', title: '기획자의 사고방식 시작하기' },
  { week: 'W05', title: '기획자의 사고방식 시작하기' },
  { week: 'W06', title: '기획자의 사고방식 시작하기' },
  { week: 'W07', title: '기획자의 사고방식 시작하기' },
  { week: 'W08', title: '기획자의 사고방식 시작하기' },
  { week: 'W09', title: '기획자의 사고방식 시작하기' },
  { variant: 'none', week: 'W10', title: '기획자의 사고방식 시작하기' },
  { variant: 'none', week: 'W11', title: '기획자의 사고방식 시작하기' },
  { variant: 'none', week: 'W12', title: '기획자의 사고방식 시작하기' },
]

function Session() {
  const [track, setTrack] = useState('기획/디자인')
  const [open, setOpen] = useState(false)
  const [generation, setGeneration] = useState('14기')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col">
      <Banner page="Session" />
      <div className="flex flex-col items-center px-12 gap-10 rounded-t-[25px] bg-white -mt-6 relative">

        <div className='flex w-full justify-between mt-12'>
          <ToggleGroup options={parts} value={track} onChange={setTrack} />
          <div ref={ref} className="relative self-end">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between px-3 w-29.5 h-11.5 border border-gray-9 rounded-[10px] bg-white cursor-pointer"
            >
              <span className="text-[15px] text-gray-2">{generation}</span>
              <img
                src={Toggle}
                alt=""
                className={`transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
            {open && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-29.5 bg-white border border-gray-9 rounded-[10px] overflow-hidden z-10 shadow-sm">
                {generations.map((gen) => (
                  <button
                    key={gen}
                    onClick={() => { setGeneration(gen); setOpen(false) }}
                    className={`w-full px-3 h-11.5 text-left text-[15px] cursor-pointer transition-colors duration-100
                      ${generation === gen ? 'font-medium' : 'text-gray-2 hover:bg-gray-10'}`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {sessions.map((item) => (
            <SessionFolder key={item.week} variant={item.variant} week={item.week} title={item.title} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Session
