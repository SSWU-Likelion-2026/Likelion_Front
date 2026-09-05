// react
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// api

import { getProfile, editProfile, editProfileImage, getSubmittedApplications, getDraftApplications, deleteApplication } from '../../api/mypage/mypage'
import type { ProfileGetResponse, ApplicationGetResponse, DraftApplication } from '../../types/mypage/mypage'
import { getAccessToken } from '../../lib/auth-storage'

// component
import Banner from '../../components/Banner'
import Button from '../../components/Button'
import Modal from '../../components/Modal'

// assests
import Profile from '../../img/mypage/profile.jpg'
import BackIcon from '../../img/mypage/back.svg'

type Tab = '내 프로필' | '지원 현황'

export default function MyPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('내 프로필')
  const [applicationTab, setApplicationTab] = useState<'지원완료' | '임시저장'>('지원완료')

  const [profileData, setProfileData] = useState<ProfileGetResponse | null>(null)
  const [submittedData, setSubmittedData] = useState<ApplicationGetResponse | null>(null)
  const [draftData, setDraftData] = useState<DraftApplication | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<boolean | null>(false)

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
      getSubmittedApplications()
        .then(res => setSubmittedData(res.result))
        .catch(err => console.error('지원완료 조회 실패:', err))
    } else {
      getDraftApplications()
        .then(res => setDraftData(res.result))
        .catch(err => console.error('임시저장 조회 실패:', err))
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
  
  const isLoggedIn = !!getAccessToken()

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col">
        <Banner page="MyPage" />
        <div className="rounded-t-[25px] bg-white -mt-6 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <p className="text-[32px] font-medium text-gray-6">마이페이지는 로그인 후에 이용할 수 있어요.</p>
        </div>
      </div>
    )
  }

  return (
    <>
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
            {!result && (
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
            )}
            {result && applicationTab === '지원완료' && submittedData?.applications[0]?.applicationStatus === '최종 합격' && (
              <h1 className='text-[24px] text-center font-semibold mt-[53px] mb-[75px]'>지원해주신 과정에 <span className='text-primary-100'>최종 합격</span>하셨습니다. <br /> 앞으로의 일정과 안내사항을 확인해 주세요.</h1>
            )}
            {result && applicationTab === '지원완료' && submittedData?.applications[0]?.applicationStatus === '최종 불합격' && (
              <h1 className='text-[24px] text-center font-semibold mt-[53px] mb-[75px]'>아쉽게도 이번 기수에는 함께하지 못하게 되었습니다. <br /> 보내주신 관심과 시간을 진심으로 감사드립니다.</h1>
            )}
            {applicationTab === '지원완료' && (
              submittedData ? (
                <main className='relative bg-[#FAFAFA] rounded-[20px] w-full border border-primary-35 mb-[79px] flex flex-col gap-[30px] px-[49px] py-[47px]'>
                  {[
                    { title: '이름', content: submittedData.applications[0]?.name },
                    { title: '지원파트', content: submittedData.applications[0]?.part },
                    { title: '지원상태', content: submittedData.applications[0]?.applicationStatus },
                    ...(!result ? [{ title: '결과확인', content: null }] : []),
                  ].map((item) => (
                    <div key={item.title} className='flex items-center h-[47px]'>
                      <p className='text-[24px] text-black font-semibold w-[117px]'>{item.title}</p>
                      {item.content === null
                        ? (submittedData.applications[0]?.applicationStatus === "평가 대기"
                            ? <p className='text-[22px] text-gray-5'>심사 중</p>
                            : <Button color='Main100' onClick={() => setResult(true)}>결과 확인</Button>
                          )
                        : item.title === '지원상태' && result
                          ? <p className={`text-[22px] ${['서류 합격', '최종 합격'].includes(item.content ?? '') ? 'text-primary-100' : 'text-black'}`}>{item.content}</p>
                          : <p className='text-[22px] text-gray-5'>{item.content}</p>
                      }
                    </div>
                  ))}
                  <p className='absolute right-[35px] bottom-[25px] text-[#979797] text-[18px]'>최종 제출일 {submittedData.applications[0]?.submittedAt}</p>
                </main>
              ) : null
            )}

            {applicationTab === '임시저장' && (
              draftData?.applicationId === null ? (
                <main className='relative bg-[#FAFAFA] rounded-[20px] h-[439px] w-full border border-primary-35 mb-[79px] flex flex-col gap-[45px] px-[49px] py-[47px]'>
                  <div className='flex flex-col items-center justify-center h-full'>
                    <h1 className='text-[34px] font-semibold'>임시 저장된 지원 내역이 없어요.</h1>
                    <p className='mt-[15px] mb-[50px] text-[18px] text-gray-7'>지원서 작성 후 확인해주세요.</p>
                    <Button color='black' onClick={() => navigate(`/recruiting/apply?applicationId=${draftData?.applicationId}`)}>지원서 작성하기</Button>
                  </div>
                </main>
              ) : (
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
                    <Button color='white' onClick={() => setDeleteModalOpen(true)}>삭제</Button>
                    <Button color='black' onClick={() => navigate(`/recruiting/apply?applicationId=${draftData?.applicationId}`)}>계속 작성</Button>
                  </div>
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
    <Modal
      open={deleteModalOpen}
      title="임시저장 삭제"
      message="임시저장된 지원서를 삭제하시겠습니까?"
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={() => {
        if (!draftData?.applicationId) return
        deleteApplication(String(draftData.applicationId)).then(() => {
          setDraftData(null)
          setDeleteModalOpen(false)
        })
      }}
    />
    </>
  )
}
