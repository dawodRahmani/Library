import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ResizableImage } from './resizable-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { useRef } from 'react';
import {
    Bold, Italic, UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code, Minus,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Image as ImageIcon,
    Undo, Redo, RemoveFormatting,
    Type,
} from 'lucide-react';

const FONT_OPTIONS: { label: string; value: string }[] = [
    { label: 'پیش‌فرض',                value: '' },
    { label: 'Amiri Quran (قرآنی)',    value: '"Amiri Quran", serif' },
    { label: 'Amiri (عربی)',           value: 'Amiri, serif' },
    { label: 'Scheherazade (قرآنی)',   value: '"Scheherazade New", serif' },
    { label: 'Lateef (عربی)',          value: 'Lateef, serif' },
    { label: 'Noto Naskh Arabic',      value: '"Noto Naskh Arabic", serif' },
    { label: 'Reem Kufi',              value: '"Reem Kufi", sans-serif' },
    { label: 'Cairo',                  value: 'Cairo, sans-serif' },
    { label: 'Tajawal',                value: 'Tajawal, sans-serif' },
    { label: 'Vazirmatn (دری/فارسی)',  value: 'Vazirmatn, sans-serif' },
];

interface RichEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    dir?: 'rtl' | 'ltr';
    uploadUrl?: string;
}

function ToolbarBtn({
    onClick, active, title, children,
}: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className={`p-1.5 rounded transition-colors ${
                active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-5 bg-gray-200 mx-0.5 self-center" />;
}

export function RichEditor({
    value,
    onChange,
    placeholder = 'متن مقاله را اینجا بنویسید...',
    dir = 'rtl',
    uploadUrl,
}: RichEditorProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Underline,
            TextStyle,
            Color,
            FontFamily.configure({ types: ['textStyle'] }),
            ResizableImage.configure({ inline: false, allowBase64: true }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-emerald-600 underline' },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor: ed }) => { onChange(ed.getHTML()); },
    });

    // ── Image helpers ────────────────────────────────────────────────────────
    async function insertImageFromFile(file: File) {
        if (!editor) return;
        if (uploadUrl) {
            const fd = new FormData();
            fd.append('image', file);
            const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? '';
            const res  = await fetch(uploadUrl, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrf },
                body: fd,
            });
            const json = await res.json() as { url: string };
            editor.chain().focus().setImage({ src: json.url }).run();
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.chain().focus().setImage({ src: e.target?.result as string }).run();
            };
            reader.readAsDataURL(file);
        }
    }

    function insertImageFromUrl() {
        if (!editor) return;
        const url = window.prompt('آدرس تصویر (URL):');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }

    function setLink() {
        if (!editor) return;
        const prev = editor.getAttributes('link').href as string ?? '';
        const url  = window.prompt('آدرس لینک:', prev);
        if (url === null) return;
        if (url === '') { editor.chain().focus().unsetLink().run(); return; }
        editor.chain().focus().setLink({ href: url }).run();
    }

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-400 transition-colors" dir={dir}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-gray-200 bg-gray-50">
                {/* Undo / Redo */}
                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="بازگشت"><Undo className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="جلو"><Redo className="w-4 h-4" /></ToolbarBtn>
                <Divider />

                {/* Font family */}
                <div className="flex items-center gap-1">
                    <Type className="w-4 h-4 text-gray-500" />
                    <select
                        title="فونت"
                        value={(editor.getAttributes('textStyle').fontFamily as string) ?? ''}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (v) editor.chain().focus().setFontFamily(v).run();
                            else   editor.chain().focus().unsetFontFamily().run();
                        }}
                        className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:border-emerald-400 max-w-[150px]"
                    >
                        {FONT_OPTIONS.map((f) => (
                            <option key={f.label} value={f.value} style={{ fontFamily: f.value || undefined }}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Divider />

                {/* Headings */}
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="عنوان ۱"><Heading1 className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="عنوان ۲"><Heading2 className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="عنوان ۳"><Heading3 className="w-4 h-4" /></ToolbarBtn>
                <Divider />

                {/* Inline formatting */}
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="ضخیم"><Bold className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="مایل"><Italic className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="زیرخط"><UnderlineIcon className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="خط‌خورده"><Strikethrough className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="کد"><Code className="w-4 h-4" /></ToolbarBtn>
                <Divider />

                {/* Alignment */}
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="راست‌چین"><AlignRight className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="وسط‌چین"><AlignCenter className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="چپ‌چین"><AlignLeft className="w-4 h-4" /></ToolbarBtn>
                <Divider />

                {/* Lists & blocks */}
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="لیست نقطه‌ای"><List className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="لیست شماره‌دار"><ListOrdered className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="نقل قول"><Quote className="w-4 h-4" /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="خط جداکننده"><Minus className="w-4 h-4" /></ToolbarBtn>
                <Divider />

                {/* Link */}
                <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="لینک"><LinkIcon className="w-4 h-4" /></ToolbarBtn>

                {/* Image: upload */}
                <ToolbarBtn onClick={() => imageInputRef.current?.click()} title="آپلود تصویر">
                    <ImageIcon className="w-4 h-4" />
                </ToolbarBtn>
                {/* Image: from URL */}
                <ToolbarBtn onClick={insertImageFromUrl} title="تصویر از URL">
                    <ImageIcon className="w-4 h-4 opacity-50" />
                </ToolbarBtn>
                <Divider />

                {/* Clear formatting */}
                <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="حذف قالب‌بندی">
                    <RemoveFormatting className="w-4 h-4" />
                </ToolbarBtn>
            </div>

            {/* Editor content */}
            <EditorContent
                editor={editor}
                className="min-h-[320px] p-4 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px]"
            />

            {/* Hidden file input */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void insertImageFromFile(file);
                    e.target.value = '';
                }}
            />
        </div>
    );
}
