import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { auth, db } from '../../../firebase';


const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [expoPushToken, setExpoPushToken] = useState('');

  const navigation = useNavigation();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  };

  function storeTokenInFirebase() {
    db.collection('users').doc(auth.currentUser?.uid).set({
      push_token: {expoPushToken}
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Root");
      }
    })
    // get the users expo push token, then stores it in firestore db
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    console.log(expoPushToken);
    storeTokenInFirebase();
    
    return unsubscribe;
  }, [])

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Registered new user: ", user.email)
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Logged in as: ", user.email)
      })
      .catch(error => alert(error.message))
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Image source={require('../../../assets/Crypto-Alerts-icon.png')} style={styles.icon} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder='Email' 
          placeholderTextColor="white"
          style={styles.textInput}
        />
        <TextInput 
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder='Password' 
          placeholderTextColor="white"
          style={styles.textInput}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button1}
        >
          <Text style={styles.buttonText1}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.button2}
        >
          <Text style={styles.buttonText2}>Register</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    paddingTop: 100,
  },
  iconContainer:{
    paddingBottom: 50,
  },
  icon:{
    width: 128,
    height: 128,
    borderRadius: 10,
  },
  inputContainer: {
    width: '80%',
  },
  textInput: {
    backgroundColor: "black",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderColor: 'yellow',
  },
  button1: {
    backgroundColor: '#ffae32',
    width: 150,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ffae32',
    borderRadius: 10,
    marginTop:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText1:{
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
  button2: {
    backgroundColor: 'transparent',
    width: 150,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ffae32',
    borderRadius: 10,
    marginTop:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText2:{
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});