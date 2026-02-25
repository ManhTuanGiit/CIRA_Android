/**
 * useCameraVM.ts
 * Camera ViewModel – self-contained, no native module dependencies.
 *
 * When react-native-vision-camera & image-picker are installed and linked,
 * replace the stubs below with real implementations.
 */

import { useState, useCallback } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

export type CameraFacing = 'front' | 'back';

export interface CameraVMState {
  /** Which camera is active */
  facing: CameraFacing;
  /** Flash on/off */
  flashOn: boolean;
  /** True while a capture is in progress */
  capturing: boolean;
  /** URI of taken / picked photo (null = still in viewfinder) */
  photoUri: string | null;
  /** Caption text the user typed */
  caption: string;
  /** Permission status */
  cameraPermission: 'granted' | 'denied' | 'undetermined';
}

export function useCameraVM() {
  const [state, setState] = useState<CameraVMState>({
    facing: 'back',
    flashOn: false,
    capturing: false,
    photoUri: null,
    caption: '',
    cameraPermission: 'undetermined',
  });

  /* ------------------------------------------------------------ */
  /*  Permission                                                   */
  /* ------------------------------------------------------------ */

  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Cira needs camera access to take photos',
            buttonPositive: 'OK',
          },
        );
        const status =
          granted === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied';
        setState(p => ({ ...p, cameraPermission: status }));
        return status === 'granted';
      } catch {
        return false;
      }
    }
    // iOS – assume granted (plist-based)
    setState(p => ({ ...p, cameraPermission: 'granted' }));
    return true;
  }, []);

  /* ------------------------------------------------------------ */
  /*  Camera controls                                              */
  /* ------------------------------------------------------------ */

  const toggleCamera = useCallback(() => {
    setState(p => ({
      ...p,
      facing: p.facing === 'back' ? 'front' : 'back',
    }));
  }, []);

  const toggleFlash = useCallback(() => {
    setState(p => ({ ...p, flashOn: !p.flashOn }));
  }, []);

  /* ------------------------------------------------------------ */
  /*  Capture (stub – replace with react-native-vision-camera)     */
  /* ------------------------------------------------------------ */

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    setState(p => ({ ...p, capturing: true }));

    // Simulate capture delay
    await new Promise(r => setTimeout(r, 300));

    // Stub: return a placeholder picsum image
    const uri = `https://picsum.photos/1080/1080?random=${Date.now()}`;
    setState(p => ({ ...p, capturing: false, photoUri: uri }));
    return uri;
  }, []);

  /* ------------------------------------------------------------ */
  /*  Gallery pick (stub – replace with react-native-image-picker) */
  /* ------------------------------------------------------------ */

  const pickFromGallery = useCallback(async (): Promise<string | null> => {
    // Stub – show alert explaining this is a preview
    Alert.alert(
      'Chọn ảnh',
      'Tính năng chọn ảnh từ thư viện sẽ sẵn sàng khi cài react-native-image-picker',
    );
    return null;
  }, []);

  /* ------------------------------------------------------------ */
  /*  Caption                                                      */
  /* ------------------------------------------------------------ */

  const setCaption = useCallback((text: string) => {
    setState(p => ({ ...p, caption: text }));
  }, []);

  /* ------------------------------------------------------------ */
  /*  Reset                                                        */
  /* ------------------------------------------------------------ */

  const clearPhoto = useCallback(() => {
    setState(p => ({ ...p, photoUri: null, caption: '' }));
  }, []);

  return {
    ...state,
    requestCameraPermission,
    toggleCamera,
    toggleFlash,
    capturePhoto,
    pickFromGallery,
    setCaption,
    clearPhoto,
  };
}
