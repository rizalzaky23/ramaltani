import { useState, useEffect, useCallback } from 'react';
import { DEMO_REGIONS } from '../data/mockData';

/**
 * Calculate distance between two coordinates using Haversine formula (in km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the closest BMKG region based on GPS coordinates
 */
export function findNearestBMKGRegion(latitude, longitude, regionList = DEMO_REGIONS) {
  if (!latitude || !longitude || !regionList || regionList.length === 0) {
    return regionList[0] || null;
  }

  let nearest = regionList[0];
  let minDistance = Infinity;

  for (const region of regionList) {
    const dist = calculateDistance(latitude, longitude, region.latitude, region.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...region, distanceKm: Math.round(dist * 10) / 10 };
    }
  }

  return nearest;
}

const STORAGE_KEY = 'ramaltani_gps_location';

export function useGPSLocation() {
  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionPrompted, setPermissionPrompted] = useState(() => {
    return Boolean(localStorage.getItem('ramaltani_gps_prompted'));
  });

  const nearestRegion = coords
    ? findNearestBMKGRegion(coords.latitude, coords.longitude)
    : (DEMO_REGIONS.find(r => r.id === 'reg-009') || DEMO_REGIONS[0]);

  const requestGPS = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Perangkat Anda tidak mendukung sensor lokasi GPS.');
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
            timestamp: new Date().toISOString(),
            isGPS: true,
          };

          const matchedRegion = findNearestBMKGRegion(newCoords.latitude, newCoords.longitude);
          const fullLocation = {
            ...newCoords,
            regionId: matchedRegion?.id || 'reg-009',
            regionName: matchedRegion?.name || 'Ngawi',
            province: matchedRegion?.province || 'Jawa Timur',
            distanceKm: matchedRegion?.distanceKm || 0,
          };

          setCoords(fullLocation);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fullLocation));
          localStorage.setItem('ramaltani_gps_prompted', 'true');
          setPermissionPrompted(true);
          setLoading(false);
          resolve(fullLocation);
        },
        (err) => {
          let msg = 'Gagal mendeteksi lokasi GPS.';
          if (err.code === err.PERMISSION_DENIED) {
            msg = 'Izin lokasi ditolak. Anda dapat memilih lokasi secara manual.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            msg = 'Sinyal GPS tidak tersedia saat ini.';
          } else if (err.code === err.TIMEOUT) {
            msg = 'Waktu permintaan lokasi GPS habis.';
          }

          setError(msg);
          localStorage.setItem('ramaltani_gps_prompted', 'true');
          setPermissionPrompted(true);
          setLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const setManualRegion = useCallback((regionId) => {
    const region = DEMO_REGIONS.find((r) => r.id === regionId) || DEMO_REGIONS[0];
    const manualLocation = {
      latitude: region.latitude,
      longitude: region.longitude,
      accuracy: 0,
      timestamp: new Date().toISOString(),
      isGPS: false,
      regionId: region.id,
      regionName: region.name,
      province: region.province,
      distanceKm: 0,
    };

    setCoords(manualLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manualLocation));
    localStorage.setItem('ramaltani_gps_prompted', 'true');
    setPermissionPrompted(true);
  }, []);

  const dismissPrompt = useCallback(() => {
    localStorage.setItem('ramaltani_gps_prompted', 'true');
    setPermissionPrompted(true);
  }, []);

  return {
    coords,
    nearestRegion,
    loading,
    error,
    permissionPrompted,
    requestGPS,
    setManualRegion,
    dismissPrompt,
  };
}
