import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://zenn.dev/api/articles?order=latest');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Zenn APIからのデータ取得に失敗しました:', error);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}