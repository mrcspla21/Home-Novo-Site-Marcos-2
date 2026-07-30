import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

const HERO_IMAGE_URL_DESKTOP = "https://omarcosfonseca.com.br/wp-content/uploads/2026/07/fundo.jpg";
const HERO_IMAGE_URL_MOBILE = "https://omarcosfonseca.com.br/wp-content/uploads/2026/07/mobile-2.jpg";

const KICKER = "Nem toda marca precisa de um novo design.";
const TITLE_L1 = "Algumas precisam ser";
const TITLE_L2 = "verdadeiramente";
const TITLE_L3 = "compreendidas.";
const FULL_TITLE = TITLE_L1 + TITLE_L2 + TITLE_L3;
const PARAGRAPH =
  "Investigo o que impede marcas, profissionais e projetos de serem percebidos pelo valor que realmente possuem — e transformo essa descoberta em direção, sistemas e expressão visual.";

const NAV = ["Início", "Metodologia", "Análises", "Casos", "Projetos", "Sobre", "Contato"];

/** Safe horizontal gutter — 378px on a 1920px monitor, never cramped on smaller ones. */
const EDGE = "clamp(24px, 19.7vw, 378px)";

/** Lens geometry, as fractions of the viewport. */
const LENS = { left: 0.65, top: 0.20, width: 0.15, height: 0.60 };

