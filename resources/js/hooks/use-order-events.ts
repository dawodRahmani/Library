import { useEffect, useRef, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UseOrderEventsOptions {
    /** Inertia props to reload */
    reloadProps?: string[];
    /** Polling interval in ms (default: 5000) */
    interval?: number;
    /** Show toast + play sound when data changes */
    showNotifications?: boolean;
    /** Disable polling */
    enabled?: boolean;
}

interface OrderLike {
    id: number;
    order_number?: string;
    status?: string;
    table?: { number: number; name?: string | null } | null;
}

interface TableLike {
    id: number;
    number: number;
    status?: string;
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

// ── Diff Logic ──────────────────────────────────────────────
function extractOrders(props: Record<string, unknown>): OrderLike[] {
    // Handle paginated orders (orders.data) or flat arrays
    const raw = props.orders ?? props.order;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object' && 'data' in (raw as Record<string, unknown>)) {
        return (raw as { data: OrderLike[] }).data;
    }
    // Single order (show page)
    if (typeof raw === 'object' && 'id' in (raw as Record<string, unknown>)) {
        return [raw as OrderLike];
    }
    return [];
}

function extractTables(props: Record<string, unknown>): TableLike[] {
    const raw = props.tables ?? props.tableStatuses;
    if (Array.isArray(raw)) return raw;
    return [];
}

interface ChangeMessage {
    title: string;
    description: string;
    type: 'success' | 'info' | 'warning';
}

function detectChanges(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>,
    t: (key: string, opts?: Record<string, unknown>) => string,
): ChangeMessage[] {
    const messages: ChangeMessage[] = [];

    // ── Order changes ──────────────────────────────────────
    const oldOrders = extractOrders(oldProps);
    const newOrders = extractOrders(newProps);

    if (oldOrders.length > 0 || newOrders.length > 0) {
        const oldMap = new Map(oldOrders.map((o) => [o.id, o]));

        for (const newOrder of newOrders) {
            const old = oldMap.get(newOrder.id);

            if (!old) {
                // New order appeared
                const tableInfo = newOrder.table
                    ? `${t('orders.table')} ${newOrder.table.number}`
                    : t('orders.noTable');
                messages.push({
                    title: `${t('orders.newOrder')} ${newOrder.order_number || ''}`,
                    description: tableInfo,
                    type: 'success',
                });
            } else if (old.status !== newOrder.status && newOrder.status) {
                // Status changed
                const statusLabel = t(statusKeys[newOrder.status] || newOrder.status);
                messages.push({
                    title: `${newOrder.order_number || `#${newOrder.id}`}`,
                    description: `${t('orders.status')}: ${statusLabel}`,
                    type: newOrder.status === 'cancelled' ? 'warning' : 'info',
                });
            }
        }
    }

    // ── Table changes ──────────────────────────────────────
    const oldTables = extractTables(oldProps);
    const newTables = extractTables(newProps);

    if (oldTables.length > 0 || newTables.length > 0) {
        const oldTableMap = new Map(oldTables.map((t) => [t.id, t]));

        for (const newTable of newTables) {
            const old = oldTableMap.get(newTable.id);
            if (old && old.status !== newTable.status) {
                const statusLabel = newTable.status === 'occupied'
                    ? t('dashboard.occupied')
                    : t('dashboard.available');
                messages.push({
                    title: `${t('orders.table')} ${newTable.number}`,
                    description: statusLabel,
                    type: 'info',
                });
            }
        }
    }

    return messages;
}

// ── Hook ────────────────────────────────────────────────────
export function useOrderEvents({
    reloadProps,
    interval = 5000,
    showNotifications = false,
    enabled = true,
}: UseOrderEventsOptions = {}) {
    const { t } = useTranslation();
    const lastProps = useRef<Record<string, unknown> | null>(null);
    const isFirstLoad = useRef(true);
    const pageProps = usePage().props as Record<string, unknown>;

    // Store initial props on mount
    useEffect(() => {
        if (isFirstLoad.current) {
            lastProps.current = structuredClone(pageProps);
            isFirstLoad.current = false;
        }
    }, [pageProps]);

    const handleSuccess = useCallback(
        (page: { props: Record<string, unknown> }) => {
            if (!showNotifications || !lastProps.current) {
                lastProps.current = structuredClone(page.props);
                return;
            }

            const changes = detectChanges(lastProps.current, page.props, t);

            if (changes.length > 0) {
                playNotificationSound();
                for (const msg of changes) {
                    if (msg.type === 'success') {
                        toast.success(msg.title, { description: msg.description, duration: 5000 });
                    } else if (msg.type === 'warning') {
                        toast.warning(msg.title, { description: msg.description, duration: 5000 });
                    } else {
                        toast.info(msg.title, { description: msg.description, duration: 4000 });
                    }
                }
            }

            lastProps.current = structuredClone(page.props);
        },
        [showNotifications, t],
    );

    useEffect(() => {
        if (!enabled) return;

        const timer = setInterval(() => {
            if (document.hidden) return;

            router.reload({
                preserveState: true,
                preserveScroll: true,
                only: reloadProps?.length ? reloadProps : undefined,
                onSuccess: handleSuccess,
            });
        }, interval);

        return () => clearInterval(timer);
    }, [enabled, interval, reloadProps, handleSuccess]);
}
