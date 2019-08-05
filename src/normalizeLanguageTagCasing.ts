/**
 * Implements RFC 5646, to quote it:
 *
 * ‘An implementation can reproduce this format without accessing the
 * registry as follows.  All subtags, including extension and private
 * use subtags, use lowercase letters with two exceptions: two-letter
 * and four-letter subtags that neither appear at the start of the tag
 * nor occur after singletons.  Such two-letter subtags are all
 * uppercase (as in the tags "en-CA-x-ca" or "sgn-BE-FR") and four-
 * letter subtags are titlecase (as in the tag "az-Latn-x-latn").’
 *
 * @params tag - an IETF language tag.
 */

export default function normalizeLanguageTagCasing(tag: string) {
  const parts = tag.split(/-/);

  return parts
    .map((part, index) => {
      // console.log('Part', part);
      if (index !== 0 && parts[index - 1].length !== 1) {
        if (part.length === 2) {
          return part.toUpperCase();
        }
        if (part.length === 4) {
          return `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}`;
        }
      }
      return part.toLowerCase();
    })
    .join('-');
}
