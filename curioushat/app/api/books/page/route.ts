import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * Serves original PDF page images for the book reader.
 *
 * For the sample book (9999), serves the uploaded PDF directly.
 * In production, this would serve pre-rendered PNG pages from the conversion pipeline.
 *
 * Usage: GET /api/books/page?book=9999&page=1
 */
export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get('book')
  const page = req.nextUrl.searchParams.get('page')

  if (!bookId || !page) {
    return NextResponse.json({ error: 'Missing book or page parameter' }, { status: 400 })
  }

  // For sample book, serve the original PDF
  if (bookId === '9999') {
    try {
      // Try to find the PDF in public/books/sample/
      const pdfPath = join(process.cwd(), 'public', 'books', 'sample', 'eemm101.pdf')
      const pdfBuffer = await readFile(pdfPath)

      // Return the full PDF with a page hint header
      // The client-side PDF.js renderer will handle page extraction
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Cache-Control': 'public, max-age=86400',
          'X-Page-Requested': page,
        },
      })
    } catch {
      // PDF not found — return a placeholder
      return NextResponse.json({
        error: 'PDF not found. Place eemm101.pdf in public/books/sample/',
        hint: 'Copy the uploaded PDF to: curioushat/public/books/sample/eemm101.pdf'
      }, { status: 404 })
    }
  }

  return NextResponse.json({ error: 'Book not found' }, { status: 404 })
}
