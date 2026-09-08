import check from "../../img/stamp/check.svg";

interface StampModalProps {
  onClose: () => void;
}

export default function StampModal({
  onClose,
}: StampModalProps) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/65
      "
    >
      <div
        className="
          flex
          h-[700px]
          w-[700px]
          flex-col
          items-center
          justify-center
          rounded-[20px]
          bg-white

          max-[393px]:h-[270px]
          max-[393px]:w-[calc(100%-80px)]
          max-[393px]:rounded-[8px]
        "
      >
        <div
          className="
            flex
            w-full
            flex-col
            items-center
            px-[100px]

            max-[393px]:px-[73px]
          "
        >
          {/* 체크 아이콘 */}
          <img
            src={check}
            alt="인증 완료"
            className="
              h-[70px]
              w-[70px]

              max-[393px]:h-[50px]
              max-[393px]:w-[50px]
            "
          />

          {/* 제목 */}
          <h2
            className="
              mt-[30px]
              text-center
              text-[30px]
              font-semibold
              text-[#121212]

              max-[393px]:mt-[16px]
              max-[393px]:whitespace-nowrap
              max-[393px]:text-[16px]
            "
          >
            인증이 완료되었습니다
          </h2>

          {/* 설명 */}
          <p
            className="
              mt-[14px]
              text-center
              text-[20px]
              leading-[1.5]
              text-[#808386]

              max-[393px]:mt-[8px]
              max-[393px]:whitespace-nowrap
              max-[393px]:text-[13px]
              max-[393px]:leading-[15px]
            "
          >
            스탬프가 지급되었어요.
            <br />
            다른 미션도 계속 도전해보세요!
          </p>

          {/* 확인 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="
              mt-[35px]
              h-[83px]
              w-[397px]
              rounded-[10px]
              bg-[#242424]
              text-[24px]
              font-semibold
              text-white

              max-[393px]:mt-[15px]
              max-[393px]:h-[50px]
              max-[393px]:w-full
              max-[393px]:min-w-[145px]
              max-[393px]:rounded-full
              max-[393px]:text-[20px]
            "
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}