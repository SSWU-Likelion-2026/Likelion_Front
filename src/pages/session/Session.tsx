// react
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// api
import { getSessions } from '../../api/session/session'

// types 
import type { Session } from '../../types/session/session'

// components
import Banner from '../../components/Banner'
import ToggleGroup from '../../components/ToggleGroup'
import SessionFolder from '../../components/session/SessionFolder'

// assets
import Toggle from '../../img/session/toggle.svg'

const parts = ['기획/디자인', '프론트엔드', '백엔드']
const generations = ['14기', '13기', '12기']
const partMap: Record<string, string> = {
  '기획/디자인': 'PM',
  '프론트엔드': 'FRONTEND',
  '백엔드': 'BACKEND',
}

function Session() {
  const navigate = useNavigate()
  const [track, setTrack] = useState('기획/디자인')
  const [generation, setGeneration] = useState('14기')
  const [sessionData, setSessionData] = useState<Session[]>([])
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    const term = parseInt(generation)
    getSessions(term, partMap[track]).then(res =>
      setSessionData(res.result.sessions)
    )
  }, [track, generation])

  return (
    <div className="flex flex-col">
      <Banner page="Session" />
      <div className="flex flex-col items-center px-30 gap-10 rounded-t-[25px] bg-white -mt-6 relative">

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
        
        {sessionData.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-25">
            <h1 className='text-[34px] font-semibold'>조회된 세션이 없습니다.</h1>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {sessionData.map((item) => (
            <SessionFolder
              key={item.sessionId}
              week={item.weekNumber}
              title={item.title}
              onClick={() => navigate(`/session/${item.weekNumber}`, { state: { part: track, title: item.title } })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Session
