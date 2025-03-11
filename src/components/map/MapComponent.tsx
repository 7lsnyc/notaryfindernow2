"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { NotaryBase } from '@/lib/supabase';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Notary } from '@/types'

declare global {
  interface Window {
    google: typeof google;
  }
}

export interface MapProps {
  notaries: Notary[];
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  onMarkerClick?: (notaryId: string) => void;
  className?: string;
}

export function MapComponent({ notaries, center, zoom = 12, onMarkerClick, className = '' }: MapProps) {
  const { isLoaded: jsApiLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    // Clean up markers
    if (markersRef.current) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    setMap(null);
    setIsLoaded(false);
  }, []);

  const updateMarkers = useCallback(() => {
    if (!map) return;

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }

    // Create new markers
    const newMarkers = notaries.map(notary => {
      const marker = new google.maps.Marker({
        position: { lat: notary.latitude, lng: notary.longitude },
        map,
        title: notary.name,
      });

      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(notary.id);
        }
        
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px; font-weight: bold;">${notary.name}</h3>
              <p style="margin: 0 0 4px;">Rating: ${notary.rating} ⭐️</p>
              <p style="margin: 0;">${notary.address}</p>
            </div>
          `,
        });
        infoWindow.open(map, marker);
      });

      return marker;
    });

    markersRef.current = newMarkers;
  }, [map, notaries, onMarkerClick]);

  // Update markers when dependencies change
  useEffect(() => {
    if (map && notaries.length > 0) {
      updateMarkers();
    }
    
    // Cleanup function
    return () => {
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, [map, notaries, updateMarkers]);

  // Update center when it changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [map, center]);

  if (!jsApiLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full bg-red-50 rounded-lg flex items-center justify-center p-4">
        <p className="text-red-500">Error loading Google Maps</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName={`w-full h-full min-h-[400px] rounded-lg ${className}`}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
      }}
    />
  );
} 