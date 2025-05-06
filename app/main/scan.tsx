import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Animated } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';


interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: string;
}

const Scan = () => {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDevice, setScannedDevice] = useState<DeviceInfo | null>(null);
  const [isPairing, setIsPairing] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successAnim] = useState(new Animated.Value(0));
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    getAuthToken();
  }, []);

  const getAuthToken = () => {
    SecureStore.getItemAsync('authToken')
      .then((storedToken) => {
        if (storedToken !== null) {
          console.log('Stored token:', storedToken);
        } else {
          console.log('No token found');
        }
      })
      .catch((error) => {
        console.error('Error fetching token from SecureStore', error);
      });
  };

  useEffect(() => {
    const verifyPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera access to scan QR codes',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    };
    verifyPermissions();
  }, []);


  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      setScanned(true);  // Prevent multiple scans
      const deviceInfo = validateQRData(data);  // Add validation function
      setScannedDevice(deviceInfo);
      setIsScanning(false);
    } catch (error) {
      handleScanError(error);
    }
  };
  const validateQRData = (data: string): DeviceInfo => {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.deviceId || !parsed.deviceName || !parsed.deviceType) {
        throw new Error('Invalid device data structure');
      }
      return parsed;
    } catch (error) {
      throw new Error('Invalid QR code format');
    }
  };

  // Enhanced error handling
  const handleScanError = (error: unknown) => {
    let message = 'QR scan failed';
    if (error instanceof Error) message = error.message;

    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
      setScanned(false);
    }, 2000);
  };
  const restartScan = () => {
    setScanned(false);
    setScannedDevice(null);
    setIsScanning(true);
    setErrorMessage(null);
  };

  const startSuccessAnimation = () => {
    successAnim.setValue(0);
    Animated.sequence([
      Animated.spring(successAnim, {
        toValue: 1,
        friction: 2,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
    ]).start();
  };

  const startScanning = () => {
    getAuthToken();
    setIsScanning(true);
    setScannedDevice(null);
    setErrorMessage(null);
    setIsPaired(false);
  };

  const handlePairDevice = async () => {
    if (!scannedDevice) return;

    setIsPairing(true);
    try {
      const authToken = await SecureStore.getItemAsync('authToken');
      if (!authToken) throw new Error('Authentication token not found');

      const response = await fetch(`https://canine-dog.vercel.app/api/device/pair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ deviceId: scannedDevice.deviceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(scannedDevice.deviceId);

        throw new Error(errorData.message || 'Pairing failed');
      }
      console.log(scannedDevice.deviceId);
      setIsPaired(true);
      startSuccessAnimation();
      Alert.alert('Success', 'Device paired successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Pairing failed. Please try again.');
    } finally {
      setIsPairing(false);
    }
  };

  if (!hasPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isScanning ? (
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.frameOverlay}>
            <View style={styles.frame} />
            <Text style={styles.scanGuideText}>Align QR code within frame</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsScanning(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </CameraView>
      ) : (
        <View style={styles.content}>
          {!scannedDevice ? (
            <View style={styles.contentTop}>
              <Text style={styles.addButtonText}>Add New Device</Text>
              <View style={[styles.circle, styles.outerCircle]}>
                <View style={[styles.circle, styles.middleCircle]}>
                  <View style={[styles.circle, styles.innerCircle]}>
                    <TouchableOpacity style={styles.addButton} onPress={startScanning}>
                      <Ionicons name="camera-outline" size={40} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            </View>
          ) : (
            <View style={styles.contentBottom}>
              <TouchableOpacity
                style={[styles.deviceButton, isPaired && styles.pairedButton]}
                disabled={isPaired || isPairing}
                onPress={handlePairDevice} // <-- 🛠️ Call handlePairDevice onPress here
              >
                <View style={styles.deviceInfo}>
                  <View style={styles.icon}>
                    {isPaired ? (
                      <Animated.View style={{ transform: [{ scale: successAnim }] }}>
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                      </Animated.View>
                    ) : scannedDevice.deviceType === 'CAT' ? (
                      <FontAwesome5 name="cat" size={24} color="black" />
                    ) : (
                      <FontAwesome5 name="dog" size={24} color="black" />
                    )}
                  </View>
                  <View>
                    <Text style={styles.deviceButtonText}>{scannedDevice.deviceName}</Text>
                    <Text style={styles.deviceSubtitle}>
                      {isPaired ? 'Paired' : `Type: ${scannedDevice.deviceType}`}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isPaired && (
                <Animated.View style={[styles.successContainer, { opacity: successAnim }]}>
                  <Ionicons name="checkmark-done-circle" size={80} color="#4CAF50" />
                </Animated.View>
              )}

              <TouchableOpacity
                style={[styles.nextButton, !isPaired && styles.disabledButton]}
                onPress={() => router.push('/main/welcome')}
                disabled={!isPaired}
              >
                <Text style={styles.nextButtonText}>Continue to Dashboard</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F7' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  contentTop: { flex: 1, backgroundColor: 'white', borderBottomRightRadius: 30, borderBottomLeftRadius: 30, alignItems: 'center', justifyContent: 'center', gap: 30 },
  contentBottom: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, gap: 20 },
  circle: { justifyContent: 'center', alignItems: 'center' },
  outerCircle: { width: 540, height: 540, borderRadius: 400, backgroundColor: 'rgba(232,209,255,0.3)' },
  middleCircle: { width: 360, height: 360, borderRadius: 400, backgroundColor: 'rgba(232,209,255,0.4)' },
  innerCircle: { width: 180, height: 180, borderRadius: 400, backgroundColor: 'rgba(232,209,255,1)' },
  addButton: { width: 90, height: 90, borderRadius: 50, backgroundColor: '#C686FF', justifyContent: 'center', alignItems: 'center' },
  addButtonText: { fontFamily: 'Poppins-Medium', color: '#C686FF', fontSize: 18, fontWeight: '600' },
  deviceInfo: { justifyContent: 'space-between', flexDirection: 'row' },
  deviceButtonText: { fontFamily: 'Poppins-Medium', fontSize: 16, fontWeight: 'bold' },
  deviceSubtitle: { fontFamily: 'Poppins-Medium', fontSize: 14, color: 'gray' },
  icon: { alignItems: 'center', justifyContent: 'center', marginRight: 30 },
  nextButton: { width: width * 0.9, padding: 15, backgroundColor: '#C686FF', borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: 'gray' },
  nextButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', marginTop: 10 },
  successContainer: { marginTop: 20 },
  deviceButton: { width: width * 0.9, padding: 15, backgroundColor: '#FFFFFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pairedButton: { backgroundColor: '#E0FFE0' },
  scanText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '500',
  },
  cancelButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  frameOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  scanGuideText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Scan;
