<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Salary;
use App\Services\LedgerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalaryController extends Controller
{
    public function index(Request $request): Response
    {
        // Build available months from existing salary records
        $months = Salary::selectRaw('DISTINCT month')
            ->orderByDesc('month')
            ->limit(12)
            ->pluck('month')
            ->values();

        // Default to most recent month in DB, or the requested month
        $defaultMonth = $months->first() ?? '';
        $month = $request->get('month', $defaultMonth);

        $employees = Employee::orderBy('name')->get()->map(fn($e) => [
            'id'          => $e->id,
            'name'        => $e->name,
            'role'        => $e->role,
            'is_active'   => $e->is_active,
            'base_salary' => $e->base_salary,
        ]);

        $salaries = Salary::with('employee')
            ->where('month', $month)
            ->get()
            ->map(fn($s) => $this->format($s));

        return Inertia::render('salaries/index', [
            'employees'     => $employees,
            'salaries'      => $salaries,
            'selectedMonth' => $month,
            'months'        => $months,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'employee_id'  => 'required|exists:employees,id',
            'month'        => 'required|string|size:7',
            'base_amount'  => 'required|integer|min:0',
            'bonuses'      => 'nullable|integer|min:0',
            'deductions'   => 'nullable|integer|min:0',
            'amount'       => 'required|integer|min:0',
            'status'       => 'required|in:paid,pending,partial',
            'payment_date' => 'nullable|date',
            'notes'        => 'nullable|string|max:500',
        ]);

        $salary = Salary::create($data);

        if ($salary->status === 'paid') {
            $this->recordLedger($salary);
        }

        return back();
    }

    public function update(Request $request, Salary $salary): RedirectResponse
    {
        $wasNotPaid = $salary->status !== 'paid';

        $data = $request->validate([
            'employee_id'  => 'required|exists:employees,id',
            'month'        => 'required|string|size:7',
            'base_amount'  => 'required|integer|min:0',
            'bonuses'      => 'nullable|integer|min:0',
            'deductions'   => 'nullable|integer|min:0',
            'amount'       => 'required|integer|min:0',
            'status'       => 'required|in:paid,pending,partial',
            'payment_date' => 'nullable|date',
            'notes'        => 'nullable|string|max:500',
        ]);

        $salary->update($data);

        // Create ledger entry when first marked as paid
        if ($wasNotPaid && $salary->fresh()->status === 'paid') {
            $this->recordLedger($salary->fresh());
        }

        return back();
    }

    public function destroy(Salary $salary): RedirectResponse
    {
        \App\Models\LedgerEntry::where('reference', 'SAL-' . $salary->id)->delete();
        $salary->delete();
        return back();
    }

    public function markAsPaid(Salary $salary): RedirectResponse
    {
        if ($salary->status === 'paid') {
            return back();
        }

        $salary->update([
            'status'       => 'paid',
            'payment_date' => now()->toDateString(),
        ]);

        $this->recordLedger($salary->fresh());

        return back();
    }

    private function recordLedger(Salary $salary): void
    {
        LedgerService::record(
            type: 'salary',
            reference: 'SAL-' . $salary->id,
            description: 'معاش ' . ($salary->employee->name ?? '') . ' — ' . $salary->month,
            amount: $salary->amount,
            direction: 'out',
            category: 'salary',
        );
    }

    private function format(Salary $s): array
    {
        return [
            'id'            => $s->id,
            'employee_id'   => $s->employee_id,
            'employee_name' => $s->employee->name ?? '',
            'month'         => $s->month,
            'base_amount'   => $s->base_amount,
            'bonuses'       => $s->bonuses,
            'deductions'    => $s->deductions,
            'amount'        => $s->amount,
            'status'        => $s->status,
            'payment_date'  => $s->payment_date?->toDateString(),
            'notes'         => $s->notes,
        ];
    }
}
