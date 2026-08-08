# Image Size Guide — راهنمای اندازهٔ تصاویر

This guide tells the designer the **exact pixel size** to export each image, so it shows
**fully — without cropping — on both mobile and desktop**.

## Why images were getting cropped on desktop (the bug we fixed)

The image boxes used a **fixed height + full width** (e.g. `h-40`, `h-36`) or a height that
**changed on desktop** (`lg:h-full`). On a phone the box is narrow and tall-ish, so almost
nothing was cut. On a wide desktop screen the *same* box became **wide and short**, and
`object-cover` sliced off the top and bottom of the picture.

**The fix:** every image box now has a **fixed aspect ratio that never changes** between mobile
and desktop (Tailwind `aspect-video` = 16:9, or `7:10` portrait for covers). So if the designer
exports the image at the ratio below, it fills the box perfectly on every screen — no cropping.

> Rule of thumb: **match the ratio** in the table and you will never be cropped. If the ratio
> doesn't match, the image is still scaled to fill (`object-cover`) and the mismatched edge gets
> trimmed — so always export at the listed ratio.

## Recommended export sizes

| Section | File | Box ratio | **Export at (px)** | Orientation |
|---|---|---|---|---|
| **Home hero — large card** | `home-hero.tsx` | 16:9 | **1280 × 720** | Landscape |
| **Home hero — small/medium card** | `home-hero.tsx` | 16:9 | **800 × 450** | Landscape |
| **Magazine (Majalla) card cover** | `majalla-list.tsx` | 7:10 | **420 × 600** | Portrait |
| **Magazine featured side cover** | `majalla-list.tsx` | 7:10 | **420 × 600** | Portrait |
| **Video card thumbnail** | `videos.tsx` | 16:9 | **1280 × 720** | Landscape |
| **Audio card thumbnail** | `audio-list.tsx` | 16:9 | **800 × 450** | Landscape |
| **Fatwa / Dar-ul-Ifta CARD thumbnail** | `dar-ul-ifta-list.tsx` | 16:9 | **800 × 450** | Landscape |
| **Fatwa / Dar-ul-Ifta image (POPUP)** | `dar-ul-ifta-list.tsx` | any | width ≤ **1000** | Any — shown in full (`object-contain`), never cropped |
| **Book cover (library list + modal)** | `library/index.tsx` | 7:10 | **420 × 600** | Portrait |
| **About page hero banner** | `about-content.tsx` | full-screen background (60–80vh) | **1920 × 1080** (16:9) | Landscape — scenic/background only, no text near edges |
| **Site logo (header + sidebar)** | `site-settings` | shown with `object-contain` (never cropped) | **height 112px**, e.g. **400 × 112** transparent | Wide/landscape — **PNG with transparency** |
| **Contact page logo** | `contact-content.tsx` | square, `object-contain` | **512 × 512** | Square — PNG with transparency |

### Notes for the designer
- **16:9** = landscape banner (wider than tall). **7:10** = upright book/magazine cover.
- Keep the important part (title, face, logo) **centered** with a little safe margin — even at the
  right ratio, a few pixels at the very edge can be trimmed by anti-aliasing.
- Export as **JPG or WebP**, quality ~80%, to keep the offline app fast. Use PNG only when you
  need transparency.
- The sizes above are already **2× (retina-ready)**, so they stay sharp on high-resolution
  desktop monitors. Don't go smaller, or the image will look blurry when stretched.
- The **Fatwa popup image**, the **logos**, and the **contact logo** are the exceptions — they use
  `object-contain`, so the whole image always shows (it may get empty side/top space if the ratio is
  unusual, but it is never cut off).

## Quick tricks so any picture "just fits" (for the person uploading)

If you don't have an image at the exact ratio, use one of these:

1. **Match the ratio, not the exact pixels.** The only thing that matters for "no cropping" is the
   **shape**: `16:9` (wide banner) or `7:10` (upright cover). Any size at the right shape works —
   `800 × 450` and `1280 × 720` are both 16:9. When unsure, pick **16:9 landscape**: most section
   boxes on this site are 16:9.
2. **Keep the subject centered with breathing room.** Put the face / title / logo in the middle
   ~80% of the image. Even at the right ratio, a few edge pixels can be trimmed — never place
   important content right at the border.
3. **Add a background (letterbox) instead of stretching.** If your photo is the wrong shape, don't
   stretch it. Put it on a solid or blurred background canvas sized to the target ratio (16:9), so
   the whole subject shows and the canvas fills the box. Free tools: Canva, Photopea (photopea.com),
   or Windows Paint (set the canvas size first, then paste).
4. **Crop to the ratio before uploading.** In Canva/Photoshop/Photopea set the crop tool to a fixed
   ratio (16:9 or 7:10), frame the subject, export. On a phone, most gallery/crop apps let you type
   a custom ratio.
5. **Export smart:** JPG or WebP, quality ~80%, for photos. **PNG (transparent)** only for logos.
   Aim to keep each image **under ~500 KB** so the offline app stays fast.
6. **Logos need transparency.** Export the header/contact logo as a **PNG with a transparent
   background** (not white), or it will show an ugly white box on colored areas.
7. **Rule of thumb by shape:**
   - Wide banner / thumbnail / hero → **16:9 landscape**
   - Book or magazine cover → **7:10 portrait (upright)**
   - Logo → **transparent PNG**, wide for header / square for contact

> If the person still isn't sure: tell them to just upload a **16:9 landscape** image with the
> subject centered. That is the safe default for almost every section here.
