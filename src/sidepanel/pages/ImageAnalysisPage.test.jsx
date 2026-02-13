import { render, screen } from "@testing-library/react";
import { IMAGE_ANALYSIS_STATUS } from "../../shared/constants/index";
import useAnalysisStore from "../../shared/stores/useAnalysisStore";
import ImageAnalysisPage from "./ImageAnalysisPage";

describe("ImageAnalysisPage", () => {
  beforeEach(() => {
    useAnalysisStore.setState({
      analysisStatus: IMAGE_ANALYSIS_STATUS.LOADING,
      analysisData: null,
    });

    chrome.storage.local.get.mockResolvedValue({});
    chrome.storage.local.remove.mockResolvedValue();
  });

  it("마운트 시 로딩 스피너를 표시한다", () => {
    chrome.storage.local.get.mockReturnValue(new Promise(() => {}));

    render(<ImageAnalysisPage />);

    expect(screen.getByText("이미지를 분석중입니다...")).toBeInTheDocument();
  });

  it("이미지 분석에 성공하면 제목과 해설을 표시한다", async () => {
    chrome.storage.local.get.mockResolvedValue({
      pendingImageAnalysis: {
        imageUrl: "https://example.com/image.jpg",
        pageUrl: "https://example.com",
      },
    });

    chrome.runtime.sendMessage.mockImplementation((message, callback) => {
      callback({
        success: true,
        data: { title: "이미지 제목", summary: "이미지 해설 내용" },
      });
    });

    render(<ImageAnalysisPage />);

    expect(await screen.findByText("이미지 제목")).toBeInTheDocument();
    expect(screen.getByText("이미지 해설 내용")).toBeInTheDocument();
  });

  it("분석할 이미지가 없으면 에러 메시지를 표시한다", async () => {
    chrome.storage.local.get.mockResolvedValue({});

    render(<ImageAnalysisPage />);

    const errorMessage = await screen.findByRole("alert");

    expect(errorMessage).toHaveTextContent(
      "분석할 이미지 정보가 없습니다. 이미지를 선택 후 단축키를 눌러주세요",
    );
  });
});
