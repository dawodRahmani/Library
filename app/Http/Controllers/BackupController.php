<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Storage;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZipArchive;

class BackupController extends Controller
{
    private const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'ico'];
    private const VIDEO_EXTS = ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v', 'flv', 'wmv'];

    /** Download the raw sqlite database file */
    public function downloadDatabase(): BinaryFileResponse|HttpResponse
    {
        $path = database_path('database.sqlite');
        if (! file_exists($path)) {
            abort(404, 'Database file not found.');
        }

        $filename = 'database-' . now()->format('Y-m-d-His') . '.sqlite';

        return response()->download($path, $filename, [
            'Content-Type' => 'application/x-sqlite3',
        ]);
    }

    /** Zip all images under storage/app/public and stream the archive */
    public function downloadImages(): StreamedResponse|HttpResponse
    {
        return $this->zipAndStream(
            self::IMAGE_EXTS,
            'images-' . now()->format('Y-m-d-His') . '.zip'
        );
    }

    /** Zip all videos under storage/app/public and stream the archive */
    public function downloadVideos(): StreamedResponse|HttpResponse
    {
        return $this->zipAndStream(
            self::VIDEO_EXTS,
            'videos-' . now()->format('Y-m-d-His') . '.zip'
        );
    }

    private function zipAndStream(array $extensions, string $downloadName): StreamedResponse|HttpResponse
    {
        $root = Storage::disk('public')->path('');
        if (! is_dir($root)) {
            abort(404, 'Storage directory not found.');
        }

        if (! class_exists(ZipArchive::class)) {
            abort(500, 'PHP zip extension is not available.');
        }

        $tmp = tempnam(sys_get_temp_dir(), 'backup_');
        $zip = new ZipArchive();
        if ($zip->open($tmp, ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Could not create zip archive.');
        }

        $extSet = array_flip(array_map('strtolower', $extensions));
        $added  = 0;

        $iter = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($iter as $file) {
            if (! $file->isFile()) {
                continue;
            }
            $ext = strtolower($file->getExtension());
            if (! isset($extSet[$ext])) {
                continue;
            }
            $relative = ltrim(str_replace('\\', '/', substr($file->getPathname(), strlen($root))), '/');
            $zip->addFile($file->getPathname(), $relative);
            $added++;
        }

        $zip->close();

        if ($added === 0) {
            @unlink($tmp);

            return response('هیچ فایلی برای دانلود یافت نشد.', 404);
        }

        return response()->streamDownload(function () use ($tmp) {
            $fp = fopen($tmp, 'rb');
            if ($fp) {
                while (! feof($fp)) {
                    echo fread($fp, 1024 * 64);
                    flush();
                }
                fclose($fp);
            }
            @unlink($tmp);
        }, $downloadName, [
            'Content-Type' => 'application/zip',
        ]);
    }
}
