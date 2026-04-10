<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowed = ['da', 'en', 'ar', 'tg'];

        // Cookie (explicit user choice) takes priority over session
        $cookie  = $request->cookie('locale');
        $session = $request->session()->get('locale');

        $locale = (in_array($cookie, $allowed) ? $cookie : null)
                  ?? (in_array($session, $allowed) ? $session : null)
                  ?? $request->getPreferredLanguage($allowed)
                  ?? 'da';

        // Set application locale
        app()->setLocale($locale);

        // Always sync the session so it matches the current locale
        $request->session()->put('locale', $locale);

        // Share locale with Inertia views (already done via HandleInertiaRequests)
        // The locale will be available as $request->getLocale()

        return $next($request);
    }
}