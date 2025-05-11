import React, { useState, useEffect, Suspense, lazy, useRef, useCallback } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import 'remixicon/fonts/remixicon.css';
import { transitions, animateElement, parallaxEffect } from './utils/animations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Enable GSAP's force3D for better performance
gsap.config({
  force3D: true
});

// Add a cleanup function to prevent memory leaks
const cleanupGSAP = () => {
  ScrollTrigger.getAll().forEach(t => t.kill());
  gsap.killTweensOf("*");
  gsap.set("*", { clearProps: "all" });
};

// Lazy load route components
const Contact = lazy(() => import("./pages/Contact"));
const Quiz = lazy(() => import("./pages/Quiz"));

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
      <p className="text-yellow-500/80">Loading...</p>
    </div>
  </div>
);

function App() {
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeline = useRef(null);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Message: ''
  });
  // Ref to track svg element
  const svgRef = useRef(null);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.placeholder]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    
    // Animation for successful submission
    gsap.to(".submit-success", {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      onComplete: () => {
        setTimeout(() => {
          gsap.to(".submit-success", {
            scale: 0,
            opacity: 0,
            duration: 0.3
          });
        }, 2000);
      }
    });
  };

  // Reset animation state when returning to home
  useEffect(() => {
    if (location.pathname === '/') {
      setShowContent(false);
      setIsAnimating(false);
      if (animationTimeline.current) {
        animationTimeline.current.kill();
        animationTimeline.current = null;
      }
    }
    return () => {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
      safeRemoveNode('.svg');
    };
  }, [location.pathname]);

  // More reliable node removal utility
  const safeRemoveNode = useCallback((selector) => {
    return new Promise((resolve) => {
      const node = document.querySelector(selector);
      if (!node) {
        resolve();
        return;
      }

      const cleanup = () => {
        try {
          if (node && node.parentNode) {
            node.parentNode.removeChild(node);
          }
        } catch (error) {
          console.warn('Node removal failed:', error);
        }
        resolve();
      };

      gsap.to(node, {
        opacity: 0,
        duration: 0.3,
        onComplete: cleanup,
        onInterrupt: cleanup
      });
    });
  }, []);

  // Initialize showContent based on route
  useEffect(() => {
    if (location.pathname !== '/') {
      setShowContent(true);
      setIsAnimating(false);
    }
  }, []);

  // Update animation logic
  useGSAP(() => {
    if (isAnimating || location.pathname !== '/') return;

    setIsAnimating(true);
    
    const element = document.querySelector('.vi-mask-group');
    if (!element) {
      setShowContent(true);
      setIsAnimating(false);
      return;
    }

    animationTimeline.current = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setShowContent(true);
        setIsAnimating(false);
      }
    });

    animationTimeline.current
      .to(".vi-mask-group", {
        rotate: 10,
        duration: 1,
        ease: "Power4.easeInOut",
        transformOrigin: "50% 50%",
      })
      .to(".vi-mask-group", {
        scale: 10,
        duration: 1,
        delay: -0.5,
        ease: "Expo.easeInOut",
        transformOrigin: "50% 50%",
        opacity: 0,
        onComplete: () => {
          const svg = document.querySelector(".svg");
          if (svg && svg.parentNode) {
            svg.parentNode.removeChild(svg);
          }
        }
      });

    return () => {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
        animationTimeline.current = null;
      }
    };
  }, [location.pathname, isAnimating]);

  // Reset state and cleanup on route change
  useEffect(() => {
    if (location.pathname !== '/') {
      setShowContent(true);
      setIsAnimating(false);
    }

    return () => {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
        animationTimeline.current = null;
      }
      safeRemoveNode('.svg');
    };
  }, [location.pathname, safeRemoveNode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupGSAP();
      safeRemoveNode(".svg");
    };
  }, []);

  // Update useGSAP animations section
  useGSAP(() => {
    if (!showContent) return;

    const ctx = gsap.context(() => {
      // Text reveal timeline
      const textTl = gsap.timeline({
        defaults: { 
          ease: "expo.out",
          duration: 1.2
        }
      });

      // Animate text elements
      textTl
        .fromTo(".text-wrapper", {
          opacity: 0,
          y: 100,
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          pointerEvents: "auto"
        })
        .fromTo(".gta-text", {
          opacity: 0,
          y: 50,
          rotateX: -45,
        }, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.2,
          duration: 1.5,
        }, "-=0.5");

      // Set initial state to visible after animation
      textTl.add(() => {
        gsap.set(".text-wrapper", { clearProps: "all" });
        gsap.set(".gta-text", { clearProps: "all" });
      });
    });

    return () => ctx.revert();
  }, [showContent]);

  // Add these styles at the top of the component, after imports
  const globalStyles = `
    /* Font fallback system */
    body {
      font-family: 'Helvetica Now Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Ensure font is applied before animation */
    .text-wrapper {
      opacity: 0;
      visibility: hidden;
      font-family: 'Helvetica Now Display', sans-serif;
    }

    .fonts-loaded .text-wrapper {
      opacity: 1;
      visibility: visible;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      scroll-behavior: smooth;
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }

    body {
      min-height: 100vh;
      background: black;
      color: white;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .animate-text {
      will-change: transform, opacity;
      backface-visibility: hidden;
      -webkit-font-smoothing: antialiased;
    }

    @media (max-width: 768px) {
      .animate-text {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
    }

    .main {
      position: relative;
      width: 100%;
      overflow-x: hidden;
      background: black;
    }

    .section {
      width: 100%;
      position: relative;
      overflow: visible;
    }

    @media (max-width: 768px) {
      .main {
        overflow-x: hidden;
        touch-action: pan-y pinch-zoom;
      }
      
      .landing {
        height: 100vh !important;
        height: -webkit-fill-available !important;
      }
      
      .character {
        transform: scale(1.6) !important;
        bottom: 0 !important;
      }
      
      .text h1 {
        text-align: center !important;
        margin-left: 0 !important;
        font-size: clamp(3rem, 10vw, 6rem) !important;
      }
      
      .btmbar {
        padding: 1rem !important;
      }
      
      .section {
        padding: 3rem 1rem !important;
      }
      
      .stat-card {
        padding: 1rem !important;
      }

      .contact-form {
        padding: 1.5rem !important;
      }

      /* Prevent overflow issues */
      .overflow-hidden {
        overflow: hidden !important;
      }

      /* Optimize touch targets */
      button, 
      .button-like,
      input,
      textarea {
        min-height: 44px !important;
        font-size: 16px !important;
      }

      /* Improve scrolling */
      * {
        -webkit-overflow-scrolling: touch;
      }

      /* Fix character scaling on smaller screens */
      .character-container {
        transform: scale(0.8);
      }

      /* Improve text readability */
      p {
        font-size: 1rem !important;
        line-height: 1.6 !important;
      }

      /* Better spacing for mobile */
      .grid {
        gap: 1rem !important;
      }

      /* Optimize buttons for touch */
      .download-btn,
      button[type="submit"] {
        width: 100% !important;
        padding: 1rem !important;
      }
    }

    /* Fix viewport height issues on mobile */
    @supports (-webkit-touch-callout: none) {
      .min-h-screen {
        min-height: -webkit-fill-available;
      }
    }
  `;

  // Define mobileStyles before the return statement
  const mobileStyles = `
    @media (max-width: 768px) {
      .main {
        overflow-x: hidden;
        touch-action: pan-y pinch-zoom;
      }
      
      .landing {
        height: 100vh !important;
        height: -webkit-fill-available !important;
      }
      
      .character {
        transform: scale(1.6) !important;
        bottom: 0 !important;
      }
      
      .text h1 {
        text-align: center !important;
        margin-left: 0 !important;
        font-size: clamp(3rem, 10vw, 6rem) !important;
      }
      
      .btmbar {
        padding: 1rem !important;
      }
      
      .section {
        padding: 3rem 1rem !important;
      }
      
      .stat-card {
        padding: 1rem !important;
      }

      .contact-form {
        padding: 1.5rem !important;
      }

      /* Prevent overflow issues */
      .overflow-hidden {
        overflow: hidden !important;
      }

      /* Optimize touch targets */
      button, 
      .button-like,
      input,
      textarea {
        min-height: 44px !important;
        font-size: 16px !important;
      }

      /* Improve scrolling */
      * {
        -webkit-overflow-scrolling: touch;
      }

      /* Fix character scaling on smaller screens */
      .character-container {
        transform: scale(0.8);
      }

      /* Improve text readability */
      p {
        font-size: 1rem !important;
        line-height: 1.6 !important;
      }

      /* Better spacing for mobile */
      .grid {
        gap: 1rem !important;
      }

      /* Optimize buttons for touch */
      .download-btn,
      button[type="submit"] {
        width: 100% !important;
        padding: 1rem !important;
      }
    }

    /* Fix viewport height issues on mobile */
    @supports (-webkit-touch-callout: none) {
      .min-h-screen {
        min-height: -webkit-fill-available;
      }
    }
  `;

  // Add performance monitoring
  useEffect(() => {
    let startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Component mounted in ${endTime - startTime}ms`);
    };
  }, []);

  // Optimize GSAP animations
  useGSAP(() => {
    if (!showContent) return;
    
    gsap.config({
      autoSleep: 60,
      force3D: true,
      nullTargetWarn: false,
    });

    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        // ...existing animation code...
      });
      return () => ctx.revert();
    });
  }, [showContent]);

  // Add font loading check
  useEffect(() => {
    document.fonts.ready.then(() => {
      console.log('Fonts loaded');
    }).catch(err => {
      console.warn('Font loading error:', err);
    });
  }, []);

  // Set initial content visibility
  useEffect(() => {
    setShowContent(true);
    setIsAnimating(false);
  }, []);

  // Simplified GSAP animation
  useGSAP(() => {
    if (!showContent) return;

    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    gsap.set(".text-wrapper", { opacity: 1, visibility: "visible" });
    
    gsap.fromTo(".gta-text",
      { opacity: 0, y: 50 },
      { 
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      }
    );

    return () => {
      gsap.killTweensOf([".text-wrapper", ".gta-text"]);
    };
  }, [showContent]);

  // Add click handler for image highlight
  const handleImageClick = useCallback((e) => {
    gsap.to(e.target, {
      filter: 'brightness(1.5)',
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(e.target, {
          filter: 'brightness(1)',
          scale: 1,
          duration: 0.5,
          ease: 'power2.inOut'
        });
      }
    });
  }, []);

  // Add scroll animation for text sections
  useEffect(() => {
    const paragraphs = document.querySelectorAll('.animate-text');
    const statsSection = document.querySelector('.stats');
    const contactSection = document.querySelector('.contact');
    const contentSection = document.querySelector('.content');

    // Content section text animations
    gsap.from(paragraphs, {
      scrollTrigger: {
        trigger: contentSection,
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        scrub: 1.5,
      },
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power3.out',
    });

    // Stats section enhanced animations
    const statsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: statsSection,
        start: 'top bottom', // Changed to trigger as soon as stats section enters viewport
        end: 'top center',
        toggleActions: 'play none none none', // Changed to play once
        scrub: false, // Removed scrub for instant visibility
      }
    });

    statsTimeline
      .set(statsSection, { opacity: 1, visibility: 'visible' }) // Ensure immediate visibility
      .from('.stats h2, .stats > div > p', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      })
      .from('.stat-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
      }, '-=0.4');

    // Contact section animations (existing code)
    gsap.from('.contact-title, .contact-subtitle', {
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 70%',
        end: 'top 30%',
        toggleActions: 'play none none reverse',
        scrub: 1.5,
      },
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.out',
    });

    // Contact form and info smooth slide-in
    gsap.from('.contact-form', {
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 50%',
        end: 'center 70%',
        toggleActions: 'play none none reverse',
        scrub: 2,
      },
      x: -100,
      opacity: 0,
      duration: 2,
      ease: 'power3.out',
    });

    gsap.from('.contact-info', {
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 50%',
        end: 'center 70%',
        toggleActions: 'play none none reverse',
        scrub: 2,
      },
      x: 100,
      opacity: 0,
      duration: 2,
      ease: 'power3.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [showContent]);

  // Add scroll animation for background parallax
  useEffect(() => {
    // Get elements
    const skyBg = document.querySelector('.sky');
    const mainBg = document.querySelector('.bg');
    const character = document.querySelector('.character');
    
    // Enhanced character animation
    gsap.to(character, {
      y: -100,
      scale: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".imagesdiv",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Subtle rotation for dynamic effect
          const rotation = self.progress * -8;
          gsap.to(character, {
            rotate: rotation,
            duration: 0.3,
            ease: "power1.out"
          });
        }
      }
    });

    // Create parallax effect for sky
    gsap.to(skyBg, {
      yPercent: -30,
      scale: 1.8,
      rotate: -25,
      ease: "none",
      scrollTrigger: {
        trigger: ".imagesdiv",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    // Create parallax effect for main background
    gsap.to(mainBg, {
      yPercent: -15,
      scale: 2,
      rotate: -5,
      ease: "none",
      scrollTrigger: {
        trigger: ".imagesdiv",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [showContent]);

  return (
    <>
      <style>{globalStyles}</style>
      <style>{mobileStyles}</style>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={
            <div className="wrapper">
              <div className="main-content w-full min-h-screen bg-black">
                {/* Rest of your content */}
                {(showContent || location.pathname !== '/') && (
                    <>
                      <div className="main">
                        <div className="section landing relative w-full min-h-[100vh] bg-black"
                          style={{ 
                            WebkitOverflowScrolling: 'touch',
                            height: 'auto',
                            minHeight: '-webkit-fill-available',
                            transform: 'translateZ(0)',
                          }}>
                          <div className="navbar absolute top-0 left-0 z-[10] w-full 
                            py-5 md:py-8 lg:py-10 xl:py-12 
                            px-5 md:px-8 lg:px-12 xl:px-16">
                            <div className="logo flex gap-7">
                              <div className="lines flex flex-col gap-[5px]">
                                <div className="line w-15 h-2 bg-white"></div>
                                <div className="line w-8 h-2 bg-white"></div>
                                <div className="line w-5 h-2 bg-white"></div>
                              </div>
                              <h3 className="text-4xl -mt-[8px] leading-none text-white">
                                Rockstar
                              </h3>
                            </div>
                          </div>

                          <div className="imagesdiv relative overflow-hidden w-full h-screen">
                            <img
                              className="absolute sky top-0 left-0 w-full h-full object-cover
                                md:scale-[1.4] lg:scale-[1.5] xl:scale-[1.6] 2xl:scale-[1.7]
                                md:rotate-[-15deg] lg:rotate-[-18deg] xl:rotate-[-20deg]
                                transform-gpu"
                            src="./sky.png"
                            alt=""
                            />
                            <img
                              className="absolute bg top-0 left-0 w-full h-full object-cover
                                md:scale-[1.6] lg:scale-[1.7] xl:scale-[1.8] 2xl:scale-[1.9]
                                md:rotate-[-2deg] lg:rotate-[-2.5deg] xl:rotate-[-3deg]
                                transform-gpu"
                            src="./bg.png"
                            alt=""
                            />

                            <div className="text text-white flex flex-col items-center justify-center
                              absolute top-[50%] md:top-[20%] lg:top-[18%] xl:top-[15%]
                              left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-y-0
                              scale-[1.1] md:scale-[1.3] lg:scale-[1.4] xl:scale-[1.5] 2xl:scale-[1.6]
                              md:rotate-[-10deg] z-20">
                              <div className="text-wrapper relative w-full">
                                <div className="text-container relative flex flex-col items-center md:items-start">
                                  {['GRAND', 'THEFT', 'AUTO'].map((text, i) => (
                                    <h1 key={i} 
                                      className={`
                                        gta-text
                                        text-[4.5rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem]
                                        font-black
                                        leading-[0.8] md:leading-[0.85] lg:leading-[0.9]
                                        ${i === 1 ? 'ml-0 md:ml-16 lg:ml-20' : 'ml-0 md:-ml-32 lg:-ml-40'} 
                                        ${i === 1 ? 'my-4 md:my-6 lg:my-8' : ''}
                                        select-none transform-gpu will-change-transform
                                        relative z-10
                                        text-black
                                        bg-clip-text
                                        bg-gradient-to-br from-slate-900 via-black to-slate-900
                                        [-webkit-text-stroke:_2px_rgba(255,255,255,0.9)]
                                        [text-shadow:_4px_4px_0px_rgba(255,255,255,0.2),
                                                    -1px_-1px_0px_rgba(0,0,0,0.8),
                                                    0_0_20px_rgba(255,255,255,0.4),
                                                    0_0_40px_rgba(255,255,255,0.2)]
                                        after:content-[''] after:absolute after:inset-0
                                        after:bg-gradient-to-t after:from-black/50 
                                        after:to-transparent after:z-[-1]
                                        after:mix-blend-color-dodge
                                        transition-all duration-300
                                        hover:[-webkit-text-stroke:_2px_rgba(255,255,255,1)]
                                        hover:[text-shadow:_4px_4px_0px_rgba(255,255,255,0.4),
                                                              -1px_-1px_0px_rgba(0,0,0,1),
                                                              0_0_30px_rgba(255,255,255,0.6),
                                                              0_0_60px_rgba(255,255,255,0.3)]
                                        group
                                      `}
                                    >
                                      {text}
                                      <span className="absolute inset-0 z-[-1] 
                                        blur-[1px] opacity-80
                                        bg-gradient-to-b from-white/20 to-transparent
                                        mix-blend-overlay
                                        group-hover:opacity-100 group-hover:blur-[2px]
                                        transition-all duration-300"
                                      >
                                        {text}
                                      </span>
                                      <div className="absolute inset-0 z-[-2]
                                        bg-gradient-to-br from-black/80 to-black/40
                                        backdrop-blur-sm rounded-lg opacity-50
                                        group-hover:opacity-70 transition-opacity"
                                      ></div>
                                    </h1>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="character-container fixed bottom-0 left-1/2 -translate-x-1/2 
                              w-full max-w-[2000px] flex justify-center items-end">
                              <img
                                className="character pointer-events-none
                                  w-[95%] md:w-[80%] lg:w-[75%] xl:w-[70%] 2xl:w-[65%]
                                  scale-[1.8] md:scale-[2] lg:scale-[2.2] xl:scale-[2.3] 2xl:scale-[2.4]
                                  mb-10 md:mb-16 lg:mb-20 xl:mb-24
                                  z-[15] transform-gpu"
                                src="./girlbg.png"
                                alt="character"
                              />
                            </div>
                          </div>

                          <div className="btmbar text-white absolute bottom-0 left-0 w-full 
                            py-4 md:py-6 lg:py-8 xl:py-10
                            px-5 md:px-8 lg:px-12 xl:px-16 
                            bg-gradient-to-t from-black to-transparent">
                            <div className="flex gap-4 items-center">
                              <i className="text-2xl md:text-4xl ri-arrow-down-line"></i>
                              <h3 className="text-base md:text-xl font-[Helvetica_Now_Display]">
                              Scroll
                              </h3>
                            </div>
                            <img
                              className="absolute h-[35px] md:h-[55px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-1 md:mt-0 mr-0"
                              src="./ps5.png"
                              alt=""
                            />
                          </div>
                        </div>

                        {/* Content Sections with updated structure */}
                        <div className="section content relative bg-black py-20">
                          <div className="w-full min-h-screen bg-black relative z-[1] transform-gpu">
                            <div className="cntnr flex flex-col md:flex-row items-start justify-between
                              w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto
                              px-4 md:px-12 lg:px-16 xl:px-20 2xl:px-24
                              py-20 md:py-28 lg:py-32 xl:py-36
                              gap-8 md:gap-12 lg:gap-16 xl:gap-20
                              relative z-20">
                              <div className="limg relative w-full md:w-[45%] h-[300px] md:h-[70vh]">
                                <img
                                  className="absolute w-full h-full object-contain object-center 
                                    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                    scale-[0.9] md:scale-[1.2] z-10
                                    cursor-pointer transition-all duration-300
                                    hover:shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                                  src="./imag.png"
                                  alt="GTA VI Promo Image"
                                  onClick={handleImageClick}
                                />
                              </div>
                              <div className="rg w-full md:w-[45%] flex flex-col items-start relative z-10">
                                <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold">Still Running,</h1>
                                <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold">Not Hunting</h1>
                                <p className="animate-text mt-8 text-base md:text-lg lg:text-xl font-[Helvetica_Now_Display] text-gray-300 transform-gpu">
                                  Still running, not hunting — a life on the edge, escaping chaos, surviving the streets, and staying one step ahead in a world without mercy.
                                </p>
                                <p className="animate-text mt-4 text-base md:text-lg lg:text-8xl font-[Helvetica_Now_Display] text-gray-300 transform-gpu">
                                  Step into the vibrant chaos of Leonida in Grand Theft Auto VI. Join Lucia and Jason as they navigate crime, loyalty, and survival in Rockstar's most ambitious open-world experience yet.
                                </p>
                                <p className="animate-text mt-8 text-base md:text-lg lg:text-xl font-[Helvetica_Now_Display] text-gray-300 transform-gpu">
                                  Grand Theft Auto VI dives deep into the chaotic streets of Leonida, where survival depends on loyalty and bold choices.
                                </p>
                                <button className="download-btn relative overflow-hidden px-8 py-4 mt-20 md:mt-32 text-xl 
                                  md:text-2xl text-white rounded-lg cursor-pointer
                                  backdrop-blur-md bg-gradient-to-r from-yellow-500/30 to-yellow-600/30
                                  border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                                  hover:from-yellow-500/50 hover:to-yellow-600/50 
                                  active:scale-95 hover:-translate-y-1
                                  transition-all duration-300 group
                                  w-full md:w-auto">
                                  <div className="flex items-center justify-center gap-3 relative z-10">
                                    <span className="relative group-hover:tracking-wider transition-all">
                                      Download Now
                                    </span>
                                    <i className="ri-download-2-line text-2xl group-hover:animate-bounce"></i>
                                  </div>
                                  
                                  {/* Updated Character Image Overlay */}
                                  <div className="character-hover absolute -right-[10%] -top-[180%] w-[200px] md:w-[300px] 
                                    opacity-0 group-hover:opacity-40 pointer-events-none transition-all duration-500
                                    mix-blend-lighten">
                                    <img 
                                      src="./girlbg.png"
                                      alt=""
                                      className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                  </div>

                                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 
                                    group-hover:from-yellow-400/30 group-hover:to-yellow-500/30 blur-xl transition-all"></div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="section stats relative bg-black py-20">
                          {/* Stats Section */}
                          <div className="w-full min-h-[60vh] bg-black relative z-[2] transform-gpu">
                            <div className="absolute inset-0 bg-gradient-to-b from-black to-yellow-900/5 opacity-90"></div>
                            <div className="absolute w-full h-full">
                              <div className="absolute top-[20%] left-[5%] w-[30rem] h-[30rem] bg-yellow-500/5 rounded-full filter blur-[8rem] animate-pulse"></div>
                              <div className="absolute bottom-[20%] right-[5%] w-[25rem] h-[25rem] bg-yellow-600/5 rounded-full filter blur-[8rem] animate-pulse delay-700"></div>
                            </div>

                            <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 xl:px-20 py-24 relative z-10">
                              <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6
                                  [text-shadow:_0_0_30px_rgba(234,179,8,0.2)]">
                                  The World is Waiting
                                </h2>
                                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                                  Join millions of players eager to experience the next chapter in gaming history
                                </p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                {[
                                  { number: '150M+', label: 'Pre-Registrations', icon: 'user-follow' },
                                  { number: '2.4B+', label: 'Trailer Views', icon: 'play-circle' },
                                  { number: '98%', label: 'Positive Reviews', icon: 'star' },
                                  { number: '180+', label: 'Countries Waiting', icon: 'earth' }
                                ].map((stat, i) => (
                                  <div key={i} className="stat-card group p-6 md:p-8 rounded-2xl
                                    backdrop-blur-xl bg-gradient-to-br from-white/5 via-white/2 to-transparent
                                    border border-white/10 hover:border-yellow-500/20
                                    transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)]">
                                    <i className={`ri-${stat.icon}-fill text-4xl md:text-5xl text-yellow-500/80
                                      group-hover:text-yellow-400 transition-colors mb-4`}></i>
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2
                                      bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent
                                      group-hover:from-yellow-300 group-hover:to-yellow-500">
                                      {stat.number}
                                    </h3>
                                    <p className="text-gray-400 text-sm md:text-base group-hover:text-gray-300">
                                      {stat.label}
                                    </p>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                                      from-yellow-500/10 to-yellow-300/10 opacity-0 
                                      group-hover:opacity-100 blur-xl transition-opacity"></div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-16 text-center">
                                <button className="px-8 py-4 rounded-xl text-white text-lg md:text-xl font-bold
                                  cursor-pointer bg-gradient-to-r from-yellow-600 to-yellow-500 
                                  hover:from-yellow-500 hover:to-yellow-400
                                  active:scale-95 hover:-translate-y-1
                                  transition-all duration-300 group">
                                  <span className="flex items-center gap-2">
                                    Join the Community
                                    <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="section contact relative bg-black py-20 md:py-32">
                          <div className="max-w-6xl mx-auto relative z-10">
                            <div className="text-center mb-16">
                              <h2 className="contact-title text-4xl md:text-6xl font-bold mb-6">
                                Get In Touch
                              </h2>
                              <p className="contact-subtitle text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                                Join the next generation of gaming
                              </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative z-30">
                              <div className="contact-form bg-black/40 backdrop-blur-xl p-8 rounded-2xl
                                border border-white/10 hover:border-yellow-500/30 
                                transition-all duration-300 shadow-xl hover:shadow-yellow-500/10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                  <div className="space-y-5">
                                    {['Name', 'Email', 'Message'].map((item, i) => (
                                      <div key={i} className="relative">
                                        {item !== 'Message' ? (
                                          <input 
                                            type={item === 'Email' ? 'email' : 'text'}
                                            placeholder={item}
                                            value={formData[item]}
                                            onChange={handleFormChange}
                                            className="form-input w-full px-5 py-4 rounded-xl bg-black/30 text-white
                                            border border-white/5 focus:border-yellow-500/50
                                            focus:shadow-[0_0_20px_rgba(234,179,8,0.2)]
                                            placeholder:text-gray-500 backdrop-blur-sm
                                            transition-all duration-300 outline-none
                                            group-hover:border-white/10"
                                            required
                                          />
                                        ) : (
                                          <textarea 
                                            rows="4" 
                                            placeholder={item}
                                            value={formData[item]}
                                            onChange={handleFormChange}
                                            className="form-input w-full px-5 py-4 rounded-xl bg-black/30 text-white
                                            border border-white/5 focus:border-yellow-500/50
                                            focus:shadow-[0_0_20px_rgba(234,179,8,0.2)]
                                            placeholder:text-gray-500 backdrop-blur-sm
                                            transition-all duration-300 outline-none resize-none
                                            group-hover:border-white/10"
                                            required
                                          ></textarea>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <button type="submit" 
                                    className="w-full py-4 rounded-xl text-white font-bold text-lg
                                    cursor-pointer relative overflow-hidden group/btn
                                    active:scale-95 hover:-translate-y-1
                                    transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500
                                      group-hover/btn:from-yellow-500 group-hover/btn:to-yellow-400
                                      transition-all duration-300"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-2
                                      transform transition-transform group-hover/btn:scale-105">
                                      Send Message
                                      <i className="ri-send-plane-fill group-hover/btn:translate-x-1 
                                        transition-transform"></i>
                                    </span>
                                  </button>
                                </form>
                                <div className="submit-success absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                  bg-black/80 text-white px-6 py-3 rounded-lg scale-0 opacity-0">
                                Message sent successfully!
                                </div>
                              </div>

                              <div className="contact-info space-y-8">
                                <div className="p-8 rounded-2xl
                                  backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent
                                  border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]
                                  hover:shadow-[0_0_50px_rgba(234,179,8,0.1)]
                                  transition-all duration-500">
                                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                                    Visit Our Studio
                                  </h3>
                                  <div className="space-y-4">
                                    {['Rockstar Games HQ', 'Take-Two Interactive Software', '622 Broadway', 'New York, NY 10012'].map((text, i) => (
                                      <p key={i} className="text-gray-400 flex items-center gap-3">
                                        <i className={`ri-${i === 0 ? 'building' : i === 1 ? 'game' : 'map-pin'}-fill text-yellow-500`}></i>
                                        {text}
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                <div className="social-links grid grid-cols-4 gap-4">
                                  {[
                                    { 
                                      platform: 'twitter', 
                                      gradient: 'from-[#1DA1F2] to-[#0D8BD9]',
                                      hoverEffect: 'hover:shadow-[0_0_20px_rgba(29,161,242,0.4)]'
                                    },
                                    { 
                                      platform: 'facebook', 
                                      gradient: 'from-[#4267B2] to-[#385899]',
                                      hoverEffect: 'hover:shadow-[0_0_20px_rgba(66,103,178,0.4)]'
                                    },
                                    { 
                                      platform: 'instagram',
                                      gradient: 'from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
                                      hoverEffect: 'hover:shadow-[0_0_20px_rgba(221,42,123,0.4)]'
                                    },
                                    { 
                                      platform: 'youtube', 
                                      gradient: 'from-[#FF0000] to-[#CC0000]',
                                      hoverEffect: 'hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]'
                                    }
                                  ].map(({ platform, gradient, hoverEffect }) => (
                                    <a key={platform} 
                                      href={`#${platform}`}
                                      className={`
                                        relative overflow-hidden
                                        aspect-square p-4 rounded-2xl
                                        bg-black/30 backdrop-blur-lg
                                        border border-white/10
                                        flex items-center justify-center
                                        group cursor-pointer
                                        transition-all duration-500
                                        hover:-translate-y-1 hover:scale-105
                                        ${hoverEffect}
                                      `}
                                    >
                                      <div className={`
                                        absolute inset-0 opacity-0 
                                        bg-gradient-to-br ${gradient}
                                        transition-opacity duration-500
                                        group-hover:opacity-100
                                      `}/>
                                      
                                      <i className={`
                                        ri-${platform}-fill text-2xl
                                        relative z-10
                                        transition-all duration-500
                                        text-white/70 group-hover:text-white
                                        group-hover:scale-110
                                      `}/>
                                      
                                      <div className={`
                                        absolute inset-0 
                                        bg-gradient-to-br ${gradient}
                                        opacity-0 group-hover:opacity-20 
                                        blur-xl transition-opacity duration-500
                                      `}/>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Action Buttons - Moved outside Suspense for better performance */}
                      {location.pathname === '/' && showContent && (
                        <div className="fixed bottom-8 right-8 z-50 flex gap-4 transform-gpu">
                          <Link to="/quiz"
                            className="p-4 rounded-full bg-yellow-500 hover:bg-yellow-400
                              shadow-lg hover:shadow-yellow-500/25
                              transform-gpu hover:-translate-y-1
                              transition-all duration-300 group">
                            <i className="ri-gamepad-line text-2xl text-white
                              group-hover:rotate-12 transition-transform"></i>
                          </Link>
                          <Link to="/contact"
                            className="p-4 rounded-full bg-yellow-500 hover:bg-yellow-400
                              shadow-lg hover:shadow-yellow-500/25
                              transform-gpu hover:-translate-y-1
                              transition-all duration-300 group">
                            <i className="ri-customer-service-2-line text-2xl text-white
                              group-hover:rotate-12 transition-transform"></i>
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Suspense>
    </>
  );}

export default App;