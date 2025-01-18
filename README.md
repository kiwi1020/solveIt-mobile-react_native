<h1 align="center"><strong>축제 ON</strong></h1>
<h3 align="center">축제를 즐기기 위한 축제 웨이팅 어플</h3>

<p align="center">
<img src="https://github.com/user-attachments/assets/47d7b689-2a63-44c4-9185-42a33bfe6667"  width="850" height="480"  />
</p>


---
## 1. 프로젝트 개요

**📊 시장 분석**
- 기존 프랜차이즈 매장은 개별 예약 사이트 운영으로 **효율성 및 다양성 부족**  
- 서비스 지역 제한 및 유지 비용 증가로 **경쟁력 약화**  
- 독립 사이트 운영 부담으로 **소상공인 사업자 어려움 가중**  


**💡 필요성**  
- 다양한 도시락 브랜드를 한곳에 모아 **편리한 선택 제공**  
- **정기 결제 및 구독 서비스**로 사용자 편의성 극대화  
- **시간 절약과 건강한 식사** 제공  


**🚀 기대 효과**  
- **편리성 증대**: 원하는 도시락을 쉽고 빠르게 선택  
- **상권 활성화**: 고객과 가맹점 간 협력 강화  
- **고객 확보**: 신규 고객 유치와 기존 고객 유지  
- **비즈니스 성과 향상**: 마케팅과 매출 증대 효과 기대  
---


## 2. 개발 기간
<h3 align="center">24/03/01 ~ 24/10/31</h3>

<p align="center">
<img src="https://github.com/user-attachments/assets/c8772bd4-6ffc-4704-b734-dd6d7b03eba9"  width="800" height="480"  />
</p>



<img src="https://github.com/user-attachments/assets/aad1107d-b375-4655-8c91-54bbcb4f0c1e" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/189ef4fc-8366-4cdc-8574-b6384195b70b" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/ced99d9c-6a9f-4dd8-ae11-355534c54853" style="width: 200px;">

---

<img src="https://github.com/user-attachments/assets/72b595cb-6877-4ad6-8c5c-5bd8b13f31d4" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/33a16854-817f-474c-a00d-49920d71a81b" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/d9af8e3d-0bee-4944-808c-cdfee5ec609a" style="width: 200px;">

---

# Festival Queue Management Application

## 프로젝트 개요

주점 부스 대기 시간이 길어 푸드트럭, 공연 등 축제의 다양한 즐길 거리를 놓치게 되는 문제를 해결하고, 부스 정보를 찾기 어렵고 혼잡함으로 인해 방문 결정을 내리기 어려운 문제를 해결하고자 설계했습니다.
부스 운영자가 대기 상황을 효율적으로 관리할 수 있도록 학생들이 대기 시간 없이 축제를 온전히 즐길 수 있는 어플리케이션입니다.

---

## 주요 기능

### 1. 일반 사용자 기능
- **UUID**를 활용해 사용자 고유 ID로 대기표 예약 가능.
- 리스트에 있는 가게 목록에서 원하는 가게를 선택해 대기표 예약.
- **중복 방지:** 한 사용자가 여러 번 대기표를 발급받을 수 없도록 설계.
- **조회 및 취소 기능:** 사용자가 자신이 예약한 대기표를 확인하고 취소 가능.
- 대기표 발급 시, **인원수를 임의로 설정하여 단체 예약** 지원.
- 가게 이미지를 **슬라이드 형식**으로 제공하며, 클릭 시 전체 이미지 보기 가능.

### 2. 가게 관리자 기능
- 클라우드에서 **유효한 UUID 인증**을 받은 관리자만 가게 등록 가능.
- 가게 이름과 정보 이미지를 등록하고, 가게의 마감 및 게시 설정 가능.
- 해당 가게에 예약된 대기표 정보를 **한눈에 확인 가능**.
- 관리자는 대기표 **완료 및 취소 기능**으로 대기표 관리 가능.
- 등록된 가게 정보의 수정 및 삭제 지원.
- **푸시 알림:** 특정 대기표 발급자에게 알림 전송 가능.
- **총 대기 팀 수 계산** 기능으로 매장 관리 효율성 강화.

### 3. 공통 기능
- 하단 탭 구성 및 직관적인 **아이콘 UI** 제공.
- **스택 네비게이션**을 설정하여 사용자 친화적인 경로 이동 지원.
- **runTransaction** 기능을 활용해 여러 사용자가 동시에 대기표를 발급하거나 상태를 확인할 때 발생할 수 있는 교착 상태 방지.

---

## 개발 환경
- **개발 프레임워크** Expo
- **사용 언어:** JavaScript, TypeScript
- **데이터베이스:** Firebase Store, Firebase Storage
- **UI 개발:** React Native
- **알림 서비스:** Expo Notification

---

## 개발 기간
- **2개월**
- **서동현** 
- **유우열**
