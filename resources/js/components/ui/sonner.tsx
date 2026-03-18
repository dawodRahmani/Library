import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            position="top-center"
            dir="rtl"
            toastOptions={{
                classNames: {
                    toast:
                        'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                    success: 'group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-800 group-[.toaster]:!border-emerald-200 dark:group-[.toaster]:!bg-emerald-900/30 dark:group-[.toaster]:!text-emerald-300',
                    error: 'group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-800 group-[.toaster]:!border-red-200 dark:group-[.toaster]:!bg-red-900/30 dark:group-[.toaster]:!text-red-300',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
