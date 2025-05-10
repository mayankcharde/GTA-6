import React, { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import 'remixicon/fonts/remixicon.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  let [showContent, setShowContent] = useState(false);
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          const svg = document.querySelector(".svg");
          if (svg && svg.parentNode) {
            svg.parentNode.removeChild(svg);
          }
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  useGSAP(() => {
    if (!showContent) return;

    const isMobile = window.innerWidth <= 768;
    
    // Initial landing animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }});
    
    tl.from(".navbar", {
      y: -100,
      opacity: 0,
      duration: 1.5,
    })
    .from(".text h1", {
      y: 200,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
    }, "-=1")
    .from(".character", {
      y: 300,
      scale: 0,
      opacity: 0,
      rotate: 0,
      duration: 2,
      ease: "elastic.out(1, 0.5)",
    }, "-=1").to(".character", {
      bottom: isMobile ? "-15%" : "-10%",
      scale: isMobile ? 1.3 : 1.8,
      x: "-50%",
      rotate: 0,
      duration: 1.5,
      ease: "power2.out",
    });

    // Parallax effects
    gsap.to(".sky", {
      scrollTrigger: {
        trigger: ".landing",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: isMobile ? 100 : 200,
      scale: 1.1,
    });

    gsap.to(".bg", {
      scrollTrigger: {
        trigger: ".landing",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
      y: isMobile ? 150 : 300,
      scale: 1.15,
    });

    // Content section animations
    gsap.from(".limg img", {
      scrollTrigger: {
        trigger: ".limg",
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
      scale: 0.8,
      opacity: 0,
      rotate: -10,
    });

    gsap.from(".rg h1", {
      scrollTrigger: {
        trigger: ".rg",
        start: "top 80%",
      },
      y: 100,
      opacity: 0,
      stagger: 0.3,
      duration: 1,
    });

    gsap.from(".rg p", {
      scrollTrigger: {
        trigger: ".rg p",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
    });

    // Enhanced mobile-friendly mouse/touch movement effect
    const handleMovement = (x, y) => {
      const moveScale = isMobile ? 0.5 : 1; // Increased mobile sensitivity
      const xMove = (x / window.innerWidth - 0.5) * 40 * moveScale;
      const yMove = (y / window.innerHeight - 0.5) * 20 * moveScale;
      
      // Optimized animations for mobile
      gsap.to(".text", {
        x: xMove * (isMobile ? 0.3 : 0.5),
        y: yMove * (isMobile ? 0.2 : 0.3),
        rotateX: yMove * (isMobile ? 0.1 : 0.2),
        rotateY: -xMove * (isMobile ? 0.1 : 0.2),
        duration: isMobile ? 0.5 : 1, // Faster response on mobile
        ease: "power2.out",
      });
      
      gsap.to(".sky", {
        x: xMove * (isMobile ? 0.8 : 1.2),
        y: yMove * (isMobile ? 0.8 : 1.2),
        duration: isMobile ? 0.5 : 1,
        ease: "power2.out",
      });
      
      gsap.to(".bg", {
        x: xMove * (isMobile ? 1.2 : 2),
        y: yMove * (isMobile ? 1 : 1.5),
        duration: isMobile ? 0.6 : 1.2,
        ease: "power2.out",
      });
    };

    const handleMouse = (e) => handleMovement(e.clientX, e.clientY);

    const handleTouch = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMovement(touch.clientX, touch.clientY);
      }
    };

    const cleanupFunction = () => {
      const main = document.querySelector(".main");
      if (main) {
        main.removeEventListener("mousemove", handleMouse);
        main.removeEventListener("touchmove", handleTouch);
        main.removeEventListener("touchstart", handleTouch);
      }
    };

    const main = document.querySelector(".main");
    if (main) {
      main.addEventListener("mousemove", handleMouse);
      main.addEventListener("touchmove", handleTouch, { passive: false });
      main.addEventListener("touchstart", handleTouch, { passive: false });
    }

    return cleanupFunction;
  }, [showContent]);

  return (
    <>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  VI
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="./bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>
      {showContent && (
        <div className="main w-full md:rotate-[-10deg] scale-100 md:scale-[1.4] overflow-hidden">
          <div className="landing overflow-hidden relative w-full h-screen bg-black">
            <div className="navbar absolute top-0 left-0 z-[10] w-full py-5 md:py-10 px-5 md:px-10">
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
                className="absolute sky md:scale-[1.5] md:rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="./sky.png"
                alt=""
              />
              <img
                className="absolute md:scale-[1.8] md:rotate-[-3deg] bg top-0 left-0 w-full h-full object-cover"
                src="./bg.png"
                alt=""
              />
              <div className="text text-white flex flex-col gap-1 md:gap-3 absolute top-[15%] md:top-20 left-1/2 -translate-x-1/2 scale-[1] md:scale-[1.4] md:rotate-[-10deg]">
                <h1 className="text-[4rem] md:text-[12rem] leading-[0.8] md:leading-none -ml-5 md:-ml-40">grand</h1>
                <h1 className="text-[4rem] md:text-[12rem] leading-[0.8] md:leading-none ml-2 md:ml-20">theft</h1>
                <h1 className="text-[4rem] md:text-[12rem] leading-[0.8] md:leading-none -ml-5 md:-ml-40">auto</h1>
              </div>
              <img
                className="absolute character bottom-[-15%] md:bottom-[-10%] left-1/2 -translate-x-1/2 scale-[1.3] md:scale-[1.8] z-[5] pointer-events-none"
                src="./girlbg.png"
                alt="character"
              />
            </div>
            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-4 md:py-15 px-5 md:px-10 bg-gradient-to-t from-black to-transparent">
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
          <div className="w-full min-h-screen flex items-center justify-center bg-black pt-20 md:pt-0">
            <div className="cntnr flex flex-col md:flex-row items-center justify-between text-white w-full h-auto md:h-screen max-w-[1440px] mx-auto px-4 md:px-10 gap-8 md:gap-16 py-10 md:py-20">
              <div className="limg relative w-full md:w-[45%] h-[300px] md:h-[70vh] mt-0">
                <img
                  className="absolute w-full h-full object-contain object-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.9] md:scale-[1.2]"
                  src="./imag.png"
                  alt="GTA VI Promo Image"
                />
              </div>
              <div className="rg w-full md:w-[45%] py-5 md:py-0 flex flex-col items-start">
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold">Still Running,</h1>
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold">Not Hunting</h1>
                <p className="mt-8 text-base md:text-lg lg:text-xl font-[Helvetica_Now_Display] text-gray-300">
                  Still running, not hunting — a life on the edge, escaping chaos, surviving the streets, and staying one step ahead in a world without mercy.
                </p>
                <p className="mt-4 text-base md:text-lg lg:text-xl font-[Helvetica_Now_Display] text-gray-300">
                  Step into the vibrant chaos of Leonida in Grand Theft Auto VI. Join Lucia and Jason as they navigate crime, loyalty, and survival in Rockstar's most ambitious open-world experience yet. With stunning visuals, gripping storytelling, and unforgettable characters, GTA 6 redefines the future of interactive entertainment.
                </p>
                <p className="mt-8 text-base md:text-lg lg:text-xl font-[Helvetica_Now_Display] text-gray-300">
                  Grand Theft Auto VI dives deep into the chaotic streets of Leonida, where survival depends on loyalty and bold choices. Lucia sets the tone with lines like, 'We've been through enough. We don't have anything to lose,' and 'The only way we're gonna get through this is by sticking together. Being a team.' Her partner Jason backs her with unwavering support, stating, 'If anything happens, I'm right behind you, and Don't test me!' Together, they face the lawless world around them with grit, trust, and relentless drive. These powerful lines capture the intensity and emotional core of GTA 6's gripping story.
                </p>
                <button className="download-btn relative overflow-hidden px-8 py-4 mt-10 text-xl md:text-2xl text-white rounded-lg
                  backdrop-blur-md bg-gradient-to-r from-yellow-500/30 to-yellow-600/30
                  border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                  hover:from-yellow-500/40 hover:to-yellow-600/40 hover:shadow-yellow-500/20
                  transition-all duration-300 ease-out transform hover:scale-105
                  flex items-center justify-center gap-3 group w-full md:w-auto">
                  <span className="relative z-10">Download Now</span>
                  <i className="ri-download-2-line text-2xl relative z-10 group-hover:animate-bounce"></i>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 blur-xl"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );}export default App;