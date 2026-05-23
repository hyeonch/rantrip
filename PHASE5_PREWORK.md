# Phase 5 선행작업 정리

## 목적

Phase 1~4는 실제 사용 경험을 여자친구와 함께 다듬는 구간이다. Phase 5 선행작업은 그 흐름을 방해하지 않으면서, 나중에 여행 기록 기능을 서버 저장으로 옮길 수 있도록 기술 기반만 미리 준비하는 작업이다.

핵심은 Supabase를 빠른 초기 백엔드 후보로 검토하되, 앱 전체가 Supabase에 직접 묶이지 않도록 추상화 계층을 먼저 설계하는 것이다.

---

## 기본 방향

- Phase 5 선행작업 전에 TypeScript 전환을 먼저 끝낸다.
- Phase 1~4 화면과 UX는 건드리지 않는다.
- 실제 로그인 UI, 기록 작성 UI, 사진 업로드 UI는 아직 구현하지 않는다.
- Supabase는 초기 구현체로만 둔다.
- React 컴포넌트는 Supabase SDK를 직접 호출하지 않는다.
- 앱은 `authService`, `tripService`, `photoService` 같은 내부 서비스에만 의존한다.
- 나중에 Supabase를 제거하더라도 컴포넌트 수정 범위를 최소화한다.

---

## 권장 구조

```text
React Component
  ↓
authService / tripService / photoService
  ↓
Repository interface
  ↓
Supabase implementation
```

나중에 Supabase를 덜어낼 경우:

```text
React Component
  ↓
authService / tripService / photoService
  ↓
Repository interface
  ↓
Custom API implementation
  ↓
직접 운영하는 서버 / DB / Storage
```

---

## 선행작업 목록

### 0. TypeScript 전환

- [ ] 기존 React + Vite 프로젝트를 TypeScript 기반으로 전환
- [ ] `Station`, `Line`, `Direction` 타입 정의
- [ ] `Trip`, `TripPhoto`, `TripVisibility` 타입 초안 정의
- [ ] Supabase 서비스/Repository 설계 전에 타입 경계를 먼저 만든다
- [ ] 전환 후 `npm run build` 통과 확인

### 1. 백엔드 후보 결정

- [x] Supabase를 1차 후보로 확정
- [ ] Firebase와 직접 백엔드는 보조 후보로만 간단 비교
- [x] 초기에는 직접 서버 없이 `React + Supabase`로 결정
- [ ] 나중에 직접 백엔드로 전환할 가능성을 전제로 경계 설계

### 2. 환경 변수 구조 준비

- [ ] `.env.example` 파일 작성
- [ ] `VITE_SUPABASE_URL` 정의
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` 정의
- [ ] 실제 `.env`는 git에 올리지 않도록 확인
- [ ] 배포 환경에서 필요한 변수 목록 정리

### 3. Supabase 클라이언트 위치 결정

- [ ] `src/lib/supabaseClient.js` 생성 여부 결정
- [ ] Supabase SDK 초기화 코드는 한 파일에만 둔다
- [ ] 컴포넌트에서 `supabaseClient`를 직접 import하지 않는 규칙 명시

### 4. 서비스 레이어 설계

- [ ] `authService` 역할 정의
- [ ] `tripService` 역할 정의
- [ ] `photoService` 역할 정의
- [ ] 서비스 함수 이름 초안 작성
- [ ] 컴포넌트가 사용할 공개 함수만 정리

예시:

```js
signIn()
signOut()
getCurrentUser()
createTrip(input)
getMyTrips()
getTripById(id)
updateTrip(id, input)
deleteTrip(id)
uploadTripPhoto(tripId, file)
deleteTripPhoto(photoId)
```

### 5. Repository 경계 설계

- [ ] Supabase 호출을 repository 내부로 숨기는 구조 결정
- [ ] `supabaseAuthRepository` 역할 정의
- [ ] `supabaseTripRepository` 역할 정의
- [ ] `supabasePhotoRepository` 역할 정의
- [ ] Supabase 제거 시 교체할 파일 목록 정리

권장 파일 구조:

```text
src/
  lib/
    supabaseClient.js
  services/
    authService.js
    tripService.js
    photoService.js
  repositories/
    supabase/
      supabaseAuthRepository.js
      supabaseTripRepository.js
      supabasePhotoRepository.js
```

### 6. 데이터 모델 초안 확정

- [ ] `User` 모델 필드 정리
- [ ] `Trip` 모델 필드 정리
- [ ] `TripPhoto` 모델 필드 정리
- [ ] Phase 4 로컬 기록 데이터와 서버 데이터가 크게 다르지 않게 맞춘다

초안:

```text
User
- id
- email
- displayName
- createdAt

Trip
- id
- userId
- departureName
- boardingName
- destinationName
- lineId
- lineName
- direction
- stopCount
- title
- body
- ratingText
- visibility
- visitedAt
- createdAt
- updatedAt

TripPhoto
- id
- tripId
- imageUrl
- sortOrder
- createdAt
```

### 7. Supabase 테이블 설계 초안

- [ ] `trips` 테이블 컬럼 초안 작성
- [ ] `trip_photos` 테이블 컬럼 초안 작성
- [ ] `profiles` 테이블이 필요한지 검토
- [ ] 각 테이블의 primary key, foreign key 정리
- [ ] `created_at`, `updated_at` 처리 방식 결정

### 8. Storage 설계 초안

- [ ] 사진 저장 버킷 이름 결정
- [ ] 파일 경로 규칙 결정
- [ ] 대표 사진 처리 방식 결정
- [ ] 원본 저장 vs 압축본 저장 정책 검토

예시 경로:

```text
trip-photos/{userId}/{tripId}/{photoId}.jpg
```

### 9. RLS 정책 초안

- [ ] 로그인한 유저만 자신의 여행 기록을 조회 가능
- [ ] 로그인한 유저만 자신의 여행 기록을 생성 가능
- [ ] 로그인한 유저만 자신의 여행 기록을 수정/삭제 가능
- [ ] 공개 기록을 둘 경우 공개 조회 정책 별도 검토
- [ ] Storage 파일도 본인 폴더만 접근 가능하게 설계

### 10. 마이그레이션 가능성 문서화

- [ ] Supabase를 제거할 때 바뀌는 부분 정리
- [ ] 그대로 유지해야 하는 서비스 함수 목록 정리
- [ ] 직접 백엔드 전환 시 필요한 API 목록 작성

예상 API:

```text
POST /auth/sign-in
POST /auth/sign-out
GET /me
POST /trips
GET /trips
GET /trips/:id
PATCH /trips/:id
DELETE /trips/:id
POST /trips/:id/photos
DELETE /photos/:id
```

---

## 아직 하지 않을 것

- 실제 로그인 화면 구현
- 실제 회원가입 화면 구현
- 기록 작성 UI 구현
- 사진 업로드 UI 구현
- Supabase와 실제 데이터 연결
- 공개 피드, 댓글, 좋아요 같은 소셜 기능
- 직접 백엔드 서버 구현

---

## 완료 기준

- Phase 1~4 구현을 방해하지 않는다.
- 나중에 서버 저장으로 넘어갈 때 필요한 데이터 구조가 정리되어 있다.
- Supabase를 쓰더라도 컴포넌트가 Supabase SDK를 직접 호출하지 않는 구조가 잡혀 있다.
- Supabase를 제거할 때 교체해야 할 경계가 명확하다.
