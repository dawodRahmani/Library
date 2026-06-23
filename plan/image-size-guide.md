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
| **Magazine (Majalla) card cover** | `majalla-list.tsx` | 16:9 | **800 × 450** | Landscape |
| **Magazine featured side cover** | `majalla-list.tsx` | 7:10 | **420 × 600** | Portrait |
| **Video card thumbnail** | `videos.tsx` | 16:9 | **1280 × 720** | Landscape |
| **Book cover (library list + modal)** | `library/index.tsx` | 7:10 | **420 × 600** | Portrait |
| **Fatwa / Dar-ul-Ifta image (popup)** | `dar-ul-ifta-list.tsx` | any | width ≤ **1000** | Any — shown in full (`object-contain`), never cropped |

### Notes for the designer
- **16:9** = landscape banner (wider than tall). **7:10** = upright book/magazine cover.
- Keep the important part (title, face, logo) **centered** with a little safe margin — even at the
  right ratio, a few pixels at the very edge can be trimmed by anti-aliasing.
- Export as **JPG or WebP**, quality ~80%, to keep the offline app fast. Use PNG only when you
  need transparency.
- The sizes above are already **2× (retina-ready)**, so they stay sharp on high-resolution
  desktop monitors. Don't go smaller, or the image will look blurry when stretched.
- The **Fatwa popup image** is the one exception — it uses `object-contain`, so the whole image
  always shows (it may get empty side/top space if the ratio is unusual, but it is never cut off).
