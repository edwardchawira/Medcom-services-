# AI Course Builder Rollout

## Phase 1: Schema and policy
- Apply migration `supabase/migrations/20260429_ai_course_builder.sql`.
- Verify RLS policy behavior for creator-owned writes and published reads.

## Phase 2: APIs and service wiring
- Deploy Route Handlers under `app/api/community-courses/ai/*` and `app/api/community-courses/blocks/*`.
- Set `OPENAI_API_KEY` for production AI generation.
- Keep graceful fallback responses when provider key is absent.

## Phase 3: UI release (feature flag)
- Serve `CourseBuilderV2` behind `NEXT_PUBLIC_AI_COURSE_BUILDER=true`.
- Keep `CourseUploadForm` available as fallback path until QA sign-off.

## Phase 4: Data migration
- Run `npm run migrate:course-blocks` in controlled environment.
- Validate existing courses still render in reader routes.

## Phase 5: Progressive hardening
- Add moderation checks for prompts/image descriptors.
- Add rate limiting for generation endpoints.
- Add block-version restore UI from `community_course_block_versions`.

