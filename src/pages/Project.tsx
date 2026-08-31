import { useState } from "react";
import { useNavigate } from "react-router-dom";

const projects = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  name: "프로젝트 이름",
  description: "프로젝트 한줄설명",
}));

function Project() {
  const [selectedGeneration, setSelectedGeneration] = useState(14);
  const navigate = useNavigate();

  const generations = [14, 13, 12];

  return (
    <section className="min-h-screen w-full bg-white">
      {/* Project 배너 */}
      <div className="relative h-[288px] w-full bg-gradient-to-b from-[#5D23E3] to-[#B0E7D5]">
        <h1 className="absolute left-30 top-[107px] font-montserrat text-[95px] font-semibold leading-none text-white">
          Project
        </h1>
      </div>

      {/* 프로젝트 보드 */}
      <div className="relative -mt-[20px] w-full rounded-t-[20px] bg-white px-12 py-8">
        {/* 상단 메뉴 */}
        <div className="mb-[70px] flex items-center justify-between">
          {/* 기수 선택 버튼 */}
          <div className="flex items-center gap-3">
            {generations.map((generation) => (
              <button
                key={generation}
                type="button"
                onClick={() => setSelectedGeneration(generation)}
                className={`h-[53px] min-w-[91px] rounded-full px-5 text-[18px] font-medium transition-colors ${selectedGeneration === generation
                    ? "bg-[#171F29] text-white"
                    : "bg-transparent text-[#6C6E72]"
                  }`}
              >
                {generation}기
              </button>
            ))}
          </div>

          {/* 프로젝트 등록 버튼 */}
          <button
            type="button"
            onClick={() => navigate("/ProjectMaking")}
            className="flex h-[46px] w-[107px] items-center justify-center whitespace-nowrap rounded-[10px] border border-[#D0D6DD] px-[10px] text-[16px] font-medium text-[#808386]"
          >
            프로젝트 등록
          </button>
        </div>

        {/* 14기 / 13기 */}
        {selectedGeneration !== 12 ? (
          <div className="grid w-full grid-cols-3 gap-[24px] font-montserrat">
            {projects.map((project) => (
              <div
                key={project.id}
                className="w-full overflow-hidden rounded-[20px] border border-[#E5E5E5] bg-white"
              >
                <div className="aspect-[384/233] w-full bg-[#D9D9D9]" />

                <div className="h-[137px] w-full px-5 py-5">
                  <p className="text-[24px] font-bold text-[#121212]">
                    {project.name}
                  </p>

                  <p className="mt-3 text-[16px] font-medium text-[#121212]">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 12기 - 프로젝트 없음 */
          <div className="flex min-h-[300px] w-full items-start justify-center pt-[20px]">
            <p className="text-center text-[34px] font-semibold leading-[50px] text-black">
              조회된 프로젝트가 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Project;