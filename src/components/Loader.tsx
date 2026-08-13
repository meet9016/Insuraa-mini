import React from 'react';

export default function Loader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root{
          --blue:#2c3a8c;
          --blue-soft:#5b6bd6;
          --green-dark:#0f9d70;
          --green-light:#5fe0ac;
          --bg:#eef1fa;
        }
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(238, 241, 250, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }
        .wrap{
          position:relative;
          width:200px;
          height:200px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .glow{
          position:absolute;
          width:170px;
          height:170px;
          border-radius:50%;
          background:radial-gradient(circle, rgba(95,224,172,.35), rgba(44,58,140,.25) 55%, transparent 75%);
          filter:blur(22px);
          animation:glowPulse 2.8s ease-in-out infinite;
        }
        @keyframes glowPulse{
          0%,100%{ transform:scale(.9); opacity:.7; }
          50%{ transform:scale(1.08); opacity:1; }
        }
        .track-ring{
          position:absolute;
          width:172px;
          height:172px;
          border-radius:50%;
          border:1px solid rgba(44,58,140,.12);
        }
        .orbit{
          position:absolute;
          width:172px;
          height:172px;
          animation:spin 2s linear infinite;
        }
        .orbit svg{ width:100%; height:100%; display:block; overflow:visible; }
        @keyframes spin{ to{ transform:rotate(360deg); } }
        .disc{
          position:relative;
          width:126px;
          height:126px;
          border-radius:50%;
          background:rgba(255,255,255,.65);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,.8);
          box-shadow:
            0 14px 30px -10px rgba(44,58,140,.32),
            inset 0 1px 0 rgba(255,255,255,.9);
          display:flex;
          align-items:center;
          justify-content:center;
          animation:breathe 2.8s ease-in-out infinite;
        }
        @keyframes breathe{
          0%,100%{ transform:scale(1); }
          50%{ transform:scale(1.045); }
        }
        .disc img{
          width:78px;
          height:auto;
          display:block;
          filter:drop-shadow(0 3px 8px rgba(44,58,140,.2));
        }
        .spark{
          position:absolute;
          width:172px;
          height:172px;
          animation:spin 2s linear infinite;
        }
        .spark i{
          position:absolute;
          top:0; left:50%;
          width:8px; height:8px;
          margin-left:-4px;
          border-radius:50%;
          background:var(--green-light);
          box-shadow:0 0 10px 2px rgba(95,224,172,.9), 0 0 2px rgba(255,255,255,.9);
        }
        @media (prefers-reduced-motion: reduce){
          .glow,.orbit,.disc,.spark{ animation:none !important; }
        }
      `}} />
      <div className="loader-container">
        <div className="wrap">
          <div className="track-ring"></div>
          <div className="orbit">
            <svg viewBox="0 0 172 172">
              <defs>
                <linearGradient id="tail" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5fe0ac" stopOpacity="0"/>
                  <stop offset="75%" stopColor="#5fe0ac" stopOpacity=".7"/>
                  <stop offset="100%" stopColor="#2c3a8c"/>
                </linearGradient>
              </defs>
              <circle cx="86" cy="86" r="82" fill="none" stroke="url(#tail)"
                strokeWidth="3.4" strokeLinecap="round"
                strokeDasharray="150 425" />
            </svg>
          </div>
          <div className="spark"><i></i></div>
          <div className="disc">
            <img src="/logo.png" alt="Logo" />
          </div>
        </div>
      </div>
    </>
  );
}
