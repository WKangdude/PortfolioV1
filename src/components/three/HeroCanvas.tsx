'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { SceneFallback } from './SceneFallback';
import styles from './Scene.module.css';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <SceneFallback />,
});

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

export function HeroCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>(
    'loading',
  );
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (media.matches) {
        setStatus('fallback');
        return;
      }
      try {
        const probe = document.createElement('canvas');
        const context = probe.getContext('webgl2');
        if (!context) {
          setStatus('fallback');
          return;
        }
        context.getExtension('WEBGL_lose_context')?.loseContext();
        setStatus('ready');
      } catch {
        setStatus('fallback');
      }
    };
    // La escena se descarga solo cuando la portada está cerca del viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          update();
          observer.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    if (host.current) observer.observe(host.current);
    media.addEventListener('change', update);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
    };
  }, []);

  return (
    <div className={styles.scene} ref={host}>
      <div className={styles.viewport}>
        {status === 'ready' ? (
          <SceneBoundary onFailure={() => setStatus('fallback')}>
            <HeroScene onUnavailable={() => setStatus('fallback')} />
          </SceneBoundary>
        ) : (
          <SceneFallback />
        )}
      </div>
      <div className={styles.hint}>
        <Icon name="refresh" />
        <span>
          {status === 'ready'
            ? 'Mueve el cursor o haz clic para transformar'
            : 'Datos y geometría, en una misma forma'}
        </span>
      </div>
    </div>
  );
}
