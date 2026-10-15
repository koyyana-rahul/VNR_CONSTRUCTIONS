/**
 * ============================================================================
 * TESTIMONIALS — EMPTY BY DESIGN
 * ============================================================================
 *
 * The brief: "Display only authentic customer testimonials approved for
 * publication. If none are available, omit the section until genuine content
 * is supplied."
 *
 * No testimonials were supplied, so this array is intentionally empty and the
 * <Testimonials /> component renders `null` — the section does not appear on
 * the homepage at all. There are no placeholder quotes, no invented client
 * names and no star ratings anywhere in this build.
 *
 * Shape once populated (all fields verified with the reviewer before use):
 *   {
 *     id: 't-001',
 *     quote: '…',
 *     author: '…',           // full name, if the client consented
 *     role: '…',             // optional, e.g. 'Homeowner'
 *     projectSlug: '…',      // optional link to the related project
 *     verified: true,        // must be true to render
 *   }
 */
export const testimonials = [];

export default testimonials;