import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — Evasion-style IntersectionObserver hook
 * Tambahkan class 'in-view' ke element saat masuk viewport.
 * 
 * @param {Object} options
 * @param {number} options.threshold - 0.0–1.0, default 0.15
 * @param {string} options.rootMargin - CSS margin string, default '0px 0px -5% 0px'
 * @param {boolean} options.once - hanya animasikan sekali (default: true)
 * @returns {React.RefObject} ref untuk dipasang di container element
 * 
 * @example
 * const ref = useScrollReveal();
 * <div ref={ref}>
 *   <h2 className="reveal-up">Judul</h2>
 *   <p className="reveal-blur reveal-delay-2">Teks</p>
 * </div>
 */
export function useScrollReveal({ threshold = 0.12, rootMargin = '0px 0px -5% 0px', once = true } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectors = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur';
    const elements = container.querySelectorAll(selectors);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold, rootMargin });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return containerRef;
}

/**
 * useSingleReveal — reveal satu element tunggal (bukan child dari container)
 * 
 * @example
 * const ref = useSingleReveal('reveal-up');
 * <div ref={ref} className="reveal-up">...</div>
 */
export function useSingleReveal(className = 'reveal-up', { threshold = 0.1, rootMargin = '0px 0px -5% 0px', once = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('in-view');
        if (once) observer.unobserve(el);
      }
    }, { threshold, rootMargin });

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * useParallaxScroll — scroll-tied horizontal transform (Evasion gallery)
 * Mengembalikan ref container dan transform style yang bisa diapply ke inner div
 *
 * @param {number} factor - kecepatan transform (default -0.4, negatif = scroll kiri)
 * @returns {{ ref, style }}
 */
export function useParallaxScroll(factor = -0.35) {
  const ref = useRef(null);
  const styleRef = useRef({});
  const frameRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress: 0 ketika masuk bawah viewport, 1 ketika keluar atas
      const progress = 1 - (rect.top + rect.height) / (viewH + rect.height);
      const px = progress * rect.width * factor;

      if (el._inner) {
        el._inner.style.transform = `translate3d(${px}px, 0, 0)`;
      }
    };

    const onScroll = () => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        update();
        frameRef.current = null;
      });
    };

    // Cache inner element reference
    el._inner = el.querySelector('[data-parallax-inner]');

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [factor]);

  return ref;
}