/** Text column: from the left gutter up to a safe distance before the lens. */
const COL_WIDTH = `calc(${LENS.left * 100}% - ${EDGE} - 5vw)`;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function HeroReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lensInnerRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [secondFoldProgress, setSecondFoldProgress] = useState(0);
  const [typed, setTyped] = useState(0);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [dragging, setDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkWidth = () => setWindowWidth(window.innerWidth);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const isMobile = windowWidth < 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isPhone = windowWidth < 768;

  // ---- scroll progress -----------------------------------------------------
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (el) {
        const total = el.offsetHeight - window.innerHeight;
        const p = total > 0 ? clamp(-el.getBoundingClientRect().top / total) : 0;
        setProgress(p);
      }

      const foldEl = document.getElementById("second-fold");
      if (foldEl) {
        const rect = foldEl.getBoundingClientRect();
        // foldP goes 0 -> 1 as foldEl ascends from bottom (innerHeight) to top (0) of viewport
        const foldP = clamp((window.innerHeight - rect.top) / window.innerHeight);
        setSecondFoldProgress(foldP);
      } else {
        setSecondFoldProgress(0);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // ---- text transition & smooth kicker position -----------------------------
  const [textIn, setTextIn] = useState(0);

  useEffect(() => {
    let raf: number;
    const update = () => {
      setTextIn((prev) => {
        const target = progress > 0.015 ? 1 : 0;
        const speed = target === 1 ? 0.08 : 0.14;
        const next = lerp(prev, target, speed);
        if (Math.abs(next - target) < 0.001) return target;
        return next;
      });
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  // Typing starts only after kicker reaches its final header position
  const focused = textIn >= 0.95;

  // ---- typing --------------------------------------------------------------
  useEffect(() => {
    if (!focused) {
      setTyped(0);
      return;
    }
    const id = window.setInterval(() => {
      setTyped((n) => {
        if (n >= FULL_TITLE.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 32);
    return () => window.clearInterval(id);
  }, [focused]);

  const titleDone = typed >= FULL_TITLE.length;

  // ---- magic lens tracking -------------------------------------------------
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const active = useRef(false);
  active.current = focused && !isMobile && dragging && secondFoldProgress < 0.2;

  const applyLens = useCallback(() => {
    const { x, y } = current.current;
    if (lensRef.current) lensRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (lensInnerRef.current)
      lensInnerRef.current.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let raf = 0;
    const loop = () => {
      const t = active.current ? target.current : { x: 0, y: 0 };
      current.current.x = lerp(current.current.x, t.x, 0.12);
      current.current.y = lerp(current.current.y, t.y, 0.12);
      applyLens();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const track = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const baseCx = (0.65 + 0.15 / 2) * w;
      const baseCy = (0.20 + 0.60 / 2) * h;
      const halfW = (0.15 * w) / 2;
      const halfH = (0.60 * h) / 2;
      const cx = clamp(e.clientX, halfW, w - halfW);
      const cy = clamp(e.clientY, halfH, h - halfH);
      target.current = { x: cx - baseCx, y: cy - baseCy };
    };

    const onDown = (e: PointerEvent) => {
      if (lensRef.current && lensRef.current.contains(e.target as Node)) {
        track(e);
        setDragging(true);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (active.current) track(e);
    };
    const onUp = () => setDragging(false);

    // Bind to window so dragging works across the screen
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [applyLens, isMobile]);

  // ---- derived visuals -----------------------------------------------------
  const initialBgOpacity = isMobile ? 0.9 : lerp(0.1, 0.72, textIn);
  const bgOpacity = isMobile ? 0.9 : lerp(initialBgOpacity, 1.0, secondFoldProgress);

  const initialBgBlur = isMobile ? 0 : lerp(46, 22, textIn);
  // Background only becomes 100% clear (0px blur) as second fold ascends past 40% scroll
  const unblurProgress = clamp((secondFoldProgress - 0.4) / 0.6);
  const bgBlur = isMobile ? 0 : lerp(initialBgBlur, 0, unblurProgress);

  const lensBlur = lerp(26, 0, textIn);

  const initialLensVis = lerp(0.35, 1, textIn);
  const lensOpacity = isMobile ? 0 : lerp(initialLensVis, 0, secondFoldProgress * 2);
  const radialOverlayOpacity = isMobile ? 0.2 : lerp(lerp(1, 0, textIn), 0, secondFoldProgress);

  const kickerSizeStr = isPhone
    ? `${lerp(1.1, 0.75, textIn)}rem`
    : isTablet
      ? `${lerp(1.3, 0.95, textIn)}rem`
      : `${lerp(1.4, 0.78, textIn)}rem`;
  const kickerTop = isPhone
    ? lerp(50, 56.0, textIn)
    : isTablet
      ? lerp(50, 59.1, textIn)
      : lerp(48, 23.5, textIn);
  const kickerTrack = isPhone
    ? lerp(0.1, 0.05, textIn)
    : isTablet
      ? lerp(0.16, 0.06, textIn)
      : lerp(0.36, 0.2, textIn);

  const colLeft = isMobile ? 0 : EDGE;
  const colWidth = isMobile ? "100%" : COL_WIDTH;
  const paddingX = isMobile ? "24px" : 0;
  const textAlign = isMobile ? "center" : "left";
  const titleAlign = isMobile ? "items-center" : "items-start";

  const currentLens = isMobile ? { left: 0.53, top: 0.1, width: 0.25, height: 0.33 } : { left: 0.65, top: 0.20, width: 0.15, height: 0.60 };
  const currentHeroImage = isMobile ? HERO_IMAGE_URL_MOBILE : HERO_IMAGE_URL_DESKTOP;

  const actualLens = currentLens;

  return (
    <section ref={sectionRef} className="relative w-full h-[220vh] bg-background">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-background grain select-none z-0"
        style={{
          cursor: "default",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          touchAction: "auto",
          pointerEvents: secondFoldProgress >= 0.98 ? "none" : "auto",
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {/* blurred base image */}
        <div
          className="absolute inset-0 will-change-[filter,opacity] pointer-events-none"
          style={{ opacity: bgOpacity, filter: `blur(${bgBlur}px) saturate(0.95)` }}
        >
          <img
            draggable={false}
            src={currentHeroImage}
            alt="Retrato em contraluz sobre fundo escuro"
            width={1600}
            height={583}
            className={`h-full w-full scale-105 object-cover pointer-events-none ${isMobile ? (isTablet ? "object-top" : "object-center") : "object-[46%_42%]"}`}
            style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
          />
        </div>
        <div 
          className={`absolute inset-0 pointer-events-none ${isMobile ? 'bg-background/20' : 'bg-[radial-gradient(120%_90%_at_18%_50%,var(--background)_38%,transparent_78%)]'}`} 
          style={{ opacity: radialOverlayOpacity }}
        />

        {/* magic lens */}
        <div
          ref={lensRef}
          className={`absolute overflow-hidden will-change-transform ${isMobile ? 'pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]' : ''}`}
          style={{
            ...(isMobile ? {
              left: `${actualLens.left * 100}%`,
              top: `${actualLens.top * 100}%`,
            } : {
              left: `${currentLens.left * 100}%`,
              top: `${currentLens.top * 100}%`,
            }),
            width: `${actualLens.width * 100}%`,
            height: `${actualLens.height * 100}%`,
            opacity: lensOpacity,
            borderRadius: "14px",
            cursor: focused && !isMobile && secondFoldProgress < 0.2 ? (dragging ? "grabbing" : "grab") : "default",
            pointerEvents: focused && !isMobile && secondFoldProgress < 0.2 ? "auto" : "none",
            boxShadow: secondFoldProgress < 0.5
              ? (focused ? "0 30px 90px -30px rgba(0,0,0,0.9)" : "0 0 0 1px rgba(255,255,255,0.12)")
              : "none",
            outline: secondFoldProgress < 0.3 ? "1px dashed rgba(255,255,255,0.22)" : "none",
            outlineOffset: "6px",
          }}
        >
          <div className="absolute inset-0 will-change-transform">
            <div
              ref={lensInnerRef}
              className={`absolute ${isMobile ? 'transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]' : ''}`}
              style={{
                ...(isMobile ? {
                  left: `${-actualLens.left * 100}vw`,
                  top: `${-actualLens.top * 100}vh`,
                } : {
                  left: `${-currentLens.left * 100}vw`,
                  top: `${-currentLens.top * 100}vh`,
                }),
                width: "100vw",
                height: "100vh",
                filter: `blur(${lensBlur}px)`,
              }}
            >
              <img
                draggable={false}
                src={currentHeroImage}
                alt=""
                width={1600}
                height={583}
                className={`h-full w-full scale-105 object-cover pointer-events-none ${isMobile ? (isTablet ? "object-top" : "object-center") : "object-[46%_42%]"}`}
                style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
              />
            </div>
          </div>

          {/* explore hint, inside the lens (desktop) */}
          {!isMobile && (
            <>
              {/* scroll cue (desktop) inside lens before text arrives */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-foreground pointer-events-none transition-opacity duration-500"
                style={{ opacity: clamp(1 - textIn * 2) * (1 - secondFoldProgress) }}
              >
                <svg
                  viewBox="0 0 24 32"
                  className="h-8 w-6 cue-anim drop-shadow-md"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
                  <path d="M12 9v14" />
                  <path d="M8.5 19.5 12 23.5l3.5-4" />
                </svg>
                <p className="mt-4 text-[0.72rem] font-extralight tracking-[0.12em] text-foreground/90 drop-shadow-md">
                  Desça para
                </p>
                <p className="text-[0.78rem] font-medium tracking-[0.06em] drop-shadow-md">revelar</p>
              </div>
              
              <div
                className="absolute inset-x-0 bottom-6 px-4 text-center transition-opacity duration-500"
                style={{ opacity: focused && !dragging && secondFoldProgress < 0.2 ? 1 : 0, pointerEvents: "none" }}
              >
                <span className="inline-block rounded-full bg-background/55 px-3 py-2 text-[0.68rem] font-light leading-snug tracking-[0.08em] text-foreground/90 backdrop-blur-md">
                  Clique e segure para
                  <br />
                  explorar a imagem revelada
                </span>
              </div>
            </>
          )}
        </div>

        {/* nav */}
        <header
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-center lg:justify-between py-4 lg:py-8"
          style={{ 
            opacity: textIn * lerp(1, 0, secondFoldProgress * 2), 
            paddingLeft: isMobile ? '1.5rem' : EDGE, 
            paddingRight: isMobile ? '1.5rem' : EDGE 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-serif text-[0.95rem] lg:text-[1.05rem] tracking-[0.3em] text-foreground whitespace-nowrap text-center lg:text-left">
            MARCOS FONSECA
          </span>
          <nav className="hidden lg:flex items-center gap-7 text-[0.86rem] font-light text-foreground/85">
            {NAV.map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-gold">
                {item}
              </a>
            ))}
          </nav>
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 lg:static lg:translate-y-0 lg:hidden text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <Menu className="w-6 h-6" strokeWidth={1} />
          </button>
        </header>

        {/* mobile menu dropdown */}
        <div 
          className={`absolute inset-x-0 top-0 z-10 bg-background/95 backdrop-blur-md border-b border-white/5 shadow-2xl transition-all duration-500 ease-in-out lg:hidden ${isMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}`}
          style={{ paddingTop: '5rem', paddingBottom: '2rem' }}
        >
          <nav className="flex flex-col items-center gap-6 text-[0.9rem] font-light text-foreground">
            {NAV.map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-gold" onClick={() => setIsMenuOpen(false)}>
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* kicker phrase */}
        <p
          className={`absolute z-10 font-light text-foreground/85 pointer-events-none max-w-full ${isPhone ? '' : 'whitespace-nowrap'}`}
          style={{
            left: colLeft,
            top: `${kickerTop}%`,
            transform: isMobile ? 'translateY(-50%)' : 'none',
            width: colWidth,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            textAlign: textAlign as "left" | "center",
            fontSize: kickerSizeStr,
            letterSpacing: `${kickerTrack}em`,
            lineHeight: isPhone ? 1.45 : 1.5,
            opacity: lerp(1, 0, secondFoldProgress * 2),
          }}
        >
          {isPhone ? (
            <>
              Nem toda marca precisa
              <br />
              de um novo design.
            </>
          ) : (
            KICKER
          )}
        </p>

        {/* title + paragraph */}
        <div
          className={`absolute z-10 pointer-events-none flex flex-col ${titleAlign}`}
          style={{
            left: colLeft,
            top: isPhone ? `${lerp(50, 58.2, textIn)}%` : isTablet ? `${lerp(50, 61.2, textIn)}%` : "25.5%",
            width: colWidth,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            opacity: focused ? lerp(1, 0, secondFoldProgress * 2) : 0,
          }}
        >
          <h1 className={`font-serif font-normal leading-[1.14] text-foreground flex flex-col ${titleAlign}`}>
            <span className="block tracking-tight whitespace-nowrap" style={{ fontSize: isPhone ? "7.5vw" : isTablet ? "5.2vw" : "3.2vw" }}>
              {FULL_TITLE.slice(0, Math.min(typed, TITLE_L1.length))}
              {typed <= TITLE_L1.length && <span className="caret" />}
            </span>
            <span className="block tracking-tight text-gold italic whitespace-nowrap" style={{ fontSize: isPhone ? "10vw" : isTablet ? "7.0vw" : "4.26vw" }}>
              {typed > TITLE_L1.length ? FULL_TITLE.slice(TITLE_L1.length, Math.min(typed, TITLE_L1.length + TITLE_L2.length)) : ""}
              {typed > TITLE_L1.length && typed <= TITLE_L1.length + TITLE_L2.length && <span className="caret" />}
            </span>
            <span className="block tracking-tight text-gold italic whitespace-nowrap" style={{ fontSize: isPhone ? "10.7vw" : isTablet ? "7.5vw" : "4.57vw" }}>
              {typed > TITLE_L1.length + TITLE_L2.length ? FULL_TITLE.slice(TITLE_L1.length + TITLE_L2.length, typed) : ""}
              {typed > TITLE_L1.length + TITLE_L2.length && <span className="caret" />}
            </span>
          </h1>
          <p
            className={`font-light leading-relaxed text-foreground/80 transition-opacity duration-700 pointer-events-auto max-w-[30rem] ${isPhone ? 'mt-3 text-[0.75rem]' : isTablet ? 'mt-4 text-[0.85rem]' : 'mt-6 text-[0.95rem]'}`}
            style={{ opacity: titleDone ? 1 : 0, textAlign: textAlign as "left" | "center" }}
          >
            {PARAGRAPH}
          </p>
        </div>

        {/* bottom cue */}
        <div
          className="absolute bottom-10 z-10 flex justify-center text-foreground pointer-events-none"
          style={{ left: colLeft, width: colWidth, opacity: titleDone ? lerp(0.85, 0, secondFoldProgress * 2.5) : 0 }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-6 cue-anim opacity-75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="square"
          >
            <path d="M12 4v16M7 15l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
