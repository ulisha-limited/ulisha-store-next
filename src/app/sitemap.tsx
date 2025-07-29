import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ulishastore.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://ulishastore.com/category",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/category/Accessories",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/category/Shoes",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/category/Clothes",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/category/Handbags",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/category/Electronics",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/category/Phones",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/category/Smart%20Watches",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://ulishastore.com/about",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://ulishastore.com/privacy",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://ulishastore.com/returns",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://ulishastore.com/login",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://ulishastore.com/register",
      lastModified: new Date(),
      priority: 0.7,
    },
  ];
}
