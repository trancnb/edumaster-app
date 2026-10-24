import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EduMaster Global Boundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear potentially corrupted workspace/session cache
      localStorage.removeItem('edtech_active_selected_grade_v2');
      localStorage.removeItem('edtech_khbd_version_history');
    } catch (e) {
      console.warn(e);
    }
    window.location.reload();
  };

  private handleClearAll = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Hệ thống đang tự động khôi phục</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đã phát hiện một gián đoạn tạm thời trong quá trình nạp dữ liệu. Bạn có thể tải lại an toàn hoặc khôi phục về trạng thái chuẩn chỉ với một chạm.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-black/50 rounded-xl border border-slate-700/60 text-left overflow-x-auto">
                <code className="text-[11px] font-mono text-amber-300 break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải lại và khôi phục phiên làm việc</span>
              </button>

              <button
                onClick={this.handleClearAll}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Đặt lại dữ liệu gốc mặc định (Khuyên dùng khi lỗi lặp lại)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
