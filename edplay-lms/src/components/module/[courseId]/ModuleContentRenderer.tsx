'use client';

import { sanitize } from '~/utils/sanitize';

interface Props {
  html: string;
}

export default function ModuleContentRenderer({ html }: Props) {
  const cleanHtml = sanitize(html);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
