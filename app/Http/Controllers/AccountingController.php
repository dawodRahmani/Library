<?php

namespace App\Http\Controllers;

use App\Models\LedgerEntry;
use App\Services\LedgerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = LedgerEntry::orderByDesc('date')->orderByDesc('id');

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('description', 'like', '%' . $request->search . '%')
                  ->orWhere('reference', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        // Summary always over all entries (no filters)
        $allEntries   = LedgerEntry::all();
        $totalIncome  = $allEntries->where('direction', 'in')->sum('amount');
        $totalOutflow = $allEntries->where('direction', 'out')->sum('amount');
        $balance      = $totalIncome - $totalOutflow;

        // Running balance map (oldest → newest)
        $allOrdered = LedgerEntry::orderBy('date')->orderBy('id')->get();
        $runningMap = [];
        $running = 0;
        foreach ($allOrdered as $entry) {
            $running += $entry->direction === 'in' ? $entry->amount : -$entry->amount;
            $runningMap[$entry->id] = $running;
        }

        $entries = $query->paginate(20)->through(fn($e) => [
            'id'          => $e->id,
            'date'        => $e->date->toDateString(),
            'type'        => $e->type,
            'reference'   => $e->reference,
            'description' => $e->description,
            'amount'      => $e->amount,
            'direction'   => $e->direction,
            'category'    => $e->category,
            'balance'     => $runningMap[$e->id] ?? 0,
        ]);

        return Inertia::render('accounting/index', [
            'entries' => $entries,
            'summary' => [
                'totalIncome'  => $totalIncome,
                'totalOutflow' => $totalOutflow,
                'balance'      => $balance,
            ],
            'filters' => $request->only(['type', 'search', 'date_from', 'date_to']),
        ]);
    }

    public function addFund(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'amount'      => 'required|numeric|min:1',
            'description' => 'required|string|max:255',
        ]);

        LedgerService::record(
            type: 'fund',
            reference: 'FUND-' . now()->format('Ymd-His'),
            description: $data['description'],
            amount: $data['amount'],
            direction: 'in',
        );

        return back();
    }
}
