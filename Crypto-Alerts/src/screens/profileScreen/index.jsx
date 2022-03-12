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
          style={styles.button}
        >
          <Text>Sign Out</Text>
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
  button: {
    backgroundColor: "lightgrey",
    width: 200,
    padding: 15,
    borderRadius: 10,
    marginTop:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailText:{
    color: 'white',
  }
});