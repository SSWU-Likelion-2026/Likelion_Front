import mystamp from "../../img/stamp/mystamp.png";
import realstamp from "../../img/stamp/realstamp.png";

import num1 from "../../img/stamp/num1.png";
import num2 from "../../img/stamp/num2.png";
import num3 from "../../img/stamp/num3.png";
import num4 from "../../img/stamp/num4.png";
import num5 from "../../img/stamp/num5.png";
import num6 from "../../img/stamp/num6.png";
import num7 from "../../img/stamp/num7.png";
import num8 from "../../img/stamp/num8.png";
import num9 from "../../img/stamp/num9.png";
import num10 from "../../img/stamp/num10.png";
import num11 from "../../img/stamp/num11.png";
import num12 from "../../img/stamp/num12.png";

interface CompletedStamp {
  id: number;
  date: string;
  imageUrl?: string;
}

interface MyStampProps {
  userName?: string;
  totalStampCount?: number;
  completedStamps?: CompletedStamp[];
}

const stampNumbers = [
  num1,
  num2,
  num3,
  num4,
  num5,
  num6,
  num7,
  num8,
  num9,
  num10,
  num11,
  num12,
];

const formatDate = (date: string) => {
  if (!date) return "";

  return date.replaceAll("-", ".");
};

export default function MyStamp({
  userName = "",
  totalStampCount = 0,
  completedStamps = [],
}: MyStampProps) {
  /**
   * ======================================
   * 인증된 스탬프 정렬
   *
   * mission id와 상관없이
   * 인증한 순서대로 1번부터 도장을 찍기 위해
   * 날짜가 오래된 순으로 정렬
   * ======================================
   */

  const sortedCompletedStamps = [
    ...completedStamps,
  ].sort((a, b) => {
    const aTime =
      new Date(a.date).getTime();

    const bTime =
      new Date(b.date).getTime();

    return aTime - bTime;
  });

  return (
    <div className="myStampPage w-full">
      {/* ======================================
          사용자 정보
      ====================================== */}

      <div
        className="
          myStampProfile
          flex
          items-center
          justify-between

          max-[1014px]:w-full
        "
      >
        <div
          className="
            flex
            items-center
            gap-[24px]

            max-[1014px]:gap-[14px]
          "
        >
          {/* 프로필 이미지 */}

          <img
            src={mystamp}
            alt="프로필"
            className="
              myStampProfileImage
              h-[180px]
              w-[180px]

              max-[1014px]:h-[87px]
              max-[1014px]:w-[87px]
            "
          />

          {/* 이름 + 획득 스탬프 */}

          <div className="myStampUserInfo">
            <p
              className="
                text-[34px]
                font-semibold
                text-[#121212]

                max-[1014px]:text-[20px]
              "
            >
              {userName}
              {userName && "님"}
            </p>

            <p
              className="
                mt-[10px]
                text-[28px]
                font-medium
                text-[#121212]

                max-[1014px]:mt-[6px]
                max-[1014px]:text-[16px]
              "
            >
              총 획득 스탬프
            </p>
          </div>
        </div>

        {/* 총 스탬프 개수 */}

        <p
          className="
            myStampCount
            mr-[40px]
            mt-[38px]
            text-[50px]
            font-semibold
            text-[#121212]

            max-[1014px]:mr-0
            max-[1014px]:text-[20px]
          "
        >
          {totalStampCount}개
        </p>
      </div>

      {/* ======================================
          도장판
      ====================================== */}

      <div
        className="
          stampBoard
          mt-[40px]
          grid
          w-full
          grid-cols-1
          justify-items-center
          gap-x-[20px]
          gap-y-[40px]
          rounded-[30px]
          border
          border-misc-e1e1e1
          bg-misc-f5f5f7
          px-[20px]
          py-[40px]

          min-[1015px]:grid-cols-3
          min-[1015px]:gap-x-[30px]
          min-[1015px]:px-[40px]

          xl:grid-cols-4
          xl:gap-x-[50px]
          xl:gap-y-[46px]
          xl:rounded-[70px]
          xl:px-[55px]
          xl:py-[48px]

          max-[1014px]:mt-[24px]
          max-[1014px]:grid-cols-3
          max-[1014px]:gap-x-[20px]
          max-[1014px]:gap-y-[24px]
          max-[1014px]:rounded-[30px]
          max-[1014px]:px-[14px]
          max-[1014px]:py-[22px]
        "
      >
        {stampNumbers.map(
          (
            numberImage,
            index,
          ) => {
            const stampNumber =
              index + 1;

            /**
             * mission id 기준이 아니라
             * 인증된 데이터 순서대로
             * 1번부터 채움
             *
             * completedStamps가 1개라면
             * 무조건 1번 자리에 도장이 찍힘
             */
            const completed =
              sortedCompletedStamps[
                index
              ];

            return (
              <div
                key={
                  stampNumber
                }
                className="
                  stampItem
                  flex
                  w-full
                  min-w-0
                  flex-col
                  items-center
                  justify-start

                  max-[1014px]:min-h-[112px]
                "
              >
                {/* ==================================
                    숫자 / 인증 도장
                ================================== */}

                <div
                  className="
                    stampImageBox
                    relative
                    h-[176px]
                    w-[176px]
                    shrink-0

                    max-[1014px]:h-[88px]
                    max-[1014px]:w-[88px]
                  "
                >
                  {/* 기본 숫자 */}

                  <img
                    src={
                      numberImage
                    }
                    alt={`${stampNumber}번 스탬프`}
                    className="
                      h-[176px]
                      w-[176px]

                      max-[1014px]:h-[88px]
                      max-[1014px]:w-[88px]
                    "
                  />

                  {/* 인증 완료된 경우 도장 표시 */}

                  {completed && (
                    <img
                      src={
                        realstamp
                      }
                      alt="획득한 스탬프"
                      className="
                        realStamp
                        absolute
                        left-1/2
                        top-1/2
                        h-[140px]
                        w-[140px]
                        -translate-x-1/2
                        -translate-y-1/2

                        max-[1014px]:h-[70px]
                        max-[1014px]:w-[70px]
                      "
                    />
                  )}
                </div>

                {/* ==================================
                    인증 완료 날짜
                ================================== */}

                <div
                  className="
                    mt-[10px]
                    h-[24px]

                    max-[1014px]:mt-[6px]
                    max-[1014px]:h-[18px]
                  "
                >
                  {completed && (
                    <p
                      className="
                        stampDate
                        text-[20px]
                        font-medium
                        text-[#7C4DFF]

                        max-[1014px]:text-[14px]
                      "
                    >
                      {formatDate(
                        completed.date,
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}