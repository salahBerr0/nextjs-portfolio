'use client';

import { memo, useCallback, useMemo } from 'react';

// Memoized SVG components
const CriticalErrorIcon = memo(() => (<svg className="w-24 h-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>));
CriticalErrorIcon.displayName = 'CriticalErrorIcon';

const RefreshIcon = memo(() => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>));
RefreshIcon.displayName = 'RefreshIcon';

// Main component
const CriticalFallback = memo(function CriticalFallback() {
  const refreshPage = useCallback(() => {window.location.reload();}, []);

  // Memoized class strings
  const classNames = useMemo(() => ({
    container: [
      "min-h-screen flex items-center justify-center",
      "bg-gradient-to-br from-gray-900 via-black to-gray-900",
      "relative overflow-hidden"
    ].join(' '),
    content: [
      "text-center grid content-center z-10 p-8 max-w-md mx-4",
      "backdrop-blur-xl bg-gray-900/60 border border-gray-700/50",
      "rounded-3xl shadow-2xl shadow-red-500/10",
      "animate-fade-in-up"
    ].join(' '),
    button: [
      "bg-gradient-to-r from-red-600 to-red-700 text-white",
      "px-8 py-3 rounded-xl flex items-center justify-center font-medium flex items-center gap-3",
      "hover:from-red-700 hover:to-red-800 transition-all duration-300",
      "hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25",
      "active:scale-95 border border-red-500/30",
      "group"
    ].join(' '),
    emergencyPulse: [
      "absolute top-8 right-8 w-3 h-3 bg-red-500 rounded-full",
      "animate-ping shadow-lg shadow-red-500"
    ].join(' ')
  }), []);

  // Animated background elements
  const backgroundElements = useMemo(() => (
    <>
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
    </>
  ), []);

  return (
    <main className={classNames.container} role="alert" aria-live="assertive" aria-label="Critical error - website unavailable">
      {backgroundElements}
      {/* Emergency indicator */}
      <div className={classNames.emergencyPulse} aria-hidden="true"></div>
      <div className={classNames.content}>
        {/* Critical Error Icon */}
        <article className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
          <CriticalErrorIcon />
        </article>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Critical System Error</h1>
        <article className="space-y-3 mb-8">
          <p className="text-gray-300 text-lg font-medium">Website Temporarily Unavailable</p>
          <p className="text-gray-400 text-sm leading-relaxed">We've encountered a critical error that requires a full page refresh. This is usually resolved quickly.</p>
        </article>

        {/* Action Button */}
        <button onClick={refreshPage} className={classNames.button} aria-label="Refresh website to resolve critical error">
          <RefreshIcon />
          <span className="group-hover:scale-110 transition-transform duration-200">Refresh Page</span>
        </button>

        {/* Technical Info */}
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <p className="text-gray-500 text-xs">If this persists, please check your connection or try again later</p>
          <p className="text-red-400/60 text-xs mt-2 font-mono">ERR_CRITICAL_FAILURE</p>
        </div>
      </div>
    </main>
  );
});

CriticalFallback.displayName = 'CriticalFallback';

export default CriticalFallback;