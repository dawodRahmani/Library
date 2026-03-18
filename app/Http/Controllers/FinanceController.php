<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Expense;
use App\Models\Order;
use App\Models\Salary;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    private static array $dariMonths = [
        '01' => 'جنوری',  '02' => 'فبروری', '03' => 'مارچ',
        '04' => 'اپریل', '05' => 'می',      '06' => 'جون',
        '07' => 'جولای',  '08' => 'آگست',   '09' => 'سپتمبر',
        '10' => 'اکتوبر', '11' => 'نوامبر', '12' => 'دسامبر',
    ];

    public function index(Request $request): Response
    {
        $selectedMonth = $request->input('month', Carbon::now()->format('Y-m'));

        // Last 6 months (oldest first)
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $months[] = Carbon::now()->subMonths($i)->format('Y-m');
        }

        $monthlyHistory = array_map(fn ($m) => $this->computeMonthly($m), $months);

        $current       = $this->computeMonthly($selectedMonth);
        $previousMonth = Carbon::createFromFormat('Y-m', $selectedMonth)->subMonth()->format('Y-m');
        $previous      = $this->computeMonthly($previousMonth);

        return Inertia::render('finance/index', [
            'current'          => $current,
            'previous'         => $previous,
            'dailyCashFlow'    => $this->computeDailyCashFlow($selectedMonth),
            'expenseBreakdown' => $this->computeExpenseBreakdown($selectedMonth),
            'salaryOverview'   => $this->computeSalaryOverview($selectedMonth),
            'monthlyHistory'   => $monthlyHistory,
            'selectedMonth'    => $selectedMonth,
            'months'           => $months,
        ]);
    }

    // ── Helpers ──────────────────────────────────────────────────────

    private function monthLabel(string $yearMonth): string
    {
        [$year, $month] = explode('-', $yearMonth);
        $name = self::$dariMonths[$month] ?? $month;
        return "$name $year";
    }

    private function computeMonthly(string $yearMonth): array
    {
        [$year, $month] = explode('-', $yearMonth);
        $start = Carbon::create((int) $year, (int) $month, 1)->startOfDay();
        $end   = $start->copy()->endOfMonth()->endOfDay();

        $income = (float) Order::where('status', 'paid')
            ->whereBetween('paid_at', [$start, $end])
            ->sum('total_amount');

        $expenses = (float) Expense::whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->sum('amount');

        $salaries = (float) Salary::where('month', $yearMonth)
            ->where('status', 'paid')
            ->sum('amount');

        $ordersCount = Order::where('status', 'paid')
            ->whereBetween('paid_at', [$start, $end])
            ->count();

        return [
            'month'       => $yearMonth,
            'monthLabel'  => $this->monthLabel($yearMonth),
            'income'      => $income,
            'expenses'    => $expenses,
            'salaries'    => $salaries,
            'netProfit'   => $income - $expenses - $salaries,
            'ordersCount' => $ordersCount,
        ];
    }

    private function computeDailyCashFlow(string $yearMonth): array
    {
        [$year, $month] = explode('-', $yearMonth);
        $start = Carbon::create((int) $year, (int) $month, 1);
        $end   = $start->copy()->endOfMonth();

        $incomeByDay = Order::where('status', 'paid')
            ->whereBetween('paid_at', [$start->copy()->startOfDay(), $end->copy()->endOfDay()])
            ->selectRaw('DATE(paid_at) as day, SUM(total_amount) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $expenseByDay = Expense::whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->selectRaw('date as day, SUM(amount) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $result  = [];
        $current = $start->copy();
        while ($current->lte($end)) {
            $dateStr  = $current->toDateString();
            $result[] = [
                'date'    => $dateStr,
                'inflow'  => (float) ($incomeByDay[$dateStr] ?? 0),
                'outflow' => (float) ($expenseByDay[$dateStr] ?? 0),
            ];
            $current->addDay();
        }

        return $result;
    }

    private function computeExpenseBreakdown(string $yearMonth): array
    {
        [$year, $month] = explode('-', $yearMonth);
        $start = Carbon::create((int) $year, (int) $month, 1)->toDateString();
        $end   = Carbon::create((int) $year, (int) $month, 1)->endOfMonth()->toDateString();

        $byCategory = Expense::whereBetween('date', [$start, $end])
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        // Salaries count as their own category
        $salariesTotal = (float) Salary::where('month', $yearMonth)
            ->where('status', 'paid')
            ->sum('amount');
        if ($salariesTotal > 0) {
            $byCategory['salaries'] = ($byCategory['salaries'] ?? 0) + $salariesTotal;
        }

        $grandTotal = array_sum($byCategory);
        if ($grandTotal == 0) {
            return [];
        }

        $colors = [
            'food'        => '#f59e0b',
            'rent'        => '#6366f1',
            'salaries'    => '#8b5cf6',
            'utilities'   => '#3b82f6',
            'supplies'    => '#10b981',
            'maintenance' => '#f97316',
            'other'       => '#94a3b8',
        ];

        $labels = [
            'food'        => 'مواد غذایی',
            'rent'        => 'کرایه',
            'salaries'    => 'معاشات',
            'utilities'   => 'آب و برق',
            'supplies'    => 'لوازم',
            'maintenance' => 'تعمیرات',
            'other'       => 'سایر',
        ];

        $breakdown = [];
        foreach ($byCategory as $category => $amount) {
            $breakdown[] = [
                'category'      => $category,
                'categoryLabel' => $labels[$category] ?? $category,
                'amount'        => (float) $amount,
                'percentage'    => round(((float) $amount / $grandTotal) * 100, 1),
                'color'         => $colors[$category] ?? '#94a3b8',
            ];
        }

        return $breakdown;
    }

    private function computeSalaryOverview(string $yearMonth): array
    {
        $employees = Employee::where('is_active', true)->get();
        $salaries  = Salary::where('month', $yearMonth)->get()->keyBy('employee_id');

        return $employees->map(function ($emp) use ($salaries) {
            $salary = $salaries->get($emp->id);
            return [
                'employeeName' => $emp->name,
                'role'         => $emp->role,
                'baseSalary'   => (float) $emp->base_salary,
                'status'       => $salary?->status ?? 'pending',
                'paidDate'     => $salary?->payment_date?->toDateString(),
            ];
        })->values()->toArray();
    }
}
