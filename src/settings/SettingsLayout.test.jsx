import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import SettingsLayout from "./SettingsLayout";

describe("SettingsLayout", () => {
  it("사이드바와 중첩 라우트 내용을 렌더링한다", () => {
    render(
      <MemoryRouter initialEntries={["/general"]}>
        <Routes>
          <Route path="/" element={<SettingsLayout />}>
            <Route path="general" element={<div>일반 콘텐츠</div>} />
            <Route path="info" element={<div>정보 콘텐츠</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("img", { name: "스프레드 러브" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "일반" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "정보" })).toBeInTheDocument();
    expect(screen.getByText("일반 콘텐츠")).toBeInTheDocument();
  });
});
