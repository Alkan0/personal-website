import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://amichalo.gr";
  return [
    { url: `${base}/`, priority: 1.0, lastModified: new Date() },
    { url: `${base}/#about`, priority: 0.7, lastModified: new Date() },
    { url: `${base}/#experience`, priority: 0.7, lastModified: new Date() },
    { url: `${base}/#projects`, priority: 0.7, lastModified: new Date() },
    { url: `${base}/#contact`, priority: 0.6, lastModified: new Date() },
  ];
}
