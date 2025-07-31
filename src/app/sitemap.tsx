/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ulishastore.com",
    },
    {
      url: "https://ulishastore.com/category",
    },
    {
      url: "https://ulishastore.com/category/accessories",
    },
    {
      url: "https://ulishastore.com/category/shoes",
    },
    {
      url: "https://ulishastore.com/category/clothes",
    },
    {
      url: "https://ulishastore.com/category/handbags",
    },
    {
      url: "https://ulishastore.com/category/electronics",
    },
    {
      url: "https://ulishastore.com/category/phones",
    },
    {
      url: "https://ulishastore.com/category/smart-watches",
    },
    {
      url: "https://ulishastore.com/about",
    },
    {
      url: "https://ulishastore.com/privacy",
    },
    {
      url: "https://ulishastore.com/returns",
    },
    {
      url: "https://ulishastore.com/login",
    },
    {
      url: "https://ulishastore.com/register",
    },
  ];
}
