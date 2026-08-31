import Banner from '../../components/Banner'
import Profile from '../../img/mypage/profile.jpg'
import Button from '../../components/Button'

function MyPage() {
  return (
    <div className="flex flex-col">
      <Banner page="MyPage" />
      <div className="rounded-t-[25px] bg-white -mt-6 relative px-30">
        <header>
          <button>내 프로필</button>
          <button>지원 현황</button>
        </header>
        <section className='flex justify-center items-center gap-6'>
          <img src={Profile} alt="내 프로필" />
          <div className='flex flex-col gap-[15px]'>
            <h1 className='text-[34px] font-semibold'>성이름님</h1>
            <p className='text-[24px] font-medium text-gray-1'>성신 멋사 사이트 방문을 환영해요!</p>
          </div>
          <Button color='white'>
            프로필 수정
          </Button>
        </section>
      </div>
    </div>
  )
}

export default MyPage
