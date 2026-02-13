import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("ISO 날짜 문자열을 한국어 형식으로 변환한다", () => {
    const isoDateString = "2025-01-15T09:30:00.000Z";

    const result = formatDate(isoDateString);

    expect(result).toBe("2025년 1월 15일");
  });
});
