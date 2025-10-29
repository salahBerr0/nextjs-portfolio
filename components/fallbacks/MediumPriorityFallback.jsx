'use client';

import { memo, useCallback, useMemo } from 'react';
import useComponentRetry from '@/hooks/useComponentRetry';

// Memoized SVG components
const WarningIcon = memo(() => (<svg className="w-10 h-10 text-purple-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>));
WarningIcon.displayName = 'WarningIcon';

const RefreshIcon = memo(() => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>));
RefreshIcon.displayName = 'RefreshIcon';

const LoadingSpinner = memo(() => (<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />));
LoadingSpinner.displayName = 'LoadingSpinner';

// Main component
const MediumPriorityFallback = memo(
    function MediumPriorityFallback({ componentName, onRetry }) {
        const { isRetrying, retry } = useComponentRetry(onRetry);
        const reloadPage = useCallback(() => {window.location.reload();}, []);
        // Memoized content - optimized dependency array
        const retryButtonContent = useMemo(() => {
            if (isRetrying) {
                return (
                    <div className="flex items-center gap-2">
                        <LoadingSpinner />Retrying...
                    </div>
                );
                }
                return (
                <span className="flex items-center gap-2">
                    <RefreshIcon />Retry {componentName}
                </span>
                );
        }, [isRetrying, componentName]);

  // Memoized class strings
  const classNames = useMemo(() => ({
    mainButton: [
      "relative bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl",
      "text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300",
      "shadow-2xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed group"
    ].join(' '),
    secondaryButton: [
      "border border-gray-600 text-gray-300 px-6 py-3 rounded-xl",
      "text-sm font-medium hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-300"
    ].join(' '),
  }), []);

  // Memoized text content to prevent string recreation
  const textContent = useMemo(() => ({
    title: `${componentName} Loading Issue`,
    footer: "If the issue persists, please try again later"
  }), [componentName]);

  return (
    <main role="alert" aria-live="polite" aria-busy={isRetrying} className='p-8 m-3 border border-gray-700/50 bg-gray-900/80 backdrop-blur-lg rounded-2xl text-center animate-fade-in'>
        <article role='' className="relative p-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse">
            <WarningIcon />
            <h3 className="text-gray-100 font-bold text-[22px]">{textContent.title}</h3>
        </article>
      
        <article className='grid content-center justify-items-center h-max w-full text-gray-400 mb-2'>
            <span>We're experiencing difficulties loading the section.</span>
            <span>This is usually temporary and can be resolved by retrying.</span>
        </article>

        <article className="flex gap-4 justify-center items-center flex-wrap">
            <button onClick={retry} disabled={isRetrying} className={classNames.mainButton} aria-label={`Retry loading ${componentName}`} aria-describedby="retry-description">{retryButtonContent}</button>
            <button onClick={reloadPage} disabled={isRetrying} className={classNames.secondaryButton} aria-label="Refresh entire page">Full Refresh</button>
        </article>
      
        <span className="text-gray-500 text-xs mt-6">{textContent.footer}</span>
    </main>
  );
});

MediumPriorityFallback.displayName = 'MediumPriorityFallback';

export default MediumPriorityFallback;