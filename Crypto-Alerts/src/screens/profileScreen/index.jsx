import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebase'

const ProfileScreen = () => {
  const navigation = useNavigation()

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
          navigation.replace("LoginScreen");
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.emailText}>Signed in as:  {auth.currentUser?.email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button1}
        >
          <Text style={styles.buttonText1}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileScreen;


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
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
  emailText:{
    color: 'white',
  }
});