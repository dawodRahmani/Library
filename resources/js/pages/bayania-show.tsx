import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopBar }      from '@/components/home/top-bar';
import { MainNav }     from '@/components/home/main-nav';
import { NewsTicker }  from '@/components/home/news-ticker';
import { PageHeader }  from '@/components/home/page-header';
import { HomeSidebar } from '@/components/home/home-sidebar';
import { HomeFooter }  from '@/components/home/home-footer';
import { useDir }      from '@/hooks/use-dir';
import { CalendarDays, ArrowRight, FileText, Music, Video } from 'lucide-react';

type StatementType = 'text' | 'audio' | 'video';

interface StatementItem {
    id:           number;
    type:         StatementType;
    title:        string;
    body:         string;
    media_source: 'link' | 'upload' | null;
    media_url:    string | null;
    has_file:     boolean;
    stream_url:   string | null;
    thumbnail:    string | null;
    published_at: string | null;
}

interface Props {
    statement: StatementItem;
}

function formatDate(date: string | null, locale: string) {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ar' ? 'ar-SA' : 'fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

function youtubeEmbedUrl(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) {
            const id = u.pathname.replace(/^\//, '');
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (u.hostname.includes('youtube.com')) {
            const id = u.searchParams.get('v');
            if (id) return `https://www.youtube.com/embed/${id}`;
            if (u.pathname.startsWith('/embed/')) return url;
        }
        return null;
    } catch {
        return null;
    }
}

function typeIcon(type: StatementType) {
    if (type === 'audio') return Music;
    if (type === 'video') return Video;
    return FileText;
}

export default function BayaniaShow({ statement }: Props) {
    const { i18n, t } = useTranslation();
    const locale = ['da', 'en', 'ar', 'tg'].includes(i18n.language) ? i18n.language : 'da';
    const dir = useDir();

    const TypeIcon = typeIcon(statement.type);

    const audioSrc = statement.type === 'audio'
        ? (statement.media_source === 'upload' ? statement.stream_url : statement.media_url)
        : null;

    const videoSrcLink = statement.type === 'video' && statement.media_source === 'link' ? statement.media_url : null;
    const videoSrcFile = statement.type === 'video' && statement.media_source === 'upload' ? statement.stream_url : null;
    const ytEmbed      = videoSrcLink ? youtubeEmbedUrl(videoSrcLink) : null;

    return (
        <div dir={dir} className="min-h-screen bg-[#f0f2f5] font-sans">
            <Head title={`${statement.title} — کتابخانه رسالت`} />

            <TopBar />
            <MainNav />
            <NewsTicker />

            <PageHeader
                title={statement.title}
                breadcrumbs={[
                    { label: t('nav.home', 'خانه'), href: '/' },
                    { label: t('nav.statements', 'بیانیه‌ها'), href: '/bayania' },
                    { label: statement.title },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Back link */}
                        <Link
                            href="/bayania"
                            className="inline-flex items-center gap-1.5 text-sm text-[#27ae60] hover:underline"
                        >
                            <ArrowRight className="w-4 h-4" />
                            {t('nav.statements', 'بیانیه‌ها')}
                        </Link>

                        {/* Statement card */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#27ae60]/10 flex items-center justify-center">
                                    <TypeIcon className="w-5 h-5 text-[#27ae60]" />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 leading-snug flex-1">
                                    {statement.title}
                                </h1>
                            </div>

                            {statement.published_at && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>{formatDate(statement.published_at, locale)}</span>
                                </div>
                            )}

                            {/* Audio player */}
                            {statement.type === 'audio' && audioSrc && (
                                <div className="border-t border-gray-100 pt-5">
                                    <audio controls src={audioSrc} className="w-full" preload="metadata">
                                        {t('bayania.audioUnsupported')}
                                    </audio>
                                </div>
                            )}

                            {/* Video player */}
                            {statement.type === 'video' && (ytEmbed || videoSrcLink || videoSrcFile) && (
                                <div className="border-t border-gray-100 pt-5">
                                    {ytEmbed ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                                            <iframe
                                                src={ytEmbed}
                                                title={statement.title}
                                                className="absolute inset-0 w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <video
                                            controls
                                            src={videoSrcFile ?? videoSrcLink ?? ''}
                                            poster={statement.thumbnail ? `/storage/${statement.thumbnail}` : undefined}
                                            className="w-full rounded-lg bg-black max-h-[70vh]"
                                            preload="metadata"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Body text */}
                            {statement.body ? (
                                <div
                                    className="statement-body prose prose-sm max-w-none text-gray-700 leading-relaxed border-t border-gray-100 pt-5"
                                    dangerouslySetInnerHTML={{ __html: statement.body }}
                                />
                            ) : statement.type === 'text' ? (
                                <p className="text-gray-400 text-sm border-t border-gray-100 pt-5">
                                    {t('bayania.noContent')}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <HomeSidebar />
                    </div>
                </div>
            </div>

            <HomeFooter />
        </div>
    );
}
