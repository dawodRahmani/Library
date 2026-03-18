<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FloorController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'color'       => 'required|string|in:emerald,blue,amber,purple,red,gray',
            'order'       => 'integer|min:0',
        ]);

        Floor::create($data);

        return back();
    }

    public function update(Request $request, Floor $floor): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'color'       => 'required|string|in:emerald,blue,amber,purple,red,gray',
            'order'       => 'integer|min:0',
        ]);

        $floor->update($data);

        return back();
    }

    public function destroy(Floor $floor): RedirectResponse
    {
        $floor->delete();
        return back();
    }
}
