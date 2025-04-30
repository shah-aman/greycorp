import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { useCameraPermissions, CameraView, CameraType } from 'expo-camera';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

export default function SelfieScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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
          To verify your identity with a selfie, we need permission to use your camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakeSelfie = () => {
    // Simulate taking a selfie
    setSelfieUri('https://images.pexels.com/photos/5853825/pexels-photo-5853825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  };

  const handleUpload = () => {
    if (!selfieUri) return;
    
    setIsUploading(true);
    
    // Simulate upload with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        router.push('/kyc/pending');
      }
    }, 300);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Selfie Verification</Text>
      
      <Text style={styles.subtitle}>
        Please take a clear selfie in good lighting
      </Text>
      
      <View style={styles.cameraContainer}>
        {selfieUri ? (
          <Image source={{ uri: selfieUri }} style={styles.camera} />
        ) : (
          <CameraView style={styles.camera} facing={CameraType.front}>
            <View style={styles.faceguideline}>
              <View style={styles.oval} />
            </View>
            
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                Blink & turn head slowly when prompted
              </Text>
            </View>
          </CameraView>
        )}
      </View>
      
      {isUploading ? (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>Uploading verification data...</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${uploadingProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{uploadingProgress}%</Text>
        </View>
      ) : selfieUri ? (
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonText}>Upload & Verify</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.captureButton} onPress={handleTakeSelfie}>
          <Camera size={28} color={Colors.bg} />
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
    height: 500,
    borderRadius: Layout.radii.md,
    overflow: 'hidden',
    ...Layout.shadow.md,
  },
  camera: {
    flex: 1,
  },
  faceguideline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  oval: {
    width: 240,
    height: 320,
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 160,
  },
  instructions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    ...Fonts.caption,
    color: Colors.bg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: Layout.spacing * 2,
    paddingHorizontal: Layout.spacing * 4,
    borderRadius: Layout.radii.sm,
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
  uploadingContainer: {
    alignItems: 'center',
    marginTop: Layout.spacing * 8,
  },
  uploadingText: {
    ...Fonts.body,
    marginBottom: Layout.spacing * 3,
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.secondary,
  },
  progressText: {
    ...Fonts.body,
    marginTop: Layout.spacing * 2,
  },
});