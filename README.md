# RECALL

영어 문장을 저장하고 간격 반복 플래시카드로 복습하는 개인 학습 웹앱입니다.

> Save what you learn. Recall what you know.

## 기술 스택

- Next.js App Router, TypeScript, Tailwind CSS
- shadcn/ui 방식의 Radix UI 컴포넌트, Lucide Icons
- Neon PostgreSQL, Drizzle ORM, Zod
- Vercel 배포 대응

## 주요 기능

- 문장·해석·메모·태그 CRUD
- 영어/한국어 검색, 상태 및 태그 필터
- 한국어→영어 / 영어→한국어 3D 플래시카드
- `Again`, `Got it` 복습 로그 영구 저장
- 1·3·7·14·30일 간격 반복과 같은 날 중복 진도 방지
- 실제 Neon 데이터를 기반으로 한 대시보드와 최근 7일 통계
- 데스크톱·모바일 반응형 UI

## 로컬 실행

```bash
npm install
cp .env.example .env.local
```

Neon Console에서 프로젝트와 데이터베이스를 만든 뒤 `.env.local`의 값을 채웁니다.

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

마이그레이션과 개발 서버를 실행합니다.

```bash
npm run db:migrate
npm run dev
```

앱은 `http://localhost:3000`에서 열립니다. `DATABASE_URL`이 없거나 연결할 수 없으면 빈 데이터나 가짜 성공 상태를 표시하지 않고 설정 안내 화면을 보여 줍니다.

## 데이터베이스

스키마는 [db/schema.ts](./db/schema.ts), 생성된 SQL은 [drizzle](./drizzle)에 있습니다.

- `sentences`: 문장, 해석, 메모, 태그, 학습 상태, 복습 횟수와 일정
- `review_logs`: 문장별 `again` / `got_it` 응답과 복습 시각
- 문장 삭제 시 연결된 복습 로그는 `ON DELETE CASCADE`로 삭제
- 상태, 결과, 음수가 아닌 카운트에 DB 제약조건 적용

스키마 변경:

```bash
npm run db:generate
npm run db:migrate
```

## REST API

- `GET /api/sentences`
- `POST /api/sentences`
- `PATCH /api/sentences/:id`
- `DELETE /api/sentences/:id`
- `POST /api/reviews`
- `GET /api/stats`

모든 변경 요청은 Zod로 검증합니다. 복습 로그 생성과 문장 상태·다음 복습일 갱신은 하나의 Drizzle 트랜잭션에서 처리됩니다.

## 방문자별 데이터 격리

로그인 화면 없이 바로 사용할 수 있습니다. `proxy.ts`가 첫 방문 시 HTTP-only 익명 방문자 쿠키를 발급하고, 모든 문장·복습·통계 쿼리에 해당 방문자의 `owner_id`를 강제합니다. 따라서 제출 링크를 받은 사람은 즉시 CRUD를 테스트할 수 있지만 서로의 데이터는 조회하거나 변경할 수 없습니다.

`DATABASE_URL`과 방문자 식별 헤더는 클라이언트 JavaScript에 노출되지 않습니다. Vercel에는 `DATABASE_URL`만 서버 환경변수로 등록하세요.

## 검증

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## 샘플 데이터

빈 화면의 **Import sample set** 버튼으로 시연용 문장 10개를 실제 Neon DB에 삽입할 수 있습니다. 샘플에는 `sample` 태그가 붙어 사용자 입력 문장과 구분됩니다.
