import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Connect to Gradio client
    const client = await Client.connect("ChronoSpinner/SugarCane_Prediction_Model");
    
    // Send the file to the prediction API
    const result = await client.predict("/predict", {
      file_obj: file,
    });

    // Return the prediction result
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error processing prediction:', error);
    return NextResponse.json(
      { error: 'Failed to process prediction' },
      { status: 500 }
    );
  }
}