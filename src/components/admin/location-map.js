"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

export default function LocationMap({ latitude, longitude, onLocationChange }) {
  const lat = parseFloat(latitude) || 51.5134
  const lng = parseFloat(longitude) || -0.1384
  const [position, setPosition] = useState([lat, lng])
  const markerRef = useRef(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const newPos = marker.getLatLng()
          setPosition([newPos.lat, newPos.lng])
          if (onLocationChange) {
            onLocationChange(newPos.lat.toFixed(6), newPos.lng.toFixed(6))
          }
        }
      },
    }),
    [onLocationChange]
  )

  useEffect(() => {
    setPosition([parseFloat(latitude) || 51.5134, parseFloat(longitude) || -0.1384])
  }, [latitude, longitude])

  return (
    <div className="w-full h-full [&_.leaflet-container]:z-0 [&_.leaflet-pane]:z-0 [&_.leaflet-top]:z-10 [&_.leaflet-bottom]:z-10">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={position[0]} lng={position[1]} />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
        />
      </MapContainer>
    </div>
  )
}
