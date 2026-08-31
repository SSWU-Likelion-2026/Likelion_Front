import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import ProfileImg from '../../img/session/profile.jpg'

interface LocationState {
  part: string
  title: string
  noneWeeks?: string[]
}

interface Review {
  id: number
  name: string
  content: string
}

const weeks = ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10']

const mockTags = ['문제와 맥락정리', '데스크 리서치 및 경쟁사분석', '핵심 솔루션 설계', '설득력있는 PPT 스토리 만들기']

const mockDescription = `좋은 아이디어를 실제 서비스 기획으로 발전시키기 위해서는 문제의 배경과 사용자를 이해하고, 리서치를 통해 근거를 확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다. 좋은 아이디어를 실제 서비스 기획으로 발전시키기 위해서는 문제의 배경과 사용자를 이해하고, 리서치를 통해 근거를 확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다.`

const initialReviews: Review[] = [
  { id: 1, name: '성이름', content: '확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다.' },
  { id: 2, name: '성이름', content: '확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다.' },
  { id: 3, name: '성이름', content: '확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다.' },
]

export default function SessionDetail() {
  const { week } = useParams<{ week: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { part, title, noneWeeks = [] } = (location.state as LocationState) ?? { part: '', title: '', noneWeeks: [] }
  const [lockedModalOpen, setLockedModalOpen] = useState(false)

  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  const handleSubmit = () => {
    if (!reviewText.trim()) return
    setReviews(prev => [...prev, { id: Date.now(), name: '성이름', content: reviewText }])
    setReviewText('')
  }

  const handleDelete = (id: number) => {
    setReviews(prev => prev.filter(r => r.id !== id))
    setDeleteTargetId(null)
    setOpenMenuId(null)
  }

  const handleEditStart = (review: Review) => {
    setEditingId(review.id)
    setEditText(review.content)
    setOpenMenuId(null)
  }

  const handleEditSave = (id: number) => {
    if (!editText.trim()) return
    setReviews(prev => prev.map(r => r.id === id ? { ...r, content: editText } : r))
    setEditingId(null)
  }

  return (
    <div className="mt-[43px] px-12 flex justify-center gap-[78px] min-h-screen">
      
      <aside className="w-[102px] y-[64px] shrink-0 flex flex-col">
        {weeks.map(w => (
          <button
            key={w}
            onClick={() => noneWeeks.includes(w) ? setLockedModalOpen(true) : navigate(`/session/${w}`, { state: { part, title, noneWeeks } })}
            className={`mb-[21px] px-[28.9px] py-[19px] rounded-[5px] text-[22px] font-medium text-center cursor-pointer
              ${w === week ? 'bg-black text-white' : 'text-gray-8'}`}
          >
            {w}
          </button>
        ))}
      </aside>
      
      <main className="w-[1020px] flex flex-col justify-center">
        
        <header className='flex flex-col gap-[35px]'>
            <p className="text-[18px] text-gray-4">{part} &gt; {week}</p>
            <h1 className="text-[32px] text-black">[{week}] {title}</h1>
        </header>
        
        {/* 이미지 */}
        <div className="w-full h-[693px] bg-gray-10 rounded-[20px] mt-[45px] mb-[45px]">
        </div>

        <div>
            <h2 className="text-[24px] font-semibold">기획의 과정과 스토리텔링 설계</h2>
            <p className="text-[18px] mt-[15px]">{mockDescription}</p>

            <h3 className="text-[24px] font-semibold mt-[45px]">주요학습 내용</h3>
            <div className="flex flex-wrap gap-2 mt-[15px]">
            {mockTags.map(tag => (
                <span key={tag} className="px-3 py-3 rounded-[5px] bg-[#F3F4F6] text-[16px]">
                {tag}
                </span>
            ))}
            </div>
        </div>

        <div className="mt-[87px] border border-gray-9 rounded-[15px] p-[35px]">
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="세션 후기 입력하기"
            className="w-full h-[245px] text-[20px] text-black placeholder:text-gray-4 resize-none outline-none"
          />
        </div>
        <div className="flex justify-end mt-5.25">
          <button
            onClick={handleSubmit}
            className="w-26 h-15.5 border border-gray-9 text-[20px] text-[#697584] rounded-[9px] cursor-pointer"
          >
            후기 등록
          </button>
        </div>

        <div className="mt-[31px] flex flex-col gap-[25px] pb-[176px]">
          {reviews.map(review => {
            const isEditing = editingId === review.id
            return (
              <div key={review.id} className="flex gap-[13px] relative p-2">
                <img src={ProfileImg} alt="profile" className="w-[50px] h-[50px] object-cover shrink-0" />
                <div className="flex-1">
                  <p className="text-[22px] font-semibold mb-[6px]">{review.name}</p>
                  {isEditing ? (
                    <>
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="w-full text-[18px] resize-none outline-none border-b border-gray-8 pb-8px]"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-[15px] mt-[23px]">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-5 py-3 border border-gray-9 text-[20px] text-[#697584] rounded-[10px] cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleEditSave(review.id)}
                          className="px-5 py-3 bg-primary-100 text-white text-[20px] rounded-[10px] cursor-pointer"
                        >
                          저장
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-[18px] font-normal">{review.content}</p>
                  )}
                </div>
                <div className="relative shrink-0">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === review.id ? null : review.id)}
                    className="text-gray-5 text-xl cursor-pointer px-1 hover:text-gray-2"
                  >
                    ⋮
                  </button>
                  {openMenuId === review.id && (
                    <div className="absolute right-0 top-7 w-24 bg-white border border-gray-9 rounded-lg shadow-sm overflow-hidden z-10">
                      <button
                        onClick={() => handleEditStart(review)}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-gray-2 hover:bg-gray-10 cursor-pointer"
                      >
                        수정하기
                      </button>
                      <button
                        onClick={() => { setDeleteTargetId(review.id); setOpenMenuId(null) }}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-gray-2 hover:bg-gray-10 cursor-pointer"
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Modal
        open={deleteTargetId !== null}
        title="댓글 삭제"
        message="정말로 삭제하시겠습니까?"
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId !== null && handleDelete(deleteTargetId)}
      />
      <Modal
        open={lockedModalOpen}
        title="미공개 세션"
        message="아직 공개된 세션이 아닙니다"
        onClose={() => setLockedModalOpen(false)}
        onConfirm={() => setLockedModalOpen(false)}
        confirmOnly
        confirmClassName="px-8 py-3 bg-gray-1 text-white text-[18px] rounded-[10px] cursor-pointer hover:bg-gray-2"
      />
    </div>
  )
}
