import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, View, Text, StyleSheet } from 'react-native';
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
      behavior='padding'
    >
      <View style={styles.inputContainer}>
        <TextInput 
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder='Email' 
          placeholderTextColor="grey"
          style={styles.textInput}
        />
        <TextInput 
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder='Password' 
          placeholderTextColor="grey"
          style={styles.textInput}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text stye={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.button}
        >
          <Text stye={styles.buttonText}>Register</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
    color: 'white'
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: "lightgrey",
    width: 200,
    padding: 15,
    borderRadius: 10,
    marginTop:10,
    justifyContent: 'center',
    alignItems: 'center',
  },

});