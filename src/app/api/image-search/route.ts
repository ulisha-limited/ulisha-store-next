/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { supabase } from '@/lib/supabase';
import path from 'path';

// IMPORTANT: Never expose your API key or key file on the client-side.
const keyFilename = path.join(process.cwd(), 'path/to/your-google-cloud-key-file.json');

// Initialize the Vision client
const visionClient = new ImageAnnotatorClient({ keyFilename });

// This interface should match the structure of your Supabase table
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  tags: string[]; // Assuming your Supabase column is a text array
}

export async function POST(req: Request) {
  try {
    // Parse the incoming form data to get the image file
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    // Convert the file to a Buffer
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // Send the image to the Google Cloud Vision API for label detection
    const [result] = await visionClient.labelDetection(imageBuffer);
    const labels = result.labelAnnotations || [];
    const detectedLabels = labels.map(label => label.description?.toLowerCase()).filter(Boolean) as string[];

    console.log('Detected labels:', detectedLabels);

    // Fetch products from the Supabase table where the tags column contains any of the detected labels.
    // The query uses the 'overlap' operator (@>) for array columns.
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .overlaps('tags', detectedLabels);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Failed to fetch products from the database.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      labels: detectedLabels,
      products: products,
    }, { status: 200 });

  } catch (error) {
    console.error('Error in image search API:', error);
    return NextResponse.json({ error: 'Failed to process image search.' }, { status: 500 });
  }
}
