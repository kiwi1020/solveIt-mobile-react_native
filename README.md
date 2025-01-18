<p align="right">
  <a href="https://www.youtube.com/watch?v=zg-HLhObBTU" align="right">
<img src="https://img.shields.io/badge/유튜브%20바로가기-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="유튜브 바로가기">
  </a>
</p>

<h1 align="center"><strong>축제 ON</strong></h1>
<h3 align="center">축제를 즐기기 위한 축제 웨이팅 어플</h3>


---


<p align="center">
<img src="https://github.com/user-attachments/assets/aad1107d-b375-4655-8c91-54bbcb4f0c1e" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/189ef4fc-8366-4cdc-8574-b6384195b70b" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/ced99d9c-6a9f-4dd8-ae11-355534c54853" style="width: 200px;">
</p>

<p align="center">
<img src="https://github.com/user-attachments/assets/72b595cb-6877-4ad6-8c5c-5bd8b13f31d4" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/33a16854-817f-474c-a00d-49920d71a81b" style="width: 200px;">
<img src="https://github.com/user-attachments/assets/d9af8e3d-0bee-4944-808c-cdfee5ec609a" style="width: 200px;">
</p>


---
## 1. 프로젝트 개요

**📊 시장 분석**
- 주점 부스 대기 시간이 길어 푸드트럭, 공연 등 축제의 다른 즐길 거리를 놓치는 현상 발생  
- 부스 정보를 찾기 어렵고, 혼잡함으로 인해 방문 결정을 내리기 어려운 상황  
- 부스 운영자가 대기 상황을 효율적으로 관리하기 어려운 문제 발생  


**💡 필요성**  
- 학생들이 대기 시간 없이 축제를 온전히 즐길 수 있도록 **디지털 시스템 구축** 필요  
- **부스 정보 제공**을 통해 다양한 선택의 폭 확대 및 대기 줄 효율적 관리  
- **실시간 대기 상황 관리**로 학생들의 편리한 경험 제공 


**🚀 기대 효과**  
- **대기 시간 절감**: 대기 없이 축제를 즐길 수 있는 환경 제공  
- **효율적인 대기 관리**: 부스 대기 상황을 실시간으로 확인하고 관리 가능  
- **사용자 경험 개선**: 실시간 알림과 빠른 대기표 발급으로 사용자 만족도 향상  
- **운영 효율화**: 부스 운영자가 대기 상황을 효율적으로 관리할 수 있도록 지원 
---


## 2. 개발 기간
<h3 align="center">24/03/01 ~ 24/10/31</h3>

<p align="center">
<img src="https://github.com/user-attachments/assets/2ee819da-ecc0-4ce3-b421-ed1f642ec233"  width="900"   />
</p>

## 3. 팀원 소개 및 역할💡

- **서동현**

  역할 : 기획자, UX Designer, Tester, 일반 사용자 Part 개발
  
  기능 : DB설계, 기능 설계, 권한별 기능 설계, 사용자 대기표 개발, UUID 개발, 디버깅, 관리자 대기표 개발

- **유우열**

  역할 : PM, UI Designer, Database 설계, 주점 관리 Part 개발
  
  기능 : 가게 수정 기능 개발, 가게 오픈 마감 기능 개발, 알림 기능 개발, firebase 연동, Modal창 개발, 게시판 개발
---

## 4. 개발 환경

- **프레임워크:**
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)<img src="https://img.shields.io/badge/52.0.6-515151?style=for-the-badge">
![React Native](https://img.shields.io/badge/React%20Native-5E5E5E?style=for-the-badge&logo=react&logoColor=61DAFB)<img src="https://img.shields.io/badge/0.76.2-515151?style=for-the-badge">

- **DB:**
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)<img src="https://img.shields.io/badge/11.0.2-515151?style=for-the-badge">

- **기타 기술:**
![JSX](https://img.shields.io/badge/JSX-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled%20Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)<img src="https://img.shields.io/badge/6.1.13-515151?style=for-the-badge">

--- 

## 5. 차별점 

- **간소화된 사용자 인증** : 별도의 회원가입 없이 앱 실행 시 고유 UUID를 자동 생성하여 사용자를 식별, 서비스 접근성을 대폭 개선

<p align="center">
</p>

- **운영자 중심의 관리 기능** : Firebase Firestore 및 FireStorage를 통해 운영자가 대기표 및 가게 정보를 실시간으로 관리 가능하며 정확한 정보 제공
<p align="center">
</p>


- **비상 상황에 대한 실시간 대응** : Expo Notifications를 활용해 대기표 발급 중단, 호출 취소 등 긴급 상황을 실시간으로 사용자에게 알림

<p align="center">
</p>

- **실시간 데이터 처리와 안정성** : Firebase의 runTransaction 기능을 활용해 다수 사용자가 동시에 대기표를 발급하거나 상태를 확인할 때 발생할 수 있는 데이터 충돌 및 서버 과부하 문제를 해결

<p align="center">
</p>

---  
## 6. 설치 방법

```sh
npm install -g expo-cli
expo init <FestivalON>

npm install
npm install @react-navigation/native
npm install @react-navigation/stack
npm install firebase
npm install styled-components

expo install react-native-screens
expo install react-native-safe-area-context
expo install react-native-gesture-handle
expo install react-native-reanimated
expo install react-native-get-random-values
expo install expo-notifications
expo install expo-linear-gradient
expo start -c
```


## 7. 프로젝트 후기

- **서동현**  
"."  

- **유우열**  
"이번 프로젝트에서 리액트 네이티브와 엑스포를 활용하여 모바일 앱을 개발했습니다. 리액트 네이티브의 장점은 한 번의 코드로 iOS와 Android 앱을 동시에 개발할 수 있다는 점이었습니다. Expo는 개발 환경 설정과 빌드 과정을 매우 간소화해줘서, 빠르게 프로토타입을 개발할 수 있었습니다. 파이어베이스를 활용한 데이터 저장 및 관리를 하면서, NoSQL의 강점을 잘 이해하게 되었습니다."  
