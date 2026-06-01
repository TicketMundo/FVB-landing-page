interface Props {
  spotify: string;
}

function toEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const match = url.match(/open\.spotify\.com(\/(artist|album|playlist|track)\/[^?#]+)/);
  if (match) return `https://open.spotify.com/embed${match[1]}`;
  return url;
}

export function SpotifySection({ spotify }: Props) {
  const embedUrl = toEmbedUrl(spotify);
  if (!embedUrl) return null;
  return (
    <div className="h-full flex flex-col">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ minHeight: 380 }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-card flex-1"
        title="Spotify player"
      />
    </div>
  );
}
