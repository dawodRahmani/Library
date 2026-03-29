import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';

const CONTACT_INFO = [
    {
        icon: MapPin,
        title: 'آدرس',
        lines: ['کابل، افغانستان', 'منطقه وزیر اکبر خان، کوچه ۳'],
    },
    {
        icon: Phone,
        title: 'تلفن',
        lines: ['+93 70 123 4567', '+93 79 987 6543'],
    },
    {
        icon: Mail,
        title: 'ایمیل',
        lines: ['info@risalat-library.af', 'support@risalat-library.af'],
    },
    {
        icon: Clock,
        title: 'ساعات کاری',
        lines: ['شنبه — چهارشنبه: ۸ صبح تا ۵ عصر', 'پنجشنبه: ۸ صبح تا ۱۲ ظهر'],
    },
];

const SOCIALS = [
    { icon: Facebook, label: 'فیسبوک',  href: '#', color: 'bg-[#3b5998]' },
    { icon: Twitter,  label: 'توییتر',  href: '#', color: 'bg-[#1da1f2]' },
    { icon: Youtube,  label: 'یوتیوب',  href: '#', color: 'bg-[#ff0000]' },
    { icon: Linkedin, label: 'لینکدین', href: '#', color: 'bg-[#0077b5]' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-7 bg-[#27ae60] rounded-full" />
            <h2 className="text-[20px] font-bold text-gray-900">{children}</h2>
        </div>
    );
}

export function ContactContent() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="space-y-8">
            {/* Contact info cards */}
            <div>
                <SectionTitle>اطلاعات تماس</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CONTACT_INFO.map(({ icon: Icon, title, lines }) => (
                        <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
                            <div className="shrink-0 w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center mt-0.5">
                                <Icon className="w-5 h-5 text-[#27ae60]" />
                            </div>
                            <div>
                                <p className="font-bold text-[13px] text-gray-900 mb-1">{title}</p>
                                {lines.map((l) => (
                                    <p key={l} className="text-[12px] text-gray-500 leading-relaxed">{l}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <SectionTitle>ارسال پیام</SectionTitle>

                {sent ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#27ae60]/10 flex items-center justify-center">
                            <Send className="w-6 h-6 text-[#27ae60]" />
                        </div>
                        <p className="font-bold text-[16px] text-gray-800">پیام شما ارسال شد!</p>
                        <p className="text-[13px] text-gray-500">به زودی با شما تماس خواهیم گرفت.</p>
                        <button
                            onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                            className="mt-2 text-[13px] text-[#27ae60] hover:underline"
                        >
                            ارسال پیام دیگر
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">نام و نام خانوادگی</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="نام شما"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#27ae60] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">ایمیل</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="email@example.com"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#27ae60] transition-colors"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">موضوع</label>
                            <input
                                type="text"
                                required
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                placeholder="موضوع پیام"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#27ae60] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">پیام</label>
                            <textarea
                                required
                                rows={5}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="پیام خود را بنویسید..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#27ae60] transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-[#27ae60] hover:bg-[#219a52] text-white font-bold text-[13px] px-6 py-2.5 rounded-lg transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            ارسال پیام
                        </button>
                    </form>
                )}
            </div>

            {/* Social */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <SectionTitle>شبکه‌های اجتماعی</SectionTitle>
                <div className="flex flex-wrap gap-3">
                    {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                        <a
                            key={label}
                            href={href}
                            className={`flex items-center gap-2.5 ${color} text-white text-[13px] font-bold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
