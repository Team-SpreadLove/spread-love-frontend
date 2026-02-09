const SUMMARY_STATUS = {
  DEFAULT: "default",
  LOADING: "loading",
  RESULT: "result",
  ERROR: "error",
};

const IMAGE_ANALYSIS_STATUS = {
  LOADING: "loading",
  RESULT: "result",
  ERROR: "error",
};

const LENGTH_OPTIONS = [
  { value: "short", label: "짧게" },
  { value: "medium", label: "중간" },
  { value: "long", label: "길게" },
];

const PERSONA_OPTIONS = [
  { value: "friendly", label: "친근함" },
  { value: "default", label: "기본" },
  { value: "professional", label: "전문적" },
];

const DEFAULT_SETTINGS = {
  length: "medium",
  persona: "default",
};

const TEST_DATA = {
  YONHAP_NEWS: {
    url: "https://www.yna.co.kr/view/AKR20231213165600007",
    image: "/images/mocks/spreadlove-screenshot-01.png",
  },
  NAVER_SPORTS: {
    url: "https://m.sports.naver.com/kbaseball/article/311/0001961081",
    image: "/images/mocks/spreadlove-screenshot-02.png",
  },
  MUSINSA: {
    url: "https://www.musinsa.com/products/5446082",
    image: "/images/mocks/spreadlove-screenshot-03.png",
  },
};

const PAGINATION = {
  PAGE_SIZE: 12,
  GROUP_SIZE: 5,
};

const TOKEN_PREFIX = {
  USER: "user_",
  GUEST: "guest_",
};

export {
  SUMMARY_STATUS,
  IMAGE_ANALYSIS_STATUS,
  LENGTH_OPTIONS,
  PERSONA_OPTIONS,
  DEFAULT_SETTINGS,
  TEST_DATA,
  PAGINATION,
  TOKEN_PREFIX,
};
