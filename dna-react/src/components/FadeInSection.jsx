import { useEffect, useRef, useState } from "react";

/** Shared Hook for Intersection Observer */
const useFadeInSection = (threshold = 0.3) => {
  const domRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { threshold }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
      observer.disconnect();
    };
  }, [threshold]);

  return { domRef, isVisible };
};

/** Fade and Slide from Left */
export const FadeSlideFromLeft = ({ children }) => {
  const { domRef, isVisible } = useFadeInSection();

  return (
    <div
      ref={domRef}
      className={`transition-all duration-2000 ease-in-out transform ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
      }`}
    >
      {children}
    </div>
  );
};

/** Fade and Slide from Right */
export const FadeSlideFromRight = ({ children }) => {
  const { domRef, isVisible } = useFadeInSection();

  return (
    <div
      ref={domRef}
      className={`transition-all duration-2000 ease-in-out transform ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      }`}
    >
      {children}
    </div>
  );
};

export const FadeSlideFromBottom = ({ children }) => {
  const ref = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

export default { FadeSlideFromLeft, FadeSlideFromRight, FadeSlideFromBottom };
