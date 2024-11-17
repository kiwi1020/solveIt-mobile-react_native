import React, { useEffect } from "react";

// 탭 네비게이션
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./components/Tab";

// // 파이어 베이스 쓰는법
// import firebaseApp from "./firebase/firebaseConfig";
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// const db = getFirestore(firebaseApp);

export default function App() {
  
  // // Firestore에 데이터를 넣는 함수
  // const addUserToFirestore = async () => {
  //   try {
  //     // 'users'라는 컬렉션에 새 문서 추가
  //     const docRef = await addDoc(collection(db, "users"), {
  //       storecode: "defaultStore", //가게 고유번호
  //       usercode: "defaultUser", //고객 고유번호
  //       number: "0", //번호표 번호
  //       state: "waiting", //상태
  //       personnel: "0",//인원 수
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  //  // Firestore에 데이터를 넣는 함수
  //  const addStoreToFirestore = async () => {
  //   try {
  //     // 'users'라는 컬렉션에 새 문서 추가
  //     const docRef = await addDoc(collection(db, "users"), {
  //       storecode: "defaultStore", //가게 고유번호
  //       storename: "Default Store", //가게 이름
  //       image1: "image1.png",
  //       image2: "image1.png",
  //       image3: "image1.png",
  //       image4: "image1.png",
  //       image5: "image1.png",
  //       image6: "image1.png",
  //       image7: "image1.png",
  //       image8: "image1.png",
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  // // 컴포넌트가 처음 렌더링될 때 Firestore에 데이터를 추가하도록 호출
  // useEffect(() => {
  //   addUserToFirestore();
  //   addStoreToFirestore();
  // }, []);

  return (
    <NavigationContainer>
      <TabNavigation />
    </NavigationContainer>
  );
}
