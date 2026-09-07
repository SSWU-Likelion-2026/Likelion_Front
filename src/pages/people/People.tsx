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
import MemberCard from '../../components/people/MemberCard'
import ProfileFormModal from '../../components/people/ProfileFormModal'

const TERMS = [14, 13]

const GROUP_SECTIONS: { key: MemberGroup; title: string; subtitle?: string }[] = [
  { key: 'LEADERSHIP', title: '대표단' },
  { key: 'PM', title: 'PM', subtitle: '기획/디자인' },
  { key: 'FE', title: 'FE', subtitle: '프론트엔드' },
  { key: 'BE', title: 'BE', subtitle: '백엔드' },
]

const BANNER_GRADIENT =
  'radial-gradient(ellipse 150% 100% at 50% 0%, #5D23E3 5%, #673CE1 17%, #7254DF 29%, #8685DC 53%, #9BB6D8 76%, #B0E7D5 100%)'

function People() {
  const user = useSyncExternalStore(subscribe, getUser, () => null)
  const [term, setTerm] = useState(TERMS[0])
  const [memberType, setMemberType] = useState<MemberType>('STAFF')
  const [members, setMembers] = useState<MemberProfileSummary[] | null>(null)
  const [modalMode, setModalMode] = useState<'closed' | 'create' | 'edit'>('closed')
  const [myProfile, setMyProfile] = useState<MemberProfileDetail | null>(null)

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
        // 등록된 프로필이 없으면 수정 버튼을 눌러도 등록 폼으로 진행
        setMyProfile(null)
        setModalMode('create')
      })
  }

  const closeModal = () => setModalMode('closed')

  const handleSaved = () => {
    loadMembers()
  }

  return (
    <div className="bg-[#212121]">
      <section className="relative h-[506px] overflow-hidden" style={{ backgroundImage: BANNER_GRADIENT }}>
        <p className="absolute left-[110px] top-[225px] m-0 font-montserrat text-[95px] font-semibold text-white">
          People
        </p>
      </section>

      {/* 흰 영역이 배너보다 100px 먼저(위로) 겹치도록 해서, 둥근 모서리 안쪽에 검정 배경 대신 그라데이션이 보이게 한다 (피그마 배너 506px / 흰 박스 top 406px 기준) */}
      <section className="relative -mt-[100px] min-h-[600px] w-full rounded-t-[25px] bg-white px-[120px] py-[45px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[15px]">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                className={`w-[90px] rounded-[15px] px-[15px] py-[12px] text-[18px] font-semibold ${
                  t === term ? 'bg-[#212121] text-white' : 'rounded-full text-[#797979]'
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
                className="cursor-pointer border-0 bg-transparent px-[15px] py-[12px] text-[18px] font-medium text-[#797979]"
              >
                프로필 등록
              </button>
              <button
                type="button"
                onClick={() => openModal('edit')}
                className="cursor-pointer border-0 bg-transparent px-[15px] py-[12px] text-[18px] font-medium text-[#797979]"
              >
                프로필 수정
              </button>
            </div>
          )}
        </div>

        <div className="mt-[20px] flex items-center gap-[15px]">
          <button
            type="button"
            onClick={() => setMemberType('STAFF')}
            className={`px-[15px] py-[12px] text-[20px] ${
              memberType === 'STAFF' ? 'font-semibold text-black' : 'font-medium text-[#797979]'
            }`}
          >
            운영진
          </button>
          <button
            type="button"
            onClick={() => setMemberType('BABY_LION')}
            className={`px-[15px] py-[12px] text-[20px] ${
              memberType === 'BABY_LION' ? 'font-semibold text-black' : 'font-medium text-[#797979]'
            }`}
          >
            아기사자
          </button>
        </div>

        <div className="mt-[45px] flex flex-col gap-[75px]">
          {sections.map((section) => (
            <div key={section.key} className="flex flex-col gap-[45px]">
              <div className="flex items-center gap-[15px]">
                <div className="h-[40px] w-[8px] shrink-0 bg-black" />
                <p className="m-0 text-[30px] font-semibold text-black">{section.title}</p>
                {section.subtitle && <p className="m-0 text-[18px] font-semibold text-[#808386]">{section.subtitle}</p>}
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
