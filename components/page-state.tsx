import { AlertCircle, LoaderCircle } from "lucide-react";
export function LoadingState() { return <div className="page-state"><LoaderCircle className="animate-spin"/><p>Loading your sentences…</p></div>; }
export function ErrorBanner({ message }: { message: string }) { return <div className="error-banner" role="alert"><AlertCircle/>{message}</div>; }
export function DatabaseErrorState({ message }: { message: string }) { return <div className="page-state database-error" role="alert"><AlertCircle/><h1>Database setup required</h1><p>{message}</p><code>DATABASE_URL=postgresql://...</code><small>`.env.local`을 저장한 뒤 개발 서버를 다시 시작하세요.</small></div>; }
