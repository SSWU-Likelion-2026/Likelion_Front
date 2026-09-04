import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import backbtn from "../../img/project/backbtn.svg";
import underbtn from "../../img/project/underbtn.svg";
import downloadbtn from "../../img/project/download.svg";
import deletebtn from "../../img/project/deletebtn.svg";

import {
    getProjectDetail,
    updateProject,
} from "../../api/project/project";

import { ApiError } from "../../api/instance";

import type {
    ProjectMemberRequest,
    ProjectRequest,
} from "../../types/project/project";

// ======================================================
// 기수
// ======================================================

const generations = [14, 13, 12];

// ======================================================
// 해커톤
// ======================================================
//
// 백엔드 enum은 최종 확인 필요.
// 현재 명세에서 IDEATHON / HERETHON 형태를 기준으로 작성.
//

const eventOptions = [
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

// ======================================================
// 기술 스택
// ======================================================

const stackList = {
    기획: [
        "Notion",
        "Google Workspace",
        "Miro",
        "Ms Office",
        "Confluence",
        "Figma",
        "Figjam",
        "Asana",
        "Slack",
        "Discord",
        "Jira",
        "Linear",
        "Trello",
        "GitHub",
    ],

    디자인: [
        "Figma",
        "Sketch",
        "Penpot",
        "Framer",
        "ProtoPie",
        "Adobe Illustrator",
        "Adobe Photoshop",
        "Canva",
        "Spline",
        "Blender",
        "After Effects",
    ],

    프론트엔드: [
        "Notion",
        "Google Workspace",
        "Miro",
        "Ms Office",
        "Confluence",
        "Figma",
        "Figjam",
        "Asana",
        "Slack",
        "Discord",
        "Jira",
        "Linear",
        "Trello",
        "GitHub",
    ],

    백엔드: [
        "Notion",
        "Google Workspace",
        "Miro",
        "Ms Office",
        "Confluence",
        "Figma",
        "Figjam",
        "Asana",
        "Slack",
        "Discord",
        "Jira",
        "Linear",
        "Trello",
        "GitHub",
    ],

    AI: [
        "Chat GPT",
        "Claude",
        "Gemini",
        "Grok",
        "Perplexity",
        "NotebookLM",
        "HuggingFace",
        "DALL",
        "Midjourney",
        "Stable Diffusion",
        "Runway",
        "Kling",
        "Whisper",
        "ElevenLabs",
        "Cursor",
        "Bolt",
        "Lovable",
        "v0",
        "n8n",
        "Zapier",
        "Make",
    ],
};

// ======================================================
// 타입
// ======================================================

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
    file?: File;
    url: string;
};

// ======================================================
// Component
// ======================================================

