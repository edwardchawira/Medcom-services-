# AI Course Builder Baseline

## Existing integration seams

- Course authoring entrypoint: `app/courses/upload/page.tsx` -> `components/CourseUploadForm.tsx`
- Course create API: `app/api/community-courses/route.ts` (`POST`)
- Community read + learn routes:
  - `app/courses/community/[slug]/overview/page.tsx`
  - `app/courses/community/[slug]/learn/[step]/page.tsx`
- Content renderer: `components/MarkdownContent.tsx`

## Why this seam works

- The current upload form already models chapter-level composition and question editing.
- Existing Supabase RLS is ownership-aware and can be extended to block-level tables.
- Reader routes are stable and can consume a normalized block graph without URL changes.

## Migration strategy

1. Write block tables + version/job tables.
2. Add AI generation APIs and editable block APIs.
3. Add `CourseBuilderV2` UI while preserving `CourseUploadForm` as fallback.
4. Read preview data from block tables first, fallback to markdown if blocks are absent.
5. Backfill legacy markdown to text blocks in a one-time migration script.

