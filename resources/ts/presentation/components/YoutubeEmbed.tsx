type YoutubeEmbedProps = {
  videoId: string;
  title: string;
};

/**
 * Privacy-friendly YouTube embed (youtube-nocookie) with 16:9 frame.
 */
export const YoutubeEmbed = ({
  videoId,
  title,
}: YoutubeEmbedProps): React.ReactElement => {
  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-border bg-background">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};
