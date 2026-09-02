import { useEffect, useState } from "react";
import { Music, Music2, Play, Vibrate, SlidersHorizontal, Volume2, VolumeX } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { hapticCorrect, hapticsSupported, isHapticsOn, toggleHaptics } from "@/lib/haptics";
import { useI18n } from "@/lib/i18n";
import {
  getMusicVolume,
  getSfxVolume,
  isMusicOn,
  isMuted,
  setMusicVolume,
  setSfxVolume,
  sfxCoin,
  sfxCorrect,
  sfxTap,
  startMusic,
  toggleMuted,
  toggleMusic,
  stopMusic,
} from "@/lib/sfx";

/** Controles separados de música e efeitos, com volume persistido. */
export function AudioSettings() {
  const { t } = useI18n();
  const [music, setMusic] = useState(true);
  const [sound, setSound] = useState(true);
  const [musicVol, setMusicVol] = useState(0.6);
  const [sfxVol, setSfxVol] = useState(1);
  const [tested, setTested] = useState<"music" | "sfx" | null>(null);
  const [haptics, setHaptics] = useState(false);
  const [canVibrate, setCanVibrate] = useState(false);

  useEffect(() => {
    if (!tested) return;
    const id = setTimeout(() => setTested(null), 2000);
    return () => clearTimeout(id);
  }, [tested]);

  useEffect(() => {
    setMusic(isMusicOn());
    setSound(!isMuted());
    setMusicVol(getMusicVolume());
    setSfxVol(getSfxVolume());
    setHaptics(isHapticsOn());
    setCanVibrate(hapticsSupported());
    if (isMusicOn()) startMusic();
  }, []);

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t("audio")}
        className="rounded-full p-1 text-muted-foreground transition-colors hover:text-accent"
      >
        <SlidersHorizontal className="size-5" strokeWidth={2.5} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 rounded-2xl border-2 p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-extrabold">
                {music ? (
                  <Music className="size-4 text-accent" strokeWidth={3} />
                ) : (
                  <Music2 className="size-4 opacity-50" strokeWidth={3} />
                )}
                {t("music")}
                <span className="font-mono text-xs text-muted-foreground">
                  {Math.round(musicVol * 100)}%
                </span>
              </span>
              <Switch checked={music} onCheckedChange={() => setMusic(toggleMusic())} />
            </div>
            <Slider
              aria-label={t("musicVolume")}
              disabled={!music}
              value={[Math.round(musicVol * 100)]}
              max={100}
              step={5}
              onValueChange={([v]) => setMusicVol(setMusicVolume((v ?? 0) / 100))}
            />
            <button
              type="button"
              onClick={() => {
                if (!music) setMusic(toggleMusic());
                else {
                  stopMusic();
                  startMusic();
                }
                setTested("music");
              }}
              className="btn-3d flex w-full items-center justify-center gap-2 rounded-xl border-accent-deep bg-accent px-3 py-2 text-sm font-extrabold text-accent-foreground"
            >
              <Play className="size-4 shrink-0" strokeWidth={3} />
              {t("test")}
            </button>
            {tested === "music" ? (
              <p className="animate-pop text-xs font-bold text-accent">{t("testOk")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-extrabold">
                {sound ? (
                  <Volume2 className="size-4 text-secondary" strokeWidth={3} />
                ) : (
                  <VolumeX className="size-4 opacity-50" strokeWidth={3} />
                )}
                {t("effects")}
                <span className="font-mono text-xs text-muted-foreground">
                  {Math.round(sfxVol * 100)}%
                </span>
              </span>
              <Switch
                checked={sound}
                onCheckedChange={() => {
                  const nowMuted = toggleMuted();
                  setSound(!nowMuted);
                }}
              />
            </div>
            <Slider
              aria-label={t("sfxVolume")}
              disabled={!sound}
              value={[Math.round(sfxVol * 100)]}
              max={100}
              step={5}
              onValueChange={([v]) => setSfxVol(setSfxVolume((v ?? 0) / 100))}
              onValueCommit={() => sfxTap()}
            />
            <button
              type="button"
              onClick={() => {
                if (!sound) setSound(!toggleMuted());
                sfxCorrect(1);
                sfxCoin();
                setTested("sfx");
              }}
              className="btn-3d flex w-full items-center justify-center gap-2 rounded-xl border-secondary-deep bg-secondary px-3 py-2 text-sm font-extrabold text-secondary-foreground"
            >
              <Play className="size-4 shrink-0" strokeWidth={3} />
              {t("test")}
            </button>
            {tested === "sfx" ? (
              <p className="animate-pop text-xs font-bold text-secondary">{t("testOk")}</p>
            ) : null}
          </div>
          {canVibrate ? (
            <div className="flex items-center justify-between gap-2 border-t-2 border-border pt-3">
              <span className="flex items-center gap-2 text-sm font-extrabold">
                <Vibrate
                  className={`size-4 ${haptics ? "text-primary" : "opacity-50"}`}
                  strokeWidth={3}
                />
                {t("haptics")}
              </span>
              <Switch
                checked={haptics}
                onCheckedChange={() => {
                  const next = toggleHaptics();
                  setHaptics(next);
                  if (next) hapticCorrect();
                }}
              />
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}