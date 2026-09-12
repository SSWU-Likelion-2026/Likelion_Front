import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Banner from "../../components/Banner";
import EmptyState from "../../components/EmptyState";
import ToggleGroup from "../../components/ToggleGroup";

import underbtn from "../../img/project/underbtn.svg";

import {
  getProjects,
  getProjectDetail,
} from "../../api/project/project";

import type {
  ProjectListItem,
} from "../../types/project/project";

function Project() {
  const navigate = useNavigate();

  const generations = [
    14,
    13,
    12,
  ];

  const [
    selectedGeneration,
    setSelectedGeneration,
  ] = useState(14);

  const [
    isGenerationOpen,
    setIsGenerationOpen,
  ] = useState(false);
  const [
    projectThumbnails,
    setProjectThumbnails,
  ] = useState<Record<number, string>>({});

  const [
    projects,
    setProjects,
  ] = useState<ProjectListItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ======================================================
  // 프로젝트 목록 조회
  // ======================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProjects({
          term: selectedGeneration,
          page: 0,
          size: 9,
          sort: "createdAt,desc",
        });

        setProjects(result.content);

        // 각 프로젝트의 첫 번째 장표를 썸네일로 사용
        const thumbnailEntries = await Promise.all(
          result.content.map(
            async (project) => {
              try {
                const detail =
                  await getProjectDetail(
                    project.id,
                  );

                const sortedSlides = [
                  ...detail.slides,
                ].sort(
                  (a, b) =>
                    a.sequenceNum -
                    b.sequenceNum,
                );

                return [
                  project.id,
                  sortedSlides[0]
                    ?.imageUrl ?? "",
                ] as const;
              } catch (error) {
                console.error(
                  `프로젝트 ${project.id} 썸네일 조회 실패:`,
                  error,
                );

                return [
                  project.id,
                  "",
                ] as const;
              }
            },
          ),
        );

        setProjectThumbnails(
          Object.fromEntries(
            thumbnailEntries,
          ),
        );
      } catch (error) {
        console.error(
          "프로젝트 목록 조회 실패:",
          error,
        );

        setError(
          "프로젝트 목록을 불러오지 못했습니다.",
        );

        setProjects([]);
        setProjectThumbnails({});
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedGeneration]);

  // ======================================================
  // 모바일 기수 선택
  // ======================================================

  const handleGenerationSelect = (
    generation: number,
  ) => {
    setSelectedGeneration(generation);
    setIsGenerationOpen(false);
  };

  return (
    <section className="min-h-screen w-full bg-white">
      <Banner page="Project" />

      <div
        className="
          relative
          -mt-6
          w-full
          rounded-t-[25px]
          bg-white
          px-[120px]
          py-8

          max-[1014px]:-mt-[18px]
          max-[1014px]:rounded-t-[20px]
          max-[1014px]:px-6
          max-[1014px]:pb-8
          max-[1014px]:pt-[18px]
        "
      >
        {/* ==========================================
            상단 메뉴
        ========================================== */}

        <div
          className="
            mb-[70px]
            flex
            items-center
            justify-between

            max-[1014px]:mb-4
          "
        >
          {/* 데스크톱 기수 ToggleGroup */}
          <div className="max-[1014px]:hidden">
            <ToggleGroup
              options={generations.map(
                (generation) => `${generation}기`,
              )}
              value={`${selectedGeneration}기`}
              onChange={(value) =>
                setSelectedGeneration(
                  Number(value.replace("기", "")),
                )
              }
            />
          </div>

          {/* ======================================
              모바일 기수 드롭다운
          ====================================== */}

          <div className="relative hidden max-[1014px]:block">
            <button
              type="button"
              onClick={() =>
                setIsGenerationOpen(
                  (prev) => !prev,
                )
              }
              className="
                flex
                h-[46px]
                w-[97px]
                items-center
                justify-between
                rounded-[10px]
                border
                border-[#D0D6DD]
                bg-white
                px-[6px]
                text-[14px]
                font-medium
                text-[#121212]
              "
            >
              <span>
                {selectedGeneration}기
              </span>

              <img
                src={underbtn}
                alt=""
                className={`
                  mr-[3px]
                  w-[10px]
                  transition-transform
                  duration-200
                  ${isGenerationOpen
                    ? "rotate-180"
                    : ""
                  }
                `}
              />
            </button>

            {isGenerationOpen && (
              <div
                className="
                  absolute
                  left-0
                  top-[45px]
                  z-30
                  w-[96px]
                  overflow-hidden
                  rounded-[7px]
                  bg-white
                  py-[5px]
                  shadow-[0_2px_10px_rgba(0,0,0,0.13)]
                "
              >
                {generations.map(
                  (generation) => (
                    <button
                      key={generation}
                      type="button"
                      onClick={() =>
                        handleGenerationSelect(
                          generation,
                        )
                      }
                      className="
                        flex
                        h-[40px]
                        w-full
                        items-center
                        px-[8px]
                        text-left
                        text-[16px]
                        font-medium
                        text-[#121212]
                        hover:bg-[#F5F5F5]
                      "
                    >
                      {generation}기
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* ======================================
              프로젝트 등록
          ====================================== */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/ProjectMaking",
              )
            }
            className="
    flex
    h-[46px]
    w-[107px]
    items-center
    justify-center
    whitespace-nowrap
    rounded-[10px]
    border
    border-[#D0D6DD]
    px-[10px]
    text-[16px]
    font-medium
    text-[#808386]

    max-[1014px]:h-[46px]
    max-[1014px]:w-[97px]
    max-[1014px]:rounded-[10px]
    max-[1014px]:px-0
    max-[1014px]:text-[14px]
  "
          >
            프로젝트 등록
          </button>
        </div>

        {/* ==========================================
            로딩
        ========================================== */}

        {loading && (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center

              max-[1014px]:min-h-[150px]
            "
          >
            <p
              className="
                text-[22px]
                text-[#808386]

                max-[1014px]:text-[13px]
              "
            >
              프로젝트를 불러오는 중입니다.
            </p>
          </div>
        )}

        {/* ==========================================
            에러
        ========================================== */}

        {!loading &&
          error && (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center

                max-[1014px]:min-h-[150px]
              "
            >
              <p
                className="
                  text-[22px]
                  text-red-500

                  max-[1014px]:text-[13px]
                "
              >
                {error}
              </p>
            </div>
          )}

        {/* ==========================================
            프로젝트 목록
        ========================================== */}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div
              className="
                mt-[30px]
                grid
                w-full
                grid-cols-3
                gap-[24px]
                font-montserrat

                max-[1014px]:grid-cols-1
                max-[1014px]:gap-[24px]
              "
            >
              {projects.map(
                (project) => (
                  <div
                    key={project.id}
                    onClick={() =>
                      navigate(
                        `/ProjectDetail/${project.id}`,
                      )
                    }
                    className="
                      w-full
                      cursor-pointer
                      overflow-hidden
                      rounded-[20px]
                      border
                      border-[#E5E5E5]
                      bg-white

                      max-[1014px]:h-[304px]
                      max-[1014px]:rounded-[12px]
                      max-[1014px]:shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                    "
                  >
                    {/* 이미지 */}

                    <div
                      className="
                        aspect-[384/233]
                        w-full
                        overflow-hidden
                        bg-[#D9D9D9]

                        max-[1014px]:h-[159px]
                        max-[1014px]:aspect-auto
                      "
                    >
                      {projectThumbnails[project.id] && (
                        <img
                          src={
                            projectThumbnails[
                            project.id
                            ]
                          }
                          alt={`${project.title} 썸네일`}
                          className="
      h-full
      w-full
      object-cover
    "
                        />
                      )}
                    </div>

                    {/* 내용 */}

                    <div
                      className="
                        h-[137px]
                        w-full
                        px-5
                        py-5

                        max-[1014px]:h-[145px]
                        max-[1014px]:px-[22px]
                        max-[1014px]:py-[24px]
                      "
                    >
                      <p
                        className="
                          text-[24px]
                          font-semibold
                          text-[#121212]

                          max-[1014px]:text-[24px]
                          max-[1014px]:leading-[20px]
                        "
                      >
                        {project.title}
                      </p>

                      <p
                        className="
                          mt-3
                          line-clamp-2
                          text-[16px]
                          font-medium
                          text-[#121212]

                          max-[1014px]:mt-[10px]
                          max-[1014px]:text-[16px]
                          max-[1014px]:leading-[22px]
                        "
                      >
                        {project.summary}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

        {/* ==========================================
            프로젝트 없음
        ========================================== */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <EmptyState message="조회된 프로젝트가 없습니다." />
          )}
      </div>
    </section>
  );
}

export default Project;