"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { PokeballVariant } from "@/lib/pokeballs";

interface PokeballSVGProps {
  variant: PokeballVariant;
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function PokeballSVG({
  variant,
  size = 80,
  animate = false,
  className = "",
}: PokeballSVGProps) {
  // useId gives each instance a unique prefix to avoid SVG id collisions
  const uid = useId().replace(/:/g, "");
  const slug = `${variant.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${uid}`;

  const Wrapper = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        animate: { rotate: [0, 10, -10, 5, -5, 0] },
        transition: { duration: 0.6, repeat: Infinity, repeatDelay: 3 },
      }
    : {};

  return (
    <Wrapper className={className} {...animateProps}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ball shadow */}
          <radialGradient id={`shadow-${slug}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Shine */}
          <radialGradient
            id={`shine-${slug}`}
            cx="35%"
            cy="30%"
            r="50%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          <clipPath id={`top-clip-${slug}`}>
            <rect x="0" y="0" width="100" height="48" />
          </clipPath>
          <clipPath id={`bottom-clip-${slug}`}>
            <rect x="0" y="52" width="100" height="48" />
          </clipPath>
        </defs>

        {/* Top half */}
        <g clipPath={`url(#top-clip-${slug})`}>
          <circle cx="50" cy="50" r="46" fill={variant.topColor} />

          {/* Accent patterns */}
          {variant.accentPattern === "stripes" && (
            <>
              <line
                x1="15"
                y1="20"
                x2="85"
                y2="20"
                stroke={variant.accentColor}
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
              />
              <line
                x1="20"
                y1="30"
                x2="80"
                y2="30"
                stroke={variant.accentColor}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.5"
              />
            </>
          )}
          {variant.accentPattern === "spots" && (
            <>
              <circle
                cx="35"
                cy="25"
                r="6"
                fill={variant.accentColor}
                opacity="0.5"
              />
              <circle
                cx="62"
                cy="20"
                r="4"
                fill={variant.accentColor}
                opacity="0.4"
              />
              <circle
                cx="48"
                cy="35"
                r="5"
                fill={variant.accentColor}
                opacity="0.3"
              />
            </>
          )}
          {variant.accentPattern === "star" && (
            <text
              x="50"
              y="28"
              textAnchor="middle"
              fontSize="18"
              fill={variant.accentColor}
              opacity="0.7"
            >
              ★
            </text>
          )}
          {variant.accentPattern === "rings" && (
            <>
              <circle
                cx="50"
                cy="28"
                r="12"
                fill="none"
                stroke={variant.accentColor}
                strokeWidth="2"
                opacity="0.5"
              />
              <circle
                cx="50"
                cy="28"
                r="6"
                fill="none"
                stroke={variant.accentColor}
                strokeWidth="1.5"
                opacity="0.3"
              />
            </>
          )}
          {variant.accentPattern === "gradient" && (
            <circle
              cx="50"
              cy="50"
              r="46"
              fill={`url(#shadow-${slug})`}
            />
          )}
        </g>

        {/* Bottom half */}
        <g clipPath={`url(#bottom-clip-${slug})`}>
          <circle cx="50" cy="50" r="46" fill={variant.bottomColor} />
        </g>

        {/* Center band */}
        <rect
          x="4"
          y="46"
          width="92"
          height="8"
          rx="1"
          fill={variant.bandColor}
        />

        {/* Center button outer */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill={variant.bandColor}
        />

        {/* Center button inner */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill={variant.buttonColor}
        />

        {/* Button glow */}
        <circle
          cx="50"
          cy="50"
          r="5"
          fill={variant.buttonGlow}
          opacity="0.6"
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={variant.bandColor}
          strokeWidth="3"
        />

        {/* Shine highlight */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={`url(#shine-${slug})`}
        />
      </svg>
    </Wrapper>
  );
}
