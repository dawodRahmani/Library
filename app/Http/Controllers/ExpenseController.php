<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Services\LedgerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Expense::with('expenseCategory')
            ->orderByDesc('date')
            ->orderByDesc('id');

        if ($request->filled('category')) {
            $query->where('expense_category_id', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $expenses = $query->get()->map(fn($e) => $this->format($e));

        $categories = ExpenseCategory::orderBy('name')->get()->map(fn($c) => [
            'id'   => $c->id,
            'name' => $c->name,
            'slug' => $c->slug,
        ]);

        return Inertia::render('expenses/index', [
            'expenses'   => $expenses,
            'categories' => $categories,
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        ExpenseCategory::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name'], '-'),
        ]);

        return back();
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'description'         => 'required|string|max:255',
            'amount'              => 'required|integer|min:1',
            'date'                => 'required|date',
            'notes'               => 'nullable|string|max:500',
        ]);

        $expense = Expense::create([
            ...$data,
            'category'   => ExpenseCategory::find($data['expense_category_id'])?->slug ?? 'other',
            'created_by' => auth()->id(),
        ]);

        LedgerService::record(
            type: 'expense',
            reference: 'EXP-' . $expense->id,
            description: $expense->description,
            amount: $expense->amount,
            direction: 'out',
            category: $expense->expenseCategory?->slug ?? 'other',
        );

        return back();
    }

    public function update(Request $request, Expense $expense): RedirectResponse
    {
        $data = $request->validate([
            'expense_category_id' => 'required|exists:expense_categories,id',
            'description'         => 'required|string|max:255',
            'amount'              => 'required|integer|min:1',
            'date'                => 'required|date',
            'notes'               => 'nullable|string|max:500',
        ]);

        $expense->update([
            ...$data,
            'category' => ExpenseCategory::find($data['expense_category_id'])?->slug ?? 'other',
        ]);

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
            'id'                  => $e->id,
            'expense_category_id' => $e->expense_category_id,
            'category'            => $e->expenseCategory?->slug ?? $e->category,
            'category_name'       => $e->expenseCategory?->name ?? $e->category,
            'description'         => $e->description,
            'amount'              => $e->amount,
            'date'                => $e->date->toDateString(),
            'notes'               => $e->notes,
        ];
    }
}
