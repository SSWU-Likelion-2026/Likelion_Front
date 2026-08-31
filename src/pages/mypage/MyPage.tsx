import Banner from '../../components/Banner'
import Profile from '../../img/mypage/profile.jpg'
import Button from '../../components/Button'
import { useState } from 'react'

const initialProfile = [
  { title: "이메일", content: "20270908@sungshin.ac.kr" },
  { title: "학과", content: "컴퓨터공학과" },
  { title: "학번", content: "20270908" },
  { title: "전화번호", content: "010-1234-5678" },
  { title: "가입일", content: "2027.02.28" },
]

type Tab = '내 프로필' | '지원 현황'

export default function MyPage() {
  const [tab, setTab] = useState<Tab>('내 프로필')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
  const [editValues, setEditValues] = useState(initialProfile.map(item => item.content))

  const handleTabChange = (t: Tab) => {
      setTab(t)
      setIsEditing(false)
  }

  const handleEditStart = () => {
    setEditValues(profile.map(item => item.content))
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  const handleEditSave = () => {
    setProfile(profile.map((item, i) => ({ ...item, content: editValues[i] })))
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col">
      <Banner page="MyPage" />
      <div className="rounded-t-[25px] bg-white -mt-6 relative px-30">
        <header className='mt-[70px] text-[32px] font-semibold flex gap-10'>
          {(['내 프로필', '지원 현황'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`cursor-pointer ${tab === t ? 'text-black' : 'text-[#BFBFBF]'}`}
            >
              {t}
            </button>
          ))}
        </header>

        {tab === '내 프로필' && (
          <>
            <section className='mt-[57px] flex justify-between items-center'>
              <div className='flex items-center gap-6'>
                <img src={Profile} alt="내 프로필" className='w-[180px]' />
                <div className='flex flex-col gap-[15px]'>
                  <h1 className='text-[34px] font-semibold'>성이름님</h1>
                  <p className='text-[24px] font-medium text-gray-1'>성신 멋사 사이트 방문을 환영해요!</p>
                </div>
              </div>
              {isEditing ? (
                <div className='flex gap-[15px]'>
                  <Button color='white' onClick={handleEditCancel}>취소</Button>
                  <Button color='black' onClick={handleEditSave}>저장</Button>
                </div>
              ) : (
                <Button color='white' onClick={handleEditStart}>프로필 수정</Button>
              )}
            </section>
            <main className='mt-[30px] bg-[#FAFAFA] rounded-[20px] w-full border border-primary-35 mb-[79px] flex flex-col gap-[30px] px-[49px] py-[47px]'>
              {profile.map((item, i) => (
                <div key={item.title} className='flex items-center h-[47px]'>
                  <p className='text-[24px] text-black font-semibold w-[117px]'>{item.title}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editValues[i]}
                      onChange={e => setEditValues(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                      className='flex-1 text-[22px] text-gray-5 bg-[#F3F4F6] border border-[#EBEBEB] rounded-[10px] px-[16px] py-[10px] outline-none'
                    />
                  ) : (
                    <p className='text-[22px] text-gray-5'>{item.content}</p>
                  )}
                </div>
              ))}
            </main>
          </>
        )}

        {tab === '지원 현황' && (
          <section className='mt-[57px] mb-[79px]'>
            <p className='text-[24px] text-gray-5'>지원 현황이 없습니다.</p>
          </section>
        )}
      </div>
    </div>
  )
}
