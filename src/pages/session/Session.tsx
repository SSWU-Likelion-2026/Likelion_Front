// react
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// api
import { getSessions } from '../../api/session/session'

// types 
import type { Session as SessionItem } from '../../types/session/session'

// components
import Banner from '../../components/Banner'
import EmptyState from '../../components/EmptyState'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const track = searchParams.get('track') ?? '기획/디자인'
  const generation = searchParams.get('generation') ?? '14기'

  const setTrack = (value: string) => setSearchParams(prev => { prev.set('track', value); return prev })
  const setGeneration = (value: string) => setSearchParams(prev => { prev.set('generation', value); return prev })
  const [sessionData, setSessionData] = useState<SessionItem[]>([])
  const [openTrack, setOpenTrack] = useState(false)
  const [openGen, setOpenGen] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const genMobileRef = useRef<HTMLDivElement>(null)
  const genDesktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (trackRef.current && !trackRef.current.contains(e.target as Node)) setOpenTrack(false)
      if (
        genMobileRef.current && !genMobileRef.current.contains(e.target as Node) &&
        genDesktopRef.current && !genDesktopRef.current.contains(e.target as Node)
      ) setOpenGen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const term = parseInt(generation)
    getSessions(term, partMap[track])
      .then(res => setSessionData(res.result?.sessions ?? []))
      .catch(() => setSessionData([]))
  }, [track, generation])

  return (
    <div className="flex flex-col">
      <Banner page="Session" />
      <div className="flex flex-col items-center px-6 xl:px-[195px] gap-10 rounded-t-[25px] bg-white -mt-6 relative">

        {/* 모바일: 트랙 드롭다운 + 기수 드롭다운 */}
        <div className='lg:hidden flex w-full gap-3 mt-9'>
          <div ref={trackRef} className="relative w-[118px]">
            <button
              onClick={() => setOpenTrack(!openTrack)}
              className="flex items-center justify-between px-3 w-full h-[53px] border border-gray-9 rounded-[10px] bg-white cursor-pointer"
            >
              <span className="text-[14px] text-gray-2">{track}</span>
              <img src={Toggle} alt="" className={`transition-transform duration-200 ${openTrack ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {openTrack && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-9 rounded-[10px] overflow-hidden z-10 shadow-sm">
                {parts.map((part) => (
                  <button
                    key={part}
                    onClick={() => { setTrack(part); setOpenTrack(false) }}
                    className={`w-full px-3 h-11.5 text-left text-[15px] cursor-pointer transition-colors duration-100
                      ${track === part ? 'font-medium' : 'text-gray-2 hover:bg-gray-10'}`}
                  >
                    {part}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div ref={genMobileRef} className="relative">
            <button
              onClick={() => setOpenGen(!openGen)}
              className="flex items-center justify-between px-3 w-29.5 h-[53px] border border-gray-9 rounded-[10px] bg-white cursor-pointer"
            >
              <span className="text-[15px] text-gray-2">{generation}</span>
              <img src={Toggle} alt="" className={`transition-transform duration-200 ${openGen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {openGen && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-29.5 bg-white border border-gray-9 rounded-[10px] overflow-hidden z-10 shadow-sm">
                {generations.map((gen) => (
                  <button
                    key={gen}
                    onClick={() => { setGeneration(gen); setOpenGen(false) }}
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

        {/* 데스크탑: ToggleGroup + 기수 드롭다운 */}
        <div className='hidden lg:flex items-center w-full justify-between mt-9'>
          <ToggleGroup options={parts} value={track} onChange={setTrack} />
          <div ref={genDesktopRef} className="relative self-end">
            <button
              onClick={() => setOpenGen(!openGen)}
              className="flex items-center justify-between px-3 w-29.5 h-[53px] border border-gray-9 rounded-[10px] bg-white cursor-pointer"
            >
              <span className="text-[15px] text-gray-2">{generation}</span>
              <img src={Toggle} alt="" className={`transition-transform duration-200 ${openGen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {openGen && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-29.5 bg-white border border-gray-9 rounded-[10px] overflow-hidden z-10 shadow-sm">
                {generations.map((gen) => (
                  <button
                    key={gen}
                    onClick={() => { setGeneration(gen); setOpenGen(false) }}
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
        
        {sessionData.length === 0 && <EmptyState message="조회된 세션이 없습니다." />}
        <div className="grid grid-cols-2 xl:grid-cols-3 min-[1440px]:grid-cols-4 gap-4 xl:gap-10 pb-5 lg:pb-12">
          {sessionData.map((item) => (
            <SessionFolder
              key={item.sessionId}
              part={partMap[track]}
              week={item.weekNumber}
              title={item.title}
              onClick={() => navigate(`/session/${item.weekNumber}?term=${parseInt(generation)}&part=${partMap[track]}`, { state: { sessions: sessionData } })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Session
