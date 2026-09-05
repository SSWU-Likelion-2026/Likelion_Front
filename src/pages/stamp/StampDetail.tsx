import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import Banner from "../../components/Banner";
import downloadbtn from "../../img/project/download.svg";

import {
  authenticateStampMission,
  getStampMissions,
} from "../../api/stamp/stamp";

import type {
  StampMission,
} from "../../types/stamp/stamp";


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


export default function StampDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { missionId } = useParams();

  const missionNumber = Number(missionId);

  const locationMission =
    location.state?.mission as
    | StampMission
    | undefined;

  const [mission, setMission] =
    useState<StampMission | null>(
      locationMission ?? null,
    );

  const [missionLoading, setMissionLoading] =
    useState(!locationMission);

  const [image, setImage] =
    useState<File | null>(null);

  const [authDate, setAuthDate] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  /**
   * location.state가 없는 경우
   * ex) /stamp/1 주소에서 새로고침
   *
   * 전체 미션 목록을 받아서
   * 현재 missionId에 해당하는 미션을 찾는다.
   */
  useEffect(() => {
    if (mission) {
      return;
    }

    if (
      !missionNumber ||
      Number.isNaN(missionNumber)
    ) {
      alert("잘못된 미션입니다.");
      navigate("/stamp", {
        replace: true,
      });

      return;
    }

    const fetchMission = async () => {
      try {
        setMissionLoading(true);

        const response =
          await getStampMissions();

        const foundMission =
          response.result.find(
            (item) =>
              item.missionId === missionNumber,
          );

        if (!foundMission) {
          alert(
            "해당 미션을 찾을 수 없습니다.",
          );

          navigate("/stamp", {
            replace: true,
          });

          return;
        }

        setMission(foundMission);
      } catch (error) {
        console.error(
          "미션 조회 실패:",
          error,
        );

        alert(
          "미션 정보를 불러오지 못했습니다.",
        );

        navigate("/stamp", {
          replace: true,
        });
      } finally {
        setMissionLoading(false);
      }
    };

    fetchMission();
  }, [
    mission,
    missionNumber,
    navigate,
  ]);


 /**
 * 인증 이미지 선택
 */
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "이미지는 최대 10MB까지 업로드할 수 있습니다.",
      );

      event.target.value = "";

      return;
    }

    setImage(file);
  };


  /**
   * 스탬프 인증
   */
  const handleSubmit = async () => {
    if (
      !missionNumber ||
      Number.isNaN(missionNumber)
    ) {
      alert("잘못된 미션입니다.");
      return;
    }

    if (!image) {
      alert("인증 이미지를 업로드해주세요.");
      return;
    }

    if (!authDate) {
      alert("날짜를 입력해주세요.");
      return;
    }

    if (!description.trim()) {
      alert("미션 후기를 입력해주세요.");
      return;
    }

    if (mission?.isCompleted) {
      alert(
        "이미 완료한 미션입니다.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await authenticateStampMission(
        missionNumber,
        {
          image,
          authDate,
          content: description.trim(),
        },
      );

      navigate("/stamp", {
        state: {
          showStampModal: true,
        },
      });
    } catch (error) {
      console.error(
        "스탬프 인증 실패:",
        error,
      );

      if (axios.isAxiosError(error)) {
        const code =
          error.response?.data?.code;

        const message =
          error.response?.data?.message;

        switch (code) {
          case "STAMP-4001":
            alert(
              "이미 완료한 미션입니다.",
            );
            break;

          case "STAMP-4002":
            alert(
              "미션 참여 가능 기간이 아닙니다.",
            );
            break;

          case "MISSION-404":
            alert(
              "해당 미션을 찾을 수 없습니다.",
            );
            break;

          case "AUTH-401":
            alert(
              "로그인이 필요합니다.",
            );
            break;

          default:
            alert(
              message ||
              "스탬프 인증에 실패했습니다.",
            );
        }

        return;
      }

      alert(
        "스탬프 인증에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  if (missionLoading) {
    return (
      <div className="stampDetailPage min-h-screen bg-white">
        <Banner page="Stamp" />

        <main className="relative -mt-6 min-h-screen rounded-t-[25px] bg-white px-[120px] pt-[65px] pb-[80px]">
          <div className="py-[100px] text-center text-[22px] text-[#808386]">
            미션 정보를 불러오는 중입니다.
          </div>
        </main>
      </div>
    );
  }


  if (!mission) {
    return null;
  }


  return (
    <div className="stampDetailPage min-h-screen bg-white">
      <Banner page="Stamp" />

      <main
        className="
          stampDetailContent
          relative
          -mt-6
          min-h-screen
          rounded-t-[25px]
          bg-white
          px-[120px]
          pt-[65px]
          pb-[80px]
        "
      >
        <div className="stampDetailInner mx-auto w-full max-w-[1280px]">

          {/* 페이지 제목 */}
          <h1 className="stampDetailTitle text-[34px] font-semibold text-[#121212]">
            미션 인증
          </h1>


          {/* 미션 정보 */}
          <section className="missionInfo mt-[60px]">
            <h2 className="missionName text-[28px] font-semibold text-[#121212]">
              {mission.title}
            </h2>

            <p className="missionDate mt-[8px] text-[22px] text-[#ADAFB2]">
              {formatMissionDate(
                mission.startAt,
                mission.endAt,
              )}
            </p>

            {mission.description && (
              <p className="mt-[20px] text-[20px] leading-[1.6] text-[#808386]">
                {mission.description}
              </p>
            )}
          </section>


          {/* 이미지 업로드 */}
          <section className="imageUploadSection mt-[46px]">
            <label
              htmlFor="stampImage"
              className="
                imageUploadBox
                flex
                min-h-[364px]
                w-full
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-[15px]
                border
                border-dashed
                border-[#B8B9BD]
                bg-[#F3F4F6]
              "
            >
              <div className="flex flex-col items-center">
                <div
                  className="
                    imageUploadButton
                    mb-[18px]
                    flex
                    items-center
                    justify-center
                    gap-[10px]
                    rounded-[15px]
                    bg-white
                    px-[22px]
                    py-[16px]
                    text-[24px]
                    font-medium
                    text-[#121212]
                    shadow-[0_4px_20px_rgba(135,104,244,0.15)]
                  "
                >
                  <img
                    src={downloadbtn}
                    alt="업로드"
                    className="h-[24px] w-[24px]"
                  />

                  이미지 업로드
                </div>

                <p className="imageUploadGuide text-[24px] text-[#808386]">
                  {image
                    ? image.name
                    : "JPG, PNG (최대 10MB)"}
                </p>
              </div>
            </label>

            <input
              id="stampImage"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={
                handleImageUpload
              }
              className="hidden"
            />
          </section>


          {/* 인증 날짜 */}
          <section className="shortTextSection mt-[90px]">
            <input
              type="date"
              value={authDate}
              onChange={(event) =>
                setAuthDate(
                  event.target.value,
                )
              }
              className="
                shortTextInput
                h-[80px]
                w-full
                rounded-[15px]
                border
                border-[#D5D8DC]
                px-[24px]
                text-[20px]
                text-[#121212]
                outline-none
                focus:border-[#956CF6]
              "
            />
          </section>


          {/* 후기 입력 */}
          <section className="descriptionSection mt-[30px]">
            <div className="descriptionBox relative">
              <textarea
                value={description}
                onChange={(event) => {
                  if (
                    event.target.value
                      .length <= 300
                  ) {
                    setDescription(
                      event.target.value,
                    );
                  }
                }}
                placeholder="미션을 진행하며 느낀점을 간단히 작성해주세요."
                className="
                  descriptionInput
                  min-h-[245px]
                  w-full
                  resize-none
                  rounded-[15px]
                  border
                  border-[#D5D8DC]
                  px-[24px]
                  py-[24px]
                  pr-[60px]
                  pb-[50px]
                  text-[20px]
                  leading-[1.6]
                  text-[#121212]
                  outline-none
                  placeholder:text-[#D2D4D8]
                  focus:border-[#956CF6]
                "
              />

              <span className="descriptionCount absolute right-[22px] bottom-[20px] text-[14px] text-[#C7C9CD]">
                {description.length}/300자
              </span>
            </div>
          </section>


          {/* 하단 버튼 */}
          <div className="stampDetailButtons mt-[55px] flex justify-end gap-[12px]">
            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              disabled={isSubmitting}
              className="
                cancelButton
                rounded-[10px]
                border
                border-[#D5D8DC]
                bg-white
                px-[18px]
                py-[11px]
                text-[20px]
                font-medium
                text-[#777A80]
                transition
                hover:bg-[#F5F5F5]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              취소
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                mission.isCompleted
              }
              className="
                submitButton
                rounded-[10px]
                bg-[#242424]
                px-[20px]
                py-[13px]
                text-[20px]
                font-semibold
                text-white
                transition
                hover:bg-black
                disabled:cursor-not-allowed
                disabled:bg-[#B8B9BD]
              "
            >
              {mission.isCompleted
                ? "인증 완료"
                : isSubmitting
                  ? "인증 중..."
                  : "인증하기"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}