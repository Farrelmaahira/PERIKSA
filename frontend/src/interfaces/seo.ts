export interface PageMetadataOptions {
  title: string
  description: string
  path: string
  /* Skip the "| PERIKSA" suffix, for the home page whose title already is the brand. */
  absolute?: boolean
  noindex?: boolean
}
