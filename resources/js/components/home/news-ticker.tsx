const TICKER_ITEMS = [
    'آخرین کتاب‌های اضافه شده به کتابخانه',
    'مقاله جدید: تاریخچه خط و کتابت در افغانستان',
    'سخنرانی ویدیویی جدید بارگذاری شد',
    'کتاب‌های دیجیتال جدید در دسته‌بندی فقه',
    'صوت‌های تازه در بخش شرح حدیث',
    'نسخه‌های خطی دیجیتالی‌شده جدید',
];

export function NewsTicker() {
    return (
        <div className="bg-[#1a252f] border-y border-white/10 overflow-hidden">
            <div className="max-w-[1240px] mx-auto px-4">
                <div className="flex items-stretch h-10">
                    {/* Label */}
                    <div className="flex items-center shrink-0 bg-[#27ae60] px-4 text-white text-[13px] font-bold">
                        اخبار و اعلانات
                    </div>

                    {/* Scrolling track */}
                    <div className="flex-1 overflow-hidden relative">
                        <div className="ticker-track flex items-center h-full gap-10 text-gray-300 text-[13px]">
                            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                                <span key={i} className="flex items-center gap-2 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60] shrink-0" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
