'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

export interface PlaceResult {
  description: string
  lat: number
  lng: number
}

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, opts?: Record<string, unknown>) => {
            addListener: (event: string, cb: () => void) => void
            getPlace: () => {
              formatted_address?: string
              geometry?: { location: { lat: () => number; lng: () => number } }
            }
          }
        }
      }
    }
    __aumvedaPlacesLoading?: Promise<void>
  }
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (window.google?.maps?.places) return Promise.resolve()
  if (window.__aumvedaPlacesLoading) return window.__aumvedaPlacesLoading

  window.__aumvedaPlacesLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Places script'))
    document.head.appendChild(script)
  })

  return window.__aumvedaPlacesLoading
}

/**
 * Progressive enhancement: wires Google Places Autocomplete onto the given input ref
 * when NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is configured. Without a key, the input stays
 * a plain text field — Step 6 never hard-blocks on this integration being present.
 */
export function usePlacesAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  onSelect: (result: PlaceResult) => void,
) {
  const [available, setAvailable] = useState(false)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
    if (!apiKey || !inputRef.current) return

    let cancelled = false
    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places) return
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['(cities)'],
          fields: ['formatted_address', 'geometry'],
        })
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry?.location) return
          onSelectRef.current({
            description: place.formatted_address ?? '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          })
        })
        setAvailable(true)
      })
      .catch((err) => {
        console.warn('[usePlacesAutocomplete] Falling back to plain text input:', err)
      })

    return () => {
      cancelled = true
    }
  }, [inputRef])

  return { available }
}
