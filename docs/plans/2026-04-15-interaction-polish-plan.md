# Interaction Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Framer Motion 추가 + 재사용 인터랙션 컴포넌트 3개 구현 후 주요 페이지에 적용해 전체적인 인터랙션 완성도를 높인다.

**Architecture:** `<FadeIn>` 스크롤 reveal wrapper + `<AnimatedLink>` 밑줄 호버 + `useCartBounce` 훅을 공통 레이어로 만들고, 각 페이지 컴포넌트에 점진적으로 적용한다. Server Component 구조를 건드리지 않고 leaf 레벨 Client Component에만 'use client'를 추가한다.

**Tech Stack:** Next.js 16 App Router, React 19, Framer Motion, Tailwind CSS, Zustand

**Design Reference:** `DESIGN.md` (Bugatti 영감 — 폰트·컬러는 기존 유지, 타이포 위계·절제 원칙만 차용)

---

## Task 1: framer-motion 설치 및 버튼 스타일 정제

**Files:**
- Modify: `package.json`
- Modify: `app/(shop)/page.tsx` (Hero 버튼)
- Modify: `components/shop/AddToCartButton.tsx`

**Step 1: framer-motion 설치**

```bash
cd /Users/hj/the-vintage-prague
npm install framer-motion
```

Expected: `added 1 package` 계열 메시지

**Step 2: Hero 버튼 pill + 인터랙션 정제**

`app/(shop)/page.tsx`의 "Explore Collection" 버튼을 찾아 클래스 교체:

```tsx
// 기존
className="inline-block border border-offwhite text-offwhite text-xs tracking-widest uppercase px-10 py-4 hover:bg-offwhite hover:text-background transition-colors"

// 변경
className="inline-block border border-offwhite/60 text-offwhite text-xs tracking-[0.12em] uppercase px-10 py-4 rounded-full hover:border-offwhite hover:tracking-[0.16em] transition-all duration-300 ease-out"
```

**Step 3: AddToCartButton pill + 인터랙션 정제**

`components/shop/AddToCartButton.tsx` active 버튼 클래스 교체:

```tsx
// 기존
className="w-full bg-burgundy text-offwhite py-4 text-xs tracking-widest uppercase hover:bg-burgundy-light transition-colors"

// 변경
className="w-full border border-burgundy-vivid text-offwhite py-4 text-xs tracking-[0.12em] uppercase rounded-full hover:bg-burgundy-vivid hover:tracking-[0.16em] transition-all duration-300 ease-out"
```

**Step 4: 개발 서버 켜서 버튼 확인**

```bash
npm run dev
```

브라우저에서 `/` 홈과 `/products/[아무 상품]` 열고 버튼 호버 확인.

**Step 5: Commit**

```bash
git add -A
git commit -m "style: refine button interactions — pill shape, tracking hover"
```

---

## Task 2: `<FadeIn>` 컴포넌트

**Files:**
- Create: `components/ui/FadeIn.tsx`

**Step 1: 파일 생성**

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** y 오프셋(px). 기본 24 */
  y?: number;
}

