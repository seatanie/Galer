export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteTitle,
  tagline,
  heroTitle,
  heroSubtitle,
  heroRooms[]{
    title,
    description,
    wallImage,
    accentColor
  },
  sections
}`;

export const GALLERIES_QUERY = `*[_type == "gallery" && published != false] | order(order asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  featured,
  description,
  coverImage,
  order,
  published,
  "category": category->{ title, "slug": slug.current, color },
  "images": images[]{
    _key,
    asset,
    alt,
    caption
  }
}`;

export const GALLERY_BY_SLUG_QUERY = `*[_type == "gallery" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  featured,
  description,
  coverImage,
  "images": images[]{
    _key,
    asset,
    alt,
    caption
  }
}`;

export const VIDEOS_QUERY = `*[_type == "video" && published != false] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  videoUrl,
  poster,
  featured,
  autoplay
}`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  color
}`;

export const SECTIONS_QUERY = `*[_type == "section" && enabled == true] | order(order asc) {
  _id,
  title,
  key,
  enabled,
  headline,
  body,
  image,
  order
}`;

export const HOME_PAGE_QUERY = `{
  "settings": ${SITE_SETTINGS_QUERY},
  "galleries": ${GALLERIES_QUERY},
  "videos": ${VIDEOS_QUERY},
  "categories": ${CATEGORIES_QUERY},
  "sections": ${SECTIONS_QUERY}
}`;
