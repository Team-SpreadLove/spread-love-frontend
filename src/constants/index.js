const SUMMARY_STATUS = {
  DEFAULT: "default",
  LOADING: "loading",
  RESULT: "result",
};

const IMAGE_ANALYSIS_STATUS = {
  LOADING: "loading",
  RESULT: "result",
  ERROR: "error",
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

export { SUMMARY_STATUS, IMAGE_ANALYSIS_STATUS, TEST_DATA };
