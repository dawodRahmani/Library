export const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1 GiB
export const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024;  // 5 MiB

export interface ChunkUploadResult {
    temp_path: string;
    size: number;
    name: string;
}

export interface ChunkUploadOptions {
    file: File;
    url?: string;
    chunkSize?: number;
    onProgress?: (loaded: number, total: number) => void;
    signal?: AbortSignal;
}

function getCookie(name: string): string {
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
}

function randomId(): string {
    const c = (globalThis.crypto as Crypto | undefined);
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
        const r = (Math.random() * 16) | 0;
        const v = ch === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export async function uploadInChunks(opts: ChunkUploadOptions): Promise<ChunkUploadResult> {
    const {
        file,
        url = '/admin/uploads/chunk',
        chunkSize = DEFAULT_CHUNK_SIZE,
        onProgress,
        signal,
    } = opts;

    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error('فایل از حد مجاز ۱ گیگابایت بزرگ‌تر است.');
    }

    const uploadId = randomId();
    const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
    let result: ChunkUploadResult | null = null;

    for (let i = 0; i < totalChunks; i++) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const fd = new FormData();
        fd.append('upload_id', uploadId);
        fd.append('chunk_index', String(i));
        fd.append('total_chunks', String(totalChunks));
        fd.append('filename', file.name);
        fd.append('chunk', chunk, 'chunk');

        const xsrf = getCookie('XSRF-TOKEN');

        const res = await fetch(url, {
            method: 'POST',
            body: fd,
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
            },
            signal,
        });

        if (!res.ok) {
            let message = `آپلود قطعه ${i + 1} ناموفق بود.`;
            try {
                const err = await res.json();
                if (err?.message) message = err.message;
            } catch {
                /* ignore */
            }
            throw new Error(message);
        }

        onProgress?.(end, file.size);

        const data = (await res.json()) as Partial<ChunkUploadResult> & { done?: boolean };
        if (data.done && data.temp_path && typeof data.size === 'number') {
            result = {
                temp_path: data.temp_path,
                size: data.size,
                name: data.name ?? file.name,
            };
        }
    }

    if (!result) {
        throw new Error('آپلود به پایان نرسید.');
    }
    return result;
}
