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

  const [
    teamOpen,
    setTeamOpen,
  ] = useState(false);

  const [
    stackOpen,
    setStackOpen,
  ] = useState(false);

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
  const partOrder = [
    "기획",
    "디자인",
    "프론트엔드",
    "백엔드",
  ];
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
  const categoryOrder = [
    "기획",
    "디자인",
    "프론트엔드",
    "백엔드",
    "AI",
  ];
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
            : prev + 1,
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
      <section
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-white
        "
      >
        <p
          className="
            text-[22px]
            text-[#808386]

            max-[393px]:text-[13px]
          "
        >
          프로젝트 정보를 불러오는 중입니다.
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
      <section
        className="
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          gap-5
          bg-white
        "
      >
        <p
          className="
            text-[20px]

            max-[393px]:text-[14px]
          "
        >
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
          className="
            rounded-[10px]
            border
            px-5
            py-3

            max-[393px]:rounded-[6px]
            max-[393px]:px-3
            max-[393px]:py-2
            max-[393px]:text-[11px]
          "
        >
          목록으로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section
      className="
        min-h-screen
        bg-white
        px-[120px]
        py-6

        max-[393px]:px-6
        max-[393px]:pb-[24px]
        max-[393px]:pt-[18px]
      "
    >
      {/* ==================================================
          데스크톱 상단 버튼
      ================================================== */}

      <div
        className="
          mb-[40px]
          flex
          items-center
          justify-between

          max-[393px]:hidden
        "
      >
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
          "
        >
          <img
            src={backbtn}
            alt="뒤로가기"
            className="
              h-[16px]
              w-[8px]
            "
          />
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/ProjectEdit/${project.projectId}`,
              )
            }
            className="
              h-[46px]
              rounded-[10px]
              border
              border-[#D0D6DD]
              px-[10px]
              text-[16px]
              font-medium
              text-[#808386]
            "
          >
            프로젝트 수정
          </button>

          <button
            type="button"
            onClick={
              handleDelete
            }
            className="
              h-[46px]
              rounded-[10px]
              border
              border-[#D0D6DD]
              px-[10px]
              text-[16px]
              font-medium
              text-[#808386]
            "
          >
            프로젝트 삭제
          </button>
        </div>
      </div>

      {/* ==================================================
          프로젝트 상단
      ================================================== */}

      <div
        className="
          flex
          gap-10

          max-[393px]:flex-col
          max-[393px]:gap-0
        "
      >
        {/* ==================================================
            왼쪽 정보

            모바일에서는 contents로 풀어서
            순서를 각각 변경함
        ================================================== */}

        <div
          className="
            w-[384px]
            shrink-0

            max-[393px]:contents
          "
        >
          {/* 로고 + 제목 */}

          <div
            className="
              mb-[15px]
              flex
              items-center
              gap-4

              max-[393px]:order-1
              max-[393px]:mb-[12px]
              max-[393px]:gap-[12px]
            "
          >
            <div
              className="
                h-[93px]
                w-[93px]
                shrink-0
                overflow-hidden
                rounded-[20px]
                bg-[#D9D9D9]

                max-[393px]:h-[45px]
                max-[393px]:w-[45px]
                max-[393px]:rounded-[8px]
              "
            >
              {project.logoUrl && (
                <img
                  src={
                    project.logoUrl
                  }
                  alt={
                    project.title
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              )}
            </div>

            <h1
              className="
                text-[50px]
                font-medium
                text-[#222]

                max-[393px]:text-[24px]
                max-[393px]:font-semibold
                max-[393px]:leading-[20px]
              "
            >
              {
                project.title
              }
            </h1>
          </div>

          {/* 프로젝트 한줄 소개 */}

          <p
            className="
              mb-[30px]
              text-[20px]
              font-medium
              text-[#121212]

              max-[393px]:order-2
              max-[393px]:mb-[18px]
              max-[393px]:text-[18px]
              max-[393px]:leading-[24px]
            "
          >
            {
              project.summary
            }
          </p>

          {/* 해커톤 / 프로젝트 기간 */}

          <div
            className="
              h-[179px]
              rounded-[12px]
              border
              border-[#DADDE1]
              px-[25px]
              py-[20px]

              max-[393px]:order-4
              max-[393px]:mt-[14px]
              max-[393px]:h-auto
              max-[393px]:rounded-[15px]
              max-[393px]:px-[16px]
              max-[393px]:py-[14px]
            "
          >
            <p
              className="
                text-[18px]
                text-[#6C6E72]

                max-[393px]:text-[16px]
              "
            >
              해커톤
            </p>

            <p
              className="
                mb-3
                text-[22px]
                font-medium

                max-[393px]:mb-[10px]
                max-[393px]:mt-[1px]
                max-[393px]:text-[18px]
              "
            >
              {hackathonName[
                project.hackathon
              ] ??
                project.hackathon}
            </p>

            <p
              className="
                text-[18px]
                text-[#6C6E72]

                max-[393px]:text-[16px]
                max-[393px]:mt-[15px]
              "
            >
              프로젝트 기간
            </p>

            <p
              className="
                text-[22px]
                font-medium

                max-[393px]:mt-[1px]
                max-[393px]:text-[18px]
              "
            >
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

        {/* ==================================================
            장표
        ================================================== */}

        <div
          className="
            flex-1

            max-[393px]:order-3
            max-[393px]:w-full
          "
        >
          {/* 메인 장표 */}

          <div
            className="
              relative
              h-[529px]
              w-full
              overflow-hidden
              bg-[#CCCED0]

              max-[393px]:h-[214px]
              max-[393px]:rounded-[1px]
            "
          >
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
                className="
                  h-full
                  w-full
                  object-contain
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                "
              >
                <p
                  className="
                    text-[20px]
                    text-[#808386]

                    max-[393px]:text-[11px]
                  "
                >
                  등록된 장표가 없습니다.
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
                    className="
                    absolute
                    left-4
                    top-1/2
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-[8px]
                    bg-[#212121]

                    max-[393px]:left-[12px]
                    max-[393px]:h-[23px]
                    max-[393px]:w-[23px]
                    max-[393px]:rounded-[5px]
                  "
                  >
                    <img
                      src={
                        leftbtn
                      }
                      alt="이전"
                      className="
                      h-[12px]
                      w-[6px]

                      max-[393px]:h-[8px]
                      max-[393px]:w-[4px]
                    "
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleNextSlide
                    }
                    className="
                    absolute
                    right-4
                    top-1/2
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-[8px]
                    bg-[#212121]

                    max-[393px]:right-[12px]
                    max-[393px]:h-[23px]
                    max-[393px]:w-[23px]
                    max-[393px]:rounded-[5px]
                  "
                  >
                    <img
                      src={
                        rightbtn
                      }
                      alt="다음"
                      className="
                      h-[12px]
                      w-[6px]

                      max-[393px]:h-[8px]
                      max-[393px]:w-[4px]
                    "
                    />
                  </button>
                </>
              )}
          </div>

          {/* ==================================================
              데스크톱 썸네일
          ================================================== */}

          {project.slides
            .length >
            0 && (
              <div
                className="
                mt-3
                grid
                grid-cols-6
                gap-3

                max-[393px]:hidden
              "
              >
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
                      className={`
                      h-[80px]
                      overflow-hidden
                      border-2

                      ${currentSlide ===
                          index
                          ? "border-[#8158F6]"
                          : "border-transparent"
                        }
                    `}
                    >
                      <img
                        src={
                          slide.imageUrl
                        }
                        alt={`장표 ${index +
                          1
                          }`}
                        className="
                        h-full
                        w-full
                        object-cover
                      "
                      />
                    </button>
                  ),
                )}
              </div>
            )}

          {/* ==================================================
              모바일 슬라이드 점
          ================================================== */}

          {project.slides
            .length >
            1 && (
              <div
                className="
                hidden

                max-[393px]:mt-[10px]
                max-[393px]:flex
                max-[393px]:items-center
                max-[393px]:justify-center
                max-[393px]:gap-[5px]
              "
              >
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
                      aria-label={`${index +
                        1
                        }번째 장표`}
                      onClick={() =>
                        setCurrentSlide(
                          index,
                        )
                      }
                      className={`
                      h-[4px]
                      w-[4px]
                      rounded-full

                      ${currentSlide ===
                          index
                          ? "bg-[#575B61]"
                          : "bg-[#D5D9DE]"
                        }
                    `}
                    />
                  ),
                )}
              </div>
            )}
        </div>
      </div>

      {/* ==================================================
          하단
      ================================================== */}

      <div
        className="
          mt-10
          flex
          gap-10

          max-[393px]:mt-[12px]
          max-[393px]:flex-col
          max-[393px]:gap-[12px]
        "
      >
        {/* ==================================================
            왼쪽 - 팀원 / 기술스택
        ================================================== */}

        <div
          className="
            w-[384px]
            shrink-0
            space-y-4

            max-[393px]:w-full
            max-[393px]:space-y-[12px]
          "
        >
          {/* 프로젝트 팀원 */}

          <div
            className="
              overflow-hidden
              rounded-[12px]
              border
              border-[#D0D6DD]
              bg-white
              max-[393px]:bg-[#FAFAFA]  
              max-[393px]:rounded-[15px]
            "
          >
            <button
              type="button"
              onClick={() =>
                setTeamOpen(
                  (prev) =>
                    !prev,
                )
              }
              className="
                flex
                h-[78px]
                w-full
                items-center
                justify-between
                px-[20px]
                max-[393px]:ba
                max-[393px]:h-[px]
                max-[393px]:px-[15px]
              "
            >
              <span
                className="
                  text-[20px]
                  font-semibold
                  text-[#121212]

                  max-[393px]:text-[18px]
                  max-[393px]:font-medium
                "
              >
                프로젝트 팀원
              </span>

              <img
                src={togglebtn}
                alt="프로젝트 팀원 펼치기"
                className={`
                  h-[14px]
                  w-[14px]
                  transition-transform
                  duration-200

                  max-[393px]:h-[15px]
                  max-[393px]:w-[15x]

                  ${teamOpen
                    ? "rotate-90"
                    : ""
                  }
                `}
              />
            </button>

            {teamOpen && (
              <div
                className="
                  px-[20px]
                  py-[22px]
                max-[393px]:mt-[-20px]
                  max-[393px]:px-[15px]
                  max-[393px]:py-[14px]
                "
              >
                {Object.entries(
                  groupedMembers,
                ).length >
                  0 ? (
                  <div
                    className="
                      space-y-5

                      max-[393px]:space-y-[12px]
                    "
                  >
                    {Object.entries(groupedMembers)
                      .sort(
                        ([a], [b]) =>
                          partOrder.indexOf(a) -
                          partOrder.indexOf(b),
                      )
                      .map(([part, members]) => (
                        <div
                          key={
                            part
                          }
                        >
                          <p
                            className="
                              text-[16px]
                              text-[#808386]

                              max-[393px]:text-[16px]
                            "
                          >
                            {
                              part
                            }
                          </p>

                          <p
                            className="
                              mt-[6px]
                              text-[20px]
                              font-medium
                              text-[#121212]

                              max-[393px]:mt-[3px]
                              max-[393px]:text-[16px]
                            "
                          >
                            {members
                              .map(
                                (
                                  member,
                                ) =>
                                  member.name,
                              )
                              .join(
                                " ",
                              )}
                          </p>
                        </div>
                      ),
                      )}
                  </div>
                ) : (
                  <p
                    className="
                      text-[18px]
                      text-[#808386]

                      max-[393px]:text-[10px]
                    "
                  >
                    등록된 팀원이 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 기술 스택 */}

          <div
            className="
              overflow-hidden
              rounded-[12px]
              border
              border-[#D0D6DD]
              bg-white

              max-[393px]:bg-[#FAFAFA]  
              max-[393px]:rounded-[15px]
            "
          >
            <button
              type="button"
              onClick={() =>
                setStackOpen(
                  (prev) =>
                    !prev,
                )
              }
              className="
                flex
                h-[78px]
                w-full
                items-center
                justify-between
                px-[20px]

                max-[393px]:h-[84px]
                max-[393px]:px-[15px]
              "
            >
              <span
                className="
                  text-[20px]
                  font-semibold
                  text-[#121212]

                  max-[393px]:text-[18px]
                  max-[393px]:font-medium
                "
              >
                기술 스택
              </span>

              <img
                src={togglebtn}
                alt="기술 스택 펼치기"
                className={`
                  h-[14px]
                  w-[14px]
                  transition-transform
                  duration-200

                  max-[393px]:h-[15px]
                  max-[393px]:w-[15px]

                  ${stackOpen
                    ? "rotate-90"
                    : ""
                  }
                `}
              />
            </button>

            {stackOpen && (
              <div
                className="
                  px-[20px]
                  py-[22px]
                 max-[393px]:mt-[-20px]
                  max-[393px]:px-[15px]
                  max-[393px]:py-[14px]
                "
              >
                {Object.entries(groupedTechStacks).length > 0 ? (
                  <div className="space-y-[11px]">
                    {Object.entries(groupedTechStacks)
                      .sort(
                        ([a], [b]) =>
                          categoryOrder.indexOf(a) -
                          categoryOrder.indexOf(b),
                      )
                      .map(([category, stacks]) => (
                        <SkillRow
                          key={category}
                          title={category}
                          items={stacks.map(
                            (stack) => stack.name,
                          )}
                        />
                      ))}
                  </div>
                ) : (
                  <p
                    className="
      text-[18px]
      text-[#808386]

      max-[393px]:text-[16px]
    "
                  >
                    등록된 기술 스택이 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            Project Overview
        ================================================== */}

        <div
          className="
            min-h-[calc(100vh-180px)]
            flex-1
            rounded-[15px]
            border
            border-[#D0D6DD]
            bg-[#FAFAFA]
            px-[65px]
            py-[35px]

            max-[393px]:min-h-[220px]
            max-[393px]:w-full
            max-[393px]:rounded-[15px]
            max-[393px]:px-[15px]
            max-[393px]:py-[17px]
          "
        >
          <h2
            className="
              text-[24px]
              font-semibold

              max-[393px]:text-[18px]
            "
          >
            Project Overview
          </h2>

          <p
            className="
              mt-[25px]
              whitespace-pre-wrap
              text-[18px]
              font-medium
              leading-[1.7]

              max-[393px]:mt-[9px]
              max-[393px]:text-[14px]
              max-[393px]:leading-[20px]
            "
          >
            {project.description}
          </p>
        </div>
      </div>

      {/* ==================================================
          모바일 수정 / 삭제 버튼
      ================================================== */}

      <div
        className="
          hidden

          max-[393px]:mt-[20px]
          max-[393px]:flex
          max-[393px]:justify-end
          max-[393px]:gap-[6px]
        "
      >
        <button
          type="button"
          onClick={() =>
            navigate(
              `/ProjectEdit/${project.projectId}`,
            )
          }
          className="
            h-[46px]
            rounded-[10px]
            border
            border-[#D0D6DD]
            px-[11px]
            text-[14px]
            font-medium
            text-[#808386]
          "
        >
          프로젝트 수정
        </button>

        <button
          type="button"
          onClick={
            handleDelete
          }
          className="
            h-[46px]
            rounded-[10px]
            border
            border-[#D0D6DD]
            px-[11px]
            text-[14px]
            font-medium
            text-[#808386]
          "
        >
          프로젝트 삭제
        </button>
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
    <div
      className="
        mb-5

        max-[393px]:mb-[12px]
      "
    >
      <p
        className="
          mb-2
          text-[18px]
          text-[#6C6E72]

          max-[393px]:mb-[5px]
          max-[393px]:text-[16px]
        "
      >
        {title}
      </p>

      <div
        className="
          flex
          flex-wrap
          gap-2

          max-[393px]:gap-[5px]
        "
      >
        {items.map(
          (
            item,
            index,
          ) => (
            <span
              key={`${item}-${index}`}
              className="
                rounded-[5px]
                bg-[#DBDEE2]
                px-[12px]
                py-[8px]
                text-[16px]
                font-medium
                text-black

                max-[393px]:rounded-[5px]
                max-[393px]:px-[15px]
                max-[393px]:py-[5px]
                max-[393px]:text-[16px]
              "
            >
              {item}
            </span>
          ),
        )}
      </div>
    </div>
  );
}