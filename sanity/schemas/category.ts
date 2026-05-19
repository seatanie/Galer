export default {
  name: "category",
  title: "Categoría",
  type: "document",
  fields: [
    { name: "title", title: "Título", type: "string", validation: (R: { required: () => unknown }) => R.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    },
    { name: "description", title: "Descripción", type: "text" },
    { name: "color", title: "Color", type: "string" },
  ],
};
