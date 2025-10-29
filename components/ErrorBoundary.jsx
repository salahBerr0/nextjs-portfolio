'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
    console.log('Component that failed:', this.props.componentName);

  }

  retry = () => {
    this.setState({ hasError: false, error: null });
    console.log(`User retried: ${this.props.componentName}`);

  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <main className="p-4 border border-red-300 bg-red-50 rounded-lg grid content-center justify-items-center gap-3 z-50">
            <div role="textbox" aria-label="alert of website won't work" className="text-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl mb-2"></i>
              <h3 className="text-red-800 font-semibold mb-1">{this.props.componentName || 'Component'} Failed to Load</h3>
              <p className="text-red-600 text-sm mb-3 max-w-md">{this.state.error?.message || 'Something went wrong'}</p>
            </div>
            <div role="button" aria-label="refresh buttons" className="flex gap-2">
              <button onClick={this.retry} className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition-colors">Try Again</button>
              <button onClick={() => window.location.reload()} className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 transition-colors">Reload Page</button>
            </div>
          </main>
        )
      );
    }

    return this.props.children;
  }
}