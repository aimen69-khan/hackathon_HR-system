import { useEffect } from 'react';
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => ref.current && !ref.current.contains(e.target) && handler();
    const esc = (e) => e.key === 'Escape' && handler();
    document.addEventListener('mousedown', fn); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fn); document.removeEventListener('keydown', esc); };
  }, [ref, handler]);
}
