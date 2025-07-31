/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.ulishastore.com",
    },
    {
      url: "https://www.ulishastore.com/category",
    },
    {
      url: "https://www.ulishastore.com/category/accessories",
    },
    {
      url: "https://www.ulishastore.com/category/shoes",
    },
    {
      url: "https://www.ulishastore.com/category/clothes",
    },
    {
      url: "https://www.ulishastore.com/category/handbags",
    },
    {
      url: "https://www.ulishastore.com/category/electronics",
    },
    {
      url: "https://www.ulishastore.com/category/phones",
    },
    {
      url: "https://www.ulishastore.com/category/smart-watches",
    },
    {
      url: "https://www.ulishastore.com/about",
    },
    {
      url: "https://www.ulishastore.com/privacy",
    },
    {
      url: "https://www.ulishastore.com/returns",
    },
    {
      url: "https://www.ulishastore.com/login",
    },
    {
      url: "https://www.ulishastore.com/register",
    },
  ];
}
