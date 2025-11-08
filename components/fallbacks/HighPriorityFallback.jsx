'use client';

import { memo, useCallback, useMemo } from 'react';

const HighPriorityFallback = memo(function HighPriorityFallback({ componentName }) {
  const retry = useCallback(() => {
    window.location.reload();
  }, []);

  const classNames = useMemo(() => ({
    container: [
      "w-full py-3 px-4 bg-black/95 border border-red-800/60",
      "backdrop-blur-md flex flex-wrap items-center justify-center gap-3",
      "shadow-xl shadow-red-500/15 hover:shadow-red-500/25 transition-shadow duration-300"
    ].join(' '),
    button: [
      "bg-red-900/40 text-gray-100 px-4 py-1.5 rounded-md text-sm",
      "border border-red-700/40 hover:bg-red-800/50 transition-all duration-200",
      "hover:scale-105 active:scale-95"
    ].join(' ')
  }), []);

  return (
    <section role="alert" aria-live="assertive" className={classNames.container}>
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      
      <div className="flex items-center gap-2">
        <h3 className="text-red-400 font-semibold text-sm">{componentName} Failed</h3>
        <span className="text-red-500">•</span>
        <p className="text-red-300/70 text-xs">Critical functionality affected</p>
      </div>

      <button onClick={retry} className={classNames.button}>Reload</button>
    </section>
  );
});

HighPriorityFallback.displayName = 'HighPriorityFallback';
export default HighPriorityFallback;