export default function FadeIn({ children, delay = 0, className, y = 24 }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: 홈 Hero에 stagger 적용**

`app/(shop)/page.tsx` — Hero 섹션 내부 텍스트 요소들을 `<FadeIn>`으로 감싼다.

```tsx
import FadeIn from "@/components/ui/FadeIn";

// Hero 내부:
<FadeIn delay={0}>
  <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Prague, Czech Republic</p>
</FadeIn>
<FadeIn delay={0.1}>
  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-burgundy-vivid mb-8 leading-none">
    The Vintage<br />Prague
  </h1>
</FadeIn>
<FadeIn delay={0.2}>
  <p className="text-muted text-sm tracking-widest uppercase mb-10">
    Curated vintage fashion — each piece, a story
  </p>
</FadeIn>
<FadeIn delay={0.3}>
  <Link href="/products" className="...">Explore Collection</Link>
</FadeIn>
```

주의: `app/(shop)/page.tsx`는 Server Component이므로 `FadeIn`(`"use client"`)을 import해도 문제없다.

**Step 3: 카테고리 그리드에 stagger 적용**

같은 파일 Categories 섹션:

```tsx
// 섹션 제목
<FadeIn>
  <p className="text-xs tracking-[0.4em] uppercase text-muted text-center mb-12">
    Shop by Category
  </p>
</FadeIn>

// 그리드 각 아이템 — index를 delay로 활용
{categories.map((cat, i) => (
  <FadeIn key={cat.slug} delay={i * 0.08}>
    <Link href={...} className="group relative aspect-square ...">
      ...
    </Link>
  </FadeIn>
))}
```

**Step 4: New Arrivals에 stagger 적용**

```tsx
{newArrivals.map((product, i) => (
  <FadeIn key={product.id} delay={i * 0.08}>
    <ProductCard product={product} />
  </FadeIn>
))}
```

**Step 5: 개발 서버에서 스크롤 확인**

`/` 페이지에서 스크롤 내려가며 카드들이 순차적으로 나타나는지 확인.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add FadeIn component with scroll-triggered stagger"
```

---

## Task 3: `<AnimatedLink>` 컴포넌트 + Header nav 적용

**Files:**
- Create: `components/ui/AnimatedLink.tsx`
- Modify: `components/shop/Header.tsx`

**Step 1: AnimatedLink 생성**

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";

type AnimatedLinkProps = ComponentProps<typeof Link> & {
  className?: string;
};

export default function AnimatedLink({ children, className = "", ...props }: AnimatedLinkProps) {
  return (
    <Link {...props} className={`relative group inline-block ${className}`}>
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-current"
        initial={{ scaleX: 0, originX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", transformOrigin: "left" }}
      />
    </Link>
  );
}
```

**Step 2: Header nav 링크에 AnimatedLink 적용**

`components/shop/Header.tsx` — nav 좌측 링크 교체:

```tsx
import AnimatedLink from "@/components/ui/AnimatedLink";

// 기존 <Link> → <AnimatedLink>
<AnimatedLink href="/products" className="text-xs tracking-[0.12em] uppercase text-muted hover:text-offwhite transition-colors">
  Shop
</AnimatedLink>
<AnimatedLink href="/products?category=bags" className="text-xs tracking-[0.12em] uppercase text-muted hover:text-offwhite transition-colors">
  Bags
</AnimatedLink>
<AnimatedLink href="/products?category=clothing" className="text-xs tracking-[0.12em] uppercase text-muted hover:text-offwhite transition-colors">
  Clothing
</AnimatedLink>
```

Header는 Server Component이므로 AnimatedLink client component를 leaf로 사용하면 된다.

**Step 3: 개발 서버에서 nav 호버 확인**

브라우저에서 nav 링크에 마우스 올려서 밑줄이 좌→우로 등장하는지 확인.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add AnimatedLink with underline hover animation"
```

---

## Task 4: `useCartBounce` 훅 + CartCount spring 애니메이션

**Files:**
- Create: `hooks/useCartBounce.ts`
- Modify: `components/shop/CartCount.tsx`

**Step 1: 훅 생성**

`hooks/useCartBounce.ts`:

```ts
import { useEffect, useRef } from "react";
import { useAnimationControls } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";

export function useCartBounce() {
  const controls = useAnimationControls();
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      controls.start({
        scale: [1, 1.35, 0.9, 1],
        transition: { duration: 0.4, ease: "easeOut" },
      });
    }
    prevCount.current = count;
  }, [count, controls]);

  return controls;
}
```

**Step 2: CartCount에 애니메이션 적용**

`components/shop/CartCount.tsx` 전체 교체:

```tsx
"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { useCartBounce } from "@/hooks/useCartBounce";

export default function CartCount() {
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const controls = useCartBounce();

  if (count === 0) return null;

  return (
    <motion.span
      animate={controls}
      className="absolute -top-1 -right-1 bg-burgundy text-offwhite text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
    >
      {count}
    </motion.span>
  );
}
```

**Step 3: 개발 서버에서 확인**

상품 상세 페이지에서 "Add to Cart" 버튼 클릭 → 우상단 장바구니 배지가 spring bounce하는지 확인.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add cart count spring bounce animation"
```

---

## Task 5: 상품 목록 페이지 stagger reveal

**Files:**
- Modify: `app/(shop)/products/page.tsx`

**Step 1: 파일 읽기 후 FadeIn 래핑**

`app/(shop)/products/page.tsx`의 상품 그리드 부분을 확인하고, 각 `<ProductCard>`를 `<FadeIn>`으로 감싼다:

