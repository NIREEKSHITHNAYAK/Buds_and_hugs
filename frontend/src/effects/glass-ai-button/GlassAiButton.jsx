import { useEffect, useRef, useState } from 'react';
import glassStudyHtml from './glass-ai-button.html?raw';
import './styles.css';

/**
 * Hosts the original, self-contained Three.js r170 glass study in an opaque
 * sandbox. The iframe is mounted only while this section intersects the
 * viewport and the parent document is visible, releasing WebGL on hide.
 */
export function GlassAiButton({ onEnter }) {
  const hostRef = useRef(null);
  const frameRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMessage = event => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === 'flower-store-enter') onEnter?.();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEnter]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let intersects = false;
    const update = () => {
      setIsVisible(intersects && document.visibilityState === 'visible');
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting;
      update();
    }, { threshold: 0.01 });
    observer.observe(host);
    document.addEventListener('visibilitychange', update);
    update();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <div className="glass-ai-host" ref={hostRef}>
      {isVisible ? (
        <iframe
          ref={frameRef}
          className="glass-ai-frame"
          title="Welcome to the flower art store"
          srcDoc={glassStudyHtml}
          sandbox="allow-scripts"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="glass-ai-placeholder" aria-label="Interactive glass animation loads when visible" />
      )}
    </div>
  );
}

export default GlassAiButton;
