import { useEffect, useMemo } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { resolveAdhanAudioSource } from "./muezzinAudioAssets";
import { useAdhanSettingsStore } from "../../store/adhanSettingsStore";

export function useAdhanAudioPlayer(muezzinId: string, isFajr: boolean = false) {
  const volume = useAdhanSettingsStore((state) => state.volume);
  const source = useMemo(() => resolveAdhanAudioSource(muezzinId, isFajr), [muezzinId, isFajr]);
  const player = useAudioPlayer(source ?? undefined);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    player.volume = volume;
  }, [player, volume]);

  return {
    isAvailable: source !== null,
    isPlaying: status.playing,
    play: () => {
      if (source !== null) {
        player.seekTo(0).catch(() => {});
        player.play();
      }
    },
    stop: () => {
      player.pause();
      player.seekTo(0).catch(() => {});
    },
  };
}
