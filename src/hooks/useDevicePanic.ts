import { useEffect, useCallback } from 'react';

export function useDevicePanic(onPanic: () => void) {
  // Shake detection
  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const threshold = 15;
    const { x, y, z } = acc;
    const acceleration = Math.sqrt((x ?? 0) ** 2 + (y ?? 0) ** 2 + (z ?? 0) ** 2);

    if (acceleration > threshold) {
      onPanic();
    }
  }, [onPanic]);

  // Flip detection (Face-down)
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const { beta } = event; // beta is front-to-back tilt in degrees, [-180,180]
    // Normally face up is beta around 0-30 depending on how it's held.
    // Face-down is roughly 180 or -180.
    if (beta !== null && (Math.abs(beta) > 170)) {
      onPanic();
    }
  }, [onPanic]);

  useEffect(() => {
    // Check for permissions on iOS
    const requestPermission = async () => {
      // @ts-ignore
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          // @ts-ignore
          const response = await DeviceMotionEvent.requestPermission();
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        } catch (e) {
          console.error('Motion permission denied');
        }
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }

      // @ts-ignore
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          // @ts-ignore
          const response = await DeviceOrientationEvent.requestPermission();
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (e) {
          console.error('Orientation permission denied');
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleMotion, handleOrientation]);
}