export default function ProjectEdit() {
    const navigate = useNavigate();

    const { projectId } = useParams();

    const numericProjectId = Number(projectId);

    const logoInput =
        useRef<HTMLInputElement>(null);

    const bannerInput =
        useRef<HTMLInputElement>(null);

    // ======================================================
    // 상태
    // ======================================================

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [generation, setGeneration] =
        useState(14);

    const [projectName, setProjectName] =
        useState("");

    const [slogan, setSlogan] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [eventType, setEventType] =
        useState("");

    const [eventOpen, setEventOpen] =
        useState(false);

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [logo, setLogo] =
        useState<ImageFile | null>(null);

    const [banners, setBanners] =
        useState<ImageFile[]>([]);

    const [
        selectedStacks,
        setSelectedStacks,
    ] = useState<string[]>([]);

    const [members, setMembers] =
        useState<TeamMembers>({
            planning: [""],
            frontend: [""],
            backend: [""],
        });

    // ======================================================
    // 프로젝트 상세 조회 → 수정 폼 초기값
    // ======================================================

    useEffect(() => {
        if (
            !projectId ||
            Number.isNaN(numericProjectId)
        ) {
            alert(
                "잘못된 프로젝트 주소입니다.",
            );

            navigate("/Project");

            return;
        }

        const fetchProject =
            async () => {
                try {
                    setLoading(true);

                    const project =
                        await getProjectDetail(
                            numericProjectId,
                        );

                    setGeneration(
                        project.term,
                    );

                    setProjectName(
                        project.title,
                    );

                    setSlogan(
                        project.summary,
                    );

                    setDescription(
                        project.description,
                    );

                    setEventType(
                        project.hackathon,
                    );

                    setStartDate(
                        project.startMonth.slice(
                            0,
                            7,
                        ),
                    );

                    setEndDate(
                        project.endMonth.slice(
                            0,
                            7,
                        ),
                    );

                    setLogo({
                        url:
                            project.logoUrl,
                    });

                    setBanners(
                        [...project.slides]
                            .sort(
                                (
                                    a,
                                    b,
                                ) =>
                                    a.sequenceNum -
                                    b.sequenceNum,
                            )
                            .map(
                                (
                                    slide,
                                ) => ({
                                    url:
                                        slide.imageUrl,
                                }),
                            ),
                    );

                    setSelectedStacks(
                        project.techStacks.map(
                            (
                                stack,
                            ) =>
                                stack.name,
                        ),
                    );

                    const planning =
                        project.members
                            .filter(
                                (
                                    member,
                                ) =>
                                    [
                                        "PM",
                                        "PLANNING",
                                        "DESIGN",
                                    ].includes(
                                        member.part,
                                    ),
                            )
                            .map(
                                (
                                    member,
                                ) =>
                                    member.name,
                            );

                    const frontend =
                        project.members
                            .filter(
                                (
                                    member,
                                ) =>
                                    member.part ===
                                    "FRONTEND",
                            )
                            .map(
                                (
                                    member,
                                ) =>
                                    member.name,
                            );

                    const backend =
                        project.members
                            .filter(
                                (
                                    member,
                                ) =>
                                    member.part ===
                                    "BACKEND",
                            )
                            .map(
                                (
                                    member,
                                ) =>
                                    member.name,
                            );

                    setMembers({
                        planning:
                            planning.length >
                                0
                                ? planning
                                : [""],

                        frontend:
                            frontend.length >
                                0
                                ? frontend
                                : [""],

                        backend:
                            backend.length >
                                0
                                ? backend
                                : [""],
                    });
                } catch (error) {
                    console.error(
                        "프로젝트 상세 조회 실패:",
                        error,
                    );

                    alert(
                        "프로젝트 정보를 불러오지 못했습니다.",
                    );

                    navigate(
                        "/Project",
                    );
                } finally {
                    setLoading(false);
                }
            };

        fetchProject();
    }, [
        navigate,
        numericProjectId,
        projectId,
    ]);

    // ======================================================
    // 팀원 추가
    // ======================================================

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

    // ======================================================
    // 팀원 변경
    // ======================================================

    const changeMember = (
        category: TeamCategory,
        index: number,
        value: string,
    ) => {
        setMembers((prev) => ({
            ...prev,

            [category]:
                prev[category].map(
                    (
                        member,
                        memberIndex,
                    ) =>
                        memberIndex ===
                            index
                            ? value
                            : member,
                ),
        }));
    };

    // ======================================================
    // 팀원 → API payload
    // ======================================================

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
                            name:
                                trimmedName,
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
                            name:
                                trimmedName,

                            part:
                                "FRONTEND",
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
                            name:
                                trimmedName,

                            part:
                                "BACKEND",
                        });
                    }
                },
            );

            return result;
        };

    // ======================================================
    // 로고
    // ======================================================

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

        if (
            logo?.file
        ) {
            URL.revokeObjectURL(
                logo.url,
            );
        }

        setLogo({
            file,

            url:
                URL.createObjectURL(
                    file,
                ),
        });
    };

    const removeLogo = () => {
        if (!logo) return;

        if (
            logo.file
        ) {
            URL.revokeObjectURL(
                logo.url,
            );
        }

        setLogo(null);

        if (
            logoInput.current
        ) {
            logoInput.current.value =
                "";
        }
    };

    // ======================================================
    // 장표
    // ======================================================

    const handleBanner = (
        files: FileList | null,
    ) => {
        if (!files) return;

        const remainingCount =
            10 -
            banners.length;

        if (
            remainingCount <= 0
        ) {
            alert(
                "프로젝트 장표는 최대 10개까지 등록할 수 있습니다.",
            );

            return;
        }

        const selectedFiles =
            Array.from(
                files,
            ).slice(
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
                .filter(
                    (
                        file,
                    ) => {
                        if (
                            file.size >
                            10 *
                            1024 *
                            1024
                        ) {
                            alert(
                                `${file.name}은 10MB를 초과합니다.`,
                            );

                            return false;
                        }

                        return true;
                    },
                )
                .map(
                    (
                        file,
                    ) => ({
                        file,

                        url:
                            URL.createObjectURL(
                                file,
                            ),
                    }),
                );

        setBanners(
            (prev) => [
                ...prev,
                ...newImages,
            ],
        );

        if (
            bannerInput.current
        ) {
            bannerInput.current.value =
                "";
        }
    };

    const removeBanner = (
        index: number,
    ) => {
        setBanners((prev) => {
            const target =
                prev[index];

            if (
                target?.file
            ) {
                URL.revokeObjectURL(
                    target.url,
                );
            }

            return prev.filter(
                (
                    _,
                    bannerIndex,
                ) =>
                    bannerIndex !==
                    index,
            );
        });
    };

    // ======================================================
    // 기술스택 선택
    // ======================================================

    const toggleStack = (
        stack: string,
    ) => {
        setSelectedStacks(
            (prev) =>
                prev.includes(
                    stack,
                )
                    ? prev.filter(
                        (
                            item,
                        ) =>
                            item !==
                            stack,
                    )
                    : [
                        ...prev,
                        stack,
                    ],
        );
    };

    // ======================================================
    // Validation
    // ======================================================

    const validateForm = () => {
        if (
            !projectName.trim()
        ) {
            alert(
                "프로젝트 명을 입력해주세요.",
            );

            return false;
        }

        if (
            !slogan.trim()
        ) {
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
            banners.length ===
            0
        ) {
            alert(
                "프로젝트 장표를 최소 1개 등록해주세요.",
            );

            return false;
        }

        if (
            banners.length >
            10
        ) {
            alert(
                "프로젝트 장표는 최대 10개까지 등록할 수 있습니다.",
            );

            return false;
        }

        return true;
    };

    // ======================================================
    // PATCH 프로젝트 수정
    // ======================================================

    const handleSubmit = async () => {
        if (submitting) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (
            !projectId ||
            Number.isNaN(numericProjectId)
        ) {
            alert("잘못된 프로젝트입니다.");
            return;
        }

        /*
         * 중요
         *
         * 기존 서버 이미지:
         * https://....
         *
         * 새로 선택한 이미지:
         * blob:http://....
         *
         * 새 이미지는 S3 업로드 API가 있어야
         * 실제 https URL로 변환할 수 있다.
         */

        const hasNewLogo = Boolean(
            logo?.file,
        );

        const hasNewBanner = banners.some(
            (banner) =>
                Boolean(banner.file),
        );

        if (
            hasNewLogo ||
            hasNewBanner
        ) {
            alert(
                "새 이미지가 선택되었습니다. 이미지 업로드 API 연결 후 실제 URL로 변환해야 수정할 수 있습니다.",
            );

            return;
        }

        /*
         * 기술스택 문제
         *
         * 현재 UI는 문자열:
         * ["Figma", "Notion"]
         *
         * PATCH API는 ID:
         * [1, 5]
         *
         * 형태를 요구한다.
         */

        if (
            selectedStacks.length > 0
        ) {
            alert(
                "기술스택 ID 조회 API가 필요합니다. 현재 선택된 기술스택 이름을 techStackIds로 변환할 수 없습니다.",
            );

            return;
        }

        const requestData: ProjectRequest = {
            term: generation,

            hackathon: eventType,

            title:
                projectName.trim(),

            summary:
                slogan.trim(),

            description:
                description.trim(),

            startMonth:
                startDate,

            endMonth:
                endDate,

            logoUrl:
                logo?.url ?? "",

            slideUrls:
                banners.map(
                    (banner) =>
                        banner.url,
                ),

            members:
                createMembersPayload(),

            techStackIds: [],
        };

        try {
            setSubmitting(true);

            await updateProject(
                numericProjectId,
                requestData,
            );

            alert(
                "프로젝트가 수정되었습니다.",
            );

            navigate(
                `/ProjectDetail/${numericProjectId}`,
            );
        } catch (error) {
            console.error(
                "프로젝트 수정 실패:",
                error,
            );

            if (
                error instanceof ApiError
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
                        "해당 프로젝트를 수정할 권한이 없습니다.",
                    );

                    return;
                }

                if (
                    error.status === 404
                ) {
                    alert(
                        "존재하지 않거나 이미 삭제된 프로젝트입니다.",
                    );

                    navigate(
                        "/Project",
                    );

                    return;
                }

                const body =
                    error.body as {
                        result?: Record<
                            string,
                            string
                        >;
                    };

                const validation =
                    body?.result;

                if (validation) {
                    const firstMessage =
                        Object.values(
                            validation,
                        )[0];

                    if (
                        firstMessage
                    ) {
                        alert(
                            firstMessage,
                        );

                        return;
                    }
                }

                alert(
                    error.message,
                );

                return;
            }

            alert(
                "프로젝트 수정 중 오류가 발생했습니다.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ======================================================
    // Loading
    // ======================================================

    if (loading) {
        return (
            <section className="flex min-h-screen w-full items-center justify-center bg-white">
                <p className="text-[22px] text-[#808386]">
                    프로젝트 정보를 불러오는 중입니다.
                </p>
            </section>
        );
    }

    // ======================================================
    // UI
    // ======================================================

    return (
        <section className="min-h-screen w-full bg-white">
            <div className="mx-auto w-full px-12 py-8">
                {/* 헤더 */}
                <div className="pm_header mb-[54px]">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="mb-[40px] flex h-6 w-6 items-center justify-center"
                    >
                        <img
                            src={backbtn}
                            alt="뒤로가기"
                            className="backbtn h-[16px] w-[8px]"
                        />
                    </button>

                    <h1 className="text-[32px] font-semibold text-[#121212]">
                        프로젝트 수정
                    </h1>
                </div>

                <div className="pm flex flex-col gap-[45px]">
                    {/* 기수 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            기수 선택
                        </h2>

                        <div className="th flex gap-[15px]">
                            {generations.map(
                                (
                                    item,
                                ) => (
                                    <button
                                        key={
                                            item
                                        }
                                        type="button"
                                        onClick={() =>
                                            setGeneration(
                                                item,
                                            )
                                        }
                                        className={`num h-[79px] w-[118px] rounded-[15px] border text-[24px] font-semibold transition-colors ${generation ===
                                                item
                                                ? "border-[#8557FF] bg-[#8557FF] text-white"
                                                : "border-[#D0D6DD] bg-white text-[#121212]"
                                            }`}
                                    >
                                        {item}기
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* 프로젝트 명 */}
                    <div className="pm_name">
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 명
                        </h2>

                        <input
                            type="text"
                            value={
                                projectName
                            }
                            onChange={(e) =>
                                setProjectName(
                                    e.target.value,
                                )
                            }
                            placeholder="프로젝트 명을 입력해주세요."
                            className="h-[94px] w-full rounded-[15px] border border-[#8158F6] px-[25px] text-[20px] font-medium text-[#121212] outline-none"
                        />
                    </div>

                    {/* 슬로건 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 슬로건
                        </h2>

                        <input
                            type="text"
                            value={
                                slogan
                            }
                            onChange={(e) =>
                                setSlogan(
                                    e.target.value,
                                )
                            }
                            placeholder="프로젝트의 슬로건 (한 줄 설명)을 입력해주세요."
                            className="h-[94px] w-full rounded-[15px] border border-[#D0D6DD] px-[25px] text-[20px] text-[#121212] outline-none placeholder:text-[#808386] focus:border-[#865BFF]"
                        />
                    </div>

                    {/* 프로젝트 기간 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 기간
                        </h2>

                        <div className="flex items-center gap-[10px]">
                            {/* 해커톤 */}
                            <div className="relative w-[185px]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEventOpen(
                                            (
                                                prev,
                                            ) =>
                                                !prev,
                                        )
                                    }
                                    className="flex h-[78px] w-full items-center justify-between rounded-[15px] border border-[#D0D6DD] bg-white px-[20px] text-[20px] font-semibold text-[#121212]"
                                >
                                    <span>
                                        {eventType
                                            ? eventOptions.find(
                                                (
                                                    option,
                                                ) =>
                                                    option.value ===
                                                    eventType,
                                            )
                                                ?.label ??
                                            eventType
                                            : "해커톤 입력"}
                                    </span>

                                    <img
                                        src={
                                            underbtn
                                        }
                                        alt=""
                                        className={`h-[16px] w-[14px] transition-transform ${eventOpen
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                    />
                                </button>

                                {eventOpen && (
                                    <div className="absolute left-0 top-[90px] z-20 w-full overflow-hidden rounded-[15px] border border-[#D0D6DD] bg-white font-semibold shadow-sm">
                                        {eventOptions.map(
                                            (
                                                option,
                                            ) => (
                                                <button
                                                    key={
                                                        option.value
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        setEventType(
                                                            option.value,
                                                        );

                                                        setEventOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="block h-[42px] w-full px-[16px] text-left text-[20px] text-[#121212] hover:bg-[#F5F5F5]"
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </button>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            <input
                                type="month"
                                value={
                                    startDate
                                }
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value,
                                    )
                                }
                                className="h-[78px] w-[303px] rounded-[15px] border border-[#8158F6] px-[20px] text-[20px] text-[#121212] outline-none"
                            />

                            <span className="text-[#D0D6DD]">
                                —
                            </span>

                            <input
                                type="month"
                                value={
                                    endDate
                                }
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value,
                                    )
                                }
                                className="h-[78px] w-[303px] rounded-[15px] border border-[#D0D6DD] px-[20px] text-[20px] text-[#121212] outline-none focus:border-[#865BFF]"
                            />
                        </div>
                    </div>

                    {/* 설명 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 설명
                        </h2>

                        <textarea
                            value={
                                description
                            }
                            onChange={(e) =>
                                setDescription(
                                    e.target.value,
                                )
                            }
                            placeholder="프로젝트에 대한 설명을 입력해주세요."
                            className="h-[434px] w-full resize-none rounded-[15px] border border-[#D0D6DD] px-[25px] py-[35px] text-[24px] text-[#121212] outline-none placeholder:text-[#808386] focus:border-[#865BFF]"
                        />
                    </div>

                    {/* 팀원 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 팀원
                        </h2>

                        <div className="grid grid-cols-3 gap-[25px]">
                            <TeamMemberColumn
                                title="기획/디자인"
                                members={
                                    members.planning
                                }
                                onChange={(
                                    index,
                                    value,
                                ) =>
                                    changeMember(
                                        "planning",
                                        index,
                                        value,
                                    )
                                }
                                onAdd={() =>
                                    addMember(
                                        "planning",
                                    )
                                }
                            />

                            <TeamMemberColumn
                                title="프론트엔드"
                                members={
                                    members.frontend
                                }
                                onChange={(
                                    index,
                                    value,
                                ) =>
                                    changeMember(
                                        "frontend",
                                        index,
                                        value,
                                    )
                                }
                                onAdd={() =>
                                    addMember(
                                        "frontend",
                                    )
                                }
                            />

                            <TeamMemberColumn
                                title="백엔드"
                                members={
                                    members.backend
                                }
                                onChange={(
                                    index,
                                    value,
                                ) =>
                                    changeMember(
                                        "backend",
                                        index,
                                        value,
                                    )
                                }
                                onAdd={() =>
                                    addMember(
                                        "backend",
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* 로고 */}
                    <div className="logo">
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 로고
                        </h2>

                        <input
                            ref={
                                logoInput
                            }
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) =>
                                handleLogo(
                                    e.target.files?.[0],
                                )
                            }
                        />

                        <div className="flex h-[279px] w-full items-center justify-center rounded-[15px] border border-dashed border-[#B8B9BD] bg-[#F3F4F6]">
                            {logo ? (
                                <div className="relative h-full w-full overflow-hidden rounded-[15px]">
                                    <img
                                        src={
                                            logo.url
                                        }
                                        alt="프로젝트 로고"
                                        className="h-full w-full object-contain"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeLogo
                                        }
                                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#444] text-[20px] text-white"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            logoInput.current?.click()
                                        }
                                        className="mb-[18px] flex items-center justify-center gap-[10px] rounded-[15px] bg-white px-[22px] py-[16px] text-[24px] font-medium text-[#121212] shadow-[0_4px_20px_rgba(135,104,244,0.15)]"
                                    >
                                        <img
                                            src={
                                                downloadbtn
                                            }
                                            alt=""
                                            className="h-[24px] w-[24px]"
                                        />

                                        이미지 업로드
                                    </button>

                                    <p className="text-[24px] text-[#808386]">
                                        JPG, PNG
                                        (최대 10MB)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 장표 */}
                    <div className="banner">
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 장표
                        </h2>

                        <input
                            ref={
                                bannerInput
                            }
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                                handleBanner(
                                    e.target.files,
                                )
                            }
                        />

                        <div className="flex h-[346px] w-full items-center justify-center rounded-[15px] border border-dashed border-[#B8B9BD] bg-[#F3F4F6]">
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() =>
                                        bannerInput.current?.click()
                                    }
                                    className="mb-[18px] flex items-center justify-center gap-[10px] rounded-[15px] bg-white px-[22px] py-[16px] text-[24px] font-medium text-[#121212] shadow-[0_4px_20px_rgba(135,104,244,0.15)]"
                                >
                                    <img
                                        src={
                                            downloadbtn
                                        }
                                        alt=""
                                        className="h-[24px] w-[24px]"
                                    />

                                    이미지 업로드
                                </button>

                                <p className="text-[24px] text-[#808386]">
                                    JPG, PNG
                                    (최대 10MB)
                                </p>
                            </div>
                        </div>

                        {banners.length >
                            0 && (
                                <div className="mt-[25px] flex gap-[16px] overflow-x-auto pb-2">
                                    {banners.map(
                                        (
                                            image,
                                            index,
                                        ) => (
                                            <div
                                                key={`${image.url}-${index}`}
                                                className="relative h-[180px] min-w-[180px] overflow-hidden rounded-[15px] bg-[#ECECEF]"
                                            >
                                                <img
                                                    src={
                                                        image.url
                                                    }
                                                    alt={`장표 ${index +
                                                        1
                                                        }`}
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeBanner(
                                                            index,
                                                        )
                                                    }
                                                    className="absolute right-[8px] top-[8px] flex h-[24px] w-[24px] items-center justify-center"
                                                >
                                                    <img
                                                        src={
                                                            deletebtn
                                                        }
                                                        alt="이미지 삭제"
                                                        className="h-full w-full"
                                                    />
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                    </div>

                    {/* 기술 스택 */}
                    <div className="stack">
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            기술 스택
                        </h2>

                        <div className="flex flex-col gap-[26px]">
                            {Object.entries(
                                stackList,
                            ).map(
                                ([
                                    category,
                                    stacks,
                                ]) => (
                                    <div
                                        key={
                                            category
                                        }
                                        className="grid grid-cols-[90px_1fr] items-start gap-x-[50px]"
                                    >
                                        <p className="pt-[7px] text-[20px] font-medium text-[#808386]">
                                            {
                                                category
                                            }
                                        </p>

                                        <div className="flex flex-wrap gap-[8px]">
                                            {stacks.map(
                                                (
                                                    stack,
                                                ) => {
                                                    const selected =
                                                        selectedStacks.includes(
                                                            stack,
                                                        );

                                                    return (
                                                        <button
                                                            key={`${category}-${stack}`}
                                                            type="button"
                                                            onClick={() =>
                                                                toggleStack(
                                                                    stack,
                                                                )
                                                            }
                                                            className={`rounded-[5px] border px-[10px] py-[6px] text-[20px] font-medium transition-colors ${selected
                                                                    ? "border-[#A789FF] bg-[#F2EDFF] text-[#7950F2]"
                                                                    : "border-[#DBDEE2] bg-[#FAFAFA] text-[#121212]"
                                                                }`}
                                                        >
                                                            {
                                                                stack
                                                            }
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* 수정 */}
                    <div className="flex justify-end pb-[30px] pt-[10px]">
                        <button
                            type="button"
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                submitting
                            }
                            className="h-[79px] rounded-[15px] bg-[#8158F6] px-[35px] text-[24px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "수정 중..."
                                : "수정하기"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ======================================================
// Team Member Column
// ======================================================

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
            <p className="mb-[24px] text-[20px] font-medium text-[#121212]">
                {title}
            </p>

            <div className="flex flex-col gap-[10px]">
                {members.map(
                    (
                        member,
                        index,
                    ) => (
                        <input
                            key={
                                index
                            }
                            type="text"
                            value={
                                member
                            }
                            onChange={(e) =>
                                onChange(
                                    index,
                                    e.target.value,
                                )
                            }
                            placeholder="이름을 입력해주세요"
                            className={`mb-[7px] h-[92px] w-full rounded-[15px] border px-[20px] text-[20px] text-[#121212] outline-none placeholder:text-[#808386] ${index === 0
                                    ? "border-[#865BFF]"
                                    : "border-[#D0D6DD] focus:border-[#865BFF]"
                                }`}
                        />
                    ),
                )}

                <button
                    type="button"
                    onClick={
                        onAdd
                    }
                    className="mt-[2px] flex items-center gap-[7px] text-[20px] font-medium text-[#6C6E72]"
                >
                    <span className="text-[22px] leading-none">
                        +
                    </span>

                    새로운 멤버 추가하기
                </button>
            </div>
        </div>
    );
};