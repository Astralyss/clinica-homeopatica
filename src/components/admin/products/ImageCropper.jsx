"use client"
import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Slider } from '@mui/material'
import { X, Check } from 'lucide-react'

// Utilidad para obtener el blob recortado
function getCroppedImg(imageSrc, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    };
    image.onerror = reject;
  });
}

export default function ImageCropper({ image, open, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels)
      onCropComplete(croppedBlob)
    } catch (err) {
      alert('Error al recortar la imagen')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative flex flex-col items-center">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <div className="w-64 h-64 relative bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid={true}
            minZoom={1}
            maxZoom={3}
          />
        </div>
        <div className="w-full mt-4 flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Zoom</label>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            onChange={(_, value) => setZoom(value)}
            sx={{ width: 180 }}
          />
        </div>
        <button
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          onClick={handleConfirm}
          disabled={loading}
        >
          <Check size={20} />
          {loading ? 'Procesando...' : 'Recortar y usar imagen'}
        </button>
      </div>
    </div>
  )
} 