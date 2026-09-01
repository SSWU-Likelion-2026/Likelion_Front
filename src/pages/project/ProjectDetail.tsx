import React from "react";
import { useNavigate } from "react-router-dom";
import backbtn from '../../img/project/backbtn.svg'
import leftbtn from '../../img/project/left.svg'
import rightbtn from '../../img/project/right.svg'

export default function ProjectDetail() {
    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-white px-[120px] py-6">

            {/* 상단 버튼 영역 */}
            <div className="mb-[40px] flex items-center justify-between">
                {/* 뒤로가기 */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex h-6 w-6 items-center justify-center"
                >
                    <img
                        src={backbtn}
                        alt="뒤로가기"
                        className="backbtn h-[16px] w-[8px]"
                    />
                </button>

                {/* 수정 / 삭제 */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="h-[46px] rounded-[10px] border border-[#D0D6DD] px-[10px] text-[16px] font-medium text-[#808386]"
                    >
                        프로젝트 수정
                    </button>

                    <button
                        type="button"
                        className="h-[46px] rounded-[10px] border border-[#D0D6DD] px-[10px] text-[16px] font-medium text-[#808386]"
                    >
                        프로젝트 삭제
                    </button>
                </div>
            </div>

            {/* 프로젝트 상단 내용 */}
            <div className="flex gap-10">
                {/* 왼쪽 프로젝트 정보 */}
                <div className="info w-[384px] shrink-0">
                    <div className="mb-[15px] flex items-center gap-4">
                        <div className="h-[93px] w-[93px] rounded-[20px] bg-[#D9D9D9]" />

                        <h1 className="text-[50px] font-medium text-[#222]">
                            프로젝트명
                        </h1>
                    </div>

                    <p className="mb-1 text-[20px] font-medium text-[#121212]">
                        프로젝트 슬로건 한줄 설명 문구
                    </p>

                    <p className="mb-[30px] text-[20px] font-medium text-[#121212]">
                        프로젝트 슬로건 한줄 설명 문구
                    </p>

                    <div className="h-[179px] rounded-[12px] border border-[#DADDE1] px-[25px] py-[20px]">
                        <p className="text-[18px] text-[#6C6E72]">해커톤</p>
                        <p className="mb-3 text-[22px] font-medium">아이디어톤</p>

                        <p className="text-[18px] text-[#6C6E72]">프로젝트 기간</p>
                        <p className="text-[22px] font-medium">
                            2026.00 - 2026.00
                        </p>
                    </div>
                </div>

                {/* 오른쪽 이미지 영역 */}
                <div className="gallery flex-1">
                    <div className="relative h-[529px] w-full bg-[#CCCED0]">
                        <button
                            type="button"
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
                            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#212121]"
                        >
                            <img
                                src={rightbtn}
                                alt="다음"
                                className="h-[12px] w-[6px]"
                            />
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-6 gap-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-[80px] bg-[#CCCED0]"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 아래 영역 */}
            <div className="mt-10 flex gap-10">
                {/* 왼쪽 사이드 */}
                <div className="side w-[384px] shrink-0 space-y-5">
                    {/* 프로젝트 팀원 */}
                    <div className="member bg-[#FAFAFA]  h-[352px] rounded-[12px] border border-[#D0D6DD] p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-[24px] font-semibold">
                                프로젝트 팀원
                            </h2>
                            <span className="text-[18px]">▼</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[18px] text-[#888]">
                                    기획/디자인
                                </p>
                                <p className="mt-1 text-[22px] font-medium">
                                    성이름
                                </p>
                            </div>

                            <div>
                                <p className="text-[18px] text-[#888]">
                                    프론트엔드
                                </p>
                                <p className="mt-1 text-[22px] font-medium">
                                    성이름 성이름
                                </p>
                            </div>

                            <div>
                                <p className="text-[18px] text-[#888]">
                                    백엔드
                                </p>
                                <p className="mt-1 text-[22px] font-medium">
                                    성이름 성이름
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 기술 스택 */}
                    <div className="skill rounded-[12px] bg-[#FAFAFA]  h-[634px] border border-[#DADDE1] p-5">
                        <div className=" mb-5 flex items-center justify-between">
                            <h2 className="text-[24px] font-semibold">
                                기술 스택
                            </h2>
                            <span className="text-[18px]">▼</span>
                        </div>

                        <SkillRow
                            title="기획"
                            items={["Notion", "Figma"]}
                        />

                        <SkillRow
                            title="디자인"
                            items={["Notion", "Notion", "Notion", "Notion", "Notion"]}
                        />

                        <SkillRow
                            title="프론트엔드"
                            items={["Notion", "Notion", "Notion"]}
                        />

                        <SkillRow
                            title="백엔드"
                            items={["Notion", "Notion"]}
                        />

                        <SkillRow
                            title="AI"
                            items={["Notion", "Notion", "Notion"]}
                        />
                    </div>
                </div>

                {/* 오른쪽 설명 */}
                <div className="overview px-[65px] py-[25px] min-h-[1311px] bg-[#FAFAFA] flex-1 rounded-[15px] border border-[#D0D6DD] p-8">
                    <h2 className="mt-[35px]  text-[24px] font-semibold">
                        Project Overview
                    </h2>

                    <p className="mt-[25px] text-[18px] font-medium">
                        프로젝트 설명
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
                        className="rounded-[5px] bg-[#DBDEE2] px-[12px] py-[8px] text-medium text-[16px] text-[#000]"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}