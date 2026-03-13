import { memo } from 'react';

// Uses opacity animation on a static gradient — MUCH cheaper than box-shadow animation
const Heartbeat = memo(function Heartbeat() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] gpu-accelerated"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(120,0,0,0.4) 0%, transparent 70%)',
        animation: 'heartbeatScreen 2s ease-in-out infinite',
      }}
    />
  );
});

export default Heartbeat;
