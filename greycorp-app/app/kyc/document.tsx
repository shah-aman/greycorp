import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ChevronLeft, Camera, Check } from 'lucide-react-native';
import { useCameraPermissions, CameraView, CameraType } from 'expo-camera';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function DocumentCaptureScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [frontImageUri, setFrontImageUri] = useState<string | null>(null);
  const [backImageUri, setBackImageUri] = useState<string | null>(null);
  const [isFrontCapturing, setIsFrontCapturing] = useState(true);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.title}>We need camera access</Text>
        <Text style={styles.message}>
          To verify your identity, we need permission to use your camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (isFrontCapturing) {
      // Simulate taking a picture of front ID
      setFrontImageUri('https://images.pexels.com/photos/9069389/pexels-photo-9069389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
      setIsFrontCapturing(false);
    } else {
      // Simulate taking a picture of back ID
      setBackImageUri('https://images.pexels.com/photos/8108086/pexels-photo-8108086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
    }
  };

  const handleNext = () => {
    router.push('/kyc/selfie');
  };

  const bothCaptured = frontImageUri && backImageUri;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.title}>
        {isFrontCapturing ? 'Capture ID Front' : 'Capture ID Back'}
      </Text>
      
      <Text style={styles.subtitle}>
        {isFrontCapturing 
          ? 'Position the front of your ID within the frame' 
          : 'Now capture the back of your ID'
        }
      </Text>
      
      <View style={styles.cameraContainer}>
        {isFrontCapturing ? (
          frontImageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: frontImageUri }} style={styles.preview} />
              <View style={styles.capturedBadge}>
                <Check size={16} color={Colors.bg} />
              </View>
            </View>
          ) : (
            <CameraView style={styles.camera} facing={CameraType.back}>
              <View style={styles.guideline}>
                <View style={styles.innerGuideline} />
              </View>
            </CameraView>
          )
        ) : (
          backImageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: backImageUri }} style={styles.preview} />
              <View style={styles.capturedBadge}>
                <Check size={16} color={Colors.bg} />
              </View>
            </View>
          ) : (
            <CameraView style={styles.camera} facing={CameraType.back}>
              <View style={styles.guideline}>
                <View style={styles.innerGuideline} />
              </View>
            </CameraView>
          )
        )}
      </View>
      
      {(isFrontCapturing && !frontImageUri) || (!isFrontCapturing && !backImageUri) ? (
        <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
          <Camera size={28} color={Colors.bg} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, bothCaptured ? {} : styles.buttonDisabled]}
          onPress={bothCaptured ? handleNext : handleTakePicture}
          disabled={!bothCaptured}>
          <Text style={styles.buttonText}>
            {bothCaptured ? 'Next' : 'Capture Back of ID'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing * 5,
    backgroundColor: Colors.bg,
  },
  backButton: {
    marginTop: Layout.spacing * 10,
    marginBottom: Layout.spacing * 5,
  },
  title: {
    ...Fonts.h2,
    marginBottom: Layout.spacing * 2,
  },
  subtitle: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 6,
  },
  cameraContainer: {
    height: 400,
    borderRadius: Layout.radii.md,
    overflow: 'hidden',
    ...Layout.shadow.md,
  },
  camera: {
    flex: 1,
  },
  guideline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  innerGuideline: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: Layout.radii.sm,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  preview: {
    flex: 1,
    borderRadius: Layout.radii.md,
  },
  capturedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Layout.spacing * 8,
    ...Layout.shadow.md,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing * 4,
    paddingHorizontal: Layout.spacing * 8,
    borderRadius: Layout.radii.md,
    marginTop: Layout.spacing * 8,
    ...Layout.shadow.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  buttonText: {
    color: Colors.bg,
    ...Fonts.h3,
  },
  message: {
    ...Fonts.body,
    color: Colors.textLight,
    marginVertical: Layout.spacing * 4,
    textAlign: 'center',
  },
});