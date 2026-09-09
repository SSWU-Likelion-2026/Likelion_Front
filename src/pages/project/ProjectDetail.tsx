import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import backbtn from "../../img/project/backbtn.svg";
import leftbtn from "../../img/project/left.svg";
import rightbtn from "../../img/project/right.svg";
import togglebtn from "../../img/project/toggle.svg";

import {
  deleteProject,
  getProjectDetail,
} from "../../api/project/project";

import { ApiError } from "../../api/instance";

import type {
  ProjectDetail as ProjectDetailType,
  ProjectMember,
  ProjectTechStack,
} from "../../types/project/project";

// ======================================================
// 해커톤 이름
// ======================================================

const hackathonName: Record<
  string,
  string
> = {
  IDEATHON: "아이디어톤",
  HERETHON: "여기톤",
  CENTRALTHON: "중앙톤",
};

// ======================================================
// 팀원 Part 이름
// ======================================================

const partName: Record<
  string,
  string
> = {
  PM: "기획/디자인",
  PLANNING: "기획/디자인",
  DESIGN: "기획/디자인",
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  AI: "AI",
};

// ======================================================
// 기술스택 Category 이름
// ======================================================

const categoryName: Record<
  string,
  string
> = {
  PLANNING: "기획",
  DESIGN: "디자인",
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  AI: "AI",
};

