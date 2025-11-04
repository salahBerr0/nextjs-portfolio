'use client';
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(
  () => import('./ThreeBackground'),
  { 
    ssr: false,
    loading: () => <div className="fixed inset-0 -z-10 bg-black" />
  }
);

export default function ThreeBackgroundWrapper() {
  return <ThreeBackground />;
}