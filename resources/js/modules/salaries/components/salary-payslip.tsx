import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatShamsiDate } from '@/lib/date';
import type { Salary } from '../types';

interface SalaryPayslipProps {
    salary: Salary | null;
    employeeName: string;
    employeeRole: string;
    open: boolean;
    onClose: () => void;
}

export function SalaryPayslip({ salary, employeeName, employeeRole, open, onClose }: SalaryPayslipProps) {
    const { t } = useTranslation();
    const contentRef = useRef<HTMLDivElement>(null);

    if (!salary) return null;

    const net = salary.base_amount + (salary.bonuses ?? 0) - (salary.deductions ?? 0);

    function handlePrint() {
        const html = contentRef.current?.innerHTML;
        if (!html) return;

        const win = window.open('', '_blank', 'width=400,height=600');
        if (!win) return;

        win.document.write(`<!DOCTYPE html>
<html dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>پرچین معاش</title>
  <style>
    @page { size: 80mm auto; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      direction: rtl;
      width: 80mm;
      padding: 4mm 3mm;
      color: #000;
      background: #fff;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .large { font-size: 14px; }
    .small { font-size: 10px; }
    .divider { border-top: 1px dashed #000; margin: 4px 0; }
    .row { display: flex; justify-content: space-between; padding: 2px 0; }
    .row-bold { display: flex; justify-content: space-between; padding: 3px 0; font-weight: bold; font-size: 13px; border-top: 1px solid #000; margin-top: 2px; }
    .muted { color: #555; font-size: 10px; }
  </style>
</head>
<body>${html}</body>
</html>`);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 300);
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[340px]">
                <DialogHeader>
                    <DialogTitle>{t('salaries.payslip')}</DialogTitle>
                </DialogHeader>

                {/* Preview — mirrors thermal output */}
                <div
                    ref={contentRef}
                    className="border rounded bg-white text-black font-mono text-xs p-3 space-y-1"
                    style={{ direction: 'rtl', fontFamily: "'Courier New', monospace" }}
                >
                    {/* Header */}
                    <div className="center bold large">رستورانت برتر</div>
                    <div className="center small">{t('salaries.payslip')}</div>
                    <div className="divider" />

                    {/* Employee info */}
                    <div className="row"><span className="muted">{t('employees.name')}:</span><span>{employeeName}</span></div>
                    <div className="row"><span className="muted">{t('employees.role')}:</span><span>{employeeRole}</span></div>
                    <div className="row"><span className="muted">{t('salaries.month')}:</span><span>{salary.month}</span></div>
                    {salary.payment_date && (
                        <div className="row"><span className="muted">{t('salaries.paymentDate')}:</span><span>{formatShamsiDate(salary.payment_date)}</span></div>
                    )}
                    <div className="divider" />

                    {/* Amounts */}
                    <div className="row"><span>{t('salaries.baseSalary')}</span><span>{salary.base_amount.toLocaleString()} ؋</span></div>
                    {(salary.bonuses ?? 0) > 0 && (
                        <div className="row"><span>{t('salaries.bonuses')}</span><span>+{(salary.bonuses ?? 0).toLocaleString()} ؋</span></div>
                    )}
                    {(salary.deductions ?? 0) > 0 && (
                        <div className="row"><span>{t('salaries.deductions')}</span><span>-{(salary.deductions ?? 0).toLocaleString()} ؋</span></div>
                    )}

                    {/* Net */}
                    <div className="row-bold">
                        <span>{t('salaries.netAmount')}</span>
                        <span>{net.toLocaleString()} ؋</span>
                    </div>

                    {/* Notes */}
                    {salary.notes && (
                        <>
                            <div className="divider" />
                            <div className="small">{salary.notes}</div>
                        </>
                    )}

                    <div className="divider" />
                    <div className="center small">{formatShamsiDate(new Date().toISOString())}</div>
                </div>

                <Button onClick={handlePrint} className="w-full mt-2">
                    <Printer className="size-4 me-2" />
                    {t('common.print')}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