```tsx
import FadeIn from "@/components/ui/FadeIn";

// 그리드 내부:
{products.map((product, i) => (
  <FadeIn key={product.id} delay={Math.min(i * 0.06, 0.3)}>
    <ProductCard product={product} />
  </FadeIn>
))}
```

`Math.min(i * 0.06, 0.3)` — 최대 지연 0.3s로 캡핑. 상품이 많을 때 너무 오래 기다리지 않도록.

**Step 2: 섹션 헤더도 FadeIn**

```tsx
<FadeIn>
  <div className="flex items-center justify-between mb-12">
    ...필터/제목...
  </div>
</FadeIn>
```

**Step 3: 개발 서버에서 `/products` 확인**

페이지 진입 시 상품 카드들이 stagger로 나타나는지 확인.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add stagger reveal to products grid"
```

---

## Task 6: 상품 상세 페이지 — 이미지 & 텍스트 reveal

**Files:**
- Modify: `app/(shop)/products/[slug]/page.tsx`

**Step 1: 텍스트 섹션 FadeIn 적용**

```tsx
import FadeIn from "@/components/ui/FadeIn";

// Details 컬럼:
<div className="flex flex-col gap-6">
  <FadeIn delay={0}>
    {product.brand && <p className="text-xs tracking-widest uppercase text-muted">{product.brand}</p>}
  </FadeIn>
  <FadeIn delay={0.08}>
    <h1 className="font-serif text-3xl text-offwhite">{product.name}</h1>
  </FadeIn>
  <FadeIn delay={0.14}>
    <p className="font-serif text-2xl text-offwhite">{formatPrice(product.price)}</p>
  </FadeIn>
  <FadeIn delay={0.2}>
    {/* 나머지 details */}
  </FadeIn>
</div>
```

이미지 캐러셀 컬럼도 `<FadeIn>`으로 감싼다:

```tsx
<FadeIn delay={0} y={12}>
  <ImageCarousel images={images} />
</FadeIn>
```

**Step 2: 개발 서버에서 상품 상세 확인**

`/products/[slug]` 진입 시 이미지와 텍스트가 순차적으로 나타나는지 확인.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add fade-in reveal to product detail page"
```

---

## Task 7: Hero line-height 및 타이포 정제

**Files:**
- Modify: `app/(shop)/page.tsx`

**Step 1: Hero h1 line-height 명시**

```tsx
// 기존
<h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-burgundy-vivid mb-8 leading-none">

// 변경 (leading-none = line-height: 1.0 — 이미 맞지만 명시)
// tracking을 제거해 Cormorant Garant가 자연스럽게 붙도록
<h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-burgundy-vivid mb-8 leading-none tracking-tight">
```

**Step 2: 섹션 eyebrow 텍스트 tracking 통일**

`app/(shop)/page.tsx`의 모든 `tracking-widest` → `tracking-[0.4em]`으로 통일 (이미 Hero에서 쓰는 값).

```tsx
// 카테고리 섹션 eyebrow
<p className="text-xs tracking-[0.4em] uppercase text-muted text-center mb-12">
  Shop by Category
</p>

// New Arrivals eyebrow
<p className="text-xs tracking-[0.4em] uppercase text-muted">New Arrivals</p>
```

**Step 3: 개발 서버 최종 확인**

전체 흐름 한 번 더 확인: 홈 → 카테고리 클릭 → 상품 목록 → 상품 상세 → Add to Cart.

**Step 4: Commit**

```bash
git add -A
git commit -m "style: tighten hero typography and unify eyebrow tracking"
```

---

## 완료 체크리스트

- [ ] framer-motion 설치됨
- [ ] 버튼이 pill 형태이고 호버 시 tracking이 미세하게 늘어남
- [ ] Hero 텍스트가 stagger로 진입함
- [ ] 카테고리·상품 카드가 스크롤 진입 시 순차 reveal됨
- [ ] Nav 링크에 좌→우 밑줄 호버 효과가 있음
- [ ] 장바구니 badge가 아이템 추가 시 spring bounce함
- [ ] 상품 상세 진입 시 이미지·텍스트 fade-in됨
- [ ] Hero h1 line-height 1.0, eyebrow tracking 통일됨
