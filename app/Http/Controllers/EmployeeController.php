<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Salary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Employee::orderBy('name');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        $employees = $query->get()->map(fn($e) => $this->format($e));
        $roles = DB::table('roles')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'roles'     => $roles,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validRoles = DB::table('roles')->pluck('name')->toArray();
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'role'        => ['required', Rule::in($validRoles)],
            'phone'       => 'nullable|string|max:20',
            'hire_date'   => 'nullable|date',
            'is_active'   => 'boolean',
            'base_salary' => 'nullable|integer|min:0',
        ]);

        Employee::create($data);
        return back();
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validRoles = DB::table('roles')->pluck('name')->toArray();
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'role'        => ['required', Rule::in($validRoles)],
            'phone'       => 'nullable|string|max:20',
            'hire_date'   => 'nullable|date',
            'is_active'   => 'boolean',
            'base_salary' => 'nullable|integer|min:0',
        ]);

        $employee->update($data);
        return back();
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        // Soft-deactivate instead of hard delete if they have salaries
        if ($employee->salaries()->exists()) {
            $employee->update(['is_active' => false]);
        } else {
            $employee->delete();
        }
        return back();
    }

    public function salary(Employee $employee): Response
    {
        $salaries = Salary::where('employee_id', $employee->id)
            ->orderByDesc('month')
            ->get()
            ->map(fn($s) => [
                'id'           => $s->id,
                'employee_id'  => $s->employee_id,
                'month'        => $s->month,
                'base_amount'  => (float) $s->base_amount,
                'bonuses'      => (float) $s->bonuses,
                'deductions'   => (float) $s->deductions,
                'amount'       => (float) $s->amount,
                'status'       => $s->status,
                'payment_date' => $s->payment_date?->toDateString(),
                'notes'        => $s->notes,
            ]);

        return Inertia::render('employees/salary', [
            'employee' => $this->format($employee),
            'salaries' => $salaries,
        ]);
    }

    private function format(Employee $e): array
    {
        return [
            'id'          => $e->id,
            'name'        => $e->name,
            'role'        => $e->role,
            'phone'       => $e->phone ?? '',
            'hire_date'   => $e->hire_date?->toDateString(),
            'is_active'   => $e->is_active,
            'base_salary' => $e->base_salary,
        ];
    }
}
