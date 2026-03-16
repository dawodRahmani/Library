import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { RoleData, Permission } from '../types';

interface AssignPermissionsDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (permissionIds: number[]) => void;
    role: RoleData | null;
    allPermissions: Permission[];
    processing?: boolean;
}

export function AssignPermissionsDialog({
    open,
    onClose,
    onSubmit,
    role,
    allPermissions,
    processing = false,
}: AssignPermissionsDialogProps) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (role) {
            setSelected(role.permissions.map((p) => p.id));
        } else {
            setSelected([]);
        }
        setSearch('');
    }, [role, open]);

    // Group permissions by group
    const grouped = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        const filtered = allPermissions.filter(
            (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()),
        );
        for (const perm of filtered) {
            const group = perm.group || 'other';
            if (!groups[group]) groups[group] = [];
            groups[group].push(perm);
        }
        return groups;
    }, [allPermissions, search]);

    const togglePermission = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const toggleGroup = (perms: Permission[]) => {
        const ids = perms.map((p) => p.id);
        const allSelected = ids.every((id) => selected.includes(id));
        if (allSelected) {
            setSelected((prev) => prev.filter((id) => !ids.includes(id)));
        } else {
            setSelected((prev) => [...new Set([...prev, ...ids])]);
        }
    };

    const selectAll = () => setSelected(allPermissions.map((p) => p.id));
    const deselectAll = () => setSelected([]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[560px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t('roles.assignPermissions')}</DialogTitle>
                    <DialogDescription>
                        {role && (
                            <span className="inline-flex items-center gap-2">
                                {t(`users.${role.name}`, role.name)}
                                <Badge variant="outline" className="text-purple-600 border-purple-300">
                                    {selected.length} / {allPermissions.length}
                                </Badge>
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* Search & bulk actions */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder={t('permissions.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="ps-10 h-9"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={selectAll} className="text-xs">
                        {t('roles.selectAll')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={deselectAll} className="text-xs">
                        {t('roles.deselectAll')}
                    </Button>
                </div>

                {/* Permission groups */}
                <div className="flex-1 overflow-y-auto space-y-4 py-2 max-h-[400px]">
                    {Object.entries(grouped).map(([group, perms]) => {
                        const allGroupSelected = perms.every((p) => selected.includes(p.id));
                        return (
                            <div key={group} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={allGroupSelected}
                                        onCheckedChange={() => toggleGroup(perms)}
                                        className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                    />
                                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                        {t(`permissions.groups.${group}`, group)}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        {perms.filter((p) => selected.includes(p.id)).length}/{perms.length}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 ps-7">
                                    {perms.map((perm) => (
                                        <div key={perm.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`perm-${perm.id}`}
                                                checked={selected.includes(perm.id)}
                                                onCheckedChange={() => togglePermission(perm.id)}
                                                className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                            />
                                            <Label
                                                htmlFor={`perm-${perm.id}`}
                                                className="text-sm cursor-pointer"
                                            >
                                                {perm.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="mt-2" />
                            </div>
                        );
                    })}
                </div>

                <DialogFooter className="gap-2 pt-2">
                    <Button variant="outline" onClick={onClose} disabled={processing}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={() => onSubmit(selected)}
                        disabled={processing}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {processing && <Spinner className="me-2" />}
                        {t('common.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
