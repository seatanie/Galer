export default {
  name: "section",
  title: "Sección dinámica",
  type: "document",
  fields: [
    { name: "title", title: "Título", type: "string" },
    { name: "key", title: "Clave única", type: "string" },
    { name: "enabled", title: "Activa", type: "boolean", initialValue: true },
    { name: "headline", title: "Headline", type: "string" },
    { name: "body", title: "Cuerpo", type: "text" },
    { name: "image", title: "Imagen", type: "image" },
    { name: "order", title: "Orden", type: "number", initialValue: 0 },
  ],
};
