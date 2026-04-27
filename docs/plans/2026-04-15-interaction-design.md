# Interaction & Polish Design — The Vintage Prague

**Date:** 2026-04-15  
**Status:** Approved

## Summary

전체 톤앤매너는 유지하면서 디테일 인터랙션을 추가한다. Bugatti DESIGN.md의 타이포 위계·절제 원칙을 레퍼런스로 삼되, 기존 폰트(Cormorant Garant / Inter)와 버건디 컬러는 그대로 유지한다. Tailwind CSS로 기본 인터랙션을 다듬고, Framer Motion으로 페이지 진입·스크롤·장바구니 애니메이션을 추가한다.

---

## 1. 타이포그래피 정제 (Bugatti 원칙 적용)

기존 폰트는 유지하되 Bugatti의 위계 원칙을 적용한다.

- **Display (Cormorant Garant)**: `line-height: 1.0`, `font-weight: 400`, letter-spacing 제거 — 헤드라인은 크기로만 위계를 만들고 weight를 올리지 않는다.
- **UI 라벨 (Inter)**: 버튼·nav·캡션 전부 `UPPERCASE` + `tracking-[0.12em]` 통일 — 지금도 어느 정도 되어 있지만 일관성이 없다.
- **Hero 제목**: 현재 `text-5xl~8xl`. line-height를 명시적으로 `leading-none`(1.0)으로 고정.

---

## 2. 버튼 인터랙션 (Tailwind)

현재: `border border-offwhite ... hover:bg-offwhite hover:text-background transition-colors`

변경:
- 형태: `rounded-full` (pill) 또는 `rounded-none` (sharp rectangle) — 두 가지 중 pill 선택. Bugatti의 primary button 원칙.
- 호버: fill 대신 **border-color + text opacity** shift. 배경 채우지 않고 border가 밝아지고 텍스트가 살짝 dim됐다가 밝아지는 느낌.
- `transition-all duration-300 ease-out`
- letter-spacing: 호버 시 `hover:tracking-[0.16em]` 미세 증가 (0.04em 차이 — 거의 안 보이지만 느껴짐)
- Focus: `focus-visible:ring-1 focus-visible:ring-offwhite ring-offset-2 ring-offset-background`

---

## 3. Framer Motion 인터랙션

### 설치
```
framer-motion 패키지 추가
```

### 재사용 컴포넌트 3개

**`<FadeIn>`** (`components/ui/FadeIn.tsx`)
- 스크롤 진입 시 `opacity: 0 → 1`, `y: 20 → 0`
- `viewport: { once: true, margin: "-50px" }`
- `transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }` (custom ease-out)
- `delay` prop으로 stagger 지원

**`<AnimatedLink>`** (`components/ui/AnimatedLink.tsx`)
- 밑줄 애니메이션: `scaleX: 0 → 1` on hover, `transform-origin: left`
- nav 링크와 텍스트 링크에 공통 적용

**`useCartBounce`** (`hooks/useCartBounce.ts`)
- 장바구니 아이콘: 아이템 추가 시 `scale: 1 → 1.3 → 1` spring animation
- `type: "spring", stiffness: 400, damping: 10`

### 적용 위치

| 위치 | 컴포넌트 | 효과 |
|---|---|---|
| Hero 텍스트 블록 | `<FadeIn>` stagger | fade-up, 0.1s 간격 |
| 홈 카테고리 그리드 | `<FadeIn>` stagger | 좌→우 순서로 reveal |
| New Arrivals 상품 카드 | `<FadeIn>` stagger | 스크롤 진입 시 |
| 상품 목록 페이지 그리드 | `<FadeIn>` stagger | |
| 상품 상세 이미지 | Framer Motion `whileHover` | 마우스 parallax, 5–8px |
| 장바구니 아이콘 | `useCartBounce` | 아이템 추가 시 spring |
| 페이지 전환 | `AnimatePresence` | fade, 300ms |

---

## 4. 수정하지 않는 것

- 컬러 팔레트 (버건디, 오프화이트, 다크 배경) — 유지
- 폰트 패밀리 (Cormorant Garant, Inter) — 유지
- 전체 레이아웃 구조 — 유지
- 기존 hover:scale-105 이미지 효과 — FadeIn과 공존

---

## 5. 파일 변경 범위

### 신규 생성
- `components/ui/FadeIn.tsx`
- `components/ui/AnimatedLink.tsx`
- `hooks/useCartBounce.ts`

### 수정
- `package.json` — framer-motion 추가
- `app/(shop)/layout.tsx` — `AnimatePresence` 페이지 전환
- `app/(shop)/page.tsx` — Hero·카테고리·New Arrivals FadeIn 적용
- `app/(shop)/products/page.tsx` — 그리드 stagger
- `app/(shop)/products/[slug]/page.tsx` — 이미지 parallax
- `components/shop/Header.tsx` — AnimatedLink 적용, pill 버튼
- `components/shop/CartCount.tsx` — useCartBounce 적용
- `components/shop/ProductCard.tsx` — FadeIn wrapper
