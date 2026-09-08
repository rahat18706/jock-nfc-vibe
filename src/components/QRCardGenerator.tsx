import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode, Palette, Type, Link2, Sparkles } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  slug: string;
  destinationUrl: string;
}

interface Props {
  businesses: Business[];
}

export default function QRCardGenerator({ businesses }: Props) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(businesses[0] || null);
  const [url, setUrl] = useState(businesses[0]?.destinationUrl || 'https://g.page/r/your-business/review');
  const [title, setTitle] = useState('TAP OR SCAN');
  const [subtitle, setSubtitle] = useState('review us on Google');
  const [colors, setColors] = useState({
    c1: '#34A853', // TL - Google Green
    c2: '#FBBC05', // TR - Google Yellow
    c3: '#4285F4', // BL - Google Blue
    c4: '#EA4335', // BR - Google Red
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrImageRef = useRef<HTMLImageElement | null>(null);

  // Update URL when business changes
  useEffect(() => {
    if (selectedBusiness) {
      setUrl(selectedBusiness.destinationUrl);
    }
  }, [selectedBusiness]);

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      if (!url) return;
      
      try {
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 640,
          margin: 0,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#1a1d21',
            light: '#00000000'
          }
        });
        
        const img = new Image();
        img.onload = () => {
          qrImageRef.current = img;
          renderCanvas();
        };
        img.src = qrDataUrl;
      } catch (err) {
        console.error('QR generation error:', err);
      }
    };

    const timer = setTimeout(generateQR, 250);
    return () => clearTimeout(timer);
  }, [url]);

  // Re-render on color/text changes
  useEffect(() => {
    renderCanvas();
  }, [title, subtitle, colors]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Helper: rounded rect path
    const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(20,20,25,0.28)';
    ctx.shadowBlur = 46;
    ctx.shadowOffsetY = 22;
    roundedRectPath(0, 0, W, H, 70);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();

    // Card base with clip
    ctx.save();
    roundedRectPath(0, 0, W, H, 70);
    ctx.clip();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Corner blobs
    const drawCornerBlob = (corner: string, color: string) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      
      if (corner === 'tl') {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, H * 0.335);
        ctx.bezierCurveTo(W * 0.05, H * 0.11, W * 0.28, H * 0.015, W * 0.5, 0);
        ctx.closePath();
      } else if (corner === 'tr') {
        ctx.moveTo(W, 0);
        ctx.lineTo(W, H * 0.335);
        ctx.bezierCurveTo(W * 0.95, H * 0.11, W * 0.72, H * 0.015, W * 0.5, 0);
        ctx.closePath();
      } else if (corner === 'bl') {
        ctx.moveTo(0, H);
        ctx.lineTo(0, H * 0.665);
        ctx.bezierCurveTo(W * 0.05, H * 0.89, W * 0.28, H * 0.985, W * 0.5, H);
        ctx.closePath();
      } else if (corner === 'br') {
        ctx.moveTo(W, H);
        ctx.lineTo(W, H * 0.665);
        ctx.bezierCurveTo(W * 0.95, H * 0.89, W * 0.72, H * 0.985, W * 0.5, H);
        ctx.closePath();
      }
      
      ctx.fill();
      ctx.restore();
    };

    drawCornerBlob('tl', colors.c1);
    drawCornerBlob('tr', colors.c2);
    drawCornerBlob('bl', colors.c3);
    drawCornerBlob('br', colors.c4);

    ctx.restore();

    // WiFi icon
    const drawWifiIcon = (cx: number, cy: number) => {
      ctx.save();
      ctx.strokeStyle = '#1a1d21';
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const r = 24 + i * 25;
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 1.24, Math.PI * 1.76);
        ctx.stroke();
      }
      ctx.restore();
    };

    drawWifiIcon(W / 2, 155);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1a1d21';
    ctx.font = `800 66px 'Poppins', sans-serif`;
    ctx.fillText(title || 'TAP OR SCAN', W / 2, 305);

    // Subtitle with Google coloring
    const drawGoogleText = (text: string, x: number, y: number, fontSize: number, weight: number) => {
      const colors = { g: '#4285F4', o: ['#EA4335', '#FBBC05'], l: '#34A853', e: '#EA4335' };
      ctx.font = `${weight} ${fontSize}px 'Poppins', sans-serif`;
      ctx.textBaseline = 'alphabetic';
      let cursorX = x;
      let oCount = 0;
      
      for (const ch of text) {
        let fill = '#1a1d21';
        const lower = ch.toLowerCase();
        
        if (lower === 'g' && ch === ch.toUpperCase()) fill = colors.g;
        else if (lower === 'o') { fill = colors.o[oCount % 2]; oCount++; }
        else if (lower === 'l') fill = colors.l;
        else if (lower === 'e') fill = colors.e;
        else if (lower === 'g') fill = colors.g;
        
        ctx.fillStyle = fill;
        ctx.fillText(ch, cursorX, y);
        cursorX += ctx.measureText(ch).width;
      }
      
      return cursorX - x;
    };

    const subtitleText = subtitle || 'review us on Google';
    ctx.font = `600 40px 'Manrope', sans-serif`;
    const googleIdx = subtitleText.toLowerCase().lastIndexOf('google');
    
    if (googleIdx !== -1) {
      const before = subtitleText.slice(0, googleIdx);
      const googleWord = subtitleText.slice(googleIdx, googleIdx + 6);
      const after = subtitleText.slice(googleIdx + 6);
      
      ctx.font = `600 40px 'Manrope', sans-serif`;
      const beforeWidth = ctx.measureText(before).width;
      ctx.font = `700 40px 'Poppins', sans-serif`;
      let googleWidth = 0;
      for (const ch of googleWord) googleWidth += ctx.measureText(ch).width;
      ctx.font = `600 40px 'Manrope', sans-serif`;
      const afterWidth = ctx.measureText(after).width;
      const totalWidth = beforeWidth + googleWidth + afterWidth;
      let startX = W / 2 - totalWidth / 2;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#5b6067';
      ctx.font = `600 40px 'Manrope', sans-serif`;
      ctx.fillText(before, startX, 365);
      startX += beforeWidth;

      const gw = drawGoogleText(googleWord, startX, 365, 40, 700);
      startX += gw;

      ctx.fillStyle = '#5b6067';
      ctx.font = `600 40px 'Manrope', sans-serif`;
      ctx.fillText(after, startX, 365);
      ctx.textAlign = 'center';
    } else {
      ctx.fillStyle = '#5b6067';
      ctx.fillText(subtitleText, W / 2, 365);
    }

    // QR Code
    const qrSize = 640;
    const qrX = W / 2 - qrSize / 2;
    const qrY = 450;
    
    if (qrImageRef.current) {
      ctx.drawImage(qrImageRef.current, qrX, qrY, qrSize, qrSize);
    }

    // Bottom icons: Tap | Scan
    const drawHandBase = (cx: number, cy: number, mirror: boolean) => {
      const m = mirror ? -1 : 1;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(m, 1);
      ctx.strokeStyle = '#1a1d21';
      ctx.lineWidth = 5.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Phone body
      ctx.save();
      ctx.rotate(-0.12);
      roundedRectPath(-26, -46, 52, 68, 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-16, 8);
      ctx.lineTo(16, 8);
      ctx.stroke();
      ctx.restore();

      // Hand
      ctx.beginPath();
      ctx.moveTo(-34, 18);
      ctx.quadraticCurveTo(-30, 46, -6, 50);
      ctx.quadraticCurveTo(24, 52, 34, 30);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-20, 30);
      ctx.quadraticCurveTo(-16, 40, -2, 41);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(4, 31);
      ctx.quadraticCurveTo(10, 40, 22, 36);
      ctx.stroke();

      ctx.restore();
    };

    const drawTapIcon = (cx: number, cy: number) => {
      drawHandBase(cx, cy, false);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = '#1a1d21';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(30, -34, 10 + i * 10, Math.PI * 1.15, Math.PI * 1.65);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawScanIcon = (cx: number, cy: number) => {
      drawHandBase(cx, cy, true);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(-1, 1);
      ctx.strokeStyle = '#1a1d21';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(32, -32, 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(41, -23);
      ctx.lineTo(50, -14);
      ctx.stroke();
      ctx.restore();
    };

    const iconY = qrY + qrSize + 95;
    ctx.strokeStyle = '#c7c9cc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2, iconY - 34);
    ctx.lineTo(W / 2, iconY + 34);
    ctx.stroke();

    drawTapIcon(W / 2 - 145, iconY);
    drawScanIcon(W / 2 + 145, iconY);

    // Labels
    const labelY = iconY + 110;
    ctx.font = `700 34px 'Poppins', sans-serif`;
    ctx.fillStyle = '#1a1d21';
    ctx.textAlign = 'right';
    ctx.fillText('Tap', W / 2 - 60, labelY);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9aa0a6';
    ctx.font = `600 30px 'Manrope', sans-serif`;
    ctx.fillText('or', W / 2, labelY);
    ctx.font = `700 34px 'Poppins', sans-serif`;
    ctx.fillStyle = '#1a1d21';
    ctx.textAlign = 'left';
    ctx.fillText('Scan', W / 2 + 60, labelY);

    ctx.font = `600 30px 'Manrope', sans-serif`;
    ctx.fillStyle = '#c7c9cc';
    ctx.textAlign = 'right';
    ctx.fillText('|', W / 2 - 78, labelY);
    ctx.textAlign = 'left';
    ctx.fillText('|', W / 2 + 42, labelY);
    ctx.textAlign = 'center';
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement('a');
      link.download = `${selectedBusiness?.slug || 'review'}-qr-card.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      setIsGenerating(false);
    }, 'image/png');
  };

  const presets = [
    { name: 'Google', colors: { c1: '#34A853', c2: '#FBBC05', c3: '#4285F4', c4: '#EA4335' } },
    { name: 'Ocean', colors: { c1: '#0ea5e9', c2: '#06b6d4', c3: '#3b82f6', c4: '#8b5cf6' } },
    { name: 'Sunset', colors: { c1: '#f97316', c2: '#ef4444', c3: '#ec4899', c4: '#a855f7' } },
    { name: 'Forest', colors: { c1: '#10b981', c2: '#84cc16', c3: '#14b8a6', c4: '#06b6d4' } },
    { name: 'Mono', colors: { c1: '#1a1d21', c2: '#3f4347', c3: '#5b6067', c4: '#7a7f86' } },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">QR Card Generator</h2>
          <p className="text-sm text-stone-500 mt-1">Create custom QR cards for your businesses</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Controls Panel */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 h-fit">
          {/* Business Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Business
            </label>
            <select
              value={selectedBusiness?.id || ''}
              onChange={(e) => {
                const biz = businesses.find(b => b.id === e.target.value);
                setSelectedBusiness(biz || null);
              }}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 text-sm font-medium focus:border-coral focus:outline-none transition-colors"
            >
              {businesses.map(biz => (
                <option key={biz.id} value={biz.id}>{biz.name}</option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              <Link2 className="w-3.5 h-3.5" />
              Destination URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://g.page/r/your-business/review"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 text-sm focus:border-coral focus:outline-none transition-colors"
            />
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              <Type className="w-3.5 h-3.5" />
              Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={24}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 text-sm focus:border-coral focus:outline-none transition-colors"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 block">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 text-sm focus:border-coral focus:outline-none transition-colors"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
              <Palette className="w-3.5 h-3.5" />
              Corner Colors
            </label>
            
            {/* Presets */}
            <div className="flex gap-2 mb-3">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setColors(preset.colors)}
                  className="flex-1 aspect-square rounded-lg overflow-hidden border-2 border-stone-200 hover:border-coral transition-colors group"
                  title={preset.name}
                >
                  <div className="w-full h-full grid grid-cols-2">
                    <div style={{ background: preset.colors.c1 }} />
                    <div style={{ background: preset.colors.c2 }} />
                    <div style={{ background: preset.colors.c3 }} />
                    <div style={{ background: preset.colors.c4 }} />
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(colors).map(([key, value], i) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                    className="w-full aspect-square rounded-xl border-2 border-stone-200 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-stone-400">
                    {['TL', 'TR', 'BL', 'BR'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white rounded-xl font-bold hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Download PNG'}
          </button>

          <p className="text-xs text-stone-400 leading-relaxed">
            Transparent background. Change the URL anytime and re-download. Perfect for printing on cards, posters, or menus.
          </p>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 flex items-center justify-center">
          <div className="relative">
            {/* Checkerboard background to show transparency */}
            <div 
              className="rounded-3xl p-6"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #eee 25%, transparent 25%),
                  linear-gradient(-45deg, #eee 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #eee 75%),
                  linear-gradient(-45deg, transparent 75%, #eee 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                backgroundColor: '#fff'
              }}
            >
              <canvas
                ref={canvasRef}
                width={1200}
                height={1900}
                className="w-[300px] h-auto"
                style={{ display: 'block' }}
              />
            </div>
            
            {/* Preview label */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-coral text-white text-xs font-bold rounded-full">
              LIVE PREVIEW
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-coral/5 border-2 border-coral/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
            <QrCode className="w-5 h-5 text-coral" />
          </div>
          <div>
            <h3 className="font-bold text-ink mb-1">How it works</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              The QR code points to your business's destination URL. When customers scan it, they're redirected to leave a Google review. 
              You can change the destination URL anytime in your dashboard without reprinting the card — just update the link and regenerate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
