// import { StatusBar } from 'expo-status-bar';
import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing'; 
import uploadToAnonymousFilesAsync from 'anonymous-files'; 

// import logo from './assets/logo.png' **import your picture and keep it in assets

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }
    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    } 
    // setSelectedImage({ localUri: pickerResult.uri });
  };
  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }; 

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Image source={logo} style={{ width: 305, height: 159 }} />  ** define height and width or it will not show */}
      <Image
        source={{ uri: "https://i.ytimg.com/vi/aI3QJk7ZtE4/maxresdefault.jpg" }}
        style={styles.logo}
      />
      <Text
        style={
          styles.instructions /* organize styles by moving down and calling for them with dot notation */
        }
      >
        To share a photo from your phone with a friend, just press the button
        below!
      </Text>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={{ fontSize: 20, color: "#fff" }}>Pick a photo biatch</Text>
      </TouchableOpacity>
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  instructions: {
    color: "maroon",
    fontSize: 18,
    marginHorizontal: 15,
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "darkcyan",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
