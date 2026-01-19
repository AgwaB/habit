# Product Requirements Document (PRD): Habit Tracker

## 1. 개요
- **제품명:** My Habits
- **목적:** 반복적인 루틴 관리 및 시각적 동기 부여.
- **핵심 가치:** 단순함(Simplicity), 개별 습관의 흐름 파악(Trend Tracking).
- **플랫폼:** Web (Mobile First Responsive)
- **데이터 저장:** Supabase (PostgreSQL)

## 2. 핵심 로직
- **하루 기준:** 사용자 설정 시간(Default 00:00) 기준 스냅샷.
- **기간:** 주간(월~일), 월간(1일~말일).
- **Task 유형:** 목표형(Goal), 기록형(Counter).

## 3. 기능 요구사항

### 3.1. 메인 대시보드 (Dashboard)
- **Task List:** 등록된 모든 습관을 카드 리스트 형태로 표시.
- **Card 구성:**
    1.  **오늘의 상태:** 도넛 차트(목표 달성률) 또는 카운터.
    2.  **최근 흐름 (Mini Heatmap):** 각 Task별로 지난 **14일(2주)** 간의 수행 여부를 가로 1열 히트맵(잔디)으로 표시.
    
### 3.2. Task 관리 & 수행
- **생성/수정/아카이브:** 기본 CRUD.
- **체크(Today):** 리스트 내 도넛/버튼을 눌러 즉시 수행.
- **과거 수정:** 상세 화면의 달력 뷰에서 날짜 선택 -> 바텀 시트로 수정.

### 3.3. 상세 화면 (Detail)
- **Interactive Calendar:** 메인에서는 공간 문제로 히트맵만 보여주므로, 상세 화면에서 **월간 달력**을 제공하여 전체적인 패턴 확인 및 과거 날짜 수정을 지원.

## 4. 데이터 요구사항
- **TaskLogs:** `task_id`별로 최근 14일치 데이터를 효율적으로 가져오는 쿼리 최적화 필요 (`Window Function` 또는 `Join` 활용).