import { redirect, notFound } from 'next/navigation';

// This route handles NFC card taps
// URL: /s/[cardId]
// The Express backend handles the actual redirect,
// but this is the Next.js fallback/intermediate page

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fetch card data from API
async function getCardData(cardId) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/s/${cardId}/info`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function RedirectPage({ params }) {
  const { cardId } = params;
  
  // Get card info for the intermediate page
  const cardData = await getCardData(cardId);

  if (!cardData) {
    notFound();
  }

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redirecting to {cardData.business?.name || 'Business'}...</title>
        <meta name="robots" content="noindex, nofollow" />
        {/* Auto-redirect via meta refresh as fallback */}
        <meta httpEquiv="refresh" content={`0;url=/api/redirect/${cardId}`} />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; background: #f8f9fa;
          }
          .container { text-align: center; padding: 2rem; }
          .spinner {
            width: 40px; height: 40px; margin: 0 auto 1rem;
            border: 3px solid #e5e7eb; border-top-color: #3b82f6;
            border-radius: 50%; animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          h1 { font-size: 1.25rem; color: #111827; margin-bottom: 0.5rem; }
          p { color: #6b7280; font-size: 0.875rem; }
          .business { 
            display: inline-flex; align-items: center; gap: 0.5rem;
            margin-top: 1rem; padding: 0.5rem 1rem;
            background: white; border-radius: 9999px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="spinner" />
          <h1>Redirecting...</h1>
          <p>You&apos;ll be redirected to leave a review shortly.</p>
          {cardData.business && (
            <div className="business">
              <span>{cardData.business.name}</span>
            </div>
          )}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          // Try to redirect immediately via JS
          window.location.replace('/s/${cardId}?redirect=true');
        `}} />
      </body>
    </html>
  );
}

export async function generateMetadata({ params }) {
  return {
    title: 'Redirecting...',
    robots: { index: false, follow: false },
  };
}
