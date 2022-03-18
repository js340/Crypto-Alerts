import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
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

      <View style={styles.iconContainer}>
        <Image source={require('../../../assets/Crypto-Alerts-icon.png')} style={styles.icon} />
      </View>

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

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
          This is a crypto notification app! You will be notified only on the coins you have watchlisted. 
          Once a watchlisted coins 24 hour percentae change has exeeded the threshold amount, you will
          recieve a notification. Change the threshold amount in order to specify at what point should you
          be notified. 
        </Text>
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
  iconContainer:{
    paddingBottom: 20,
  },
  icon:{
    width: 128,
    height: 128,
    borderRadius: 10,
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
    fontSize: 16,
  },
  descriptionContainer:{
    padding: 50,
  }, 
  description: {
    color: 'white',
    fontSize: 14,
    textAlign:'center'
  },
});