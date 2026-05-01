# FitPlan Skill

**언어:** [English](README.md) | [中文](README.zh-CN.md) | [Español](README.es.md) | 한국어 | [日本語](README.ja.md) | [العربية](README.ar.md)

FitPlan Skill은 사용자 프로필을 설명 가능한 칼로리 목표, 탄수화물·단백질·지방 목표, 식단 제안, 로컬 HTML 영양 대시보드로 바꾸는 플랫폼 중립 AI Skill이자 TypeScript 도구 모음입니다.

`SKILL.md`를 읽는 AI 어시스턴트용 Skill로 사용할 수 있고, 웹 앱, CLI, 봇, 에이전트, 백엔드 서비스에 TypeScript 라이브러리로 통합할 수도 있습니다.

![FitPlan Skill dashboard preview](docs/images/dashboard-preview.png)

_README 예시 이미지는 gpt-image-2로 생성되었습니다._

> FitPlan Skill은 일반적인 피트니스와 영양 계획을 위한 MVP입니다. 의학적 진단, 치료, 처방을 제공하지 않습니다.

## 주요 기능

- Mifflin-St Jeor 공식으로 BMR을 계산합니다.
- PAL 활동 계수로 TDEE를 추정합니다.
- `cut`, `bulk`, `maintain`, `glucose_control` 네 가지 목표를 지원합니다.
- 단백질, 지방, 탄수화물 목표를 자동으로 배분합니다.
- 포함된 중국어 식품 데이터베이스를 바탕으로 기본 식단을 생성합니다.
- 식품 중량 기준을 생중량, 조리 후 중량, 포장 표시 기준으로 명확히 구분합니다.
- 다른 앱이나 에이전트가 이어서 처리하기 쉬운 구조화 JSON을 반환합니다.
- 오프라인에서도 열 수 있는 단일 파일 로컬 HTML 대시보드를 렌더링합니다.

## 구조

FitPlan Skill은 세 개의 재사용 가능한 계층으로 나뉩니다.

| 계층 | 파일 | 역할 |
| --- | --- | --- |
| Skill 지침 | `SKILL.md` | AI 어시스턴트가 입력 수집, 계산, 식단 생성, 출력을 수행하도록 안내합니다. |
| 계산 엔진 | `src/` | BMR, TDEE, 매크로, 식단 생성을 위한 TypeScript 함수입니다. |
| 표시 계층 | `templates/` / `src/render/` | 브라우저에서 바로 열 수 있는 로컬 HTML 대시보드를 만듭니다. |

## 사용 방법

```bash
npm install
npm test
npm run build
```

pnpm도 사용할 수 있습니다.

```bash
pnpm install
pnpm test
pnpm run build
```

## AI Skill로 사용

이 저장소를 대상 런타임의 Skills 디렉터리에 넣고 어시스턴트가 `SKILL.md`를 읽게 합니다. 사용자는 자연어로 이렇게 요청할 수 있습니다.

```text
감량 식단을 만들어 주세요. 남성, 30세, 175cm, 75kg이고 주 4회 운동하며 소고기는 먹지 않습니다.
```

Skill은 프로필 수집, BMR/TDEE/칼로리/매크로 계산, 구조화된 식단 생성, 필요 시 로컬 HTML 대시보드 렌더링, 임상적이거나 고위험인 상황에 대한 명확한 경계 안내를 돕습니다.

## TypeScript 라이브러리로 사용

```ts
import { createFitPlan, createFitPageHtml } from "fitplan-skill";

const input = {
  profile: {
    sex: "male",
    age: 30,
    heightCm: 175,
    weightKg: 75,
    activityLevel: "moderate",
    goal: "cut"
  }
} as const;

const plan = createFitPlan(input);
const html = createFitPageHtml(input);
```

`createFitPlan`은 정규화된 사용자 프로필, BMR, TDEE, 목표 칼로리, 매크로, 식단, 주의 사항을 반환합니다. `createFitPageHtml`은 스타일과 데이터가 포함된 완전한 HTML 문자열을 반환하며 CDN에 의존하지 않습니다.

## 입력 형식

```ts
type UserProfile = {
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "high" | "athlete";
  goal: "cut" | "bulk" | "maintain" | "glucose_control";
};
```

활동 수준은 거의 운동하지 않는 생활부터 높은 훈련량까지 포괄합니다. 목표는 감량, 증량, 유지, 혈당을 의식한 식단 계획을 포함합니다.

## 식품 데이터와 영양 계산

기본 식품 데이터는 `assets/foods_zh.json`에 있습니다. 식품을 추가할 때는 `id`, `nameZh`, `category`, `basis`, `servingUnit`, 100g당 영양 성분 필드를 유지하세요. `basis`는 중량 기준을 뜻합니다. `raw`는 생중량, `cooked`는 조리 후 중량, `packaged`는 포장 영양 표시 기준입니다.

자세한 공식은 [docs/nutrition-logic.md](docs/nutrition-logic.md)에 정리되어 있습니다. 기본 전략은 감량 `TDEE * 0.8`, 증량 `TDEE * 1.1`, 유지 `TDEE * 1.0`, 혈당 관리 목표는 유지 칼로리에서 탄수화물 비율을 낮추는 방식입니다.

## 건강 관련 한계

FitPlan Skill은 질병을 진단하거나 치료하거나 관리하지 않습니다. 당뇨병이 있거나 혈당강하제를 복용 중인 경우, 신장·간·심혈관 질환, 임신 또는 수유, 섭식장애 병력, 미성년자나 고령자, 최근 수술 또는 중대한 질병 회복기에는 식단을 바꾸기 전에 의사나 등록 영양사와 상담해야 합니다.

## 라이선스

MIT
