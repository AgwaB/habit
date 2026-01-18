# Product Requirements Document (PRD): Habit Tracker

## 1. 개요 (Overview)
- **제품명:** (가칭) My Habits
- **목적:** 반복적인 루틴(Task)을 관리하고, 시각적 피드백(도넛 차트, 히트맵)을 통해 지속적인 습관 형성을 돕는 웹 애플리케이션.
- **핵심 가치:** 단순함, 명확한 시각화, 유연한 목표 설정.
- **플랫폼:** Web (Mobile First Responsive)
- **데이터 저장:** Supabase (PostgreSQL)

## 2. 핵심 로직 정의 (Core Logics)
### 2.1. 하루의 기준 (Day Start Time)
- **설정:** 사용자는 하루의 시작 시간을 설정할 수 있다 (Default: 00:00).
- **스냅샷 정책:**
    - 기록 저장 시점의 '논리적 날짜'를 따른다.
    - *예시:* 설정이 04:00일 때, 1월 2일 02:00에 수행한 기록은 '1월 1일' 데이터로 저장됨.
    - **변경 영향:** 기준 시간을 변경하더라도, 이미 저장된 과거 데이터(History)의 날짜는 재계산하지 않는다. (변경 이후 기록부터 적용)

### 2.2. 기간 및 주기 (Frequency Window)
- **고정 기간(Fixed Window):** 주간 목표는 항상 '월요일 ~ 일요일'을 기준으로 계산한다.
- **월간 목표:** 매월 1일 ~ 말일을 기준으로 계산한다.

### 2.3. Task 유형 (Task Types)
1.  **목표형 (Goal Mode):** "주 N회", "월 N회" 등 달성 목표가 존재. (달성률 표시 O)
2.  **기록형 (Counter Mode):** 목표 없이 횟수만 카운트. (달성률 표시 X, 누적 횟수만 표시)

## 3. 기능 요구사항 (Functional Requirements)

### 3.1. Task 관리 (CRUD)
- **생성:** 제목, 아이콘/색상, 유형(Goal/Counter), 주기(주간/월간) 설정.
- **수정:** 제목 및 목표 수정 가능.
- **삭제(Archive):** 데이터를 물리적으로 삭제하지 않고 `status: archived` 처리하여 리스트에서 숨김. 설정 메뉴에서 복구 가능.

### 3.2. 수행 기록 (Action)
- **체크/언체크:** 메인 화면에서 원터치로 횟수 증가(+). (실수 방지를 위해 감소(-) 기능은 상세화면 또는 롱프레스 옵션 고려)
- **피드백:** 체크 즉시 도넛 차트 및 숫자가 업데이트되어야 함.

### 3.3. 시각화 (Visualization)
- **메인 리스트:**
    - Goal Mode: **도넛 차트(Donut Chart)**로 진행률 표시.
    - Counter Mode: 단순 텍스트(`Total N`) 표시.
- **상세 화면:**
    - **전용 달력(Calendar):** 해당 Task의 수행 날짜에 마킹.
    - **히트맵(Heatmap):** 지난 1년간의 수행 빈도를 색상 농도로 표현.
    - **통계:** 현재 연속 달성일(Streak), 총 수행 횟수.

## 4. 데이터 요구사항 (Data Requirements)
*(Supabase Schema 설계를 위한 기초)*
- **Users:** 사용자 정보
- **Tasks:** 습관 정의 (title, frequency_type, target_count, start_time_offset, is_archived)
- **TaskLogs:** 수행 기록 (task_id, performed_at, logical_date)

## 5. 비기능 요구사항 (Non-Functional)
- **반응형:** 모바일 브라우저에서 네이티브 앱처럼 보여야 함.
- **로딩:** 초기 로딩 시 Skeleton UI 적용하여 체감 속도 향상.