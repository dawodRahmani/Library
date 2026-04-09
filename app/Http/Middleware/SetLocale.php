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
        // Detect locale from session, cookie, Accept-Language header, default to 'da'
        $locale = $request->session()->get('locale')
                  ?? $request->cookie('locale')
                  ?? $request->getPreferredLanguage(['da', 'en', 'ar'])
                  ?? 'da';

        // Set application locale
        app()->setLocale($locale);

        // Store locale in session for subsequent requests
        if (!$request->session()->has('locale')) {
            $request->session()->put('locale', $locale);
        }

        // Share locale with Inertia views (already done via HandleInertiaRequests)
        // The locale will be available as $request->getLocale()

        return $next($request);
    }
}