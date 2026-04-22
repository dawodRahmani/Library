<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Prevent the browser from restoring Inertia JSON responses when the user
 * clicks the back/forward button.
 *
 * The bug: an Inertia XHR (X-Inertia: true) and a regular HTML navigation use
 * the SAME URL. Without a Vary header the browser's back/forward cache can
 * hand back the cached JSON payload when the user expects HTML, showing raw
 * JSON instead of the page.
 *
 * Fix:
 *   - Always advertise Vary: X-Inertia so the cache keys split by header.
 *   - For Inertia XHR responses, add Cache-Control: no-store so they are
 *     never restored from bfcache.
 */
class PreventInertiaBackCache
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $existingVary = $response->headers->get('Vary');
        $varyTokens   = array_filter(array_map('trim', explode(',', (string) $existingVary)));
        if (! in_array('X-Inertia', $varyTokens, true)) {
            $varyTokens[] = 'X-Inertia';
        }
        $response->headers->set('Vary', implode(', ', $varyTokens));

        if ($request->header('X-Inertia')) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
        }

        return $response;
    }
}
