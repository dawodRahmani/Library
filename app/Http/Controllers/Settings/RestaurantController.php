<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RestaurantController extends Controller
{
    private string $logoPath;

    public function __construct()
    {
        $this->logoPath = public_path('images/logo.png');
    }

    public function edit(): Response
    {
        return Inertia::render('settings/restaurant', [
            'logoUrl' => $this->currentLogoUrl(),
        ]);
    }

    public function uploadLogo(Request $request): RedirectResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $dir = public_path('images');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $request->file('logo')->move($dir, 'logo.png');

        return back()->with('logoUploaded', true);
    }

    public function removeLogo(): RedirectResponse
    {
        if (file_exists($this->logoPath)) {
            unlink($this->logoPath);
        }

        return back();
    }

    private function currentLogoUrl(): ?string
    {
        return file_exists($this->logoPath)
            ? asset('images/logo.png') . '?v=' . filemtime($this->logoPath)
            : null;
    }
}
