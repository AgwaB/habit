# Product Requirements Document (PRD): Habit Tracker

## 1. 개요
- **제품명:** My Habits
- **목적:** 반복적인 루틴 관리, 시각적 동기 부여, 장기 기록 추적.
- **핵심 가치:** 단순함(Simplicity), 흐름 파악(Trend), 유연한 탐색(Navigation).

## 2. 핵심 로직
- **하루 기준:** 사용자 설정 시간(Default 00:00) 기준 스냅샷.
- **데이터:** 과거 데이터 불변 원칙.

## 3. 기능 요구사항

### 3.1. 메인 대시보드 (Dashboard)
- **Task List:** 오늘 할 일 및 최근 2주간의 흐름(Mini Heatmap) 표시.
- **Focus:** "지금 당장 해야 할 일"과 "최근의 기세"에 집중.

### 3.2. 상세 화면 (Detail) - *Updated*
- **Purpose:** 특정 습관의 전체 히스토리 조망 및 데이터 수정.
- **Month Navigation (New):**
    - 기본적으로 '이번 달' 달력을 표시.
    - 사용자가 자유롭게 '이전 달', '다음 달'로 이동하여 과거 기록 조회 가능.
- **Interactive Calendar:**
    - 표시된 달(Month)의 날짜를 탭하여 과거 기록 수정 (Add/Remove).
- **History Edit:** 날짜 탭 -> 바텀 시트 호출 -> 수정.

### 3.3. 시각화 (Visualization)
- **메인:** Task별 도넛 차트(Today) + 미니 히트맵(Last 14 days).
- **상세:** 월간 달력(Monthly Calendar) + (옵션) 연간 히트맵.

## 4. 데이터 요구사항
- **Pagination:** 상세 화면 달력에서 월을 이동할 때마다, 해당 월(Start Date ~ End Date)의 TaskLog 데이터를 비동기로 조회해야 함.