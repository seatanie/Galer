export default {
  name: "video",
  title: "Video",
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
    { name: "videoFile", title: "Archivo video", type: "file", options: { accept: "video/*" } },
    { name: "videoUrl", title: "URL externa (Vimeo/YouTube)", type: "url" },
    { name: "poster", title: "Poster", type: "image" },
    { name: "featured", title: "Destacado", type: "boolean", initialValue: false },
    { name: "autoplay", title: "Autoplay en sección", type: "boolean", initialValue: false },
    { name: "published", title: "Publicado", type: "boolean", initialValue: true },
  ],
};
