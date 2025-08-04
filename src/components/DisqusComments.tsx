"use client";

import { useEffect, useState } from "react";

interface DisqusCommentsProps {
  slug: string;
  title: string;
}

export default function DisqusComments({
  slug,
  title,
}: DisqusCommentsProps) {
  const [DiscussionEmbed, setDiscussionEmbed] = useState<any>(null);

  useEffect(() => {
    import("disqus-react").then((mod) => {
      setDiscussionEmbed(() => mod.DiscussionEmbed);
    });
  }, []);

  if (!DiscussionEmbed) return null;

  const disqusShortname = "ulishastore";
  const disqusConfig = {
    url: `https://www.ulishastore.com/${slug}`,
    identifier: slug,
    title: title,
  };

  return <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />;
}
