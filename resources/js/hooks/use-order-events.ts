import { useCallback, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useEcho } from '@laravel/echo-react';

interface UseOrderEventsOptions {
    /** Inertia props to reload */
    reloadProps?: string[];
    /** Show toast + play sound when data changes */
    showNotifications?: boolean;
    /** Disable real-time events */
    enabled?: boolean;
}

// ── Notification Sound ──────────────────────────────────────
function playNotificationSound() {
    try {
        const ctx = new AudioContext();
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        gain1.gain.setValueAtTime(0.4, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.15);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1175, ctx.currentTime + 0.18);
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc2.start(ctx.currentTime + 0.18);
        osc2.stop(ctx.currentTime + 0.4);
    } catch {
        // Audio not available
    }
}

// ── Status translation keys ─────────────────────────────────
const statusKeys: Record<string, string> = {
    pending: 'orders.statusPending',
    in_kitchen: 'orders.statusInKitchen',
    ready: 'orders.statusReady',
    served: 'orders.statusServed',
    paid: 'orders.statusPaid',
    cancelled: 'orders.statusCancelled',
};

// ── Hook ────────────────────────────────────────────────────
export function useOrderEvents({
    reloadProps,
    showNotifications = false,
    enabled = true,
}: UseOrderEventsOptions = {}) {
    const { t } = useTranslation();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reload Inertia page data (debounced to batch rapid events)
    const reloadPage = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.reload({
                only: reloadProps?.length ? reloadProps : undefined,
            });
        }, 300);
    }, [reloadProps]);

    // ── New Order ───────────────────────────────────────────
    useEcho(
        'public-restaurant',
        '.NewOrderCreated',
        (payload: { order: { order_number?: string; table?: { number: number } | null } }) => {
            if (!enabled) return;
            reloadPage();
            if (showNotifications) {
                playNotificationSound();
                const tableInfo = payload.order.table
                    ? `${t('orders.table')} ${payload.order.table.number}`
                    : t('orders.noTable');
                toast.success(
                    `${t('orders.newOrder')} ${payload.order.order_number || ''}`,
                    { description: tableInfo, duration: 5000 },
                );
            }
        },
        [enabled, showNotifications, reloadPage, t],
    );

    // ── Order Status Changed ────────────────────────────────
    useEcho(
        'public-restaurant',
        '.OrderStatusChanged',
        (payload: { order_id: number; status: string }) => {
            if (!enabled) return;
            reloadPage();
            if (showNotifications) {
                playNotificationSound();
                const statusLabel = t(statusKeys[payload.status] || payload.status);
                toast.info(
                    `#${payload.order_id}`,
                    { description: `${t('orders.status')}: ${statusLabel}`, duration: 4000 },
                );
            }
        },
        [enabled, showNotifications, reloadPage, t],
    );

    // ── Table Status Changed ────────────────────────────────
    useEcho(
        'public-restaurant',
        '.TableStatusChanged',
        (payload: { table_id: number; status: string }) => {
            if (!enabled) return;
            reloadPage();
            if (showNotifications) {
                const statusLabel = payload.status === 'occupied'
                    ? t('dashboard.occupied')
                    : t('dashboard.available');
                toast.info(
                    `${t('orders.table')} #${payload.table_id}`,
                    { description: statusLabel, duration: 4000 },
                );
            }
        },
        [enabled, showNotifications, reloadPage, t],
    );

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);
}
