// react
import { useState, useEffect } from 'react'

// api

import { getProfile, editProfile, editProfileImage, getSubmittedApplications, getDraftApplications } from '../../api/mypage/mypage'
import type { ProfileGetResponse, ApplicationGetResponse, DraftApplication } from '../../types/mypage/mypage'

// component
import Banner from '../../components/Banner'
import Button from '../../components/Button'

// assests
import Profile from '../../img/mypage/profile.jpg'
import BackIcon from '../../img/mypage/back.svg'

type Tab = '내 프로필' | '지원 현황'

export default function MyPage() {
  const [tab, setTab] = useState<Tab>('내 프로필')
  const [applicationTab, setApplicationTab] = useState<'지원완료' | '임시저장'>('지원완료')

  const [profileData, setProfileData] = useState<ProfileGetResponse | null>(null)
  const [submittedData, setSubmittedData] = useState<ApplicationGetResponse | null>(null)
  const [draftData, setDraftData] = useState<DraftApplication | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const profileItems = [
    { title: "이메일", content: profileData?.email },
    { title: "학과", content: profileData?.major },
    { title: "학번", content: profileData?.studentId },
    { title: "전화번호", content: profileData?.phoneNumber },
    { title: "가입일", content: profileData?.joinedAt },
  ]

  useEffect(() => {
    getProfile().then(res => setProfileData(res.result))
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (!profileData) return
    setEditValues([
      profileData.email,
      profileData.major,
      profileData.studentId,
      profileData.phoneNumber,
      profileData.joinedAt,
    ])
  }, [profileData])

  useEffect(() => {
    if (tab !== '지원 현황') return
    if (applicationTab === '지원완료') {
      getSubmittedApplications().then(res => setSubmittedData(res.result))
    } else {
      getDraftApplications().then(res => setDraftData(res.result))
    }
  }, [tab, applicationTab])

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setIsEditing(false)
  }

  const handleEditStart = () => setIsEditing(true)
  const handleEditSave = () => {
    const requests: Promise<unknown>[] = [
      editProfile({
        name: profileData?.name ?? '',
        major: editValues[1],
        studentId: editValues[2],
        phoneNumber: editValues[3],
      }),
    ]

    if (selectedImage) {
      const formData = new FormData()
      formData.append('image', selectedImage)
      requests.push(editProfileImage(formData))
    }

    Promise.all(requests).then(() => {
      getProfile().then(res => setProfileData(res.result))
      setSelectedImage(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setIsEditing(false)
    })
  }

  const handleEditCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedImage(null)
    setIsEditing(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }
  
  return (
    <div className="flex flex-col">
      <Banner page="MyPage" />
      <div className="rounded-t-[25px] bg-white -mt-6 relative px-30">
        {tab === '내 프로필' ? (
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
        ) : (
          <button onClick={() => handleTabChange('내 프로필')} className='mt-[70px] cursor-pointer'>
            <img src={BackIcon} alt="뒤로가기" />
          </button>
        )}

        {tab === '내 프로필' && (
          <>
            <section className='mt-[57px] flex justify-between items-center'>
              <div className='flex items-center gap-6'>
                <div
                  className={`w-[180px] h-[180px] rounded-full overflow-hidden shrink-0 ${isEditing ? 'cursor-pointer' : ''}`}
                  onClick={() => isEditing && document.getElementById('profileImageInput')?.click()}
                >
                  <img src={previewUrl ?? profileData?.profileImageUrl ?? Profile} alt="내 프로필" className='w-full h-full object-cover' />
                </div>
                <input
                  id='profileImageInput'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageChange}
                />
                <div className='flex flex-col gap-[15px]'>
                  <h1 className='text-[34px] font-semibold'>{profileData?.name}</h1>
                  <p className='text-[24px] font-medium text-gray-1'>{profileData?.greeting}</p>
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
              {profileItems.map((item, i) => (
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
          <div className='mt-[33px]'>
            <h1 className='text-[32px] font-semibold '>지원 현황</h1>
            <header className='text-[28px] font-semibold flex gap-[35px] py-10'>
              {(['지원완료', '임시저장'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setApplicationTab(t)}
                  className={`cursor-pointer ${applicationTab === t ? 'text-black' : 'text-[#BFBFBF]'}`}
                >
                  {t}
                </button>
              ))}
            </header>
            {applicationTab === '지원완료' && (
              submittedData?.totalCount === 0 ? (
                <main className='relative bg-[#FAFAFA] rounded-[20px] h-[439px] w-full border border-primary-35 mb-[79px] flex flex-col gap-[45px] px-[49px] py-[47px]'>
                  <div className='flex flex-col items-center justify-center h-full'>
                    <h1 className='text-[34px] font-semibold'>제출한 지원 내역이 없어요.</h1>
                    <p className='mt-[15px] mb-[50px] text-[18px] text-gray-7'>지원서 작성을 완료한 후 확인해주세요</p>
                    <Button color='black'>지원서 작성하기</Button>
                  </div>
                </main>
              ) : (
                <main className='relative bg-[#FAFAFA] rounded-[20px] w-full border border-primary-35 mb-[79px] flex flex-col gap-[30px] px-[49px] py-[47px]'>
                  {[
                    { title: '이름', content: submittedData?.applications[0]?.name },
                    { title: '지원파트', content: submittedData?.applications[0]?.part },
                    { title: '지원상태', content: submittedData?.applications[0]?.applicationStatus },
                    { title: '결과확인', content: null },
                  ].map((item) => (
                    <div key={item.title} className='flex items-center h-[47px]'>
                      <p className='text-[24px] text-black font-semibold w-[117px]'>{item.title}</p>
                      {item.content === null
                        ? <Button color='Main100'>결과확인</Button>
                        : <p className='text-[22px] text-gray-5'>{item.content}</p>
                      }
                    </div>
                  ))}
                  <p className='absolute right-[35px] bottom-[25px] text-[#979797] text-[18px]'>최종 제출일 {submittedData?.applications[0]?.submittedAt}</p>
                </main>
              )
            )}

            {applicationTab === '임시저장' && (
              <>
                <main className='bg-[#FAFAFA] rounded-[20px] w-full border border-primary-35 flex flex-col gap-[30px] px-[49px] py-[47px]'>
                  {[
                    { title: '이름', content: draftData?.name },
                    { title: '지원파트', content: draftData?.part },
                    { title: '지원서', content: draftData?.applicationStatus },
                  ].map((item) => (
                    <div key={item.title} className='flex items-center h-[47px]'>
                      <p className='text-[24px] text-black font-semibold w-[117px]'>{item.title}</p>
                      <p className='text-[22px] text-gray-5'>{item.content}</p>
                    </div>
                  ))}
                </main>
                <div className='flex justify-end gap-[15px] mt-[20px] mb-[79px]'>
                  <Button color='white'>삭제</Button>
                  <Button color='black'>계속 작성</Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
