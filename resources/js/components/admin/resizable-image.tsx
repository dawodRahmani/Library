import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { useRef, useState } from 'react';

type Alignment = 'left' | 'center' | 'right';

function ResizableImageComponent({ node, updateAttributes, selected }: NodeViewProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const width = (node.attrs.width as string | number | null) ?? null;
    const align = ((node.attrs.align as Alignment | null) ?? 'center');
    const [previewWidth, setPreviewWidth] = useState<number | null>(null);

    const startResize = (
        e: React.MouseEvent<HTMLDivElement>,
        corner: 'br' | 'bl',
    ) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startWidth = imgRef.current?.offsetWidth ?? 0;

        const onMouseMove = (ev: MouseEvent) => {
            const delta = corner === 'br' ? ev.clientX - startX : startX - ev.clientX;
            const next = Math.max(60, startWidth + delta);
            setPreviewWidth(next);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (imgRef.current) {
                updateAttributes({ width: imgRef.current.offsetWidth });
            }
            setPreviewWidth(null);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const effectiveWidth = previewWidth ?? width;
    const widthStyle =
        typeof effectiveWidth === 'number'
            ? `${effectiveWidth}px`
            : (effectiveWidth ?? undefined);

    const justify =
        align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

    return (
        <NodeViewWrapper
            className="resizable-image"
            style={{ display: 'flex', justifyContent: justify, margin: '0.75rem 0' }}
        >
            <div
                style={{
                    position: 'relative',
                    display: 'inline-block',
                    maxWidth: '100%',
                    width: widthStyle,
                    outline: selected ? '2px solid #27ae60' : '2px solid transparent',
                    borderRadius: 4,
                    transition: 'outline-color 0.15s',
                }}
            >
                <img
                    ref={imgRef}
                    src={node.attrs.src as string}
                    alt={(node.attrs.alt as string) ?? ''}
                    title={(node.attrs.title as string) ?? ''}
                    draggable={false}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        borderRadius: 3,
                        userSelect: 'none',
                    }}
                />

                {selected && (
                    <>
                        {/* Alignment toolbar */}
                        <div
                            contentEditable={false}
                            style={{
                                position: 'absolute',
                                top: -34,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: 4,
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: 6,
                                padding: 3,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                fontSize: 12,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {(['left', 'center', 'right'] as Alignment[]).map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        updateAttributes({ align: a });
                                    }}
                                    style={{
                                        padding: '2px 8px',
                                        borderRadius: 4,
                                        border: 'none',
                                        background: align === a ? '#d1fae5' : 'transparent',
                                        color: align === a ? '#065f46' : '#4b5563',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {a === 'left' ? '⬅' : a === 'right' ? '➡' : '⬍'}
                                </button>
                            ))}
                            <div style={{ width: 1, background: '#e5e7eb' }} />
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    updateAttributes({ width: null });
                                }}
                                style={{
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#4b5563',
                                    cursor: 'pointer',
                                }}
                                title="اندازه اصلی"
                            >
                                ↺
                            </button>
                        </div>

                        {/* Bottom-right resize handle */}
                        <div
                            onMouseDown={(e) => startResize(e, 'br')}
                            style={{
                                position: 'absolute',
                                right: -6,
                                bottom: -6,
                                width: 12,
                                height: 12,
                                background: '#27ae60',
                                border: '2px solid white',
                                borderRadius: 2,
                                cursor: 'nwse-resize',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                        />
                        {/* Bottom-left resize handle */}
                        <div
                            onMouseDown={(e) => startResize(e, 'bl')}
                            style={{
                                position: 'absolute',
                                left: -6,
                                bottom: -6,
                                width: 12,
                                height: 12,
                                background: '#27ae60',
                                border: '2px solid white',
                                borderRadius: 2,
                                cursor: 'nesw-resize',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                        />
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}

export const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: (el) => {
                    const w = el.getAttribute('width') ?? el.style.width;
                    if (!w) return null;
                    const num = parseInt(w, 10);
                    return Number.isNaN(num) ? w : num;
                },
                renderHTML: (attrs) => {
                    if (!attrs.width) return {};
                    const val = typeof attrs.width === 'number' ? `${attrs.width}px` : attrs.width;
                    return { style: `width: ${val}` };
                },
            },
            align: {
                default: 'center',
                parseHTML: (el) => el.getAttribute('data-align') ?? 'center',
                renderHTML: (attrs) =>
                    attrs.align ? { 'data-align': attrs.align } : {},
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageComponent);
    },
});
