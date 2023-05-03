import React from 'react';
import { StyleSheet, Text, View, Buttonl, TouchableOpacity, CameraRoll, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';



export default function App() {
  const [cameraPermission, setCameraPermission] = React.useState(null);
  const [galleryPermission, setGalleryPermission] = React.useState(null);
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [cameraVisible, setCameraVisible] = React.useState(true);
  const [cameraDisplayStyle, setCameraDisplayStyle] = React.useState('flex');

  //When the picture gets taken
  const [reviewMode, setReviewMode] = React.useState(false);
  const [capturedImageURI, setCapturedImageURI] = React.useState(null);




  //request the necessary permissions for camera and image picker:
  async function requestCameraPermissionsAsync() {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraStatus === 'granted');

    const {
      status: galleryStatus,
    } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(galleryStatus === 'granted');
  }

  React.useEffect(() => {
    requestCameraPermissionsAsync();
  }, []);

  //handle the image picking process
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    // Set the cameraVisible state back to true when the image picker is closed
    setCameraVisible(true);

    if (!result.canceled) {
      setCapturedImage(result.base64);
    }
  }

  //takes a picture using the provided camera object, saves the captured image in base64 format, and hides the camera view.
  async function captureImage(camera) {
    if (camera) {
      const options = { quality: 1, exif: true };
      const data = await camera.takePictureAsync(options);
      console.log(data);
      setCapturedImageURI(data.uri);
      setCapturedImage(data.base64);
      setReviewMode(true);
    }
  }

  function confirmImage() {
    setCapturedImage(capturedImageURI);
    setReviewMode(false);
  }

  function retryImage() {
    setCapturedImageURI(null);
    setReviewMode(false);
  }
  
  
  
  // Other functions and code......................................................................................

  return (
    <View style={styles.container}>


    {/*checks if cameraVisible is true. If it is, it renders the camera view with the capture and close buttons.*/}
    {cameraVisible && (
      <Camera
        style={{ flex: 1, width: "100%", height: "50%" }}
        type={Camera.Constants.Type.back}
        ref={(ref) => {
          camera = ref;
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingBottom: 20,
          }}
        >
        
        <View style={styles.cameraButtonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => 
              captureImage(camera)}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              setCameraDisplayStyle("none");
              pickImage();
              }}
          >
            <Text style={styles.buttonText}>Camera Roll</Text>
          </TouchableOpacity>
        </View>

        </View>
      </Camera>
    )}

  {reviewMode ? (
    <View style={styles.reviewContainer}>
      <Image 
        source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
        style={styles.reviewImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={retryImage}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={confirmImage}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null}


      <StatusBar style="auto" />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  cameraButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#1AABE6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  reviewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  reviewImage: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    marginBottom: 20,
    zIndex: 1,
  },
  
});
