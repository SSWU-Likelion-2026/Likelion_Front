import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Banner from "../../components/Banner";
import stamp_nextbtn from "../../img/stamp/stamp_next.svg";
import StampModal from "./StampModal";
import MyStamp from "./MyStamp";

const missions = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: "첫 회의하고 피그마\n워크스페이스 인증",
  date: "2000.00.00~00.00",
}));

export default function Stamp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMenu, setSelectedMenu] = useState("mission");

  const [showStampModal, setShowStampModal] = useState(
    location.state?.showStampModal ?? false,
  );
  const completedStamps = [
    {
      id: 1,
      date: "2000.00.00",
    },
    {
      id: 2,
      date: "2000.00.00",
    },
    {
      id: 3,
      date: "2000.00.00",
    },
  ];

  {/*스탬프 아예 없는 버전 
    const completedStamps: {
  id: number;
  date: string;
}[] = [];
 */}

  const handleCloseModal = () => {
    setShowStampModal(false);
    setSelectedMenu("myStamp");

    navigate("/stamp", {
      replace: true,
      state: {},
    });
  };

  return (
    <div className="stampPage min-h-screen bg-white">
      <Banner page="Stamp" />

      <div className="stampContent relative -mt-6 min-h-screen rounded-t-[25px] bg-white px-[120px] pt-[65px] pb-[80px]">

        {/* 상단 메뉴 */}
        <div className="stampMenu mb-[53px] ml-[3px] flex gap-[30px] sm:gap-[50px]">
          <button
            type="button"
            onClick={() => setSelectedMenu("mission")}
            className={`text-[24px] font-semibold sm:text-[28px] lg:text-[32px] ${selectedMenu === "mission"
              ? "text-[#121212]"
              : "text-[#B6B6B6]"
              }`}
          >
            스탬프 미션
          </button>

          <button
            type="button"
            onClick={() => setSelectedMenu("myStamp")}
            className={`text-[24px] font-semibold sm:text-[28px] lg:text-[32px] ${selectedMenu === "myStamp"
              ? "text-[#121212]"
              : "text-[#BFBFBF]"
              }`}
          >
            마이 스탬프
          </button>
        </div>

        {/* 스탬프 미션 */}
        {selectedMenu === "mission" && (
          <div className="stampGrid grid grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3">
            {missions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                onClick={() => navigate(`/stamp/${mission.id}`)}
                className="
                  stampCard
                  group
                  flex
                  min-h-[220px]
                  w-full
                  min-w-0
                  flex-col
                  justify-between
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[#D0D6DD]
                  bg-white
                  px-6
                  py-7
                  text-left
                  transition-all
                  duration-200
                  hover:border-[#956CF6]
                  hover:bg-[#956CF6]
                  sm:px-8
                  sm:py-8
                  lg:px-[40px]
                  lg:py-[36px]
                  xl:px-[52px]
                  xl:py-[40px]
                "
              >
                <div className="min-w-0">
                  <h2
                    className="
                      break-words
                      whitespace-pre-line
                      text-[20px]
                      font-semibold
                      leading-[1.45]
                      text-[#121212]
                      transition-colors
                      group-hover:text-white
                      sm:text-[24px]
                      lg:text-[28px]
                    "
                  >
                    {mission.title}
                  </h2>

                  <p
                    className="
                      mt-[15px]
                      break-words
                      text-[17px]
                      text-[#6C6E72]
                      transition-colors
                      group-hover:text-white
                      sm:text-[20px]
                      lg:text-[24px]
                    "
                  >
                    {mission.date}
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <img
                    src={stamp_nextbtn}
                    alt="다음"
                    className="h-[18px] w-[22px] shrink-0"
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 마이 스탬프 */}
        {selectedMenu === "myStamp" && (
          <MyStamp
            userName="000님"
            completedStamps={completedStamps}
          />
        )}
      </div>

      {showStampModal && (
        <StampModal onClose={handleCloseModal} />
      )}
    </div>
  );
}