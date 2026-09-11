import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
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
import ToggleGroup from "../../components/ToggleGroup";

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
  const startMonth = String(
    start.getMonth() + 1,
  ).padStart(2, "0");
  const startDate = String(
    start.getDate(),
  ).padStart(2, "0");

  const endYear = end.getFullYear();
  const endMonth = String(
    end.getMonth() + 1,
  ).padStart(2, "0");
  const endDate = String(
    end.getDate(),
  ).padStart(2, "0");

  if (startYear === endYear) {
    return `${startYear}.${startMonth}.${startDate}~${endMonth}.${endDate}`;
  }

  return `${startYear}.${startMonth}.${startDate}~${endYear}.${endMonth}.${endDate}`;
};

export default function Stamp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    selectedMenu,
    setSelectedMenu,
  ] = useState<StampMenu>(
    location.state?.showStampModal
      ? "mission"
      : "mission",
  );

  const [
    showStampModal,
    setShowStampModal,
  ] = useState(
    location.state?.showStampModal ?? false,
  );

  const [
    missions,
    setMissions,
  ] = useState<StampMission[]>([]);

  const [
    myStamp,
    setMyStamp,
  ] = useState<MyStampResult | null>(null);

  const [
    missionLoading,
    setMissionLoading,
  ] = useState(true);

  const [
    myStampLoading,
    setMyStampLoading,
  ] = useState(false);

  const [
    missionError,
    setMissionError,
  ] = useState("");

  const [
    myStampError,
    setMyStampError,
  ] = useState("");

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
        const response =
          await getStampMissions();

        setMissions(response.result ?? []);
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

        const response =
          await getMyStamps();

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

      <div
        className="
          stampContent
          relative
          -mt-6
          min-h-screen
          rounded-t-[25px]
          bg-white
          px-[120px]
          pt-[65px]
          pb-[80px]

          max-[393px]:-mt-[18px]
          max-[393px]:rounded-t-[20px]
          max-[393px]:px-6
          max-[393px]:pt-[38px]
          max-[393px]:pb-[40px]
        "
      >
        {/* ==========================================
    상단 메뉴
========================================== */}

        <div
          className="
    stampMenu
    mb-[53px]
    ml-[3px]

    max-[393px]:mb-[42px]
    max-[393px]:ml-0
  "
        >
          {/* 데스크톱: 공통 ToggleGroup */}
          <div className="max-[393px]:hidden">
            <ToggleGroup
              options={[
                "스탬프 미션",
                "마이 스탬프",
              ]}
              value={
                selectedMenu === "mission"
                  ? "스탬프 미션"
                  : "마이 스탬프"
              }
              onChange={(value) =>
                setSelectedMenu(
                  value === "스탬프 미션"
                    ? "mission"
                    : "myStamp",
                )
              }
            />
          </div>

          {/* 모바일: 기존 디자인 유지 */}
          <div className="hidden gap-[8px] max-[393px]:flex">
            <button
              type="button"
              onClick={() =>
                setSelectedMenu("mission")
              }
              className={`
        flex
        h-[36px]
        items-center
        justify-center
        rounded-full
        px-[20px]
        text-[16px]
        font-medium

        ${selectedMenu === "mission"
                  ? "bg-[#171F29] text-white"
                  : "bg-transparent text-[#808386]"
                }
      `}
            >
              스탬프 미션
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedMenu("myStamp")
              }
              className={`
        flex
        h-[36px]
        items-center
        justify-center
        rounded-full
        px-[18px]
        text-[16px]
        font-medium

        ${selectedMenu === "myStamp"
                  ? "bg-[#171F29] text-white"
                  : "bg-transparent text-[#808386]"
                }
      `}
            >
              마이 스탬프
            </button>
          </div>
        </div>

        {/* ==========================================
            스탬프 미션
        ========================================== */}

        {selectedMenu === "mission" && (
          <>
            {/* 로딩 */}

            {missionLoading && (
              <div
                className="
                  py-[100px]
                  text-center
                  text-[20px]
                  text-[#808386]

                  max-[393px]:py-[60px]
                  max-[393px]:text-[13px]
                "
              >
                스탬프 미션을 불러오는 중입니다.
              </div>
            )}

            {/* 에러 */}

            {!missionLoading &&
              missionError && (
                <div
                  className="
                    py-[100px]
                    text-center
                    text-[22px]
                    text-[#808386]

                    max-[393px]:py-[60px]
                    max-[393px]:text-[13px]
                  "
                >
                  {missionError}
                </div>
              )}

            {/* 미션 없음 */}

            {!missionLoading &&
              !missionError &&
              missions.length === 0 && (
                <EmptyState message="등록된 스탬프 미션이 없습니다." />
              )}

            {/* ======================================
                미션 목록
            ====================================== */}

            {!missionLoading &&
              !missionError &&
              missions.length > 0 && (
                <div
                  className="
                    stampGrid
                    grid
                    grid-cols-1
                    gap-[24px]
                    md:grid-cols-2
                    xl:grid-cols-3

                    max-[393px]:grid-cols-1
                    max-[393px]:gap-[15px]
                  "
                >
                  {missions.map(
                    (mission) => (
                      <button
                        key={
                          mission.missionId
                        }
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

                          max-[393px]:h-[124px]
max-[393px]:min-h-[124px]
max-[393px]:w-full

                          max-[393px]:flex-row
                          max-[393px]:items-center
                          max-[393px]:justify-between

                          max-[393px]:rounded-[20px]

                          max-[393px]:px-[18px]
                          max-[393px]:py-[16px]

                          max-[393px]:hover:border-[#7C4DFF]
                          max-[393px]:hover:bg-[#7C4DFF]

                          max-[393px]:active:border-[#7C4DFF]
                          max-[393px]:active:bg-[#7C4DFF]

                          max-[393px]:shadow-[0_2px_7px_rgba(0,0,0,0.06)]
                        "
                      >
                        {/* 왼쪽 내용 */}

                        <div
                          className="
                            min-w-0

                            max-[393px]:flex
                            max-[393px]:h-full
                            max-[393px]:flex-1
                            max-[393px]:flex-col
                            max-[393px]:justify-center
                          "
                        >
                          {/* 미션 제목 */}

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

                              max-[393px]:text-[16px]
                              max-[393px]:font-medium
                              max-[393px]:leading-[19px]

                              group-active:text-white
                            "
                          >
                            {mission.title}
                          </h2>

                          {/* 날짜 */}

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

                              max-[393px]:mt-[8px]
                              max-[393px]:text-[14px]
                              max-[393px]:leading-[14px]

                              group-active:text-white
                            "
                          >
                            {formatMissionDate(
                              mission.startAt,
                              mission.endAt,
                            )}
                          </p>

                          {/* 인증 완료 */}

                          {mission.isCompleted && (
                            <p
                              className="
                                mt-[12px]

                                text-[16px]
                                font-semibold
                                text-[#956CF6]

                                transition-colors

                                group-hover:text-white

                                max-[393px]:mt-[10px]
                                max-[393px]:text-[12px]

                                group-active:text-white
                              "
                            >
                              인증 완료
                            </p>
                          )}
                        </div>

                        {/* 오른쪽 화살표 */}

                        <div
                          className="
                            mt-5
                            flex
                            justify-end

                            max-[393px]:ml-[12px]
                            max-[393px]:mt-0
                            max-[393px]:shrink-0
                            max-[393px]:items-center
                            max-[393px]:justify-center
                          "
                        >
                          <img
                            src={
                              stamp_nextbtn
                            }
                            alt="다음"
                            className="
                              h-[18px]
                              w-[22px]
                              shrink-0

                              max-[393px]:h-[13px]
                              max-[393px]:w-[9px]
                            "
                          />
                        </div>
                      </button>
                    ),
                  )}
                </div>
              )}
          </>
        )}

        {/* ==========================================
            마이 스탬프
        ========================================== */}

        {selectedMenu === "myStamp" && (
          <>
            {myStampLoading && (
              <div
                className="
                  py-[100px]
                  text-center
                  text-[20px]
                  text-[#808386]

                  max-[393px]:py-[60px]
                  max-[393px]:text-[13px]
                "
              >
                마이 스탬프를 불러오는 중입니다.
              </div>
            )}

            {!myStampLoading &&
              myStampError && (
                <div
                  className="
                    py-[100px]
                    text-center
                    text-[22px]
                    text-[#808386]

                    max-[393px]:py-[60px]
                    max-[393px]:text-[13px]
                  "
                >
                  {myStampError}
                </div>
              )}

            {!myStampLoading &&
              !myStampError &&
              myStamp && (
                <MyStamp
                  userName={
                    myStamp.userName
                  }
                  totalStampCount={
                    myStamp.totalStampCount
                  }
                  completedStamps={myStamp.stamps.map(
                    (stamp) => ({
                      id:
                        stamp.missionId,
                      date:
                        stamp.authDate,
                      imageUrl:
                        stamp.stampImageUrl,
                    }),
                  )}
                />
              )}
          </>
        )}
      </div>

      {/* 인증 완료 모달 */}

      {showStampModal && (
        <StampModal
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}