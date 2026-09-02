// react
import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

// api 
import { getSessionDetail } from '../../api/session/session'

//types
import type { SessionDetailResponse } from '../../types/session/session'
import type { Session } from '../../types/session/session'

// components
import Button from '../../components/Button'
import Modal from '../../components/Modal'

// assests
import ProfileImg from '../../img/session/profile.jpg'

interface LocationState {
  sessionId: number
  sessions?: Session[]
}

interface Review {
  id: number
  name: string
  content: string
}


const initialReviews: Review[] = [
  { id: 1, name: '성이름', content: '확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다.' },
  { id: 2, name: '성이름', content: '확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다.' },
  { id: 3, name: '성이름', content: '확보한 뒤 명확한 전략과 솔루션으로 연결해야 합니다. 이번 교육에서는 아이디어를 논리적으로 구조화하고, 핵심 메시지가 잘 전달되는 발표 자료로 완성하는 과정을 학습합니다.' },
]

export default function SessionDetail() {
  const { week } = useParams<{ week: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { sessionId, sessions = [] } = (location.state as LocationState) ?? { sessionId: 0, sessions: [] }

  // 세션 상세
  const [detailData, setDetailData] = useState<SessionDetailResponse | null>(null)
  const [lockedModalOpen, setLockedModalOpen] = useState(false)

  // 세션 후기
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [reviewText, setReviewText] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  useEffect(() => {
    console.log(sessionId)
    if(!sessionId) return
    getSessionDetail(sessionId).then(res => setDetailData(res.result))
  }, [sessionId])

  
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
    <div className="mt-[43px] px-30 flex justify-center gap-[78px] min-h-screen">
      
      <aside className="w-[102px] y-[64px] shrink-0 flex flex-col">
        {sessions.map(s => (
          <button
            key={s.sessionId}
            onClick={() => navigate(`/session/${s.weekNumber}`, { state: { sessionId: s.sessionId, sessions } })}
            className={`mb-[21px] px-[28.9px] py-[19px] rounded-[5px] text-[22px] font-medium text-center cursor-pointer
              ${s.weekNumber === Number(week) ? 'bg-black text-white' : 'text-gray-8'}`}
          >
            {`W${String(s.weekNumber).padStart(2, '0')}`}
          </button>
        ))}
      </aside>
      
      <main className="flex-1 flex flex-col justify-center">
        
        <header className='flex flex-col gap-[35px]'>
            <p className="text-[18px] text-gray-4">{detailData?.part} &gt; {detailData?.weekNumber}</p>
            <h1 className="text-[32px] text-black">{detailData?.subTitle}</h1>
        </header>
        
        {/* 이미지 */}
        <div className="w-full h-[693px] bg-gray-10 rounded-[20px] mt-[45px] mb-[45px] overflow-hidden">
          <img src={detailData?.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        </div>

        <div>
            <h2 className="text-[24px] font-semibold">{detailData?.title}</h2>
            <p className="text-[18px] mt-[15px]">{detailData?.content}</p>

            <h3 className="text-[24px] font-semibold mt-[45px]">주요학습 내용</h3>
            <div className="flex flex-wrap gap-2 mt-[15px]">
            {detailData?.learningTopics.map(tag => (
                <span key={tag.sequenceNum} className="px-3 py-3 rounded-[5px] bg-[#F3F4F6] text-[16px]">
                {tag.content}
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
          <Button
            onClick={handleSubmit}
            color="white">
            후기 등록
          </Button>
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
                        <Button onClick={() => setEditingId(null)} color="white">
                          취소
                        </Button>
                        <Button onClick={() => handleEditSave(review.id)} color="Main100">
                          저장
                        </Button>
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
        confirmClassName="bg-gray-1 text-white hover:bg-gray-2"
      />
    </div>
  )
}