export default function ProjectDetail() {
  const navigate =
    useNavigate();
  const [teamOpen, setTeamOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  const {
    projectId,
  } = useParams();

  const numericProjectId =
    Number(projectId);

  const [
    project,
    setProject,
  ] =
    useState<ProjectDetailType | null>(
      null,
    );

  const [
    currentSlide,
    setCurrentSlide,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ======================================================
  // 프로젝트 상세 조회
  // ======================================================

  useEffect(() => {
    if (
      !projectId ||
      Number.isNaN(
        numericProjectId,
      )
    ) {
      setError(
        "잘못된 프로젝트 주소입니다.",
      );

      setLoading(false);

      return;
    }

    const fetchProject =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getProjectDetail(
              numericProjectId,
            );

          // 장표 순서를 sequenceNum 기준으로 정렬
          const sortedProject = {
            ...data,
            slides: [
              ...data.slides,
            ].sort(
              (
                a,
                b,
              ) =>
                a.sequenceNum -
                b.sequenceNum,
            ),
          };

          setProject(
            sortedProject,
          );

          setCurrentSlide(0);
        } catch (error) {
          console.error(
            "프로젝트 상세 조회 실패:",
            error,
          );

          if (
            error instanceof
            ApiError
          ) {
            if (
              error.status === 404
            ) {
              setError(
                "존재하지 않는 프로젝트입니다.",
              );

              return;
            }

            setError(
              error.message ||
              "프로젝트 정보를 불러오지 못했습니다.",
            );

            return;
          }

          setError(
            "프로젝트 정보를 불러오지 못했습니다.",
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProject();
  }, [
    numericProjectId,
    projectId,
  ]);

  // ======================================================
  // 팀원 그룹
  // ======================================================

  const groupedMembers =
    useMemo(() => {
      if (!project) {
        return {};
      }

      return project.members.reduce<
        Record<
          string,
          ProjectMember[]
        >
      >(
        (
          acc,
          member,
        ) => {
          const category =
            partName[
            member.part
            ] ??
            member.part;

          if (
            !acc[category]
          ) {
            acc[category] =
              [];
          }

          acc[
            category
          ].push(member);

          return acc;
        },
        {},
      );
    }, [project]);

  // ======================================================
  // 기술스택 그룹
  // ======================================================

  const groupedTechStacks =
    useMemo(() => {
      if (!project) {
        return {};
      }

      return project.techStacks.reduce<
        Record<
          string,
          ProjectTechStack[]
        >
      >(
        (
          acc,
          stack,
        ) => {
          const category =
            categoryName[
            stack.category
            ] ??
            stack.category;

          if (
            !acc[category]
          ) {
            acc[category] =
              [];
          }

          acc[
            category
          ].push(stack);

          return acc;
        },
        {},
      );
    }, [project]);

  // ======================================================
  // 이전 장표
  // ======================================================

  const handlePreviousSlide =
    () => {
      if (
        !project ||
        project.slides
          .length === 0
      ) {
        return;
      }

      setCurrentSlide(
        (prev) =>
          prev === 0
            ? project
              .slides
              .length -
            1
            : prev - 1,
      );
    };

  // ======================================================
  // 다음 장표
  // ======================================================

  const handleNextSlide =
    () => {
      if (
        !project ||
        project.slides
          .length === 0
      ) {
        return;
      }

      setCurrentSlide(
        (prev) =>
          prev ===
            project.slides
              .length -
            1
            ? 0
            : prev +
            1,
      );
    };

  // ======================================================
  // 프로젝트 삭제
  // ======================================================

  const handleDelete =
    async () => {
      if (!project) {
        return;
      }

      const confirmed =
        window.confirm(
          "프로젝트를 삭제하시겠습니까?",
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteProject(
          project.projectId,
        );

        alert(
          "프로젝트가 삭제되었습니다.",
        );

        navigate(
          "/Project",
        );
      } catch (error) {
        console.error(
          "프로젝트 삭제 실패:",
          error,
        );

        if (
          error instanceof
          ApiError
        ) {
          if (
            error.status === 401
          ) {
            alert(
              "로그인이 필요합니다.",
            );

            return;
          }

          if (
            error.status === 403
          ) {
            alert(
              "해당 프로젝트를 삭제할 권한이 없습니다.",
            );

            return;
          }

          if (
            error.status === 404
          ) {
            alert(
              "이미 삭제되었거나 존재하지 않는 프로젝트입니다.",
            );

            navigate(
              "/Project",
            );

            return;
          }

          alert(
            error.message,
          );

          return;
        }

        alert(
          "프로젝트 삭제에 실패했습니다.",
        );
      }
    };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-[22px] text-gray-5">
          프로젝트 정보를
          불러오는 중입니다.
        </p>
      </section>
    );
  }

  // ======================================================
  // Error
  // ======================================================

  if (
    error ||
    !project
  ) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white">
        <p className="text-[20px]">
          {error ||
            "프로젝트가 존재하지 않습니다."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/Project",
            )
          }
          className="rounded-[10px] border px-5 py-3"
        >
          목록으로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-[120px] py-6">

      {/* ==========================================
          상단 버튼
      ========================================== */}

      <div className="mb-[40px] flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="flex h-6 w-6 items-center justify-center"
        >
          <img
            src={backbtn}
            alt="뒤로가기"
            className="h-[16px] w-[8px]"
          />
        </button>

        <div className="flex gap-3">

          {/* 수정 */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/ProjectEdit/${project.projectId}`,
              )
            }
            className="h-[46px] rounded-[10px] border border-gray-9 px-[10px] text-[16px] font-medium text-gray-5"
          >
            프로젝트 수정
          </button>

          {/* 삭제 */}

          <button
            type="button"
            onClick={
              handleDelete
            }
            className="h-[46px] rounded-[10px] border border-gray-9 px-[10px] text-[16px] font-medium text-gray-5"
          >
            프로젝트 삭제
          </button>
        </div>
      </div>

      {/* ==========================================
          상단 프로젝트 정보
      ========================================== */}

      <div className="flex gap-10">

        {/* 왼쪽 정보 */}

        <div className="w-[384px] shrink-0">

          {/* 로고 + 제목 */}

          <div className="mb-[15px] flex items-center gap-4">
            <div className="h-[93px] w-[93px] overflow-hidden rounded-[20px] bg-misc-d9d9d9">
              {project.logoUrl && (
                <img
                  src={
                    project.logoUrl
                  }
                  alt={
                    project.title
                  }
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <h1 className="text-[50px] font-medium text-misc-222">
              {
                project.title
              }
            </h1>
          </div>

          {/* 슬로건 */}

          <p className="mb-[30px] text-[20px] font-medium text-black-1">
            {
              project.summary
            }
          </p>

          {/* 해커톤 / 기간 */}

          <div className="h-[179px] rounded-[12px] border border-misc-dadde1 px-[25px] py-[20px]">
            <p className="text-[18px] text-gray-4">
              해커톤
            </p>

            <p className="mb-3 text-[22px] font-medium">
              {hackathonName[
                project.hackathon
              ] ??
                project.hackathon}
            </p>

            <p className="text-[18px] text-gray-4">
              프로젝트 기간
            </p>

            <p className="text-[22px] font-medium">
              {project.startMonth.replace(
                "-",
                ".",
              )}{" "}
              -{" "}
              {project.endMonth.replace(
                "-",
                ".",
              )}
            </p>
          </div>
        </div>

        {/* ==========================================
            장표
        ========================================== */}

        <div className="flex-1">

          {/* 메인 장표 */}

          <div className="relative h-[529px] w-full overflow-hidden bg-gray-8">
            {project.slides
              .length >
              0 ? (
              <img
                src={
                  project.slides[
                    currentSlide
                  ]?.imageUrl
                }
                alt={`프로젝트 장표 ${currentSlide +
                  1
                  }`}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-[20px] text-gray-5">
                  등록된 장표가
                  없습니다.
                </p>
              </div>
            )}

            {/* 좌우 버튼 */}

            {project.slides
              .length >
              1 && (
                <>
                  <button
                    type="button"
                    onClick={
                      handlePreviousSlide
                    }
                    className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[8px] bg-warm-black"
                  >
                    <img
                      src={
                        leftbtn
                      }
                      alt="이전"
                      className="h-[12px] w-[6px]"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleNextSlide
                    }
                    className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[8px] bg-warm-black"
                  >
                    <img
                      src={
                        rightbtn
                      }
                      alt="다음"
                      className="h-[12px] w-[6px]"
                    />
                  </button>
                </>
              )}
          </div>

          {/* 썸네일 */}

          {project.slides
            .length >
            0 && (
              <div className="mt-3 grid grid-cols-6 gap-3">
                {project.slides.map(
                  (
                    slide,
                    index,
                  ) => (
                    <button
                      key={
                        slide.slideId
                      }
                      type="button"
                      onClick={() =>
                        setCurrentSlide(
                          index,
                        )
                      }
                      className={`h-[80px] overflow-hidden border-2 ${currentSlide ===
                        index
                        ? "border-primary-100"
                        : "border-transparent"
                        }`}
                    >
                      <img
                        src={
                          slide.imageUrl
                        }
                        alt={`장표 ${index +
                          1
                          }`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ),
                )}
              </div>
            )}
        </div>
      </div>

      {/* ==========================================
          하단
      ========================================== */}

      <div className="mt-10 flex gap-10">

        {/* 왼쪽 */}
        <div className="w-[384px] shrink-0 space-y-4">

          {/* 프로젝트 팀원 */}
          <div className="overflow-hidden rounded-[12px] border border-gray-9 bg-white">
            <button
              type="button"
              onClick={() => setTeamOpen((prev) => !prev)}
              className="flex h-[78px] w-full items-center justify-between px-[20px]"
            >
              <span className="text-[20px] font-semibold text-black-1">
                프로젝트 팀원
              </span>

              <img
                src={togglebtn}
                alt="프로젝트 팀원 펼치기"
                className={`h-[14px] w-[14px] transition-transform duration-200 ${teamOpen ? "rotate-90" : ""
                  }`}
              />
            </button>

            {teamOpen && (
              <div className="border-t border-misc-e5e7eb px-[20px] py-[22px]">
                {Object.entries(groupedMembers).length > 0 ? (
                  <div className="space-y-5">
                    {Object.entries(groupedMembers).map(
                      ([part, members]) => (
                        <div key={part}>
                          <p className="text-[16px] text-gray-5">
                            {part}
                          </p>

                          <p className="mt-[6px] text-[20px] font-medium text-black-1">
                            {members
                              .map((member) => member.name)
                              .join(" ")}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-[18px] text-gray-5">
                    등록된 팀원이 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 기술 스택 */}
          <div className="overflow-hidden rounded-[12px] border border-gray-9 bg-white">
            <button
              type="button"
              onClick={() => setStackOpen((prev) => !prev)}
              className="flex h-[78px] w-full items-center justify-between px-[20px]"
            >
              <span className="text-[20px] font-semibold text-black-1">
                기술 스택
              </span>

              <img
                src={togglebtn}
                alt="기술 스택 펼치기"
                className={`h-[14px] w-[14px] transition-transform duration-200 ${stackOpen ? "rotate-90" : ""
                  }`}
              />
            </button>

            {stackOpen && (
              <div className="border-t border-misc-e5e7eb px-[20px] py-[22px]">
                {Object.entries(groupedTechStacks).length > 0 ? (
                  Object.entries(groupedTechStacks).map(
                    ([category, stacks]) => (
                      <SkillRow
                        key={category}
                        title={category}
                        items={stacks.map((stack) => stack.name)}
                      />
                    ),
                  )
                ) : (
                  <p className="text-[18px] text-gray-5">
                    등록된 기술 스택이 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            프로젝트 설명
        ========================================== */}

        {/* ==========================================
    프로젝트 설명
========================================== */}

        <div className="min-h-[calc(100vh-180px)] flex-1 rounded-[15px] border border-gray-9 bg-surface-faint px-[65px] py-[35px]">
          <h2 className="text-[24px] font-semibold">
            Project Overview
          </h2>

          <p className="mt-[25px] whitespace-pre-wrap text-[18px] font-medium leading-[1.7]">
            {project.description}
          </p>
        </div>
      </div>
    </section>
  );
}

// ======================================================
// 기술스택 Row
// ======================================================

function SkillRow({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[18px] text-gray-4">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map(
          (
            item,
            index,
          ) => (
            <span
              key={`${item}-${index}`}
              className="rounded-[5px] bg-border-soft px-[12px] py-[8px] text-[16px] font-medium text-black"
            >
              {item}
            </span>
          ),
        )}
      </div>
    </div>
  );
}