export default {
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  fields: [
    { name: "siteTitle", title: "Título del sitio", type: "string" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "heroTitle", title: "Título Hero", type: "string" },
    { name: "heroSubtitle", title: "Subtítulo Hero", type: "text" },
    {
      name: "heroRooms",
      title: "Salas 3D Hero",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Título", type: "string" },
            { name: "description", title: "Descripción", type: "text" },
            { name: "wallImage", title: "Imagen pared", type: "image" },
            { name: "accentColor", title: "Color acento", type: "string" },
          ],
        },
      ],
    },
    {
      name: "sections",
      title: "Secciones activas",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Hero 3D", value: "hero" },
          { title: "Masonry", value: "masonry" },
          { title: "Videos", value: "videos" },
          { title: "WebGL", value: "webgl" },
          { title: "Destacadas", value: "featured" },
        ],
      },
    },
  ],
};
