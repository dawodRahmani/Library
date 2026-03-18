<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\LedgerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Expense::orderByDesc('date')->orderByDesc('id');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $expenses = $query->get()->map(fn($e) => $this->format($e));

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'category'    => 'required|in:groceries,rent,electricity,gas,supplies,other',
            'description' => 'required|string|max:255',
            'amount'      => 'required|integer|min:1',
            'date'        => 'required|date',
            'notes'       => 'nullable|string|max:500',
        ]);

        $expense = Expense::create([...$data, 'created_by' => auth()->id()]);

        LedgerService::record(
            type: 'expense',
            reference: 'EXP-' . $expense->id,
            description: $expense->description,
            amount: $expense->amount,
            direction: 'out',
            category: $expense->category,
        );

        return back();
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        $data = $request->validate([
            'category'    => 'required|in:groceries,rent,electricity,gas,supplies,other',
            'description' => 'required|string|max:255',
            'amount'      => 'required|integer|min:1',
            'date'        => 'required|date',
            'notes'       => 'nullable|string|max:500',
        ]);

        $expense->update($data);
        return back();
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $expense->delete();
        return back();
    }

    private function format(Expense $e): array
    {
        return [
            'id'          => $e->id,
            'category'    => $e->category,
            'description' => $e->description,
            'amount'      => $e->amount,
            'date'        => $e->date->toDateString(),
            'notes'       => $e->notes,
        ];
    }
}
