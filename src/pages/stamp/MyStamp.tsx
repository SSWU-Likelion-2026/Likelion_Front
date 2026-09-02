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
}

interface MyStampProps {
    userName?: string;
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

export default function MyStamp({
    userName = "000님",
    completedStamps = [],
}: MyStampProps) {
    return (
        <div className="myStampPage w-full">

            {/* 사용자 정보 */}
            <div className="myStampProfile flex items-center justify-between">
                <div className="flex items-center gap-[24px]">
                    <img
                        src={mystamp}
                        alt="프로필"
                        className="myStampProfileImage h-[180px] w-[180px]"
                    />

                    <div className="myStampUserInfo">
                        <p className="text-[34px] font-semibold text-[#121212]">
                            {userName}
                        </p>

                        <p className="mt-[10px] text-[28px] font-medium text-[#121212]">
                            총 획득 스탬프
                        </p>
                    </div>
                </div>

                {/* 총 스탬프 개수 */}
                <p className="myStampCount mr-[40px] text-[50px] font-semibold text-[#121212]">
                    {completedStamps.length}개
                </p>
            </div>

            {/* 도장판 */}
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
    border-[#E1E1E1]
    bg-[#F5F5F7]
    px-[20px]
    py-[40px]

    sm:grid-cols-2
    sm:px-[30px]

    md:grid-cols-3
    md:gap-x-[30px]
    md:px-[40px]

    xl:grid-cols-4
    xl:gap-x-[50px]
    xl:gap-y-[46px]
    xl:rounded-[70px]
    xl:px-[55px]
    xl:py-[48px]
  "
            >
                {stampNumbers.map((numberImage, index) => {
                    const stampNumber = index + 1;

                    const completed = completedStamps.find(
                        (stamp) => stamp.id === stampNumber,
                    );

                    return (
                        <div
                            key={stampNumber}
                            className="
    stampItem
    flex
    w-full
    min-w-0
    flex-col
    items-center
    justify-center
  "
                        >
                            {/* 숫자 / 도장 */}
                            <div className="stampImageBox relative h-[176px] w-[176px]">
                                {/* 기본 숫자 */}
                                <img
                                    src={numberImage}
                                    alt={`${stampNumber}번 스탬프`}
                                    className="h-[176px] w-[176px]"
                                />

                                {/* 인증 완료된 경우 도장 표시 */}
                                {completed && (
                                    <img
                                        src={realstamp}
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
                    "
                                    />
                                )}
                            </div>

                            {/* 인증 완료 날짜 */}
                            {completed && (
                                <p className="stampDate mt-[10px] text-[20px] font-medium text-[#7C4DFF]">
                                    {completed.date}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}