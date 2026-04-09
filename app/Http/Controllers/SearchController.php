<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Audio;
use App\Models\Book;
use App\Models\Fatwa;
use App\Models\Magazine;
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

        $lang = $request->query('lang', 'da');
        $like = "%{$q}%";
        $limit = 5;
        $results = [];

        // json_extract returns the actual Unicode string, bypassing the \uXXXX
        // escape sequences that SQLite stores, so LIKE works on Arabic/Dari text.
        $titleMatch = fn ($query) => $query
            ->whereRaw("json_extract(title, '$.da') LIKE ?", [$like])
            ->orWhereRaw("json_extract(title, '$.en') LIKE ?", [$like]);

        // Books
        Book::where('is_active', true)
            ->where($titleMatch)
            ->limit($limit)
            ->get(['id', 'title', 'cover_image'])
            ->each(function ($book) use (&$results, $lang) {
                $title = $book->title[$lang] ?? $book->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'book', 'title' => $title, 'url' => '/library', 'image' => $book->cover_image];
                }
            });

        // Videos
        Video::where('is_active', true)
            ->where($titleMatch)
            ->limit($limit)
            ->get(['id', 'title', 'thumbnail'])
            ->each(function ($video) use (&$results, $lang) {
                $title = $video->title[$lang] ?? $video->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'video', 'title' => $title, 'url' => '/library/videos', 'image' => $video->thumbnail];
                }
            });

        // Audios
        Audio::where('is_active', true)
            ->where($titleMatch)
            ->limit($limit)
            ->get(['id', 'title'])
            ->each(function ($audio) use (&$results, $lang) {
                $title = $audio->title[$lang] ?? $audio->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'audio', 'title' => $title, 'url' => '/audio'];
                }
            });

        // Fatwas
        Fatwa::where('is_active', true)
            ->where($titleMatch)
            ->limit($limit)
            ->get(['id', 'title'])
            ->each(function ($fatwa) use (&$results, $lang) {
                $title = $fatwa->title[$lang] ?? $fatwa->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'fatwa', 'title' => $title, 'url' => '/dar-ul-ifta'];
                }
            });

        // Articles
        Article::where('is_active', true)
            ->where($titleMatch)
            ->limit($limit)
            ->get(['id', 'title', 'slug', 'cover_image'])
            ->each(function ($article) use (&$results, $lang) {
                $title = $article->title[$lang] ?? $article->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'article', 'title' => $title, 'url' => "/articles/{$article->slug}", 'image' => $article->cover_image];
                }
            });

        // Magazines
        Magazine::where('is_active', true)
            ->where($titleMatch)
            ->limit($limit)
            ->get(['id', 'title', 'cover_image'])
            ->each(function ($magazine) use (&$results, $lang) {
                $title = $magazine->title[$lang] ?? $magazine->title['da'] ?? '';
                if ($title) {
                    $results[] = ['type' => 'magazine', 'title' => $title, 'url' => '/majalla', 'image' => $magazine->cover_image];
                }
            });

        return response()->json($results);
    }
}
