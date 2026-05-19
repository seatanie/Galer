export default {
  name: "gallery",
  title: "Galería",
  type: "document",
  fields: [
    { name: "title", title: "Título", type: "string", validation: (R: { required: () => unknown }) => R.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    },
    { name: "featured", title: "Destacada", type: "boolean", initialValue: false },
    { name: "description", title: "Descripción", type: "text" },
    {
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
    },
    { name: "coverImage", title: "Portada", type: "image" },
    {
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            { name: "alt", title: "Alt", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
      ],
    },
    { name: "order", title: "Orden", type: "number", initialValue: 0 },
    { name: "published", title: "Publicada", type: "boolean", initialValue: true },
  ],
  orderings: [
    { title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
};
