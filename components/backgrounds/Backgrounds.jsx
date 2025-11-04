// components/Backgrounds.jsx
import dynamic from 'next/dynamic';

// Load immediately but non-blocking
const StarsBackground = dynamic(() => import('@/components/backgrounds/StarsBackground'), {
  loading: () => null
});

const ThreeBackgroundWrapper = dynamic(() => import('@/components//backgrounds/ThreeBackgroundWrapper'), {
  loading: () => null
});

export default function Backgrounds() {
  return (
    <div className="fixed inset-0 z-[-1]" role="presentation" aria-hidden="true">
      <StarsBackground />
      <ThreeBackgroundWrapper />
    </div>
  );
}