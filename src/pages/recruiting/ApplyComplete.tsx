import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyApplication } from '../../api/recruiting/recruit'

function ApplyComplete() {
  // 실제 값은 백엔드(getMyApplication)에서. 로딩 전/실패 시 placeholder.
  const [name, setName] = useState('000')
  const [term, setTerm] = useState(15)

  useEffect(() => {
    getMyApplication()
      .then((mine) => {
        if (mine.applicant?.name) setName(mine.applicant.name)
        if (mine.recruitmentTerm) setTerm(mine.recruitmentTerm)
      })
      .catch(() => {
        /* 조회 실패 시 placeholder 유지 */
      })
  }, [])

  return (
    <div className="flex min-h-[calc(100svh-57px)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-[26px] font-semibold leading-relaxed text-black">
        {name}님의
        <br />
        {term}기 지원서 제출이 완료되었습니다.
      </h1>
      <p className="text-[15px] text-gray-4">지원해 주셔서 감사합니다.</p>

      <div className="mt-4 flex items-center gap-3">
        {/* TODO: 마이페이지 라우트 (Mypage API 담당자) */}
        <Link
          to="/mypage"
          className="rounded-[10px] border border-gray-9 px-7 py-3 text-[15px] text-gray-3 hover:bg-gray-10"
        >
          마이페이지로 이동
        </Link>
        {/* TODO: 제출한 지원서 조회 라우트 */}
        <Link
          to="/mypage/applications"
          className="rounded-[10px] bg-[#212121] px-7 py-3 text-[15px] font-medium text-white hover:opacity-90"
        >
          제출한 지원서 조회
        </Link>
      </div>
    </div>
  )
}

export default ApplyComplete
