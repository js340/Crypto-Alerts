import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../firebase";


const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Root");
      }
    })
    return unsubscribe;
  }, [])

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
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