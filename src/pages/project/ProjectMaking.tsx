import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import backbtn from "../../img/project/backbtn.svg";
import underbtn from "../../img/project/underbtn.svg";
import downloadbtn from "../../img/project/download.svg";
import deletebtn from "../../img/project/deletebtn.svg";
import plus from "../../img/project/plus.svg";

import {
    createProject,
    uploadProjectImage,
    uploadProjectImages,
} from "../../api/project/project";
import { ApiError } from "../../api/instance";

import type {
    ProjectHackathon,
    ProjectMemberRequest,
    ProjectRequest,
} from "../../types/project/project";

// ==============================
// 기수
// ==============================

const generations = [14, 13, 12];

// ==============================
// 해커톤
// ==============================
//
// 백엔드 enum 확정값
//

const eventOptions: {
    label: string;
    value: ProjectHackathon;
}[] = [
        {
            label: "아이디어톤",
            value: "IDEATHON",
        },
        {
            label: "여기톤",
            value: "HERETHON",
        },
        {
            label: "중앙톤",
            value: "CENTRALTHON",
        },
    ];

// ==============================
// 기술 스택
// ==============================
//
// 백엔드에서 전달받은 고정 기술스택 ID 목록
//

type TechStackCategory =
    | "PLANNING"
    | "DESIGN"
    | "FRONTEND"
    | "BACKEND"
    | "AI";

type TechStackOption = {
    id: number;
    name: string;
    category: TechStackCategory;
};

const techStacks: TechStackOption[] = [
    { id: 1, name: "Notion", category: "PLANNING" },
    { id: 2, name: "Google Workspace", category: "PLANNING" },
    { id: 3, name: "Miro", category: "PLANNING" },
    { id: 4, name: "Ms Office", category: "PLANNING" },
    { id: 5, name: "Confluence", category: "PLANNING" },
    { id: 6, name: "Figma", category: "PLANNING" },
    { id: 7, name: "Figjam", category: "PLANNING" },
    { id: 8, name: "Asana", category: "PLANNING" },
    { id: 9, name: "Slack", category: "PLANNING" },
    { id: 10, name: "Discord", category: "PLANNING" },
    { id: 11, name: "Jira", category: "PLANNING" },
    { id: 12, name: "Linear", category: "PLANNING" },
    { id: 13, name: "Trello", category: "PLANNING" },
    { id: 14, name: "GitHub", category: "PLANNING" },

    { id: 15, name: "Figma", category: "DESIGN" },
    { id: 16, name: "Sketch", category: "DESIGN" },
    { id: 17, name: "Penpot", category: "DESIGN" },
    { id: 18, name: "Framer", category: "DESIGN" },
    { id: 19, name: "ProtoPie", category: "DESIGN" },
    { id: 20, name: "Adobe Illustrator", category: "DESIGN" },
    { id: 21, name: "Adobe Photoshop", category: "DESIGN" },
    { id: 22, name: "Canva", category: "DESIGN" },
    { id: 23, name: "Spline", category: "DESIGN" },
    { id: 24, name: "Blender", category: "DESIGN" },
    { id: 25, name: "After Effects", category: "DESIGN" },

    { id: 26, name: "React", category: "FRONTEND" },
    { id: 27, name: "Next.js", category: "FRONTEND" },
    { id: 28, name: "Vue.js", category: "FRONTEND" },
    { id: 29, name: "Flutter", category: "FRONTEND" },
    { id: 30, name: "React Native", category: "FRONTEND" },
    { id: 31, name: "Swift", category: "FRONTEND" },
    { id: 32, name: "Kotlin", category: "FRONTEND" },
    { id: 33, name: "Unity", category: "FRONTEND" },
    { id: 34, name: "Unreal Engine", category: "FRONTEND" },
    { id: 35, name: "Godot", category: "FRONTEND" },
    { id: 36, name: "Three.js", category: "FRONTEND" },

    { id: 37, name: "Node.js", category: "BACKEND" },
    { id: 38, name: "Express.js", category: "BACKEND" },
    { id: 39, name: "NestJs", category: "BACKEND" },
    { id: 40, name: "Spring Boot", category: "BACKEND" },
    { id: 41, name: "Django", category: "BACKEND" },
    { id: 42, name: "FastAPI", category: "BACKEND" },
    { id: 43, name: "MySQL", category: "BACKEND" },
    { id: 44, name: "PostgreSQL", category: "BACKEND" },
    { id: 45, name: "MongoDB", category: "BACKEND" },
    { id: 46, name: "Redis", category: "BACKEND" },
    { id: 47, name: "Prisma", category: "BACKEND" },
    { id: 48, name: "Firebase", category: "BACKEND" },
    { id: 49, name: "Supabase", category: "BACKEND" },
    { id: 50, name: "AWS", category: "BACKEND" },
    { id: 51, name: "GCP", category: "BACKEND" },
    { id: 52, name: "Azure", category: "BACKEND" },
    { id: 53, name: "Vercel", category: "BACKEND" },
    { id: 54, name: "Docker", category: "BACKEND" },
    { id: 55, name: "PyTorch", category: "BACKEND" },
    { id: 56, name: "TensorFlow", category: "BACKEND" },
    { id: 57, name: "LangChain", category: "BACKEND" },

    { id: 58, name: "Chat GPT", category: "AI" },
    { id: 59, name: "Claude", category: "AI" },
    { id: 60, name: "Gemini", category: "AI" },
    { id: 61, name: "Grok", category: "AI" },
    { id: 62, name: "Perplexity", category: "AI" },
    { id: 63, name: "NotebookLM", category: "AI" },
    { id: 64, name: "HuggingFace", category: "AI" },
    { id: 65, name: "DALL", category: "AI" },
    { id: 66, name: "Midjourney", category: "AI" },
    { id: 67, name: "Stable Diffusion", category: "AI" },
    { id: 68, name: "Runway", category: "AI" },
    { id: 69, name: "Kling", category: "AI" },
    { id: 70, name: "Whisper", category: "AI" },
    { id: 71, name: "ElevenLabs", category: "AI" },
    { id: 72, name: "Cursor", category: "AI" },
    { id: 73, name: "Bolt", category: "AI" },
    { id: 74, name: "Lovable", category: "AI" },
    { id: 75, name: "v0", category: "AI" },
    { id: 76, name: "n8n", category: "AI" },
    { id: 77, name: "Zapier", category: "AI" },
    { id: 78, name: "Make", category: "AI" },
];
// ==============================
// Type
// ==============================

