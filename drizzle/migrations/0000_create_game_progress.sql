CREATE TABLE public.game_progress (
  user_id UUID PRIMARY KEY,
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  hearts INTEGER NOT NULL DEFAULT 5,
  streak INTEGER NOT NULL DEFAULT 0,
  last_study_day TEXT,
  completed JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_progress TO authenticated;
GRANT ALL ON public.game_progress TO service_role;

ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own progress select" ON public.game_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own progress insert" ON public.game_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own progress update" ON public.game_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own progress delete" ON public.game_progress
  FOR DELETE TO authenticated USING (auth.uid() = user_id);