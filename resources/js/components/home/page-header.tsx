interface PageHeaderProps {
    title: string;
    breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, breadcrumbs = [] }: PageHeaderProps) {
    return (
        <div className="bg-[#1a252f] py-7">
            <div className="max-w-[1240px] mx-auto px-4">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                {breadcrumbs.length > 0 && (
                    <div className="flex items-center gap-2 text-[13px] text-gray-400">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-2">
                                {i > 0 && <span className="text-gray-600">/</span>}
                                {crumb.href ? (
                                    <a href={crumb.href} className="hover:text-[#27ae60] transition-colors">
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-[#27ae60]">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
