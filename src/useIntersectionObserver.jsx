import { useEffect } from "react";

const useIntersectionObserver = ({ root, target, onIntersect, threshold = 1.0, rootMargin = "1px" }) => {
  useEffect(
    () => {

      if (!root) {
        console.log('[use] not root');
        return;
      }

      const observer = new IntersectionObserver(onIntersect, {
        root,
        rootMargin,
        threshold,
      });

      if (!target) {
        console.log('[use] not target');
        return;
      }

      console.log('[use] observe');
      observer.observe(target);

      return () => {
        console.log('[use] unobserve');
        observer.unobserve(target);
      };
    }, [target, root, rootMargin, onIntersect, threshold]
  );
};

export default useIntersectionObserver;