import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Insuraa</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="page-404-container">
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --indigo: #2E3192;
            --indigo-deep: #232569;
            --teal: #2BBF8C;
            --teal-light: #6EE7C0;
            --bg: #F5F8FC;
            --slate: #5B6584;
            --slate-dark: #2B2F4C;
          }

          .page-404-container {
            min-height: 100vh;
            background:
              radial-gradient(ellipse 900px 500px at 50% -10%, #EAF1FF 0%, transparent 60%),
              var(--bg);
            font-family: 'Inter', sans-serif;
            color: var(--slate-dark);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px 20px;
            overflow-x: hidden;
          }

          /* ---------- Wordmark ---------- */
          .page-404-container .wordmark {
            position: fixed;
            top: 28px;
            left: 36px;
            display: flex;
            align-items: flex-end;
            gap: 4px;
            font-family: 'Manrope', sans-serif;
            font-weight: 800;
            font-size: 20px;
            color: var(--indigo);
            letter-spacing: -0.5px;
          }
          .page-404-container .wordmark .bars { display: flex; align-items: flex-end; gap: 2px; margin-left: 2px; }
          .page-404-container .wordmark .bar { width: 5px; background: var(--teal); border-radius: 2px; }
          .page-404-container .wordmark .bar:nth-child(1) { height: 9px; }
          .page-404-container .wordmark .bar:nth-child(2) { height: 15px; background: var(--teal-light); }

          /* ---------- Scene ---------- */
          .page-404-container .scene {
            position: relative;
            width: 340px;
            height: 250px;
            margin-bottom: 8px;
          }

          .page-404-container .rain {
            position: absolute;
            inset: 0;
            overflow: hidden;
          }
          .page-404-container .drop {
            position: absolute;
            top: -30px;
            width: 2.5px;
            height: 16px;
            border-radius: 2px;
            background: linear-gradient(to bottom, transparent, #9FB4E8);
            animation: fall linear infinite;
          }
          @keyframes fall {
            0% { transform: translateY(0); opacity: 0; }
            8% { opacity: 0.8; }
            62% { opacity: 0.8; }
            68% { transform: translateY(150px); opacity: 0; }
            100% { transform: translateY(150px); opacity: 0; }
          }

          .page-404-container .leak-drop {
            position: absolute;
            top: 96px;
            left: 171px;
            width: 5px;
            height: 5px;
            border-radius: 50% 50% 50% 0;
            background: var(--teal);
            transform: rotate(45deg);
            animation: leak 2.6s ease-in infinite;
          }
          @keyframes leak {
            0% { top: 96px; opacity: 0; }
            10% { opacity: 1; }
            75% { top: 198px; opacity: 1; }
            85% { top: 198px; opacity: 0; }
            100% { top: 198px; opacity: 0; }
          }

          .page-404-container .umbrella-wrap {
            position: absolute;
            top: 18px;
            left: 50%;
            transform-origin: 50% 12%;
            animation: sway 4.5s ease-in-out infinite;
            transform: translateX(-50%);
          }
          @keyframes sway {
            0%,100% { transform: translateX(-50%) rotate(-3.5deg); }
            50% { transform: translateX(-50%) rotate(3.5deg); }
          }

          .page-404-container .puddle-wrap {
            position: absolute;
            bottom: 6px;
            left: 0;
            right: 0;
            height: 40px;
          }
          .page-404-container .puddle {
            position: absolute;
            left: 50%;
            bottom: 14px;
            width: 40px;
            height: 9px;
            transform: translateX(-50%);
            background: radial-gradient(ellipse, rgba(43,191,140,0.35), transparent 70%);
            border-radius: 50%;
          }
          .page-404-container .ripple {
            position: absolute;
            left: 50%;
            bottom: 16px;
            width: 8px;
            height: 8px;
            border: 1.5px solid var(--teal);
            border-radius: 50%;
            transform: translateX(-50%);
            animation: ripple 2.6s ease-out infinite;
            opacity: 0;
          }
          .page-404-container .ripple.r2 { animation-delay: 0.15s; }
          @keyframes ripple {
            0% { width: 6px; height: 3px; opacity: 0; }
            12% { opacity: 0.7; }
            100% { width: 56px; height: 14px; opacity: 0; }
          }

          /* ---------- Copy ---------- */
          .page-404-container .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(43,191,140,0.12);
            color: var(--teal);
            border: 1px solid rgba(43,191,140,0.3);
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 12.5px;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 6px 14px;
            border-radius: 999px;
            margin-bottom: 18px;
          }
          .page-404-container .badge::before {
            content: '';
            width: 6px; height: 6px;
            border-radius: 50%;
            background: var(--teal);
          }

          .page-404-container h1 {
            font-family: 'Manrope', sans-serif;
            font-weight: 800;
            font-size: clamp(64px, 14vw, 96px);
            line-height: 1;
            color: var(--indigo);
            letter-spacing: -2px;
            margin-bottom: 14px;
          }

          .page-404-container h2 {
            font-family: 'Manrope', sans-serif;
            font-weight: 700;
            font-size: 22px;
            color: var(--slate-dark);
            margin-bottom: 10px;
            text-align: center;
          }

          .page-404-container p.sub {
            max-width: 420px;
            text-align: center;
            color: var(--slate);
            font-size: 15.5px;
            line-height: 1.6;
            margin-bottom: 32px;
          }

          .page-404-container .cta {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            background: var(--indigo);
            color: #fff;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 15px;
            padding: 14px 26px;
            border-radius: 12px;
            text-decoration: none;
            box-shadow: 0 8px 24px rgba(46,49,146,0.28);
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }
          .page-404-container .cta:hover {
            transform: translateY(-2px);
            background: var(--indigo-deep);
            box-shadow: 0 12px 28px rgba(46,49,146,0.35);
          }
          .page-404-container .cta svg { transition: transform 0.2s ease; }
          .page-404-container .cta:hover svg { transform: translateX(3px); }

          .page-404-container .ref {
            margin-top: 26px;
            font-family: 'Inter', sans-serif;
            font-size: 12.5px;
            color: #A6AFC7;
            letter-spacing: 0.04em;
          }

          @media (prefers-reduced-motion: reduce) {
            .page-404-container .drop, .page-404-container .leak-drop, .page-404-container .umbrella-wrap, .page-404-container .ripple { animation: none !important; }
          }

          @media (max-width: 480px) {
            .page-404-container .wordmark { top: 20px; left: 20px; font-size: 17px; }
            .page-404-container .scene { width: 280px; height: 210px; }
          }
        `}} />

        

        <div className="scene">
          <div className="rain">
            <div className="drop" style={{ left: '40px', animationDuration: '2.1s', animationDelay: '0s' }}></div>
            <div className="drop" style={{ left: '80px', animationDuration: '1.8s', animationDelay: '0.4s' }}></div>
            <div className="drop" style={{ left: '120px', animationDuration: '2.3s', animationDelay: '0.9s' }}></div>
            <div className="drop" style={{ left: '220px', animationDuration: '1.9s', animationDelay: '0.2s' }}></div>
            <div className="drop" style={{ left: '260px', animationDuration: '2.2s', animationDelay: '0.7s' }}></div>
            <div className="drop" style={{ left: '300px', animationDuration: '2.0s', animationDelay: '1.1s' }}></div>
            <div className="drop" style={{ left: '60px', animationDuration: '2.4s', animationDelay: '1.4s' }}></div>
            <div className="drop" style={{ left: '280px', animationDuration: '1.7s', animationDelay: '1.6s' }}></div>
          </div>

          <div className="leak-drop"></div>

          <div className="umbrella-wrap">
            <svg width="220" height="170" viewBox="0 0 220 170" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="canopy" x1="0" y1="0" x2="220" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2E3192" />
                  <stop offset="55%" stopColor="#3B4BB0" />
                  <stop offset="100%" stopColor="#2BBF8C" />
                </linearGradient>
              </defs>

              {/* canopy panels with a gap near the right */}
              <path d="M110 8
                       C60 8 22 34 8 78
                       L48 78
                       C54 58 74 44 92 40
                       L100 78
                       L130 78
                       L136 40
                       C150 43 164 55 170 72
                       L178 78
                       L212 78
                       C202 34 160 8 110 8 Z"
                fill="url(#canopy)" />

              {/* scalloped bottom edge */}
              <path d="M8 78 Q18 88 28 78 Q38 88 48 78 Q58 88 68 78 Q78 88 88 78 Q98 88 108 78 Q118 88 128 78 Q138 88 148 78 L178 78 Q188 88 178 78 L212 78"
                stroke="url(#canopy)" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* ferrule / pole */}
              <line x1="110" y1="8" x2="110" y2="0" stroke="#2BBF8C" strokeWidth="3" strokeLinecap="round" />
              <line x1="110" y1="78" x2="110" y2="150" stroke="#8892C9" strokeWidth="3.5" strokeLinecap="round" />

              {/* handle */}
              <path d="M110 150 C110 164 96 166 92 156" stroke="#2E3192" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          <div className="puddle-wrap">
            <div className="ripple"></div>
            <div className="ripple r2"></div>
            <div className="puddle"></div>
          </div>
        </div>

        <span className="badge">Claim #404</span>
        <h1>404</h1>
        <h2>There's a gap in this policy.</h2>
        <div className="wordmark">
          <img src="/logo.png" alt="Insuraa Logo" className="h-10 md:h-12" />
        </div>
        <p className="sub">
          The page you're looking for has lapsed, moved, or was never covered to begin with.
          Let's get you back to a page that's fully insured.
        </p>

        <Link href="/" className="cta">
          Back Dashboard
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="ref">Policy Ref: ERR‑404‑NF</div>
      </div>
    </>
  );
}

Custom404.noLayout = true;
