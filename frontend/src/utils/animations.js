import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global GSAP configuration
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
});

// Common animation configurations
export const transitions = {
  fadeIn: {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  },
  fadeInScale: {
    opacity: 0,
    scale: 0.8,
    duration: 1.2,
    ease: 'back.out(1.7)'
  },
  pageTransition: {
    opacity: 0,
    x: 100,
    duration: 0.8,
    ease: 'power2.inOut'
  }
};

// Animation utility functions
export const animateElement = (element, animation) => {
  return gsap.from(element, {
    ...animation,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  });
};

export const parallaxEffect = (element, distance = 100) => {
  gsap.to(element, {
    y: distance,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
};
