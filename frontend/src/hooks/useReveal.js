import { useEffect } from 'react';

/**
 * useReveal attaches an IntersectionObserver to all elements with [data-rv] or .word-reveal,
 * adding .rv-in when they enter viewport. Also animates numbers with [data-counter].
 */
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rv-in');

            // If it's a counter element
            const counters = entry.target.querySelectorAll?.('[data-counter]') || [];
            counters.forEach((c) => animateCounter(c));
            if (entry.target.hasAttribute?.('data-counter')) {
              animateCounter(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px',
      }
    );

    const observeAll = () => {
      const targets = document.querySelectorAll('[data-rv], .word-reveal, [data-counter]');
      targets.forEach((t) => observer.observe(t));
    };

    observeAll();

    // Re-observe if DOM changes
    const timer = setTimeout(observeAll, 600);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';

  const target = parseFloat(el.dataset.counter || '0');
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    // Ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = progress === 1 ? target : target * ease;

    const formatted = decimals > 0 
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString('id-ID');

    el.textContent = `${prefix}${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