type TeamCategory =
    | "planning"
    | "frontend"
    | "backend";

type TeamMembers = {
    planning: string[];
    frontend: string[];
    backend: string[];
};

type ImageFile = {
    file: File;
    url: string;
};

// ==============================
// Component
// ==============================

export default function ProjectMaking() {
    const navigate = useNavigate();

    const logoInput =
        useRef<HTMLInputElement>(null);

    const bannerInput =
        useRef<HTMLInputElement>(null);

    // ==============================
    // 기본 정보
    // ==============================

    const [generation, setGeneration] =
        useState(14);

    const [projectName, setProjectName] =
        useState("");

    const [slogan, setSlogan] =
        useState("");

    const [description, setDescription] =
        useState("");

    // ==============================
    // 해커톤
    // ==============================

    const [eventType, setEventType] =
        useState<ProjectHackathon | "">("");

    const [eventOpen, setEventOpen] =
        useState(false);

    // ==============================
    // 기간
    // ==============================

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    // ==============================
    // 이미지
    // ==============================

    const [logo, setLogo] =
        useState<ImageFile | null>(null);

    const [banners, setBanners] =
        useState<ImageFile[]>([]);

    // ==============================
    // 기술 스택
    // ==============================

    const [selectedStackIds, setSelectedStackIds] = useState<number[]>([]);

    // ==============================
    // 팀원
    // ==============================

    const [members, setMembers] =
        useState<TeamMembers>({
            planning: [""],
            frontend: ["", ""],
            backend: ["", ""],
        });

    // ==============================
    // 등록 상태
    // ==============================

    const [submitting, setSubmitting] =
        useState(false);

    // ==============================
    // 모바일 단계
    // 1: 기본 정보 / 2: 팀원·이미지 / 3: 기술 스택
    // ==============================

    const [mobileStep, setMobileStep] =
        useState<1 | 2 | 3>(1);

    const moveMobileStep = (step: 1 | 2 | 3) => {
        setMobileStep(step);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ==============================
    // 팀원 추가
    // ==============================

    const addMember = (
        category: TeamCategory,
    ) => {
        setMembers((prev) => ({
            ...prev,

            [category]: [
                ...prev[category],
                "",
            ],
        }));
    };

    // ==============================
    // 팀원 입력
    // ==============================

    const changeMember = (
        category: TeamCategory,
        index: number,
        value: string,
    ) => {
        setMembers((prev) => ({
            ...prev,

            [category]: prev[category].map(
                (member, memberIndex) =>
                    memberIndex === index
                        ? value
                        : member,
            ),
        }));
    };

    // ==============================
    // 로고 선택
    // ==============================

    const handleLogo = (
        file?: File,
    ) => {
        if (!file) return;

        if (
            file.size >
            10 * 1024 * 1024
        ) {
            alert(
                "이미지는 최대 10MB까지 업로드할 수 있습니다.",
            );

            return;
        }

        if (logo) {
            URL.revokeObjectURL(
                logo.url,
            );
        }

        setLogo({
            file,
            url: URL.createObjectURL(
                file,
            ),
        });
    };

    // ==============================
    // 로고 삭제
    // ==============================

    const removeLogo = () => {
        if (!logo) return;

        URL.revokeObjectURL(
            logo.url,
        );

        setLogo(null);

        if (logoInput.current) {
            logoInput.current.value =
                "";
        }
    };

    // ==============================
    // 장표 선택
    // ==============================

    const handleBanner = (
        files: FileList | null,
    ) => {
        if (!files) return;

        const remainingCount =
            10 - banners.length;

        if (
            remainingCount <= 0
        ) {
            alert(
                "프로젝트 장표는 최대 10개까지 등록할 수 있습니다.",
            );

            return;
        }

        const selectedFiles =
            Array.from(files).slice(
                0,
                remainingCount,
            );

        if (
            files.length >
            remainingCount
        ) {
            alert(
                "프로젝트 장표는 최대 10개까지 등록할 수 있습니다.",
            );
        }

        const newImages =
            selectedFiles
                .filter((file) => {
                    if (
                        file.size >
                        10 * 1024 * 1024
                    ) {
                        alert(
                            `${file.name}은 10MB를 초과합니다.`,
                        );

                        return false;
                    }

                    return true;
                })
                .map((file) => ({
                    file,
                    url: URL.createObjectURL(
                        file,
                    ),
                }));

        setBanners((prev) => [
            ...prev,
            ...newImages,
        ]);

        if (
            bannerInput.current
        ) {
            bannerInput.current.value =
                "";
        }
    };

    // ==============================
    // 장표 삭제
    // ==============================

    const removeBanner = (
        index: number,
    ) => {
        setBanners((prev) => {
            const target =
                prev[index];

            if (target) {
                URL.revokeObjectURL(
                    target.url,
                );
            }

            return prev.filter(
                (
                    _,
                    bannerIndex,
                ) =>
                    bannerIndex !== index,
            );
        });
    };

    // ==============================
    // 기술 스택 선택
    // ==============================

    const toggleStack = (id: number) => {
        setSelectedStackIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    // ==============================
    // 팀원 → API 형식
    // ==============================

    const createMembersPayload =
        (): ProjectMemberRequest[] => {
            const result: ProjectMemberRequest[] =
                [];

            members.planning.forEach(
                (name) => {
                    const trimmedName =
                        name.trim();

                    if (trimmedName) {
                        result.push({
                            name: trimmedName,
                            part: "PM",
                        });
                    }
                },
            );

            members.frontend.forEach(
                (name) => {
                    const trimmedName =
                        name.trim();

                    if (trimmedName) {
                        result.push({
                            name: trimmedName,
                            part: "FRONTEND",
                        });
                    }
                },
            );

            members.backend.forEach(
                (name) => {
                    const trimmedName =
                        name.trim();

                    if (trimmedName) {
                        result.push({
                            name: trimmedName,
                            part: "BACKEND",
                        });
                    }
                },
            );

            return result;
        };

    // ==============================
    // validation
    // ==============================

    const validateForm = () => {
        if (
            !projectName.trim()
        ) {
            alert(
                "프로젝트 명을 입력해주세요.",
            );

            return false;
        }

        if (!slogan.trim()) {
            alert(
                "프로젝트 슬로건을 입력해주세요.",
            );

            return false;
        }

        if (
            !description.trim()
        ) {
            alert(
                "프로젝트 설명을 입력해주세요.",
            );

            return false;
        }

        if (!eventType) {
            alert(
                "해커톤을 선택해주세요.",
            );

            return false;
        }

        if (
            !startDate ||
            !endDate
        ) {
            alert(
                "프로젝트 기간을 입력해주세요.",
            );

            return false;
        }

        if (
            endDate <
            startDate
        ) {
            alert(
                "종료일은 시작일보다 빠를 수 없습니다.",
            );

            return false;
        }

        if (!logo) {
            alert(
                "프로젝트 로고를 등록해주세요.",
            );

            return false;
        }

        if (
            banners.length === 0
        ) {
            alert(
                "프로젝트 장표를 최소 1개 등록해주세요.",
            );

            return false;
        }

        if (
            banners.length > 10
        ) {
            alert(
                "프로젝트 장표는 최대 10개까지 등록할 수 있습니다.",
            );

            return false;
        }

        if (
            createMembersPayload()
                .length === 0
        ) {
            alert(
                "프로젝트 팀원을 최소 1명 입력해주세요.",
            );

            return false;
        }

        return true;
    };

    // ==============================
    // 프로젝트 등록
    // ==============================

    const handleSubmit = async () => {
        if (submitting) return;

        if (!validateForm()) {
            return;
        }

        if (!logo) {
            alert("프로젝트 로고를 등록해주세요.");
            return;
        }

        if (!eventType) {
            alert("해커톤을 선택해주세요.");
            return;
        }

        try {
            setSubmitting(true);

            // 1. 로고 S3 업로드
            const logoUrl = await uploadProjectImage(
                logo.file,
                "LOGO",
            );

            // 2. 장표 S3 다건 업로드
            const slideUrls = await uploadProjectImages(
                banners.map((banner) => banner.file),
                "SLIDE",
            );

            // 3. 프로젝트 등록
            const requestData: ProjectRequest = {
                term: generation,
                hackathon: eventType,
                title: projectName.trim(),
                summary: slogan.trim(),
                description: description.trim(),
                startMonth: startDate,
                endMonth: endDate,
                logoUrl,
                slideUrls,
                members: createMembersPayload(),
                techStackIds: selectedStackIds,
            };

            const result = await createProject(requestData);

            alert("프로젝트가 등록되었습니다.");

            navigate(`/ProjectDetail/${result.projectId}`);
        } catch (error) {
            console.error("프로젝트 등록 실패:", error);

            if (error instanceof ApiError) {
                if (error.status === 401) {
                    alert("로그인이 필요합니다.");
                    return;
                }

                if (error.status === 403) {
                    alert("프로젝트를 등록할 권한이 없습니다.");
                    return;
                }

                if (error.status === 404) {
                    alert("존재하지 않는 데이터가 포함되어 있습니다.");
                    return;
                }

                const body = error.body as {
                    result?: Record<string, string>;
                };

                const validation = body?.result;

                if (validation) {
                    const firstMessage = Object.values(validation)[0];

                    if (firstMessage) {
                        alert(firstMessage);
                        return;
                    }
                }

                alert(error.message);
                return;
            }

            alert("프로젝트 등록 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen w-full bg-white">
            <div className="mx-auto w-full px-[24px] pb-[24px] pt-[26px] md:px-12 md:py-8">
                {/* 헤더 */}
                <div className="pm_header mb-[30px] md:mb-[54px]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-[40px] hidden h-6 w-6 items-center justify-center md:flex"
                    >
                        <img
                            src={backbtn}
                            alt="뒤로가기"
                            className="backbtn h-[16px] w-[8px]"
                        />
                    </button>

                    <h1 className="text-[20px] font-semibold text-[#121212] md:text-[32px]">
                        프로젝트 등록
                    </h1>
                </div>

                <div className="pm flex flex-col gap-[32px] md:gap-[45px]">
                    {/* =========================
                        STEP 1 - 기본 정보
                    ========================== */}
                    <div
                        className={`${mobileStep === 1 ? "contents" : "hidden"} md:contents`}
                    >
                        {/* 기수 선택 */}
                        <div>
                            <h2 className="mb-[16px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                기수 선택
                            </h2>

                            <div className="th flex gap-[10px] md:gap-[15px]">
                                {generations.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setGeneration(item)}
                                        className={`num h-[42px] min-w-[60px] rounded-[8px] border px-[14px] text-[16px] font-semibold transition-colors md:h-[79px] md:w-[118px] md:rounded-[15px] md:px-0 md:text-[24px] ${generation === item
                                            ? "border-[#8557FF] bg-[#8557FF] text-white"
                                            : "border-[#D0D6DD] bg-white text-[#121212]"
                                            }`}
                                    >
                                        {item}기
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 프로젝트 명 */}
                        <div className="pm_name">
                            <h2 className="mt-[15px] mb-[14px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                프로젝트 명
                            </h2>

                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="프로젝트 명을 입력해주세요."
                                className="h-[57px] w-full rounded-[10px] border border-[#8158F6] px-[16px] text-[14px] font-medium text-[#121212] outline-none placeholder:text-[#808386] md:h-[94px] md:rounded-[15px] md:px-[25px] md:text-[20px]"
                            />
                        </div>

                        {/* 프로젝트 슬로건 */}
                        <div className="pm_slogan">
                            <h2 className="mt-[15px] mb-[14px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                프로젝트 슬로건
                            </h2>

                            <input
                                type="text"
                                value={slogan}
                                onChange={(e) => setSlogan(e.target.value)}
                                placeholder="프로젝트의 슬로건 (한 줄 설명)을 입력해주세요."
                                className="h-[57px] w-full rounded-[10px] border border-[#D0D6DD] px-[16px] text-[14px] text-[#121212] outline-none placeholder:text-[#808386] focus:border-[#865BFF] md:h-[94px] md:rounded-[15px] md:px-[25px] md:text-[20px]"
                            />
                        </div>

                        {/* 프로젝트 기간 */}
                        <div>
                            <h2 className="mt-[15px] mb-[14px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                프로젝트 기간
                            </h2>

                            <div className="flex flex-col gap-[10px] md:flex-row md:items-center">
                                {/* 해커톤 */}
                                <div className="relative w-full md:w-[185px]">
                                    <button
                                        type="button"
                                        onClick={() => setEventOpen((prev) => !prev)}
                                        className="flex h-[56px] w-full items-center justify-between rounded-[10px] border border-[#D0D6DD] bg-white px-[16px] text-[14px] font-semibold text-[#121212] md:h-[78px] md:rounded-[15px] md:px-[20px] md:text-[20px]"
                                    >
                                        <span>
                                            {eventType
                                                ? eventOptions.find(
                                                    (option) =>
                                                        option.value === eventType,
                                                )?.label
                                                : "해커톤 입력"}
                                        </span>

                                        <img
                                            src={underbtn}
                                            alt=""
                                            className={`h-[12px] w-[12px] transition-transform md:h-[16px] md:w-[14px] ${eventOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {eventOpen && (
                                        <div className="absolute left-0 top-[62px] z-20 w-full overflow-hidden rounded-[10px] border border-[#D0D6DD] bg-white font-semibold shadow-sm md:top-[90px] md:rounded-[15px]">
                                            {eventOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setEventType(option.value);
                                                        setEventOpen(false);
                                                    }}
                                                    className="block h-[42px] w-full px-[16px] text-left text-[14px] text-[#121212] hover:bg-[#F5F5F5] md:text-[20px]"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex w-full items-center gap-[10px]">
                                    <input
                                        type="month"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="h-[56px] min-w-0 flex-1 rounded-[8px] border border-[#8158F6] px-[12px] text-[11px] text-[#121212] outline-none md:h-[78px] md:w-[303px] md:flex-none md:rounded-[15px] md:px-[20px] md:text-[20px]"
                                    />

                                    <span className="text-[#D0D6DD]">—</span>

                                    <input
                                        type="month"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="h-[56px] min-w-0 flex-1 rounded-[8px] border border-[#D0D6DD] px-[12px] text-[11px] text-[#121212] outline-none focus:border-[#865BFF] md:h-[78px] md:w-[303px] md:flex-none md:rounded-[15px] md:px-[20px] md:text-[20px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 프로젝트 설명 */}
                        <div>
                            <h2 className="mt-[15px] mb-[14px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                프로젝트 설명
                            </h2>

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="프로젝트에 대한 설명을 입력해주세요."
                                className="h-[250px] w-full resize-none rounded-[10px] border border-[#D0D6DD] px-[16px] py-[18px] text-[14px] text-[#121212] outline-none placeholder:text-[#808386] focus:border-[#865BFF] md:h-[434px] md:rounded-[15px] md:px-[25px] md:py-[35px] md:text-[24px]"
                            />
                        </div>

                        {/* 모바일 다음 */}
                        <button
                            type="button"
                            onClick={() => moveMobileStep(2)}
                            className="mt-[2px] h-[58px] w-full rounded-[10px] bg-[#8158F6] text-[16px] font-semibold text-white md:hidden"
                        >
                            다음
                        </button>
                    </div>

                    {/* =========================
                        STEP 2 - 팀원 / 이미지
                    ========================== */}
                    <div
                        className={`${mobileStep === 2 ? "contents" : "hidden"} md:contents`}
                    >
                        {/* 프로젝트 팀원 */}
                        <div>
                            <h2 className="mb-[8px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                프로젝트 팀원
                            </h2>

                            <div className="grid grid-cols-1 gap-[26px] md:grid-cols-3 md:gap-[25px]">
                                <TeamMemberColumn
                                    title="기획/디자인"
                                    members={members.planning}
                                    onChange={(index, value) =>
                                        changeMember("planning", index, value)
                                    }
                                    onAdd={() => addMember("planning")}
                                />

                                <TeamMemberColumn
                                    title="프론트엔드"
                                    members={members.frontend}
                                    onChange={(index, value) =>
                                        changeMember("frontend", index, value)
                                    }
                                    onAdd={() => addMember("frontend")}
                                />

                                <TeamMemberColumn
                                    title="백엔드"
                                    members={members.backend}
                                    onChange={(index, value) =>
                                        changeMember("backend", index, value)
                                    }
                                    onAdd={() => addMember("backend")}
                                />
                            </div>
                        </div>

                        {/* 프로젝트 로고 */}
                        <div className="logo">
                            <h2 className="mt-[15px] mb-[14px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                프로젝트 로고
                            </h2>

                            <input
                                ref={logoInput}
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => handleLogo(e.target.files?.[0])}
                            />

                            <div className="flex h-[142px] w-full items-center justify-center rounded-[8px] border border-dashed border-[#B8B9BD] bg-[#F3F4F6] md:h-[279px] md:rounded-[15px]">
                                {logo ? (
                                    <div className="relative h-full w-full overflow-hidden rounded-[8px] md:rounded-[15px]">
                                        <img
                                            src={logo.url}
                                            alt="프로젝트 로고"
                                            className="h-full w-full object-contain"
                                        />

                                        <button
                                            type="button"
                                            onClick={removeLogo}
                                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#444] text-[16px] text-white md:right-3 md:top-3 md:h-8 md:w-8 md:text-[20px]"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <button
                                            type="button"
                                            onClick={() => logoInput.current?.click()}
                                            className="mb-[10px] flex items-center justify-center gap-[8px] rounded-[10px] bg-white px-[16px] py-[12px] text-[16px] font-medium text-[#121212] shadow-[0_4px_20px_rgba(135,104,244,0.15)] md:mb-[18px] md:rounded-[15px] md:px-[22px] md:py-[16px] md:text-[24px]"
                                        >
                                            <img
                                                src={downloadbtn}
                                                alt=""
                                                className="h-[18px] w-[18px] md:h-[24px] md:w-[24px]"
                                            />
                                            이미지 업로드
                                        </button>

                                        <p className="text-[14px] text-[#808386] md:text-[24px]">
                                            JPG, PNG (최대 10MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 프로젝트 장표 */}
                        <div className="banner">
                            <h2 className="my-[15px] mb-[14px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                프로젝트 장표
                            </h2>

                            <input
                                ref={bannerInput}
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                className="hidden"
                                onChange={(e) => handleBanner(e.target.files)}
                            />

                            <div className="flex h-[142px] w-full items-center justify-center rounded-[8px] border border-dashed border-[#B8B9BD] bg-[#F3F4F6] md:h-[346px] md:rounded-[15px]">
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => bannerInput.current?.click()}
                                        className="mb-[10px] flex items-center justify-center gap-[8px] rounded-[10px] bg-white px-[16px] py-[12px] text-[16px] font-medium text-[#121212] shadow-[0_4px_20px_rgba(135,104,244,0.15)] md:mb-[18px] md:rounded-[15px] md:px-[22px] md:py-[16px] md:text-[24px]"
                                    >
                                        <img
                                            src={downloadbtn}
                                            alt=""
                                            className="h-[18px] w-[18px] md:h-[24px] md:w-[24px]"
                                        />
                                        이미지 업로드
                                    </button>

                                    <p className="text-[14px] text-[#808386] md:text-[24px]">
                                        JPG, PNG (최대 10MB)
                                    </p>

                                </div>
                            </div>

                            {banners.length > 0 && (
                                <div className="mt-[14px] flex gap-[10px] overflow-x-auto pb-2 md:mt-[25px] md:gap-[16px]">
                                    {banners.map((image, index) => (
                                        <div
                                            key={`${image.file.name}-${index}`}
                                            className="relative h-[100px] min-w-[100px] overflow-hidden rounded-[6px] bg-[#ECECEF] md:h-[180px] md:min-w-[180px] md:rounded-[15px]"
                                        >
                                            <img
                                                src={image.url}
                                                alt={`장표 ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeBanner(index)}
                                                className="absolute right-[5px] top-[5px] flex h-[18px] w-[18px] items-center justify-center md:right-[8px] md:top-[8px] md:h-[24px] md:w-[24px]"
                                            >
                                                <img
                                                    src={deletebtn}
                                                    alt="이미지 삭제"
                                                    className="h-full w-full"
                                                />
                                            </button>
                                        </div>
                                    ))}

                                    {banners.length < 10 && (
                                        <button
                                            type="button"
                                            onClick={() => bannerInput.current?.click()}
                                            className="h-[100px] min-w-[100px] rounded-[10px] bg-[#F3F4F6] text-[24px] text-[#808386] md:hidden"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 모바일 이전 / 다음 */}
                        <div className="grid grid-cols-[1fr_2fr] gap-[12px] md:hidden">
                            <button
                                type="button"
                                onClick={() => moveMobileStep(1)}
                                className="h-[70px] rounded-[10px] border border-[#D0D6DD] bg-white text-[20px] font-semibold text-[#121212]"
                            >
                                이전
                            </button>

                            <button
                                type="button"
                                onClick={() => moveMobileStep(3)}
                                className="h-[70px] rounded-[10px] bg-[#8158F6] text-[20px] font-semibold text-white"
                            >
                                다음
                            </button>
                        </div>
                    </div>

                    {/* =========================
                        STEP 3 - 기술 스택
                    ========================== */}
                    <div
                        className={`${mobileStep === 3 ? "contents" : "hidden"} md:contents`}
                    >
                        <div className="stack">
                            <h2 className="mb-[28px] text-[18px] font-semibold text-[#121212] md:mb-[30px] md:text-[28px]">
                                기술 스택
                            </h2>

                            <div className="flex flex-col gap-[22px] md:gap-[26px]">
                                {[
                                    ["기획", "PLANNING"],
                                    ["디자인", "DESIGN"],
                                    ["프론트엔드", "FRONTEND"],
                                    ["백엔드", "BACKEND"],
                                    ["AI", "AI"],
                                ].map(([label, category]) => {
                                    const stacks = techStacks.filter(
                                        (stack) => stack.category === category,
                                    );

                                    return (
                                        <div
                                            key={category}
                                            className="block md:grid md:grid-cols-[90px_1fr] md:items-start md:gap-x-[50px]"
                                        >
                                            <p className="mb-[9px] text-[16px] font-medium text-[#808386] md:mb-0 md:pt-[7px] md:text-[20px]">
                                                {label}
                                            </p>

                                            <div className="flex flex-wrap gap-[11px] md:gap-[8px]">
                                                {stacks.map((stack) => {
                                                    const selected =
                                                        selectedStackIds.includes(stack.id);

                                                    return (
                                                        <button
                                                            key={stack.id}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleStack(stack.id)
                                                            }
                                                            className={`rounded-[5px] border px-[10px] py-[7px] text-[14px] font-medium transition-colors md:rounded-[5px] md:px-[10px] md:py-[6px] md:text-[20px] ${selected
                                                                ? "border-[#A789FF] bg-[#F2EDFF] text-[#7950F2]"
                                                                : "border-[#DBDEE2] bg-[#FAFAFA] text-[#121212]"
                                                                }`}
                                                        >
                                                            {stack.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 모바일 등록하기 */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="mt-[6px] h-[70px] w-full rounded-[10px] bg-[#8158F6] text-[20px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
                        >
                            {submitting ? "등록 중..." : "등록하기"}
                        </button>
                    </div>

                    {/* 데스크톱 등록 버튼 */}
                    <div className="hidden justify-end pb-[30px] pt-[10px] md:flex">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="h-[79px] rounded-[15px] bg-[#8158F6] px-[35px] text-[24px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "등록 중..." : "등록하기"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ==============================
// 팀원 입력 Column
// ==============================

interface TeamMemberColumnProps {
    title: string;
    members: string[];
    onChange: (
        index: number,
        value: string,
    ) => void;
    onAdd: () => void;
}

function TeamMemberColumn({
    title,
    members,
    onChange,
    onAdd,
}: TeamMemberColumnProps) {
    return (
        <div>
            <p className="mb-[12px] text-[16px] font-medium text-[#808386] md:mb-[24px] md:text-[20px] md:text-[#121212]">
                {title}
            </p>

            <div className="flex flex-col gap-[10px]">
                {members.map((member, index) => (
                    <input
                        key={index}
                        type="text"
                        value={member}
                        onChange={(e) =>
                            onChange(
                                index,
                                e.target.value,
                            )
                        }
                        placeholder="이름을 입력해주세요"
                        className="
                h-[56px]
                w-full
                rounded-[10px]
                border
                border-[#D0D6DD]
                px-[16px]
                text-[14px]
                text-[#121212]
                outline-none
                placeholder:text-[#808386]
                transition-[border-color,box-shadow]
                duration-200

                focus:border-[#865BFF]
                focus:shadow-[0_0_15px_rgba(135,104,244,0.1)]

                md:mb-[7px]
                md:h-[92px]
                md:rounded-[15px]
                md:px-[20px]
                md:text-[20px]
            "
                    />
                ))}

                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-[2px] flex items-center justify-center gap-[7px] text-[16px] font-medium text-[#6C6E72] md:justify-start md:text-[20px]"
                >
                    <img
                        src={plus}
                        alt=""
                        className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]"
                    />

                    새로운 멤버 추가하기
                </button>
            </div>
        </div>
    );
}
