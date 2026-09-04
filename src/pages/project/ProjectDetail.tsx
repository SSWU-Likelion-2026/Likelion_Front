import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import backbtn from "../../img/project/backbtn.svg";
import leftbtn from "../../img/project/left.svg";
import rightbtn from "../../img/project/right.svg";

import {
  deleteProject,
  getProjectDetail,
} from "../../api/project/project";

import type {
  ProjectDetail as ProjectDetailType,
  ProjectMember,
  ProjectTechStack,
} from "../../types/project/project";

const hackathonName: Record<string, string> = {
  IDEATHON: "아이디어톤",
  HERETHON: "여기톤",
  CENTRALTHON: "중앙톤",
};

const partName: Record<string, string> = {
  PM: "기획/디자인",
  PLANNING: "기획/디자인",
  DESIGN: "기획/디자인",
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  AI: "AI",
};

const categoryName: Record<string, string> = {
  PLANNING: "기획",
  DESIGN: "디자인",
  FRONTEND: "프론트엔드",
  BACKEND: "백엔드",
  AI: "AI",
};

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] =
    useState<ProjectDetailType | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const numericProjectId = Number(projectId);

  useEffect(() => {
    if (!projectId || Number.isNaN(numericProjectId)) {
      setError("잘못된 프로젝트 주소입니다.");
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getProjectDetail(numericProjectId);

        setProject(data);
      } catch (error) {
        console.error(error);
        setError("프로젝트 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [numericProjectId, projectId]);

  const groupedMembers = useMemo(() => {
    if (!project) return {};

    return project.members.reduce<Record<string, ProjectMember[]>>(
      (acc, member) => {
        const category =
          partName[member.part] ?? member.part;

        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(member);

        return acc;
      },
      {},
    );
  }, [project]);

  const groupedTechStacks = useMemo(() => {
    if (!project) return {};

    return project.techStacks.reduce<
      Record<string, ProjectTechStack[]>
    >((acc, stack) => {
      const category =
        categoryName[stack.category] ?? stack.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(stack);

      return acc;
    }, {});
  }, [project]);

  const handlePreviousSlide = () => {
    if (!project || project.slides.length === 0) return;

    setCurrentSlide((prev) =>
      prev === 0 ? project.slides.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    if (!project || project.slides.length === 0) return;

    setCurrentSlide((prev) =>
      prev === project.slides.length - 1 ? 0 : prev + 1,
    );
  };

  const handleDelete = async () => {
    if (!project) return;

    const confirmed = window.confirm(
      "프로젝트를 삭제하시겠습니까?",
    );

    if (!confirmed) return;

    try {
      await deleteProject(project.projectId);

      alert("프로젝트가 삭제되었습니다.");

      navigate("/Project");
    } catch (error) {
      console.error(error);
      alert("프로젝트 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white">
        프로젝트 정보를 불러오는 중입니다.
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white">
        <p className="text-[20px]">
          {error || "프로젝트가 존재하지 않습니다."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/Project")}
          className="rounded-[10px] border px-5 py-3"
        >
          목록으로 돌아가기
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-[120px] py-6">
      {/* 상단 버튼 */}
      <div className="mb-[40px] flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-6 w-6 items-center justify-center"
        >
          <img
            src={backbtn}
            alt="뒤로가기"
            className="h-[16px] w-[8px]"
          />
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/ProjectEdit/${project.projectId}`)
            }
            className="h-[46px] rounded-[10px] border border-[#D0D6DD] px-[10px] text-[16px] font-medium text-[#808386]"
          >
            프로젝트 수정
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-[46px] rounded-[10px] border border-[#D0D6DD] px-[10px] text-[16px] font-medium text-[#808386]"
          >
            프로젝트 삭제
          </button>
        </div>
      </div>

      {/* 상단 */}
      <div className="flex gap-10">
        <div className="w-[384px] shrink-0">
          <div className="mb-[15px] flex items-center gap-4">
            <div className="h-[93px] w-[93px] overflow-hidden rounded-[20px] bg-[#D9D9D9]">
              {project.logoUrl && (
                <img
                  src={project.logoUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <h1 className="text-[50px] font-medium text-[#222]">
              {project.title}
            </h1>
          </div>

          <p className="mb-[30px] text-[20px] font-medium text-[#121212]">
            {project.summary}
          </p>

          <div className="h-[179px] rounded-[12px] border border-[#DADDE1] px-[25px] py-[20px]">
            <p className="text-[18px] text-[#6C6E72]">
              해커톤
            </p>

            <p className="mb-3 text-[22px] font-medium">
              {hackathonName[project.hackathon] ??
                project.hackathon}
            </p>

            <p className="text-[18px] text-[#6C6E72]">
              프로젝트 기간
            </p>

            <p className="text-[22px] font-medium">
              {project.startMonth.replace("-", ".")} -{" "}
              {project.endMonth.replace("-", ".")}
            </p>
          </div>
        </div>

        {/* 장표 */}
        <div className="flex-1">
          <div className="relative h-[529px] w-full overflow-hidden bg-[#CCCED0]">
            {project.slides.length > 0 && (
              <img
                src={project.slides[currentSlide]?.imageUrl}
                alt={`프로젝트 장표 ${currentSlide + 1}`}
                className="h-full w-full object-contain"
              />
            )}

            {project.slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePreviousSlide}
                  className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#212121]"
                >
                  <img
                    src={leftbtn}
                    alt="이전"
                    className="h-[12px] w-[6px]"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#212121]"
                >
                  <img
                    src={rightbtn}
                    alt="다음"
                    className="h-[12px] w-[6px]"
                  />
                </button>
              </>
            )}
          </div>

          <div className="mt-3 grid grid-cols-6 gap-3">
            {project.slides.map((slide, index) => (
              <button
                key={slide.slideId}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-[80px] overflow-hidden border-2 ${
                  currentSlide === index
                    ? "border-[#8158F6]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={slide.imageUrl}
                  alt={`장표 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="mt-10 flex gap-10">
        <div className="w-[384px] shrink-0 space-y-5">
          {/* 팀원 */}
          <div className="min-h-[352px] rounded-[12px] border border-[#D0D6DD] bg-[#FAFAFA] p-5">
            <h2 className="mb-5 text-[24px] font-semibold">
              프로젝트 팀원
            </h2>

            <div className="space-y-4">
              {Object.entries(groupedMembers).map(
                ([part, members]) => (
                  <div key={part}>
                    <p className="text-[18px] text-[#888]">
                      {part}
                    </p>

                    <p className="mt-1 text-[22px] font-medium">
                      {members
                        .map((member) => member.name)
                        .join(" ")}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* 기술스택 */}
          <div className="min-h-[634px] rounded-[12px] border border-[#DADDE1] bg-[#FAFAFA] p-5">
            <h2 className="mb-5 text-[24px] font-semibold">
              기술 스택
            </h2>

            {Object.entries(groupedTechStacks).map(
              ([category, stacks]) => (
                <SkillRow
                  key={category}
                  title={category}
                  items={stacks.map((stack) => stack.name)}
                />
              ),
            )}
          </div>
        </div>

        {/* 설명 */}
        <div className="min-h-[1311px] flex-1 rounded-[15px] border border-[#D0D6DD] bg-[#FAFAFA] px-[65px] py-[25px]">
          <h2 className="mt-[35px] text-[24px] font-semibold">
            Project Overview
          </h2>

          <p className="mt-[25px] whitespace-pre-wrap text-[18px] font-medium">
            {project.description}
          </p>
        </div>
      </div>
    </section>
  );
}

function SkillRow({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[18px] text-[#6C6E72]">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-[5px] bg-[#DBDEE2] px-[12px] py-[8px] text-[16px] font-medium text-black"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}