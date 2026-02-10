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

const PAGINATION = {
  PAGE_SIZE: 12,
  GROUP_SIZE: 5,
};

const TOKEN_PREFIX = {
  USER: "user_",
  GUEST: "guest_",
};

const ERROR_CODE = {
  AUTH_TOKEN_REQUIRED: "AUTH_TOKEN_REQUIRED",
  AUTH_GUEST_TOKEN_EXPIRED: "AUTH_GUEST_TOKEN_EXPIRED",
  AUTH_GUEST_TOKEN_INVALID: "AUTH_GUEST_TOKEN_INVALID",
  AUTH_USER_TOKEN_EXPIRED: "AUTH_USER_TOKEN_EXPIRED",
  AUTH_USER_TOKEN_INVALID: "AUTH_USER_TOKEN_INVALID",
  AUTH_TOKEN_TYPE_UNKNOWN: "AUTH_TOKEN_TYPE_UNKNOWN",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
};

const ERROR_MESSAGE = {
  NETWORK: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요.",
  UNKNOWN: "알 수 없는 오류가 발생했습니다.",
};

export {
  SUMMARY_STATUS,
  IMAGE_ANALYSIS_STATUS,
  LENGTH_OPTIONS,
  PERSONA_OPTIONS,
  DEFAULT_SETTINGS,
  PAGINATION,
  TOKEN_PREFIX,
  ERROR_CODE,
  ERROR_MESSAGE,
};
