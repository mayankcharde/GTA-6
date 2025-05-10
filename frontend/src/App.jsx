import React, { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import 'remixicon/fonts/remixicon.css'

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
          document.querySelector(".svg").remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  useGSAP(() => {
    if (!showContent) return;

    const isMobile = window.innerWidth <= 768;
    const scale = isMobile ? 1 : 1; // Changed to 1 for mobile to ensure full coverage
    const characterScale = isMobile ? 1.8 : 1.4;

    gsap.to(".main", {
      scale: scale,
      rotate: isMobile ? 0 : -10, // Remove rotation on mobile
      duration: 3,
      delay: "-2",
      ease: "Expo.easeInOut",
    });

    gsap.to(".sky", {
      scale: isMobile ? 1.2 : 1.1,
      rotate: isMobile ? 0 : -20,
      duration: 5,
      delay: "-..87",
      ease: "Expo.easeInOut",
    });

    gsap.to(".bg", {
      scale: isMobile ? 1.3 : 1.1,
      rotate: isMobile ? 0 : -3,
      duration: 4.22,
      delay: "-.85",
      ease: "Expo.easeInOut",
    });

    gsap.to(".character", {
      scale: isMobile ? 0.8 : 1, // Reduced scale for mobile
      x: "-35%",
      bottom: isMobile ? "0%" : "-30%", // Adjusted bottom position
      rotate: 0,
      duration: 2,
      delay: "-.80",
      ease: "Expo.easeInOut",
    });

    const handleMovement = (x, y) => {
      const moveScale = isMobile ? 0.3 : 1;
      const xMove = (x / window.innerWidth - 0.5) * 40 * moveScale;
      const yMove = isMobile ? (y / window.innerHeight - 0.5) * 20 * moveScale : 0;
      
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
        y: isMobile ? `${yMove * 0.2}%` : 0,
        duration: 0.5,
      });
      gsap.to(".sky", {
        x: xMove,
        y: isMobile ? yMove : 0,
        duration: 0.5,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
        y: isMobile ? yMove * 1.2 : 0,
        duration: 0.5,
      });
    };

    // Mouse/touch event handlers
    const handleMouse = (e) => handleMovement(e.clientX, e.clientY);
    const handleTouch = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMovement(touch.clientX, touch.clientY);
    };

    const main = document.querySelector(".main");
    main?.addEventListener("mousemove", handleMouse);
    main?.addEventListener("touchmove", handleTouch);
    
    return () => {
      main?.removeEventListener("mousemove", handleMouse);
      main?.removeEventListener("touchmove", handleTouch);
    };
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
        <div className="main w-full md:rotate-[-10deg] scale-100 md:scale-[1.7]">
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
                className="absolute character -bottom-[150%] left-1/2 -translate-x-1/2 scale-[1.2] sm:scale-[1.5] md:scale-[2] lg:scale-[2.5] rotate-[-45deg]"
                src="./girlbg.png"
                alt=""
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
            <div className="cntnr flex flex-col md:flex-row text-white w-full h-auto md:h-[80%] px-4 md:px-0">
              <div className="limg relative w-full md:w-1/2 h-[300px] md:h-full mt-10 md:mt-0">
                <img
                  className="absolute scale-[1] md:scale-[1.3] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src="./imag.png"
                  alt=""
                />
              </div>
              <div className="rg w-full md:w-[30%] py-10 md:py-30">
                <h1 className="text-4xl md:text-8xl">Still Running,</h1>
                <h1 className="text-4xl md:text-8xl">Not Hunting</h1>
                <p className="mt-10 text-xl font-[Helvetica_Now_Display]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Distinctio possimus, asperiores nam, omnis inventore nesciunt
                  a architecto eveniet saepe, ducimus necessitatibus at
                  voluptate.
                </p>
                <p className="mt-3 text-xl font-[Helvetica_Now_Display]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  eius illum fugit eligendi nesciunt quia similique velit
                  excepturi soluta tenetur illo repellat consectetur laborum
                  eveniet eaque, dicta, hic quisquam? Ex cupiditate ipsa nostrum
                  autem sapiente.
                </p>
                <p className="mt-10 text-xl font-[Helvetica_Now_Display]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                  eius illum fugit eligendi nesciunt quia similique velit
                  excepturi soluta tenetur illo repellat consectetur laborum
                  eveniet eaque, dicta, hic quisquam? Ex cupiditate ipsa nostrum
                  autem sapiente.
                </p>
                <button className="bg-yellow-500 px-5 py-5 md:px-10 md:py-10  mt-10 text-2xl md:text-4xl hover:bg-black text-amber-50 bg-gradient-to-b w-full md:w-auto rounded-full cursor-pointer border-none">
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;