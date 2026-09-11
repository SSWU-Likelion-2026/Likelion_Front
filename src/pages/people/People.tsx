import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { getUser, subscribe } from '../../lib/auth-storage'
import {
  getMyProfile,
  getProfiles,
  type MemberGroup,
  type MemberProfileDetail,
  type MemberProfileSummary,
  type MemberType,
} from '../../api/people/people'
import MemberCard, { MobileMemberCard } from '../../components/people/MemberCard'
import ProfileFormModal from '../../components/people/ProfileFormModal'
import Banner from '../../components/Banner'
import moreIcon from '../../img/people/more-icon.svg'

const TERMS = [14, 13]

const GROUP_SECTIONS: { key: MemberGroup; title: string; subtitle?: string }[] = [
  { key: 'LEADERSHIP', title: '대표단' },
  { key: 'PM', title: 'PM', subtitle: '기획/디자인' },
  { key: 'FE', title: 'FE', subtitle: '프론트엔드' },
  { key: 'BE', title: 'BE', subtitle: '백엔드' },
]

function People() {
  const user = useSyncExternalStore(subscribe, getUser, () => null)
  const [term, setTerm] = useState(TERMS[0])
  const [memberType, setMemberType] = useState<MemberType>('STAFF')
  const [members, setMembers] = useState<MemberProfileSummary[] | null>(null)
  const [modalMode, setModalMode] = useState<'closed' | 'create' | 'edit'>('closed')
  const [myProfile, setMyProfile] = useState<MemberProfileDetail | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)

  const loadMembers = useCallback(() => {
    // 비로그인 상태에서 목록 조회가 막혀 있는 백엔드 이슈가 있어(관리자에게 별도 확인 필요),
    // 실패해도 무한 로딩으로 남지 않도록 빈 목록으로 처리한다.
    getProfiles({ term, memberType })
      .then(setMembers)
      .catch(() => setMembers([]))
  }, [term, memberType])

  useEffect(() => {
    setMembers(null)
    loadMembers()
  }, [loadMembers])

  const sections = useMemo(() => {
    if (!members) return []
    return GROUP_SECTIONS.map((section) => ({
      ...section,
      members: members.filter((m) => m.memberGroup === section.key),
    })).filter((section) => section.members.length > 0)
  }, [members])

  const openModal = (mode: 'create' | 'edit') => {
    getMyProfile(term)
      .then((detail) => {
        setMyProfile(detail)
        setModalMode(mode)
      })
      .catch(() => {
        if (mode === 'edit') {
          alert('등록된 정보가 없어요. 프로필 등록 먼저 해주세요.')
          return
        }
        setMyProfile(null)
        setModalMode('create')
      })
  }

  const closeModal = () => setModalMode('closed')

  const handleSaved = () => {
    loadMembers()
  }

  return (
    <div className="bg-warm-black">
      {/* 배너: Session/Project/Stamp/MyPage와 동일한 공용 Banner 컴포넌트 (사이즈·색상 통일, 텍스트만 다름) */}
      <Banner page="People" />

      {/* 데스크탑 */}
      <div className="hidden lg:block">
        <section className="relative -mt-6 min-h-[600px] w-full rounded-t-[25px] bg-white px-[120px] pb-[45px] pt-[36px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTerm(t)}
                  className={`flex h-[53px] items-center justify-center rounded-[100px] px-[28px] text-[18px] font-normal ${
                    t === term ? 'bg-misc-171f29 text-white' : 'text-gray-4'
                  }`}
                >
                  {t}기
                </button>
              ))}
            </div>

            {user && (
              <div className="flex items-center gap-[15px]">
                <button
                  type="button"
                  onClick={() => openModal('create')}
                  className="flex h-[53px] cursor-pointer items-center justify-center rounded-[10px] border border-gray-9 bg-transparent px-[10px] text-[16px] font-normal text-gray-5"
                >
                  프로필 등록
                </button>
                <button
                  type="button"
                  onClick={() => openModal('edit')}
                  className="flex h-[53px] cursor-pointer items-center justify-center rounded-[10px] border border-gray-9 bg-transparent px-[10px] text-[16px] font-normal text-gray-5"
                >
                  프로필 수정
                </button>
              </div>
            )}
          </div>

          <div className="mt-[20px] flex items-center gap-[10px]">
            <button
              type="button"
              onClick={() => setMemberType('STAFF')}
              className={`px-[15px] py-[12px] text-[20px] ${
                memberType === 'STAFF' ? 'font-semibold text-black' : 'font-medium text-text-soft'
              }`}
            >
              운영진
            </button>
            <button
              type="button"
              onClick={() => setMemberType('BABY_LION')}
              className={`px-[15px] py-[12px] text-[20px] ${
                memberType === 'BABY_LION' ? 'font-semibold text-black' : 'font-medium text-text-soft'
              }`}
            >
              아기사자
            </button>
          </div>

          <div className="mt-[45px] flex flex-col gap-[130px]">
            {sections.map((section) => (
              <div key={section.key} className="flex flex-col gap-[50px]">
                <div className="flex items-center gap-[15px]">
                  <div className="h-[40px] w-[8px] shrink-0 bg-black" />
                  <p className="m-0 text-[30px] font-semibold text-black">{section.title}</p>
                  {section.subtitle && <p className="m-0 text-[18px] font-semibold text-gray-5">{section.subtitle}</p>}
                </div>
                <div className="grid grid-cols-3 gap-[24px]">
                  {section.members.map((member) => (
                    <MemberCard key={member.profileId} member={member} />
                  ))}
                </div>
              </div>
            ))}
            {members !== null && sections.length === 0 && (
              <p className="m-0 py-[60px] text-center text-[18px] text-gray-6">등록된 부원이 없어요.</p>
            )}
          </div>
        </section>
      </div>

      {/* 모바일: 피그마 "멤버 프로필" 목업(node 1183:14965) 기준 */}
      <div className="lg:hidden">
        <section className="relative -mt-6 min-h-[400px] w-full rounded-t-[20px] bg-white px-6 py-8">
          {/* 피그마 "tapbar" 인스턴스(node 1183:14972) 기준 — 활성 기수는 채워진 알약, 나머지는 플레인 텍스트 */}
          <div className="relative flex items-center justify-between gap-[8px]">
            <div className="flex items-center gap-[8px]">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTerm(t)}
                  className={`rounded-[100px] px-[20px] py-[6px] text-[16px] font-medium ${
                    t === term ? 'bg-misc-171f29 text-white' : 'text-gray-4'
                  }`}
                >
                  {t}기
                </button>
              ))}
            </div>

            {/* 더보기: 프로필 등록·수정을 드롭다운으로 (피그마 "more" node 1183:14973). 로그인 안 했으면 버튼 자체를 숨긴다 */}
            {user && (
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                aria-label="더보기"
                aria-expanded={moreOpen}
                className="flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0"
              >
                <img src={moreIcon} alt="" className="size-6" />
              </button>
            )}

            {moreOpen && (
              <>
                <button
                  type="button"
                  aria-label="더보기 닫기"
                  onClick={() => setMoreOpen(false)}
                  className="fixed inset-0 z-40 cursor-default border-0 bg-transparent p-0"
                />
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[118px] overflow-hidden rounded-[10px] border border-gray-9 bg-white py-[8px] shadow-[0px_4px_25px_0px_rgba(0,0,0,0.05)]">
                  <button
                    type="button"
                    onClick={() => {
                      setMoreOpen(false)
                      openModal('create')
                    }}
                    className="block w-full cursor-pointer whitespace-nowrap py-[13px] pl-[8px] pr-[25px] text-left text-[16px] font-medium text-black hover:bg-surface-neutral"
                  >
                    프로필 등록
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMoreOpen(false)
                      openModal('edit')
                    }}
                    className="block w-full cursor-pointer whitespace-nowrap py-[13px] pl-[8px] pr-[25px] text-left text-[16px] font-medium text-black hover:bg-surface-neutral"
                  >
                    프로필 수정
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 운영진/아기사자: 밑줄 탭 (항상 노출, 더보기와 무관) */}
          {/* MyPage 모바일 탭과 동일한 반반 분할 언더라인 탭 (misc-303237/misc-a6a6a6 토큰도 그쪽과 공유) */}
          <div className="mt-[15px] flex w-[calc(100%+3rem)] -mx-6">
            <button
              type="button"
              onClick={() => setMemberType('STAFF')}
              className={`flex-1 border-solid bg-transparent py-3 text-center text-[16px] font-medium transition-colors duration-150 ${
                memberType === 'STAFF' ? 'border-b-[3px] border-misc-303237 text-black-1' : 'border-b border-gray-9 text-misc-a6a6a6'
              }`}
            >
              운영진
            </button>
            <button
              type="button"
              onClick={() => setMemberType('BABY_LION')}
              className={`flex-1 border-solid bg-transparent py-3 text-center text-[16px] font-medium transition-colors duration-150 ${
                memberType === 'BABY_LION' ? 'border-b-[3px] border-misc-303237 text-black-1' : 'border-b border-gray-9 text-misc-a6a6a6'
              }`}
            >
              아기사자
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-[60px]">
            {sections.map((section) => (
              <div key={section.key} className="flex flex-col gap-[16px]">
                <div className="flex items-center gap-[10px]">
                  <div className="h-[24px] w-[4px] shrink-0 bg-black" />
                  <p className="m-0 text-[20px] font-semibold text-black">{section.title}</p>
                  {section.subtitle && <p className="m-0 text-[13px] font-semibold text-gray-5">{section.subtitle}</p>}
                </div>
                <div className="grid grid-cols-2 gap-[15px]">
                  {section.members.map((member) => (
                    <MobileMemberCard key={member.profileId} member={member} />
                  ))}
                </div>
              </div>
            ))}
            {members !== null && sections.length === 0 && (
              <p className="m-0 py-[45px] text-center text-[15px] text-gray-6">등록된 부원이 없어요.</p>
            )}
          </div>
        </section>
      </div>

      <ProfileFormModal
        open={modalMode !== 'closed'}
        term={term}
        existing={modalMode === 'edit' ? myProfile : null}
        onClose={closeModal}
        onSaved={handleSaved}
      />
    </div>
  )
}

export default People
