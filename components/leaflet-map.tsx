'use client'

import { useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet icon fix
const icon = L.icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = icon

const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom)
  }, [center, zoom, map])
  return null
}

const DraggableMarker = ({ position, onDragEnd }: any) => {
  const markerRef = useRef<any>(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const newPos = marker.getLatLng()
          onDragEnd(newPos.lat, newPos.lng)
        }
      },
    }),
    [onDragEnd],
  )
  return <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />
}

export default function LeafletMap({ center, zoom, markerPos, onMarkerMove }: any) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onMapClick={onMarkerMove} />
      <MapController center={center} zoom={zoom} />
      {markerPos && <DraggableMarker position={markerPos} onDragEnd={onMarkerMove} />}
    </MapContainer>
  )
}
