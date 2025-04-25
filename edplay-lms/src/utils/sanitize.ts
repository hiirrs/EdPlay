import sanitizeHtml from 'sanitize-html';

export function sanitize(content: string) {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
      img: ['src', 'alt'],
    },
    allowedSchemes: ['data', 'http', 'https'],
  });
}
