'use client';

import { Minus, Plus } from 'lucide-react';

interface ZoomControlProps {
  zoom: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (zoom: number) => void;
}

export default function ZoomControl({
  zoom,
  min = 0.5,
  max = 4,
  step = 0.05,
  onChange,
}: ZoomControlProps) {
  const decrementZoom = () => {
    const newZoom = Math.max(min, parseFloat((zoom - step * 4).toFixed(3)));
    onChange(newZoom);
  };

  const incrementZoom = () => {
    const newZoom = Math.min(max, parseFloat((zoom + step * 4).toFixed(3)));
    onChange(newZoom);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(min, Math.min(max, parseFloat(e.target.value)));
    onChange(val);
  };

  const percentage =
    max > min ? Math.max(0, Math.min(100, Math.round(((zoom - min) / (max - min)) * 100))) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="control-label">Zoom</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(37,99,235,0.15)',
            color: '#93c5fd',
            border: '1px solid rgba(59,130,246,0.25)',
          }}
        >
          {zoom.toFixed(2)}×
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Decrease button */}
        <button
          onClick={decrementZoom}
          disabled={zoom <= min + 0.001}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{
            background: 'rgba(37,99,235,0.12)',
            border: '1px solid rgba(59,130,246,0.25)',
            color: zoom <= min + 0.001 ? 'rgba(59,130,246,0.3)' : '#93c5fd',
            cursor: zoom <= min + 0.001 ? 'not-allowed' : 'pointer',
          }}
          aria-label="Giảm zoom"
        >
          <Minus size={14} />
        </button>

        {/* Slider */}
        <input
          type="range"
          className="range-slider flex-1"
          min={min}
          max={max}
          step={step}
          value={zoom}
          onChange={handleSliderChange}
          aria-label={`Zoom: ${zoom.toFixed(1)}x`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={zoom}
          style={{
            background: `linear-gradient(to right, #2563eb ${percentage}%, rgba(59,130,246,0.2) ${percentage}%)`,
          }}
        />

        {/* Increase button */}
        <button
          onClick={incrementZoom}
          disabled={zoom >= max - 0.001}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
          style={{
            background: 'rgba(37,99,235,0.12)',
            border: '1px solid rgba(59,130,246,0.25)',
            color: zoom >= max - 0.001 ? 'rgba(59,130,246,0.3)' : '#93c5fd',
            cursor: zoom >= max - 0.001 ? 'not-allowed' : 'pointer',
          }}
          aria-label="Tăng zoom"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Zoom markers */}
      <div className="flex justify-between mt-1.5">
        <span className="text-xs" style={{ color: 'rgba(59,130,246,0.5)' }}>
          {min.toFixed(2)}×
        </span>
        <span className="text-xs" style={{ color: 'rgba(59,130,246,0.5)' }}>
          {max.toFixed(1)}×
        </span>
      </div>
    </div>
  );
}
