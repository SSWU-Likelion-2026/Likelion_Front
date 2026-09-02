import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/Banner";
import downloadbtn from "../../img/project/download.svg";

export default function StampDetail() {
    const navigate = useNavigate();

    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("이미지는 최대 10MB까지 업로드할 수 있습니다.");
            return;
        }

        setImage(file);
    };

    const handleSubmit = () => {
        console.log({
            image,
            title,
            description,
        });

        navigate("/stamp", {
            state: {
                showStampModal: true,
            },
        });
    };

    return (
        <div className="stampDetailPage min-h-screen bg-white">
            <Banner page="Stamp" />

            <main
                className="
          stampDetailContent
          relative
          -mt-6 min-h-screen rounded-t-[25px] bg-white px-[120px] pt-[65px] pb-[80px]">
                <div className="stampDetailInner mx-auto w-full max-w-[1280px]">
                    {/* 페이지 제목 */}
                    <h1 className="stampDetailTitle text-[34px] font-semibold text-[#121212]">
                        미션 인증
                    </h1>

                    {/* 미션 정보 */}
                    <section className="missionInfo mt-[60px]">
                        <h2 className="missionName text-[28px] font-semibold text-[#121212]">
                            기획 · 디자인팀 첫 회의하고 피그마 워크스페이스 인증
                        </h2>

                        <p className="missionDate mt-[8px] text-[22px] text-[#ADAFB2]">
                            2000.00.00~00.00
                        </p>
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
                                    {image ? image.name : "JPG, PNG (최대 10MB)"}
                                </p>
                            </div>
                        </label>

                        <input
                            id="stampImage"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </section>

                    {/* 짧은 입력 */}
                    <section className="shortTextSection mt-[90px]">
                        <input
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="날짜를 입력해주세요."
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
      placeholder:text-[#D2D4D8]
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
                                    if (event.target.value.length <= 300) {
                                        setDescription(event.target.value);
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
                            onClick={() => navigate(-1)}
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
              "
                        >
                            취소
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
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
              "
                        >
                            인증하기
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}