import checkIcon from "../../img/stamp/check.svg";

interface StampModalProps {
  onClose: () => void;
}

export default function StampModal({
  onClose,
}: StampModalProps) {
  return (
    <div
      className="
        stampModalBackground
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/65
      "
    >
      <div
        className="
          stampModal
          flex
          h-[700px]
          w-[700px]
          flex-col
          items-center
          rounded-[20px]
          bg-white
          px-[80px]
          pt-[85px]
          pb-[60px]
        "
      >
        <img
          src={checkIcon}
          alt="인증 완료"
          className="stampModalCheck h-[130px] w-[130px]"
        />

        <div className="stampModalText mt-[80px] text-center">
          <h2 className="text-[34px] font-semibold text-[#121212]">
            인증이 완료되었습니다
          </h2>

          <p className="mt-[25px] text-[28px] leading-[1.6] text-[#808386]">
            스탬프가 지급되었어요.
            <br />
            마이 스탬프에서 계속 도전해보세요!
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            stampModalConfirm
            mt-auto
            h-[83px]
            w-[397px]
            rounded-[20px]
            bg-[#242424]
            text-[28px]
            font-semibold
            text-white
            transition
            hover:bg-black
          "
        >
          확인
        </button>
      </div>
    </div>
  );
}