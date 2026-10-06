import React, { useEffect, useRef } from 'react';
import walkingManData from '@/assets/walking-man.json';

interface WalkingLottieCharacterProps {
  width?: number;
  height?: number;
  speed?: number;
  className?: string;
}

export default function WalkingLottieCharacter({
  width = 54,
  height = 82,
  speed = 1.15,
  className = '',
}: WalkingLottieCharacterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let anim: any = null;
    let isMounted = true;

    // Dynamically import lottie-web on client-side only
    import('lottie-web').then((lottieModule) => {
      if (!isMounted || !containerRef.current) return;
      const lottie = lottieModule.default || lottieModule;

      try {
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: walkingManData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: true,
          },
        });

        if (speed && anim.setSpeed) {
          anim.setSpeed(speed);
        }
      } catch (err) {
        console.error('Error loading Lottie walking character:', err);
      }
    });

    return () => {
      isMounted = false;
      if (anim) {
        try {
          anim.destroy();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    />
  );
}
