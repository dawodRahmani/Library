import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle2 } from 'lucide-react';

export function CallWaiterButton() {
    const { t } = useTranslation();
    const [called, setCalled] = useState(false);

    const handleCall = () => {
        setCalled(true);
        setTimeout(() => setCalled(false), 5000);
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
            <button
                onClick={handleCall}
                disabled={called}
                className={`flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-bold shadow-2xl transition-all duration-300 ${
                    called
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 scale-95'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/40 active:scale-95 hover:scale-105'
                }`}
            >
                {called ? (
                    <>
                        <CheckCircle2 className="size-5 shrink-0" />
                        {t('digitalMenu.waiterCalled')}
                    </>
                ) : (
                    <>
                        <Bell className="size-5 shrink-0 animate-[wiggle_1s_ease-in-out_infinite]" />
                        {t('digitalMenu.callWaiter')}
                    </>
                )}
            </button>
        </div>
    );
}
