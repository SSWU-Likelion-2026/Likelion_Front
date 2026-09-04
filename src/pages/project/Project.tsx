import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "../../components/Banner";

import { getProjects } from "../../api/project/project";
import type { ProjectListItem } from "../../types/project/project";

function Project() {
  const navigate = useNavigate();

  const generations = [14, 13, 12];

  const [selectedGeneration, setSelectedGeneration] = useState(14);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProjects({
          term: selectedGeneration,
          page: 0,
          size: 9,
          sort: "createdAt/desc",
        });

        setProjects(result.content);
      } catch (error) {
        console.error(error);
        setError("프로젝트 목록을 불러오지 못했습니다.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedGeneration]);

  return (
    <section className="min-h-screen w-full bg-white">
      <Banner page="Project" />

      <div className="relative -mt-6 w-full rounded-t-[25px] bg-white px-[120px] py-8">
        {/* 상단 메뉴 */}
        <div className="mb-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {generations.map((generation) => (
              <button
                key={generation}
                type="button"
                onClick={() => setSelectedGeneration(generation)}
                className={`h-[53px] min-w-[91px] rounded-full px-5 text-[18px] font-medium transition-colors ${
                  selectedGeneration === generation
                    ? "bg-[#171F29] text-white"
                    : "bg-transparent text-[#6C6E72]"
                }`}
              >
                {generation}기
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate("/ProjectMaking")}
            className="flex h-[46px] w-[107px] items-center justify-center whitespace-nowrap rounded-[10px] border border-[#D0D6DD] px-[10px] text-[16px] font-medium text-[#808386]"
          >
            프로젝트 등록
          </button>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[22px] text-[#808386]">
              프로젝트를 불러오는 중입니다.
            </p>
          </div>
        )}

        {/* 에러 */}
        {!loading && error && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-[22px] text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* 목록 */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid w-full grid-cols-3 gap-[24px] font-montserrat">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() =>
                  navigate(`/ProjectDetail/${project.id}`)
                }
                className="w-full cursor-pointer overflow-hidden rounded-[20px] border border-[#E5E5E5] bg-white"
              >
                <div className="aspect-[384/233] w-full overflow-hidden bg-[#D9D9D9]">
                  {project.logoUrl && (
                    <img
                      src={project.logoUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="h-[137px] w-full px-5 py-5">
                  <p className="text-[24px] font-bold text-[#121212]">
                    {project.title}
                  </p>

                  <p className="mt-3 line-clamp-2 text-[16px] font-medium text-[#121212]">
                    {project.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 프로젝트 없음 */}
        {!loading && !error && projects.length === 0 && (
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