import React from "react";

export default function SecondFold() {
  return (
    <section id="second-fold" className="relative z-20 w-full bg-[#FAF7F2] text-[#1C1B18] overflow-hidden pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-24 md:pb-32 border-t border-[#E8DEC8]/60 shadow-[0_-30px_70px_rgba(0,0,0,0.5)]">
      {/* Background subtle radial warm glow */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial from-[#F5E8D0]/40 via-[#FAF7F2]/10 to-transparent pointer-events-none blur-3xl"
        style={{ transform: 'translate(20%, -20%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-radial from-[#EFE5D2]/30 via-[#FAF7F2]/0 to-transparent pointer-events-none blur-2xl"
        style={{ transform: 'translate(-20%, 20%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
        {/* Right side subtle scroll indicator symbol (Desktop) */}
        <div className="hidden lg:flex flex-col items-center gap-1.5 text-[#B59149]/60 absolute right-8 lg:right-14 top-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full border border-[#B59149]/70" />
          <div className="w-[1px] h-10 bg-[#B59149]/30" />
          <svg 
            className="w-3.5 h-3.5 text-[#B59149]/70" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Top Header Section: Left Headline + Right Paragraphs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-12 md:mb-16">
          {/* Left Column */}
          <div className="lg:col-span-7">
            {/* Kicker label */}
            <div className="mb-4">
              <span className="block text-[0.68rem] sm:text-xs font-light tracking-[0.28em] text-[#9E8B6F] uppercase mb-1.5">
                O QUE EU INVESTIGO
              </span>
              <div className="w-7 h-[1px] bg-[#9E8B6F]/40" />
            </div>

            {/* Main Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.16] tracking-tight text-[#1C1B18] max-w-2xl">
              Muitos problemas
              <br />
              atribuídos ao design
              <br />
              <span className="font-serif italic text-[#B59149] inline-block">
                começam antes do design. _
              </span>
            </h2>
          </div>

          {/* Right Column: Paragraphs */}
          <div className="lg:col-span-5 pt-0 space-y-5 text-[#38352F] font-light text-sm sm:text-[0.95rem] leading-[1.75]">
            <p>
              Uma marca pode possuir experiência, qualidade e valor —— e ainda assim transmitir algo diferente.
            </p>
            <p>
              Quando intenção, mensagem e experiência não produzem a mesma percepção, criar uma nova identidade, uma página ou mais conteúdo pode apenas redesenhar um problema que ainda não foi compreendido.
            </p>
            <p className="text-[#1C1B18] font-normal pt-1">
              Meu trabalho começa investigando essa distância.
            </p>
          </div>
        </div>

        {/* Center Quote Banner / Card */}
        <div className="w-full rounded-2xl md:rounded-3xl border border-[#E8DEC8] bg-[#F4EDE0]/70 backdrop-blur-sm p-6 sm:p-10 md:p-12 lg:p-14 relative overflow-hidden mb-16 md:mb-24 shadow-[0_12px_40px_rgba(180,160,120,0.05)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center relative z-10">
            {/* Left Graphic Icon / Rings */}
            <div className="md:col-span-3 flex items-center justify-center md:justify-start relative">
              {/* Fine horizontal line extending to card edge on desktop */}
              <div className="hidden md:block absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-[1px] bg-[#D8CBAD]/60 -ml-10" />
              
              <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-[#D8CBAD]/50" />
                {/* Second ring */}
                <div className="absolute inset-3 rounded-full border border-[#D8CBAD]/70" />
                {/* Third ring */}
                <div className="absolute inset-6 rounded-full border border-[#CBB892]/60 bg-[#EFE4D0]/30" />
                {/* Fourth ring */}
                <div className="absolute inset-9 rounded-full border border-[#B59149]/40 bg-[#E8DAA0]/20" />
                {/* Glowing central node */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#C09A53] shadow-[0_0_12px_#C09A53] relative z-10" />
              </div>
            </div>

            {/* Middle Vertical Divider + Quote Text */}
            <div className="md:col-span-9 flex flex-col md:flex-row items-stretch gap-6 md:gap-10 pl-0 md:pl-2 border-t md:border-t-0 md:border-l border-[#D8CBAD]/70 pt-6 md:pt-0">
              <div className="space-y-1.5 sm:space-y-2 font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-[2.05rem] leading-[1.32] text-[#A8843B] font-normal">
                <p>Primeiro revelo o que impede a percepção.</p>
                <p>Depois organizo a direção.</p>
                <p>O design vem como consequência. _</p>
              </div>
            </div>
          </div>

          {/* Watermark Quote Symbol on the bottom right */}
          <div className="absolute right-4 sm:right-8 md:right-12 bottom-0 pointer-events-none select-none text-[#E8DDC6] font-serif text-8xl sm:text-9xl lg:text-[12rem] leading-none opacity-80 z-0">
            “
          </div>
        </div>

        {/* Bottom 3 Pillars Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E0D4BB] pt-8 md:pt-10 border-t border-[#E8DEC8]">
          {/* Pillar 1 */}
          <div className="flex items-center gap-3.5 py-4 md:py-0 md:px-6 first:pl-0">
            <div className="w-9 h-9 rounded-full bg-[#EFE5D2]/70 border border-[#D8CBAD]/60 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#A8843B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-light text-[#2C2A25] tracking-wide">
              Claridade antes da forma.
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center gap-3.5 py-4 md:py-0 md:px-6">
            <div className="w-9 h-9 rounded-full bg-[#EFE5D2]/70 border border-[#D8CBAD]/60 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#A8843B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-light text-[#2C2A25] tracking-wide">
              Direção antes da execução.
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center gap-3.5 py-4 md:py-0 md:px-6 last:pr-0">
            <div className="w-9 h-9 rounded-full bg-[#EFE5D2]/70 border border-[#D8CBAD]/60 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#A8843B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-light text-[#2C2A25] tracking-wide">
              Coerência antes da estética.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
