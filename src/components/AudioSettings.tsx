import { useEffect, useState } from "react";
import { Music, Music2, SlidersHorizontal, Volume2, VolumeX } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import {
  getMusicVolume,
  getSfxVolume,
  isMusicOn,
  isMuted,
  setMusicVolume,
  setSfxVolume,
  sfxTap,
  startMusic,
  toggleMuted,
  toggleMusic,
} from "@/lib/sfx";

/** Controles separados de música e efeitos, com volume persistido. */
export function AudioSettings() {
  const { t } = useI18n();
  const [music, setMusic] = useState(true);
  const [sound, setSound] = useState(true);
  const [musicVol, setMusicVol] = useState(0.6);
  const [sfxVol, setSfxVol] = useState(1);

  useEffect(() => {
    setMusic(isMusicOn());
    setSound(!isMuted());
    setMusicVol(getMusicVolume());
    setSfxVol(getSfxVolume());
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
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}