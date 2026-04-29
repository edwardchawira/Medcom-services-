-- AI-powered course builder schema additions

create table if not exists public.community_course_lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.community_course_chapters(id) on delete cascade,
  sort_order integer not null default 1,
  block_type text not null check (block_type in ('text', 'image', 'quiz')),
  content_json jsonb not null default '{}'::jsonb,
  source text not null default 'manual' check (source in ('manual', 'ai')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_community_course_lesson_blocks_chapter
  on public.community_course_lesson_blocks(chapter_id, sort_order);

create table if not exists public.community_course_block_versions (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.community_course_lesson_blocks(id) on delete cascade,
  version_no integer not null,
  content_json jsonb not null,
  prompt text not null default '',
  model text not null default '',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(block_id, version_no)
);

create table if not exists public.community_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.community_courses(id) on delete cascade,
  chapter_id uuid references public.community_course_chapters(id) on delete cascade,
  block_id uuid references public.community_course_lesson_blocks(id) on delete cascade,
  job_type text not null check (job_type in ('outline', 'block_generate', 'block_regenerate')),
  status text not null check (status in ('pending', 'running', 'completed', 'failed')),
  input_prompt text not null default '',
  model text not null default '',
  error text not null default '',
  created_by uuid not null references auth.users(id),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.community_course_lesson_blocks enable row level security;
alter table public.community_course_block_versions enable row level security;
alter table public.community_generation_jobs enable row level security;

-- Blocks policies
create policy community_course_lesson_blocks_select
  on public.community_course_lesson_blocks
  for select
  using (
    exists (
      select 1
      from public.community_course_chapters ch
      join public.community_courses c on c.id = ch.course_id
      where ch.id = chapter_id and (c.published = true or c.created_by = auth.uid())
    )
  );

create policy community_course_lesson_blocks_insert
  on public.community_course_lesson_blocks
  for insert
  with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.community_course_chapters ch
      join public.community_courses c on c.id = ch.course_id
      where ch.id = chapter_id and c.created_by = auth.uid()
    )
  );

create policy community_course_lesson_blocks_update
  on public.community_course_lesson_blocks
  for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy community_course_lesson_blocks_delete
  on public.community_course_lesson_blocks
  for delete
  using (created_by = auth.uid());

-- Version policies
create policy community_course_block_versions_select
  on public.community_course_block_versions
  for select
  using (
    exists (
      select 1
      from public.community_course_lesson_blocks b
      join public.community_course_chapters ch on ch.id = b.chapter_id
      join public.community_courses c on c.id = ch.course_id
      where b.id = block_id and (c.published = true or c.created_by = auth.uid())
    )
  );

create policy community_course_block_versions_insert
  on public.community_course_block_versions
  for insert
  with check (
    exists (
      select 1
      from public.community_course_lesson_blocks b
      where b.id = block_id and b.created_by = auth.uid()
    )
  );

-- Job policies
create policy community_generation_jobs_select
  on public.community_generation_jobs
  for select
  using (created_by = auth.uid());

create policy community_generation_jobs_insert
  on public.community_generation_jobs
  for insert
  with check (created_by = auth.uid());

create policy community_generation_jobs_update
  on public.community_generation_jobs
  for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

