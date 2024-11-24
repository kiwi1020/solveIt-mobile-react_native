import React, { useState } from 'react';
import { View, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { getStorage, ref, getMetadata } from 'firebase/storage';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const StoreRegisterButton = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [imageExists, setImageExists] = useState(false);
  const { deviceId } = route.params;

  // Firebase 초기화
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  const storage = getStorage(app);

  useFocusEffect(
    React.useCallback(() => {
      const checkImageExists = async () => {
        try {
          // Firebase Storage 경로 확인 (deviceId로 경로 구성)
          const storageRef = ref(storage, `store_images/${deviceId}/profile`);
          console.log("Checking for image at:", `store_images/${deviceId}/profile`); // 경로 확인

          // getMetadata를 사용하여 메타데이터를 확인하고, 이미지가 존재하는지 체크
          await getMetadata(storageRef); // 메타데이터 가져오기
          
          // 파일이 존재하면 imageExists를 true로 설정
          setImageExists(true);
        } catch (error) {
          console.log("Image does not exist");
          setImageExists(false); // 이미지가 없으면 false
        } finally {
          setLoading(false);
        }
      };

      checkImageExists();
    }, [deviceId])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageExists ? (
        <Button
          title="가게 수정"
          onPress={() => navigation.navigate('StoreRegisterEdit', { deviceId, action: 'edit'})}
        />
      ) : (
        <Button
          title="가게 등록"
          onPress={() => navigation.navigate('StoreRegisterEdit', { deviceId, action: 'register' })} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoreRegisterButton;
