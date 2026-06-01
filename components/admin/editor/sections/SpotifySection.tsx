"use client";
import { useFormContext } from "react-hook-form";
import { Music } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { EventoConfigInput } from "@/lib/schemas";

type SpotifyType = "artist" | "track" | "album" | "playlist" | "episode";

interface SpotifyEmbed {
  type: SpotifyType;
  id: string;
}

function parseSpotifyUrl(url: string): SpotifyEmbed | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    const match = u.pathname.match(
      /^\/(artist|track|album|playlist|episode)\/([A-Za-z0-9]+)/
    );
    if (!match) return null;
    return { type: match[1] as SpotifyType, id: match[2] };
  } catch {
    return null;
  }
}

function embedHeight(type: SpotifyType): number {
  return type === "track" || type === "episode" ? 152 : 352;
}

export function SpotifySection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<EventoConfigInput>();

  const spotifyUrl = watch("spotify") ?? "";
  const embed = parseSpotifyUrl(spotifyUrl);

  return (
    <section id="spotify" className="flex flex-col gap-4 scroll-mt-32">
      <h2 className="text-lg font-semibold">Spotify</h2>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="spotify" className="text-sm font-medium flex items-center gap-1.5">
            <Music className="h-4 w-4 opacity-60" />
            URL de Spotify (opcional)
          </label>
          <Input
            id="spotify"
            placeholder="https://open.spotify.com/artist/..."
            {...register("spotify")}
            error={errors.spotify?.message}
          />
        </div>

        {embed && (
          <iframe
            src={`https://open.spotify.com/embed/${embed.type}/${embed.id}`}
            width="100%"
            height={embedHeight(embed.type)}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-input border-0"
          />
        )}
      </Card>
    </section>
  );
}
