<?php

namespace App\Http\Controllers;

use App\Models\Audio;
use App\Models\Book;
use App\Models\Fatwa;
use App\Models\Magazine;
use App\Models\Statement;
use App\Models\Video;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $q = trim($request->query('q', ''));

        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $lang    = $request->query('lang', 'da');
        $like    = "%{$q}%";
        $limit   = 5;
        $results = [];

        // Search all three language keys in a JSON column.
        // json_extract() returns real Unicode so LIKE works on Arabic/Dari text.
        $matchJson = fn (string $column) => fn ($query) => $query
            ->whereRaw("json_extract({$column}, '$.da') LIKE ?", [$like])
            ->orWhereRaw("json_extract({$column}, '$.en') LIKE ?", [$like])
            ->orWhereRaw("json_extract({$column}, '$.ar') LIKE ?", [$like]);

        // Match title OR description (both are JSON columns).
        $titleOrDesc = fn ($query, string $descCol = 'description') => $query->where(function ($q) use ($matchJson, $descCol) {
            $q->where($matchJson('title'))
              ->orWhere($matchJson($descCol));
        });

        // Also search plain-text author column where it exists.
        $titleDescOrAuthor = fn ($query, string $descCol = 'description') => $query->where(function ($q) use ($matchJson, $like, $descCol) {
            $q->where($matchJson('title'))
              ->orWhere($matchJson($descCol))
              ->orWhere('author', 'LIKE', $like);
        });

        // ── Books ────────────────────────────────────────────────────────────
        Book::where('is_active', true)
            ->where(fn ($q) => $titleDescOrAuthor($q))
            ->limit($limit)
            ->get(['id', 'title', 'cover_image'])
            ->each(function ($book) use (&$results, $lang) {
                $title = $book->title[$lang] ?? $book->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'book', 'title' => $title, 'url' => '/library', 'image' => $book->cover_image];
                }
            });

        // ── Videos ───────────────────────────────────────────────────────────
        Video::where('is_active', true)
            ->where(fn ($q) => $titleDescOrAuthor($q))
            ->limit($limit)
            ->get(['id', 'title', 'thumbnail'])
            ->each(function ($video) use (&$results, $lang) {
                $title = $video->title[$lang] ?? $video->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'video', 'title' => $title, 'url' => '/library/videos', 'image' => $video->thumbnail];
                }
            });

        // ── Audios ───────────────────────────────────────────────────────────
        Audio::where('is_active', true)
            ->where(fn ($q) => $titleDescOrAuthor($q))
            ->limit($limit)
            ->get(['id', 'title'])
            ->each(function ($audio) use (&$results, $lang) {
                $title = $audio->title[$lang] ?? $audio->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'audio', 'title' => $title, 'url' => '/audio'];
                }
            });

        // ── Fatwas ───────────────────────────────────────────────────────────
        Fatwa::where('is_active', true)
            ->where(fn ($q) => $titleOrDesc($q))
            ->limit($limit)
            ->get(['id', 'title'])
            ->each(function ($fatwa) use (&$results, $lang) {
                $title = $fatwa->title[$lang] ?? $fatwa->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'fatwa', 'title' => $title, 'url' => '/dar-ul-ifta'];
                }
            });

        // ── Magazines ────────────────────────────────────────────────────────
        Magazine::where('is_active', true)
            ->where(fn ($q) => $titleOrDesc($q))
            ->limit($limit)
            ->get(['id', 'title', 'cover_image'])
            ->each(function ($magazine) use (&$results, $lang) {
                $title = $magazine->title[$lang] ?? $magazine->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'magazine', 'title' => $title, 'url' => '/majalla', 'image' => $magazine->cover_image];
                }
            });

        // ── Statements (بیانیه‌ها) ────────────────────────────────────────────
        Statement::where('is_active', true)
            ->where(function ($q) use ($matchJson) {
                $q->where($matchJson('title'))
                  ->orWhere($matchJson('body'));
            })
            ->limit($limit)
            ->get(['id', 'title'])
            ->each(function ($statement) use (&$results, $lang) {
                $title = $statement->title[$lang] ?? $statement->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'statement', 'title' => $title, 'url' => '/bayania'];
                }
            });

        return response()->json($results);
    }
}
