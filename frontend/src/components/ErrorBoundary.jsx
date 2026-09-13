import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-semibold text-[#09090b] mb-2 tracking-tight">
            Gagal Memuat Komponen
          </h2>
          <p className="text-sm text-[#71717a] max-w-md mb-6 leading-relaxed">
            Terjadi kendala saat merender data BMKG atau peta geospasial. Silakan muat ulang halaman atau kembali ke beranda.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all shadow-sm"
            >
              <RotateCcw size={14} />
              <span>Muat Ulang</span>
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[#09090b] text-xs font-medium transition-all"
            >
              <Home size={14} />
              <span>Ke Beranda Petani</span>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
