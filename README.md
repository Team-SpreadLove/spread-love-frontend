<p align="center">
  <img width="640" height="400" alt="Image" src="https://github.com/user-attachments/assets/c82565cc-6900-47d1-be31-108d2a17af12" />
</p>

<br>

<p align="center">
  시각 장애인의 웹 접근성을 돕기 위해 웹 페이지를 요약하고 이미지를 설명합니다.
</p>

<br>

<p align="center">
  <a href="https://github.com/SpreadLoveProject/spread-love-frontend">Frontend Repository</a>
  <span> | </span>
  <a href="https://github.com/SpreadLoveProject/spread-love-backend">Backend Repository</a>
</p>

<br>

# 📖 CONTENTS

- [💥 Motivation](#-motivation)
- [🛠 Tech Stacks](#-tech-stacks)
- [🎯 Features](#-features)
- [🏔 Challenges](#-challenges)
  - [1. 웹페이지 전체 화면을 어떻게 캡처할 수 있을까?: 뷰포트 독립성과 권한 최소화](#1-웹페이지-전체-화면을-어떻게-캡처할-수-있을까-뷰포트-독립성과-권한-최소화)
    - [1) captureVisibleTab의 한계](#1-capturevisibletab의-한계)
    - [2) 대안 검토](#2-대안-검토)
    - [3) Puppeteer 구현으로 리팩토링하기로 결정](#3-puppeteer-구현으로-리팩토링하기로-결정)
    - [4) Puppeteer로 구현을 변환한 결과](#4-puppeteer로-구현을-변환한-결과)
  - [2. 포커스된 이미지를 어떻게 분석할 수 있을까?: Chrome Extension 제약의 연쇄적 극복](#2-포커스된-이미지를-어떻게-분석할-수-있을까-chrome-extension-제약의-연쇄적-극복)
    - [1) 사용자 제스처 시점 제약](#1-사용자-제스처-시점-제약)
    - [2) 분석 대상 범위의 현실적 재정의](#2-분석-대상-범위의-현실적-재정의)
    - [3) OpenAI Vision API의 포맷 제약과 SVG 변환](#3-openai-vision-api의-포맷-제약과-svg-변환)
    - [4) 보안 취약점 연쇄 대응](#4-보안-취약점-연쇄-대응)
- [🗓 Schedule](#-schedule)
- [👥 Memoir](#-memoir)

<br>

# **💥 Motivation**

시각장애인 사용자는 웹을 탐색할 때 스크린리더에 의존합니다.

하지만 실제로는 이미지 설명이 없는 웹사이트가 많고, 페이지 내용을 한눈에 파악하기 어렵습니다.

"이 페이지가 무엇에 관한 내용인지 빠르게 알 수 있다면?"<br>
"이미지가 무엇을 담고 있는지 즉시 설명을 들을 수 있다면?"

이러한 질문에서 출발하여, 시각장애인 사용자가 웹 콘텐츠에 더 빠르고 쉽게 접근할 수 있도록 돕는 Chrome Extension을 만들게 되었습니다.

<br>

# **🛠 Tech Stacks**

### Frontend

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

### Backend

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white) ![Sharp](https://img.shields.io/badge/Sharp-%234ea94b.svg?style=for-the-badge&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

### Database & Cache

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

<br>

# **🎯 Features**

### 1. 웹페이지 요약


### 2. 이미지 분석


### 3. 히스토리 관리

<img width="1280" height="800" alt="Image" src="https://github.com/user-attachments/assets/e5a8eeca-7c6b-4db8-9b89-a56728bd944f" />

### 4. 설정

<img width="1280" height="800" alt="Image" src="https://github.com/user-attachments/assets/6078b7c1-ed3b-4dff-b20c-df714c3a13ca" />

<br>

# **🏔 Challenges**

<br>

## 1. 웹페이지 전체 화면을 어떻게 캡처할 수 있을까?: 뷰포트 독립성과 권한 최소화

시각장애인 사용자가 현재 보고 있는 웹페이지를 이해할 수 있도록 화면을 캡처하여 분석하는 기능이 필요했습니다. 하지만 Chrome Extension 환경의 제약과 사용자마다 다른 화면 환경으로 인해 여러 문제에 직면했습니다.

<br>

### 1) `captureVisibleTab`의 한계

가장 직관적인 방법은 Chrome API의 `captureVisibleTab`을 사용하는 것이었습니다. 사용자가 요약 버튼을 클릭하면 현재 화면을 캡처하여 서버로 전송하고, Vision API로 분석 후 요약 결과를 반환하는 방식입니다.

초기 테스트에서는 잘 동작했지만, 다양한 환경에서 테스트하면서 여러 문제가 드러났습니다.

| 제약 사항 | 구체적인 문제 | 사용자 영향 |
|-----------|--------------|-------------|
| **뷰포트 의존성** | 뷰포트 크기에 따라 캡처되는 내용이 달라짐 | 웹페이지 전체 요약 기능 제한적 |
| **권한 요청** | `<all_urls>` 권한 필요 | 사용자 경고 팝업 표시 |
| **일부 사이트 차단** | 구글 등 보안 정책으로 캡처 불가 | 주요 사이트 사용 제한 |
| **데이터 크기** | Base64 인코딩 시 약 500KB | 전송 시간 지연 |

뷰포트 크기에 따라 캡처되는 내용이 달라지는 문제가 가장 큰 문제였습니다. 특히 시각장애인 사용자는 화면 배율을 높게 설정하는 경우가 많아 웹페이지 전체를 일관되게 요약할 수 없었습니다.

<br>

### 2) 대안 검토

`captureVisibleTab`을 사용했을 때 가장 큰 문제였던 뷰포트 의존성과 권한 문제를 최소화할 방법을 찾기 위해 세 가지 대안을 검토했습니다.

<br>

| 방안 | 설명 | 장점 | 단점 | 결론 |
|------|------|------|------|------|
| **방안 1<br/>스크롤 캡처** | 자동 스크롤하며 여러 장 캡처 후 이미지 병합 | • 전체 페이지 캡처 가능 | • **사용자가 캡처 과정을 지켜봐야 함** (시각장애인에게 치명적)<br/>• 스크린샷 여러 장 → API 비용↑<br/>• 처리 시간 크게 증가<br/>• 권한 문제 미해결 | ❌ 기각 |
| **방안 2<br/>Puppeteer 캡처** | 서버에서 Puppeteer로 페이지 렌더링 후 스크린샷 | • 일관된 환경 (1280x800)<br/>• 전체 페이지 캡처 가능<br/>• 권한 최소화 (tabs만) | • 로그인 페이지 접근 불가<br/>• 개인화 콘텐츠 분석 불가<br/>• 요청 경로 증가<br/>• 서버 리소스 사용 증가<br/>• 처리 시간 증가 우려 | ✅ 가장 현실적 |
| **방안 3<br/>URL 전달** | 웹페이지 URL을 Vision API에 전달하여 분석 시도 | • 뷰포트 독립적<br/>• 권한 문제 없음 | • **OpenAI Vision API가 웹페이지 URL 미지원** (이미지 URL만 가능) | ❌ 구현 불가능 (API 제약) |

<br>

### 3) Puppeteer 구현으로 리팩토링하기로 결정

고민해본 결과 **시각장애인 사용자에게 환경과 무관하게 일관된 품질을 제공하는 것**이 더 중요하다고 판단하였습니다. 또한 웹익스텐션 승인에 걸림돌이 될 수 있는 권한 문제를 해결할 수 있다는 점에서 Puppeteer을 기반으로 구현하기로 결정하였습니다.

그리고 Puppeteer을 활용했을 때 생길 수 있는 문제점들을 아래의 방법들을 활용하여 보완했습니다.

<br>

#### 🏗️ Background.js 아키텍처

**문제:** Side Panel은 사용자가 닫으면 생명주기가 종료되어 요약 요청 중에 패널을 닫으면 히스토리 저장이 실패합니다.

**해결:** Background.js에서 요청을 처리하도록 아키텍처를 변경했습니다.

```
요약 버튼 클릭 → Background.js가 URL 획득 → 서버로 전송
→ Puppeteer로 페이지 렌더링 → OpenAI API 호출
→ 결과 반환 및 Database 저장
```

**결과:**
- Side Panel이 닫혀도 요청이 중단되지 않아 **히스토리 저장 보장**
- Chrome Extension 자체 origin 사용으로 **CORS 우회**

---

#### 📏 페이지 높이 제한

**배경:** 무제한 페이지 높이는 메모리 사용량과 토큰 비용을 증가시킵니다.

**구현:** 네이버 스포츠 뉴스(약 6,200px), 네이버 쇼핑(약 7,200px) 등 실제 웹사이트를 측정한 결과를 바탕으로 **최대 높이 8,500px로 제한**했습니다.

**결과:** 메모리와 토큰 비용을 효과적으로 관리하면서도 대부분의 웹페이지를 완전히 캡처할 수 있습니다.

**개선 예정:** 더 다양한 사이트들에 대해서 성능 테스트를 추가하여 메모리 사용량과 속도, 토큰 사용량, 실제 출력물을 비교해본 후 표로 작성하여 최대 높이를 제한한 근거를 명확하게 작성해볼 계획입니다.

---

#### ⏱️ 동시 요청 제한

**배경:** Puppeteer는 요청마다 Chromium을 실행하므로 인스턴스당 약 150~300MB 메모리를 사용합니다.

**구현:** AWS t3.small (2GB RAM) 환경에서 안정적으로 운영하기 위해 **동시 요청을 3개로 제한**했습니다.

**결과:** 서버 메모리 고갈을 방지하고 안정적인 서비스 제공이 가능해졌습니다.

**개선 예정:** 추후 동시성 개선과 함께 동시 요청이 어디까지 가능한 상황인지 정확한 수치를 측정하고 표로 작성해볼 계획입니다.

---

#### 📊 데이터 전송 개선

Puppeteer 방식으로 전환하면서 클라이언트-서버 간 데이터 전송 방식이 크게 개선되었습니다.

| 항목 | 개선 전 | 개선 후 |
|------|---------|---------|
| 캡처 방식 | captureVisibleTab | Puppeteer 서버 렌더링 |
| 데이터 전송 | Base64 이미지 (~500KB) | JSON + URL (~100B) |
| 권한 | `<all_urls>` (팝업) | tabs + activeTab |

**결과:**
- 클라이언트-서버 간 데이터 전송에서 Base64 인코딩을 제거하고 URL만 전송하면서 **전송 데이터 크기가 약 5000배 감소**했습니다. (서버 내부에서는 Puppeteer 스크린샷을 Base64로 변환하여 OpenAI API에 전송하지만, 이는 OpenAI Vision API가 해당 형식만 지원하기 때문입니다)
- captureVisibleTab API에 필요했던 `<all_urls>` 권한을 제거하여 사용자 경고를 줄였습니다. Content Script는 이미지 포커스 추적을 위해 `<all_urls>`에서 실행되지만, 민감한 화면 캡처 권한과는 다릅니다.

<br>

### 4) Puppeteer로 구현을 변환한 결과

| 측정 항목 | 개선 전 | 초기 우려 | 실제 결과 |
|-----------|---------|-----------|-----------|
| 응답 시간 | 10~18초 | 10초 이상 | **7~15초** ✅ |
| 데이터 크기 | ~500KB | - | **~100B** |
| 뷰포트 의존성 | 있음 | - | **없음** |
| 권한 팝업 | 필요 | - | **불필요** |

초기 우려했던 "처리 시간 2배 증가"는 실제로는 **오히려 개선**되었습니다. Base64 인코딩 오버헤드 제거와 네트워크 전송량 감소 덕분입니다.

**개선 예정:** 현재 응답 시간은 개발 환경에서 수동 측정한 결과입니다. 프로덕션 환경에서 실제 응답 시간 데이터를 수집하고 다양한 웹사이트 유형별로 성능을 측정하여 표로 정리할 계획입니다.

<br>

## 2. 포커스된 이미지를 어떻게 분석할 수 있을까?: Chrome Extension 제약의 연쇄적 극복

시각장애인 사용자가 키보드로 이미지에 포커스 후 `Alt+Shift+I` 단축키를 눌러 즉시 분석하는 기능이 필요했습니다. 하지만 구현 과정에서 Chrome Extension의 근본적인 제약들이 연쇄적으로 드러났고, 각각을 해결하는 과정에서 다음 문제가 나타났습니다.

<br>

### 1) 사용자 제스처 시점 제약

**문제 발견**

가장 직관적인 구현은 "단축키 입력 → 포커스된 이미지 찾기 → Side Panel 열기"였습니다. 하지만 Side Panel이 열리지 않았습니다.

**원인**: Chrome의 `sidePanel.open()` API는 보안상 **사용자 제스처 컨텍스트 내에서만 실행 가능**합니다. 비동기 메시지 통신으로 Content Script에서 이미지 정보를 가져오는 동안 제스처 컨텍스트가 소멸되어 Side Panel 열기가 실패했습니다.

| 시점 | 사용자 제스처 컨텍스트 | 결과 |
|------|------------------------|------|
| 단축키 입력 | ✅ 유효 | - |
| 메시지 통신 대기 | ⏳ 대기 중 | - |
| 응답 수신 후 | ❌ 소멸됨 | Side Panel 열기 실패 |

<br>

**대안 검토**

| 방안 | 장점 | 단점 | 결론 |
|------|------|------|------|
| **제스처 우회**<br/>(offscreen.html 활용) | 구현 가능 | Chrome 정책 위반<br/>Web Store 승인 거부 위험 | ❌ 기각 |
| **Popup 사용** | 제스처 제약 없음 | UX 저하 (매번 새 창)<br/>히스토리 관리 복잡 | ❌ 기각 |
| **선제적 상태 추적** | 정책 준수<br/>동기적 접근 가능 | 이벤트 리스너 추가 필요 | ✅ 채택 |

**해결**: 모든 `<img>` 태그에 `focus`/`blur` 이벤트 리스너를 등록하여, 포커스 변경 시 즉시 Background Service Worker에 상태를 전송하도록 했습니다. 단축키 입력 시에는 이미 저장된 상태를 **동기적으로** 확인하므로 제스처 컨텍스트가 유지되어 Side Panel을 성공적으로 열 수 있었습니다.

<br>

### 2) 분석 대상 범위의 현실적 재정의

**문제 발견**

Side Panel 열기를 해결한 후 실제 테스트를 진행하자, 대부분의 웹사이트에서 **이미지 분석이 거의 작동하지 않았습니다**.

**원인**: 초기 구현에서는 웹 접근성 원칙에 따라 `alt` 속성이 있는 이미지를 분석 대상에서 제외했습니다. 하지만 실제 웹에서는 대부분의 이미지가 alt를 누락하거나 의미 없는 값(`alt=""`, `alt="image"`)을 사용하여 거의 분석되지 않았습니다.

**딜레마**:
- **원칙적**: alt가 있는 이미지 제외 (접근성 표준 준수)
- **현실적**: 모든 이미지 지원 (실제 사용성)

**최종 결정**: **모든 이미지를 분석 대상으로 확대**했습니다. alt가 있더라도 품질이 낮은 경우가 많고, 사용자가 더 자세한 설명을 원할 수 있기 때문입니다.

<br>

### 3) OpenAI Vision API의 포맷 제약과 SVG 변환

**문제 발견**

모든 이미지 분석을 지원하면서 새로운 에러가 발생했습니다:
```
Error: Invalid image format. Supported formats: PNG, JPEG, WEBP, GIF
```

**원인**: OpenAI Vision API가 **SVG 포맷을 지원하지 않음**. 로고, 아이콘 등 중요한 시각 정보가 SVG로 제공되는 경우가 많아 단순 에러 처리는 주요 정보 접근 불가로 이어졌습니다.

**해결 방안 검토**: SVG → PNG 변환 필요

| 라이브러리 | 시스템 의존성 | SVG 지원 | 결론 |
|-----------|---------------|----------|------|
| Jimp | 없음 | ❌ | ❌ 요구사항 불충족 |
| node-canvas | Cairo 필요 | ✅ | ❌ 배포 복잡도 높음 |
| Puppeteer | Chromium 필요 | ✅ | ❌ 과도한 리소스 (이미 캡처에 사용) |
| **sharp** | **없음** | **✅** | **✅ 채택** |

**sharp 선택 이유**: 추가 설치 불필요, 빠른 변환 속도, 적은 메모리 사용으로 프로덕션 환경에 최적이었습니다.

<br>

### 4) 보안 취약점 연쇄 대응

**문제 발견**

SVG 변환 기능을 구현하면서, 이미지 URL을 받아 서버에서 다운로드하는 구조의 **두 가지 치명적인 보안 취약점**을 발견했습니다.

**취약점 1: 대용량 파일 DoS 공격**

악의적 사용자가 10GB 이미지 URL을 전송하면 서버 메모리가 고갈됩니다.

**해결**: 이중 검증 시스템 구축
- **1차**: Content-Length 헤더 확인 (다운로드 전)
- **2차**: 실제 Buffer 크기 확인 (헤더 조작 대비)

**취약점 2: SSRF (Server-Side Request Forgery)**

공격자가 내부 네트워크 URL(`http://169.254.169.254/...`)을 전송하면 AWS 메타데이터 서비스 접근으로 IAM 크레덴셜 탈취가 가능합니다.

**해결**: URL 검증 시스템 구축
- localhost, 127.0.0.1 차단
- 사설 IP 대역 차단 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16)
- http/https 프로토콜만 허용

<br>

# **🗓 Schedule**

**프로젝트 기간**: 2025.12.29(일) ~ 2026.01.18(토) / 3주

<details>
<summary><b>1주차: 기획 및 설계</b></summary>

- 아이디어 수집 및 구체화
- 기술 스택 선정
- Git 작업 플로우 결정
- 코드 컨벤션, 커밋 룰 등 팀 협업 규칙 정립
- Figma를 사용한 UI/UX 설계
- Chrome Extension Manifest V3 아키텍처 설계
- Supabase를 이용한 DB Schema 설계
- API 명세서 작성

</details>

<details>
<summary><b>2~3주차: 기능 개발 및 마무리</b></summary>

- Chrome Extension 구현 (Content Script, Background Service Worker, Side Panel)
- 웹페이지 요약 기능 개발 (Puppeteer 기반 캡처)
- 이미지 분석 기능 개발 (포커스 추적, SVG 변환)
- Backend 서버 구현 (Express API, OpenAI 연동)
- 보안 기능 구현 (DoS 방지, SSRF 방어)
- 히스토리 관리 및 캐싱 시스템 구축
- 전체적인 리팩토링 및 버그 수정
- AWS 배포
- README 작성

</details>

<br>

# **👥 Memoir**

<details>
<summary><b>이하림</b></summary>

프로젝트 아이디어부터 Git 전략, 커밋 메시지 및 브랜치명 컨벤션, 코드 컨벤션, 기술 스택까지 모든 의사결정을 치열하게 토의하고 결정했습니다. 머지 방식부터 아이디어 회의, 일정 및 계획 수립, 구현 및 테스트까지 한 단계씩 체계적으로 진행하며 팀워크를 다져갔습니다.

각자 추구하는 방향성은 달랐지만, "더 좋은 프로젝트를 만들고 싶다"는 공통된 열망을 중심으로 서로의 의견을 조율했습니다. 모두가 납득할 수 있는 방향성을 찾아가는 과정에서, 협업이란 서로의 목소리에 귀 기울이며 합리적인 결론을 도출하는 것임을 배웠습니다.

지금껏 학습한 내용을 점검하고 고도화하며, 프로덕트 레벨 서비스로 발전시키는 과정에서 많은 성장과 성찰이 있었습니다. 치열하게 고민하고 토론하며 만들어낸 결과물은 인풋 그 이상의 아웃풋이었고, 이는 어떤 환경에서도 누구와 작업하든 가장 중요한 가치라고 생각합니다.

</details>

<details>
<summary><b>정원식</b></summary>



</details>
