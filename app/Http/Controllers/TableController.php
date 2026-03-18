<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use App\Models\Table;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TableController extends Controller
{
    public function index(): Response
    {
        $floors = Floor::orderBy('order')->get();
        $tables = Table::with('floor')->orderBy('floor_id')->orderBy('number')->get()
            ->map(fn($t) => [
                'id'              => $t->id,
                'number'          => $t->number,
                'name'            => $t->name,
                'capacity'        => $t->capacity,
                'status'          => $t->status,
                'active_order_id' => $t->active_order_id,
                'floor_id'        => $t->floor_id,
                'floor_name'      => $t->floor?->name ?? '',
            ]);

        return Inertia::render('tables/index', [
            'tables' => $tables,
            'floors' => $floors,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'floor_id' => 'required|exists:floors,id',
            'number'   => 'required|integer|min:1',
            'name'     => 'nullable|string|max:50',
            'capacity' => 'required|integer|min:1|max:50',
        ]);

        Table::create($data + ['status' => 'available']);

        return back();
    }

    public function update(Request $request, Table $table): RedirectResponse
    {
        $data = $request->validate([
            'floor_id' => 'required|exists:floors,id',
            'number'   => 'required|integer|min:1',
            'name'     => 'nullable|string|max:50',
            'capacity' => 'required|integer|min:1|max:50',
        ]);

        $table->update($data);

        return back();
    }

    public function destroy(Table $table): RedirectResponse
    {
        $table->delete();
        return back();
    }
}
