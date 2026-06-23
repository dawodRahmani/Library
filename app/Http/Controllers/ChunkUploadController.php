<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ChunkUploadController extends Controller
{
    public const MAX_BYTES = 1073741824; // 1 GiB

    public const ALLOWED_EXTENSIONS = [
        'mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v',
        'mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac',
    ];

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'upload_id'    => ['required', 'string', 'regex:/^[a-f0-9-]{8,64}$/i'],
            'chunk_index'  => ['required', 'integer', 'min:0'],
            'total_chunks' => ['required', 'integer', 'min:1', 'max:10000'],
            'filename'     => ['required', 'string', 'max:255'],
            'chunk'        => ['required', 'file'],
        ]);

        if ($data['chunk_index'] >= $data['total_chunks']) {
            return response()->json(['message' => 'Invalid chunk index.'], 422);
        }

        $ext = strtolower(pathinfo($data['filename'], PATHINFO_EXTENSION));
        if (! in_array($ext, self::ALLOWED_EXTENSIONS, true)) {
            return response()->json(['message' => 'File type not allowed.'], 422);
        }

        $uploadId = strtolower($data['upload_id']);
        $chunkDir = storage_path("app/chunks/{$uploadId}");
        if (! is_dir($chunkDir)) {
            File::makeDirectory($chunkDir, 0755, true);
        }

        $chunkPath = $chunkDir . DIRECTORY_SEPARATOR . $data['chunk_index'];
        $request->file('chunk')->move($chunkDir, (string) $data['chunk_index']);

        if (! file_exists($chunkPath)) {
            return response()->json(['message' => 'Chunk save failed.'], 500);
        }

        // Sum bytes received so far and bail out if we exceed the cap.
        $receivedBytes = 0;
        for ($i = 0; $i < $data['total_chunks']; $i++) {
            $p = $chunkDir . DIRECTORY_SEPARATOR . $i;
            if (file_exists($p)) {
                $receivedBytes += filesize($p);
            }
        }

        if ($receivedBytes > self::MAX_BYTES) {
            File::deleteDirectory($chunkDir);
            return response()->json(['message' => 'File exceeds 1 GB limit.'], 422);
        }

        $allReceived = true;
        for ($i = 0; $i < $data['total_chunks']; $i++) {
            if (! file_exists($chunkDir . DIRECTORY_SEPARATOR . $i)) {
                $allReceived = false;
                break;
            }
        }

        if (! $allReceived) {
            return response()->json([
                'done'     => false,
                'received' => $data['chunk_index'] + 1,
                'total'    => $data['total_chunks'],
            ]);
        }

        // Assemble final file.
        $tempDir = storage_path('app/temp-uploads');
        if (! is_dir($tempDir)) {
            File::makeDirectory($tempDir, 0755, true);
        }

        $finalName = $uploadId . '.' . $ext;
        $finalPath = $tempDir . DIRECTORY_SEPARATOR . $finalName;

        $out = fopen($finalPath, 'wb');
        if (! $out) {
            File::deleteDirectory($chunkDir);
            return response()->json(['message' => 'Cannot open final file.'], 500);
        }

        for ($i = 0; $i < $data['total_chunks']; $i++) {
            $partPath = $chunkDir . DIRECTORY_SEPARATOR . $i;
            $in = fopen($partPath, 'rb');
            if (! $in) {
                fclose($out);
                @unlink($finalPath);
                File::deleteDirectory($chunkDir);
                return response()->json(['message' => 'Cannot read chunk.'], 500);
            }
            stream_copy_to_stream($in, $out);
            fclose($in);
        }
        fclose($out);

        File::deleteDirectory($chunkDir);

        $size = filesize($finalPath);
        if ($size > self::MAX_BYTES) {
            @unlink($finalPath);
            return response()->json(['message' => 'File exceeds 1 GB limit.'], 422);
        }

        return response()->json([
            'done'      => true,
            'temp_path' => "temp-uploads/{$finalName}",
            'size'      => $size,
            'name'      => Str::limit(basename($data['filename']), 250),
        ]);
    }

    /**
     * Validate a client-supplied temp_file_path, move it to the public disk under $targetDir,
     * and return [final relative public path, size in bytes]. Returns null if the path is
     * missing or invalid.
     *
     * @return array{0:string,1:int}|null
     */
    public static function consumeTempFile(?string $tempFilePath, string $targetDir): ?array
    {
        if (! $tempFilePath || ! is_string($tempFilePath)) {
            return null;
        }

        if (! preg_match('#^temp-uploads/[a-f0-9-]{8,64}\.[a-z0-9]+$#', $tempFilePath)) {
            return null;
        }

        $abs = storage_path('app/' . $tempFilePath);
        if (! is_file($abs)) {
            return null;
        }

        $ext = strtolower(pathinfo($abs, PATHINFO_EXTENSION));
        if (! in_array($ext, self::ALLOWED_EXTENSIONS, true)) {
            @unlink($abs);
            return null;
        }

        $size = filesize($abs) ?: 0;
        if ($size <= 0 || $size > self::MAX_BYTES) {
            @unlink($abs);
            return null;
        }

        $newName = Str::uuid()->toString() . '.' . $ext;
        $relativeTarget = trim($targetDir, '/') . '/' . $newName;

        $publicRoot = Storage::disk('public')->path('');
        $targetAbs = $publicRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeTarget);
        $targetParent = dirname($targetAbs);
        if (! is_dir($targetParent)) {
            File::makeDirectory($targetParent, 0755, true);
        }

        if (! @rename($abs, $targetAbs)) {
            if (! @copy($abs, $targetAbs)) {
                return null;
            }
            @unlink($abs);
        }

        return [$relativeTarget, $size];
    }
}
