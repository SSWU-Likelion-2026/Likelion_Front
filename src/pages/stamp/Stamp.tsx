import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Banner from "../../components/Banner";
import stamp_nextbtn from "../../img/stamp/stamp_next.svg";

import StampModal from "./StampModal";
import MyStamp from "./MyStamp";

import {
  getStampMissions,
  getMyStamps,
} from "../../api/stamp/stamp";

import type {
  StampMission,
  MyStampResult,
} from "../../types/stamp/stamp";

type StampMenu = "mission" | "myStamp";


const formatMissionDate = (
  startAt: string,
  endAt: string,
) => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return "";
  }

  const startYear = start.getFullYear();
  const startMonth = String(start.getMonth() + 1).padStart(2, "0");
  const startDate = String(start.getDate()).padStart(2, "0");

  const endYear = end.getFullYear();
  const endMonth = String(end.getMonth() + 1).padStart(2, "0");
  const endDate = String(end.getDate()).padStart(2, "0");

  if (startYear === endYear) {
    return `${startYear}.${startMonth}.${startDate}~${endMonth}.${endDate}`;
  }

  return `${startYear}.${startMonth}.${startDate}~${endYear}.${endMonth}.${endDate}`;
};


export default function Stamp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMenu, setSelectedMenu] =
    useState<StampMenu>(
      location.state?.showStampModal
        ? "mission"
        : "mission",
    );

  const [showStampModal, setShowStampModal] = useState(
    location.state?.showStampModal ?? false,
  );

  const [missions, setMissions] = useState<StampMission[]>([]);
  const [myStamp, setMyStamp] = useState<MyStampResult | null>(null);

  const [missionLoading, setMissionLoading] = useState(true);
  const [myStampLoading, setMyStampLoading] = useState(false);

  const [missionError, setMissionError] = useState("");
  const [myStampError, setMyStampError] = useState("");


  /**
   * =========================
   * 스탬프 미션 목록 조회
   * =========================
   */
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setMissionLoading(true);
        setMissionError("");

        // term 미입력
        // → 백엔드에서 가장 최근 기수 조회
        const response = await getStampMissions();

        setMissions(response.result);
      } catch (error) {
        console.error(
          "스탬프 미션 목록 조회 실패:",
          error,
        );

        setMissionError(
          "스탬프 미션을 불러오지 못했습니다.",
        );
      } finally {
        setMissionLoading(false);
      }
    };

    fetchMissions();
  }, []);


  /**
   * =========================
   * 마이 스탬프 조회
   * =========================
   */
  useEffect(() => {
    if (selectedMenu !== "myStamp") {
      return;
    }

    const fetchMyStamps = async () => {
      try {
        setMyStampLoading(true);
        setMyStampError("");

        const response = await getMyStamps();

        setMyStamp(response.result);
      } catch (error) {
        console.error(
          "마이 스탬프 조회 실패:",
          error,
        );

        setMyStampError(
          "마이 스탬프를 불러오지 못했습니다.",
        );
      } finally {
        setMyStampLoading(false);
      }
    };

    fetchMyStamps();
  }, [selectedMenu]);


  /**
   * 인증 완료 모달 닫기
   */
  const handleCloseModal = () => {
    setShowStampModal(false);

    // 인증 후 바로 마이 스탬프 보여주기
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
            className={`text-[24px] font-semibold sm:text-[28px] lg:text-[32px] ${
              selectedMenu === "mission"
                ? "text-[#121212]"
                : "text-[#B6B6B6]"
            }`}
          >
            스탬프 미션
          </button>

          <button
            type="button"
            onClick={() => setSelectedMenu("myStamp")}
            className={`text-[24px] font-semibold sm:text-[28px] lg:text-[32px] ${
              selectedMenu === "myStamp"
                ? "text-[#121212]"
                : "text-[#BFBFBF]"
            }`}
          >
            마이 스탬프
          </button>
        </div>


        {/* =========================
            스탬프 미션
        ========================= */}
        {selectedMenu === "mission" && (
          <>
            {missionLoading && (
              <div className="py-[100px] text-center text-[22px] text-[#808386]">
                스탬프 미션을 불러오는 중입니다.
              </div>
            )}

            {!missionLoading && missionError && (
              <div className="py-[100px] text-center text-[22px] text-[#808386]">
                {missionError}
              </div>
            )}

            {!missionLoading &&
              !missionError &&
              missions.length === 0 && (
                <div className="py-[100px] text-center text-[22px] text-[#808386]">
                  등록된 스탬프 미션이 없습니다.
                </div>
              )}

            {!missionLoading &&
              !missionError &&
              missions.length > 0 && (
                <div className="stampGrid grid grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3">
                  {missions.map((mission) => (
                    <button
                      key={mission.missionId}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/stamp/${mission.missionId}`,
                          {
                            state: {
                              mission,
                            },
                          },
                        )
                      }
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
                          {formatMissionDate(
                            mission.startAt,
                            mission.endAt,
                          )}
                        </p>

                        {mission.isCompleted && (
                          <p
                            className="
                              mt-[12px]
                              text-[16px]
                              font-semibold
                              text-[#956CF6]
                              transition-colors
                              group-hover:text-white
                            "
                          >
                            인증 완료
                          </p>
                        )}
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
          </>
        )}


        {/* =========================
            마이 스탬프
        ========================= */}
        {selectedMenu === "myStamp" && (
          <>
            {myStampLoading && (
              <div className="py-[100px] text-center text-[22px] text-[#808386]">
                마이 스탬프를 불러오는 중입니다.
              </div>
            )}

            {!myStampLoading && myStampError && (
              <div className="py-[100px] text-center text-[22px] text-[#808386]">
                {myStampError}
              </div>
            )}

            {!myStampLoading &&
              !myStampError &&
              myStamp && (
                <MyStamp
                  userName={myStamp.userName}
                  totalStampCount={
                    myStamp.totalStampCount
                  }
                  completedStamps={myStamp.stamps.map(
                    (stamp) => ({
                      id: stamp.missionId,
                      date: stamp.authDate,
                      imageUrl: stamp.stampImageUrl,
                    }),
                  )}
                />
              )}
          </>
        )}
      </div>


      {/* 인증 완료 모달 */}
      {showStampModal && (
        <StampModal onClose={handleCloseModal} />
      )}
    </div>
  );
}