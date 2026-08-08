# Action Plan

## 1. Fix video upload limit (customers stuck at ~100 MB, should be 1 GB)

**Diagnosis:** The code is fine. It already supports **1 GB per video** using
*chunked upload* (each request to the server is only ~5 MB), so PHP's upload
limit should never block a big video.

- Frontend cap: `resources/js/lib/chunk-upload.ts` → `MAX_UPLOAD_BYTES` = 1 GiB, 5 MiB chunks
- Backend cap: `app/Http/Controllers/ChunkUploadController.php` → `MAX_BYTES` = 1 GiB
- Video form uses the chunked uploader: `resources/js/pages/admin/videos/index.tsx` (line ~377)

The "100 MB" wall is **GoDaddy's default server limit** (`post_max_size` /
`upload_max_filesize` = 100M). It only bites if the **old, non-chunked build**
is what's actually live on the server.

### Steps to do

- [ ] **Step 1 — Check what's live on GoDaddy.** Look in the deployed
      `public/build/assets/` folder. If there is a file named
      `chunked-file-uploader-*.js`, the good code is already live → skip to Step 3
      (server limits only). If not, the old build is live → do Step 2.

- [ ] **Step 2 — Deploy the current build.** Locally run:
      ```bash
      npm run build
      ```
      Then upload the fresh `public/build/` folder to GoDaddy (plus any changed
      `app/`, `routes/`, `resources/` files). On the server run:
      ```bash
      php artisan optimize:clear
      ```

- [ ] **Step 3 — Raise GoDaddy server limits** (belt-and-suspenders; also needed
      for the legacy single-shot fallback). In cPanel → **MultiPHP INI Editor** →
      select the domain → set:
      ```
      upload_max_filesize = 1024M
      post_max_size       = 1024M
      max_execution_time  = 600
      max_input_time      = 600
      memory_limit        = 256M
      ```
      If MultiPHP INI Editor is missing, create a `.user.ini` file in the
      `public_html` root with the same lines.

- [ ] **Step 4 — Verify.** Log into admin, upload a ~300–500 MB video, confirm the
      progress bar completes and the video plays back.

**Note:** GoDaddy shared hosting may also cap `max_execution_time` and disk
quota — if very large uploads still fail after this, check the account's disk
space and open a GoDaddy ticket about ModSecurity rules on repeated POSTs.

---

## 2. Image sizes per section

See `plan/image-size-guide.md` — updated with every section's exact export size
plus tricks so images fit on mobile and desktop.
