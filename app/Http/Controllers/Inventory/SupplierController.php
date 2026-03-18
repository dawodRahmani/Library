<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Supplier::orderBy('name');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('contact_name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        $suppliers = $query->get()->map(fn($s) => $this->format($s));

        return Inertia::render('inventory/suppliers', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'         => 'required|string|max:100',
            'contact_name' => 'nullable|string|max:100',
            'phone'        => 'required|string|max:20',
            'address'      => 'nullable|string|max:255',
            'category'     => 'required|string|max:50',
            'notes'        => 'nullable|string|max:500',
        ]);

        Supplier::create($data);
        return back();
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $data = $request->validate([
            'name'         => 'required|string|max:100',
            'contact_name' => 'nullable|string|max:100',
            'phone'        => 'required|string|max:20',
            'address'      => 'nullable|string|max:255',
            'category'     => 'required|string|max:50',
            'notes'        => 'nullable|string|max:500',
        ]);

        $supplier->update($data);
        return back();
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $supplier->delete();
        return back();
    }

    private function format(Supplier $s): array
    {
        return [
            'id'           => $s->id,
            'name'         => $s->name,
            'contact_name' => $s->contact_name ?? '',
            'phone'        => $s->phone ?? '',
            'address'      => $s->address,
            'category'     => $s->category,
            'notes'        => $s->notes,
            'created_at'   => $s->created_at->toDateString(),
        ];
    }
}
