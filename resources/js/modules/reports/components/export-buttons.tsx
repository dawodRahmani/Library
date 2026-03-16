import { useTranslation } from 'react-i18next';
import { Printer, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ExportButtons() {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
            >
                <Printer className="h-4 w-4 me-2" />
                {t('reports.printReport')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    // PDF download will be implemented with backend
                    alert('PDF export will be available after backend integration');
                }}
            >
                <FileDown className="h-4 w-4 me-2" />
                {t('reports.downloadPdf')}
            </Button>
        </div>
    );
}
