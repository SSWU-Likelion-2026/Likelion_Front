import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import backbtn from "../../img/project/backbtn.svg";
import underbtn from "../../img/project/underbtn.svg";
import downloadbtn from "../../img/project/download.svg";
import deletebtn from "../../img/project/deletebtn.svg";

const generations = [14, 13, 12];

const eventOptions = ["아이디어톤", "여기톤", "중앙톤"];

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

type TeamCategory = "planning" | "frontend" | "backend";

type TeamMembers = {
    planning: string[];
    frontend: string[];
    backend: string[];
};

type ImageFile = {
    file: File;
    url: string;
};

export default function ProjectMaking() {
    const navigate = useNavigate();

    const logoInput = useRef<HTMLInputElement>(null);
    const bannerInput = useRef<HTMLInputElement>(null);

    const [generation, setGeneration] = useState(14);

    const [projectName, setProjectName] = useState("");
    const [slogan, setSlogan] = useState("");
    const [description, setDescription] = useState("");

    const [eventType, setEventType] = useState("");
    const [eventOpen, setEventOpen] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [logo, setLogo] = useState<ImageFile | null>(null);
    const [banners, setBanners] = useState<ImageFile[]>([]);

    const [selectedStacks, setSelectedStacks] = useState<string[]>([]);

    const [members, setMembers] = useState<TeamMembers>({
        planning: [""],
        frontend: ["", ""],
        backend: ["", ""],
    });

    const addMember = (category: TeamCategory) => {
        setMembers((prev) => ({
            ...prev,
            [category]: [...prev[category], ""],
        }));
    };

    const changeMember = (
        category: TeamCategory,
        index: number,
        value: string,
    ) => {
        setMembers((prev) => ({
            ...prev,
            [category]: prev[category].map((member, memberIndex) =>
                memberIndex === index ? value : member,
            ),
        }));
    };

    const handleLogo = (file?: File) => {
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("이미지는 최대 10MB까지 업로드할 수 있습니다.");
            return;
        }

        if (logo) {
            URL.revokeObjectURL(logo.url);
        }

        setLogo({
            file,
            url: URL.createObjectURL(file),
        });
    };

    const handleBanner = (files: FileList | null) => {
        if (!files) return;

        const newImages = Array.from(files)
            .filter((file) => {
                if (file.size > 10 * 1024 * 1024) {
                    alert(`${file.name}은 10MB를 초과합니다.`);
                    return false;
                }

                return true;
            })
            .map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));

        setBanners((prev) => [...prev, ...newImages]);
    };

    const removeBanner = (index: number) => {
        setBanners((prev) => {
            URL.revokeObjectURL(prev[index].url);

            return prev.filter((_, bannerIndex) => bannerIndex !== index);
        });
    };

    const toggleStack = (stack: string) => {
        setSelectedStacks((prev) =>
            prev.includes(stack)
                ? prev.filter((item) => item !== stack)
                : [...prev, stack],
        );
    };

    const handleSubmit = () => {
        console.log({
            generation,
            projectName,
            slogan,
            description,
            eventType,
            startDate,
            endDate,
            members,
            logo: logo?.file,
            banners: banners.map((image) => image.file),
            selectedStacks,
        });
    };

    return (
        <section className="min-h-screen w-full bg-white">
            <div className="mx-auto w-full px-12 py-8">
                {/* 헤더 */}
                <div className="pm_header mb-[54px]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-[40px] flex h-6 w-6 items-center justify-center"
                    >
                        <img
                            src={backbtn}
                            alt="뒤로가기"
                            className="backbtn h-[16px] w-[8px]"
                        />
                    </button>

                    <h1 className="text-[32px] font-semibold text-[#121212]">
                        프로젝트 등록
                    </h1>
                </div>

                <div className="pm flex flex-col gap-[45px]">
                    {/* 기수 선택 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            기수 선택
                        </h2>

                        <div className="th flex gap-[15px]">
                            {generations.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setGeneration(item)}
                                    className={`num h-[79px] w-[118px] rounded-[15px] border text-[24px] font-semibold transition-colors ${generation === item
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
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 명
                        </h2>

                        <div className="pm_name_input">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="프로젝트 명을 입력해주세요."
                                className="h-[94px] w-full rounded-[15px] border border-[#8158F6] px-[25px] font-medium text-[20px] text-[#121212] outline-none "
                            />
                        </div>
                    </div>

                    {/* 프로젝트 슬로건 */}
                    <div className="pm_slogan">
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 슬로건
                        </h2>

                        <div className="pm_slogan_input">
                            <input
                                type="text"
                                value={slogan}
                                onChange={(e) => setSlogan(e.target.value)}
                                placeholder="프로젝트의 슬로건 (한 줄 설명)을 입력해주세요."
                                className="h-[94px] w-full rounded-[15px] border border-[#D0D6DD] px-[25px] text-[20px] text-[#121212] outline-none placeholder:text-[#808386] focus:border-[#865BFF]"
                            />
                        </div>
                    </div>

                    {/* 프로젝트 기간 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 기간
                        </h2>

                        <div className="flex items-center gap-[10px]">
                            <div className="relative w-[185px]">
                                <button
                                    type="button"
                                    onClick={() => setEventOpen((prev) => !prev)}
                                    className="flex h-[78px] w-full items-center justify-between rounded-[15px] border border-[#D0D6DD] bg-white px-[20px] font-semibold text-[20px] text-[#121212]"
                                >
                                    <span>
                                        {eventType === "" ? "해커톤 입력" : eventType}
                                    </span>

                                    <img
                                        src={underbtn}
                                        alt=""
                                        className={`h-[16px] w-[14px] transition-transform ${eventOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {eventOpen && (
                                    <div className="absolute left-0 top-[90px] z-20 w-full overflow-hidden rounded-[15px] font-semibold border border-[#D0D6DD] bg-white shadow-sm">
                                        {eventOptions.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setEventType(option);
                                                    setEventOpen(false);
                                                }}
                                                className="block h-[42px] w-full px-[16px] text-left text-[20px] text-[#121212] hover:bg-[#F5F5F5]"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <input
                                type="month"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="h-[78px] w-[303px] rounded-[15px] border border-[#8158F6] px-[20px] text-[20px] text-[#121212] outline-none"
                            />

                            <span className="text-[#D0D6DD]">—</span>

                            <input
                                type="month"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="h-[78px] w-[303px] rounded-[15px] border border-[#D0D6DD] px-[20px] text-[20px] text-[#121212] outline-none focus:border-[#865BFF]"
                            />
                        </div>
                    </div>

                    {/* 프로젝트 설명 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 설명
                        </h2>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="프로젝트에 대한 설명을 입력해주세요."
                            className="h-[434px] w-full resize-none rounded-[15px] border border-[#D0D6DD] px-[25px] py-[35px] text-[24px] text-[#121212] outline-none placeholder:text-[#808386] focus:border-[#865BFF]"
                        />
                    </div>

                    {/* 프로젝트 팀원 */}
                    <div>
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 팀원
                        </h2>

                        <div className="grid grid-cols-3 gap-[25px]">
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
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            프로젝트 로고
                        </h2>

                        <input
                            ref={logoInput}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleLogo(e.target.files?.[0])}
                        />

                        <div className="flex h-[279px] w-full items-center justify-center rounded-[15px] border border-dashed border-[#B8B9BD] bg-[#F3F4F6]">
                            {logo ? (
                                <div className="relative h-full w-full overflow-hidden rounded-[15px]">
                                    <img
                                        src={logo.url}
                                        alt="프로젝트 로고"
                                        className="h-full w-full object-contain"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            URL.revokeObjectURL(logo.url);
                                            setLogo(null);
                                        }}
                                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#444] text-[20px] text-white"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => logoInput.current?.click()}
                                        className="mb-[18px] flex items-center justify-center gap-[10px] rounded-[15px] bg-white px-[22px] py-[16px] text-[24px] font-medium text-[#121212] shadow-[0_4px_20px_rgba(135,104,244,0.15)]"
                                    >
                                        <img
                                            src={downloadbtn}
                                            alt=""
                                            className="h-[24px] w-[24px]"
                                        />
                                        이미지 업로드
                                    </button>

                                    <p className="text-[24px] text-[#808386]">
                                        JPG, PNG (최대 10MB)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 프로젝트 장표 */}
                    <div className="banner">
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
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

                        <div className="flex h-[346px] w-full items-center justify-center rounded-[15px] border border-dashed border-[#B8B9BD] bg-[#F3F4F6]">
                            <div className="flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() => bannerInput.current?.click()}
                                    className="mb-[18px] flex items-center justify-center gap-[10px] rounded-[15px] bg-white px-[22px] py-[16px] text-[24px] font-medium text-[#121212] shadow-[0_4px_20px_rgba(135,104,244,0.15)]"
                                >
                                    <img
                                        src={downloadbtn}
                                        alt=""
                                        className="h-[24px] w-[24px]"
                                    />

                                    이미지 업로드
                                </button>

                                <p className="text-[24px] text-[#808386]">
                                    JPG, PNG (최대 10MB)
                                </p>
                            </div>
                        </div>

                        {/* 업로드 이미지 미리보기 */}
                        {banners.length > 0 && (
                            <div className="mt-[25px] flex gap-[16px] overflow-x-auto pb-2">
                                {banners.map((image, index) => (
                                    <div
                                        key={`${image.file.name}-${index}`}
                                        className="relative h-[180px] min-w-[180px] overflow-hidden rounded-[15px] bg-[#ECECEF]"
                                    >
                                        <img
                                            src={image.url}
                                            alt={`장표 ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeBanner(index)}
                                            className="absolute right-[8px] top-[8px] flex h-[24px] w-[24px] items-center justify-center"
                                        >
                                            <img
                                                src={deletebtn}
                                                alt="이미지 삭제"
                                                className="h-full w-full "
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* 기술 스택 */}
                    <div className="stack">
                        <h2 className="mb-[30px] text-[28px] font-semibold text-[#121212]">
                            기술 스택
                        </h2>

                        <div className="flex flex-col gap-[26px]">
                            {Object.entries(stackList).map(([category, stacks]) => (
                                <div
                                    key={category}
                                    className="grid grid-cols-[90px_1fr] items-start gap-x-[50px]"
                                >
                                    <p className="pt-[7px] text-[20px] text-[#6C6E72] font-medium text-[#808386]">
                                        {category}
                                    </p>

                                    <div className="flex flex-wrap gap-[8px]">
                                        {stacks.map((stack) => {
                                            const selected = selectedStacks.includes(stack);

                                            return (
                                                <button
                                                    key={`${category}-${stack}`}
                                                    type="button"
                                                    onClick={() => toggleStack(stack)}
                                                    className={`rounded-[5px] border px-[10px] py-[6px] text-[20px] font-medium transition-colors ${selected
                                                            ? "border-[#A789FF] bg-[#F2EDFF] text-[#7950F2]"
                                                            : "border-[#DBDEE2] bg-[#FAFAFA] text-[#121212]"
                                                        }`}
                                                >
                                                    {stack}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 등록 버튼 */}
                    <div className="flex justify-end pb-[30px] pt-[10px]">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="h-[79px] rounded-[15px] bg-[#8158F6] px-[35px] text-[24px] font-semibold text-white"
                        >
                            등록하기
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

interface TeamMemberColumnProps {
    title: string;
    members: string[];
    onChange: (index: number, value: string) => void;
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
                {members.map((member, index) => (
                    <input
                        key={index}
                        type="text"
                        value={member}
                        onChange={(e) => onChange(index, e.target.value)}
                        placeholder="이름을 입력해주세요"
                        className={`h-[92px] w-full rounded-[15px] mb-[7px] border px-[20px] text-[20px] text-[#121212] outline-none placeholder:text-[#808386] ${index === 0
                            ? "border-[#865BFF]"
                            : "border-[#D0D6DD] focus:border-[#865BFF]"
                            }`}
                    />
                ))}

                <button
                    type="button"
                    onClick={onAdd}
                    className="mt-[2px] flex items-center gap-[7px] text-[20px] font-medium text-[#6C6E72]"
                >
                    <span className="text-[22px] leading-none">+</span>
                    새로운 멤버 추가하기
                </button>
            </div>
        </div>
    );
}