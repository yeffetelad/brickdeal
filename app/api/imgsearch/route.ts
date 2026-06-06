import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Upload image to AliExpress image search
    const aliForm = new FormData();
    aliForm.append('imageData', image);

    const uploadRes = await fetch('https://image.aliexpress.com/imageUpload.htm', {
      method: 'POST',
      body: aliForm,
      headers: {
        'Referer': 'https://www.aliexpress.com/',
        'Origin': 'https://www.aliexpress.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const text = await uploadRes.text();
    let data: { imageId?: string; imageUrl?: string; status?: string } = {};

    try {
      data = JSON.parse(text);
    } catch {
      // not JSON — fall through to fallback
    }

    if (data.imageUrl || data.imageId) {
      const imgUrl = data.imageUrl ?? '';
      const searchUrl = `https://www.aliexpress.com/wholesale?SearchText=&imgUrl=${encodeURIComponent(imgUrl)}&CatId=0&initiative_id=SB_search`;
      return NextResponse.json({ searchUrl });
    }

    // Fallback: Google Lens (reliably shows AliExpress results)
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = image.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Return a signal to the client to use Google Lens fallback
    return NextResponse.json({ fallback: true, dataUrl }, { status: 200 });

  } catch (err) {
    console.error('imgsearch error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
