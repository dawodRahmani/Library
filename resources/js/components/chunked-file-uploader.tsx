import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileVideo, Music, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadInChunks, MAX_UPLOAD_BYTES, type ChunkUploadResult } from '@/lib/chunk-upload';

type Variant = 'video' | 'audio' | 'media';

interface ExistingFile {
    size?: number | null;
    label?: string;
    downloadHref?: string;
}

interface Props {
    label?: string;
    accept?: string;
    variant?: Variant;
    existing?: ExistingFile | null;
    onUploaded: (result: ChunkUploadResult) => void;
    onCleared: () => void;
    helperText?: string;
    error?: string;
}

function formatBytes(bytes: number | null | undefined): string {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

const ACCEPT_MAP: Record<Variant, string> = {
    video: '.mp4,.webm,.mov,.avi,.mkv,.m4v',
    audio: '.mp3,.wav,.ogg,.m4a,.aac,.flac',
    media: '.mp4,.webm,.mov,.avi,.mkv,.m4v,.mp3,.wav,.ogg,.m4a,.aac,.flac',
};

export function ChunkedFileUploader({
    label = 'فایل',
    accept,
    variant = 'video',
    existing,
    onUploaded,
    onCleared,
    helperText,
    error,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedName, setUploadedName] = useState<string | null>(null);
    const [uploadedSize, setUploadedSize] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const Icon = variant === 'audio' ? Music : FileVideo;
    const resolvedAccept = accept ?? ACCEPT_MAP[variant];

    const onFileSelected = useCallback(
        async (file: File) => {
            setErrorMsg(null);

            if (file.size > MAX_UPLOAD_BYTES) {
                setErrorMsg('فایل از حد مجاز ۱ گیگابایت بزرگ‌تر است.');
                if (inputRef.current) inputRef.current.value = '';
                return;
            }

            abortRef.current?.abort();
            const ctrl = new AbortController();
            abortRef.current = ctrl;

            setUploading(true);
            setProgress(0);
            setUploadedName(null);
            setUploadedSize(null);

            try {
                const result = await uploadInChunks({
                    file,
                    onProgress: (loaded, total) => {
                        setProgress(total ? Math.round((loaded / total) * 100) : 0);
                    },
                    signal: ctrl.signal,
                });
                setUploadedName(file.name);
                setUploadedSize(result.size);
                onUploaded(result);
            } catch (err) {
                if ((err as DOMException)?.name === 'AbortError') {
                    setErrorMsg('آپلود لغو شد.');
                } else {
                    setErrorMsg((err as Error).message || 'آپلود ناموفق بود.');
                }
            } finally {
                setUploading(false);
                abortRef.current = null;
            }
        },
        [onUploaded],
    );

    function cancel() {
        abortRef.current?.abort();
        abortRef.current = null;
        setUploading(false);
        setProgress(0);
        setUploadedName(null);
        setUploadedSize(null);
        if (inputRef.current) inputRef.current.value = '';
        onCleared();
        setErrorMsg(null);
    }

    const hasUploaded = !!uploadedName;
    const displayError = error || errorMsg;

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">{label}</Label>

            {existing && !hasUploaded && !uploading && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-violet-200 bg-violet-50">
                    <Icon className="w-4 h-4 text-violet-600 shrink-0" />
                    <div className="flex-1 min-w-0 text-sm">
                        <p className="font-medium text-violet-700 truncate">
                            {existing.label ?? 'فایل موجود'}
                        </p>
                        <p className="text-xs text-violet-500">
                            {formatBytes(existing.size)} {existing.size ? '— ' : ''}آپلود جدید جایگزین می‌شود
                        </p>
                    </div>
                    {existing.downloadHref && (
                        <a
                            href={existing.downloadHref}
                            className="text-xs text-violet-600 hover:underline"
                        >
                            دانلود
                        </a>
                    )}
                </div>
            )}

            {hasUploaded && !uploading && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-200 bg-emerald-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0 text-sm">
                        <p className="font-medium text-emerald-700 truncate">{uploadedName}</p>
                        <p className="text-xs text-emerald-600">
                            {formatBytes(uploadedSize)} — آماده برای ذخیره
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={cancel}
                        className="text-emerald-600 hover:text-emerald-800"
                        aria-label="حذف"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {uploading && (
                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 font-medium">در حال آپلود قطعه‌ای…</span>
                        <button
                            type="button"
                            onClick={cancel}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            لغو
                        </button>
                    </div>
                    <div className="h-2 w-full bg-blue-100 rounded overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-blue-600 text-end">{progress}%</p>
                </div>
            )}

            {!uploading && (
                <div
                    onClick={() => inputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
                >
                    <Upload className="w-5 h-5 mx-auto mb-1.5 text-gray-400" />
                    <p className="text-sm text-gray-500">
                        {hasUploaded ? 'برای جایگزینی فایل کلیک کنید' : 'برای آپلود کلیک کنید'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {helperText ?? 'حداکثر ۱ گیگابایت — آپلود قطعه‌ای'}
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={resolvedAccept}
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onFileSelected(f);
                }}
            />

            {displayError && (
                <div className="flex items-start gap-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{displayError}</span>
                </div>
            )}
        </div>
    );
}

// Compact variant used inline (no card UI); shows just a button + status row.
export function ChunkedFileUploaderInline({
    accept,
    variant = 'video',
    existing,
    onUploaded,
    onCleared,
    error,
    helperText,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedName, setUploadedName] = useState<string | null>(null);
    const [uploadedSize, setUploadedSize] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const resolvedAccept = accept ?? ACCEPT_MAP[variant];

    async function onPick(file: File) {
        setErrorMsg(null);
        if (file.size > MAX_UPLOAD_BYTES) {
            setErrorMsg('فایل از حد مجاز ۱ گیگابایت بزرگ‌تر است.');
            if (inputRef.current) inputRef.current.value = '';
            return;
        }
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        setUploading(true);
        setProgress(0);
        setUploadedName(null);
        setUploadedSize(null);
        try {
            const result = await uploadInChunks({
                file,
                onProgress: (loaded, total) => {
                    setProgress(total ? Math.round((loaded / total) * 100) : 0);
                },
                signal: ctrl.signal,
            });
            setUploadedName(file.name);
            setUploadedSize(result.size);
            onUploaded(result);
        } catch (err) {
            if ((err as DOMException)?.name === 'AbortError') {
                setErrorMsg('آپلود لغو شد.');
            } else {
                setErrorMsg((err as Error).message || 'آپلود ناموفق بود.');
            }
        } finally {
            setUploading(false);
            abortRef.current = null;
        }
    }

    function clear() {
        abortRef.current?.abort();
        setUploading(false);
        setProgress(0);
        setUploadedName(null);
        setUploadedSize(null);
        if (inputRef.current) inputRef.current.value = '';
        onCleared();
        setErrorMsg(null);
    }

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept={resolvedAccept}
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onPick(f);
                }}
            />
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                >
                    <Upload className="w-4 h-4 me-1.5" />
                    {uploading ? 'در حال آپلود...' : uploadedName ? 'جایگزینی فایل' : 'انتخاب فایل'}
                </Button>

                {uploadedName && !uploading && (
                    <span className="text-xs text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {uploadedName} — {formatBytes(uploadedSize)}
                        <button
                            type="button"
                            onClick={clear}
                            className="ms-1 text-red-500 hover:underline"
                        >
                            <X className="w-3 h-3 inline" /> لغو
                        </button>
                    </span>
                )}

                {!uploadedName && !uploading && existing?.size && (
                    <span className="text-xs text-gray-500">
                        فایل فعلی موجود است ({formatBytes(existing.size)})
                    </span>
                )}
            </div>

            {uploading && (
                <div className="space-y-1">
                    <div className="h-2 w-full bg-blue-100 rounded overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-blue-600">
                        <span>{progress}%</span>
                        <button type="button" onClick={clear} className="hover:underline">
                            لغو آپلود
                        </button>
                    </div>
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                {helperText ?? 'حداکثر ۱ گیگابایت — آپلود قطعه‌ای.'}
            </p>

            {(error || errorMsg) && (
                <div className="flex items-start gap-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{error || errorMsg}</span>
                </div>
            )}
        </div>
    );
}
