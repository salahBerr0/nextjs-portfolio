export default function LowPriorityFallback({ componentName }) {
  return (
    <div role="alert" aria-live="assertive" className="p-2 bg-black w-full text-gray-500 text-center text-sm flex content-center justify-center gap-1">
      <i className="fas fa-exclamation-triangle mt-1 opacity-50 content-center"></i>
      <span className="text-center content-center">{componentName} temporarily unavailable</span>
    </div>
  );
}