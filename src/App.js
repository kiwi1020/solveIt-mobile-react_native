import React, { useEffect } from "react";

// 탭 네비게이션
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./components/Tab";

// 파이어 베이스 쓰는법
import firebaseApp from "./firebase/firebaseConfig";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function App() {
  
  // Firestore에 데이터를 넣는 함수
  const addUserToFirestore = async () => {
    try {
      // 'users'라는 컬렉션에 새 문서 추가
      const docRef = await addDoc(collection(db, "users"), {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        createdAt: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 Firestore에 데이터를 추가하도록 호출
  useEffect(() => {
    addUserToFirestore();
  }, []);

  return (
    <NavigationContainer>
      <TabNavigation />
    </NavigationContainer>
  );
}
