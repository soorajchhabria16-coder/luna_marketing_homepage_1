"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import React from 'react';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 5px rgba(248, 207, 156, 0.4)); }
  50% { filter: drop-shadow(0 0 15px rgba(248, 207, 156, 1)); }
`;

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const OuterRing = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  animation: ${rotate} 120s linear infinite;
`;

const InnerWheel = styled.svg`
  position: absolute;
  width: 80%;
  height: 80%;
  animation: ${rotate} 60s linear reverse infinite;
`;

const CenterPoint = styled.div`
  position: absolute;
  width: 20%;
  height: 20%;
  background: radial-gradient(circle, #f8cf9c 0%, transparent 70%);
  border-radius: 50%;
  z-index: 5;
  animation: ${pulse} 4s ease-in-out infinite;
`;

const SignIcon = styled.g`
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    filter: drop-shadow(0 0 10px #f8cf9c);
    transform: scale(1.1);
  }
`;

interface LiveBirthChartProps {
  sunSign: string;
  moonSign: string;
  risingSign: string;
}

const zodiacSymbols: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const LiveBirthChart = ({ sunSign, moonSign, risingSign }: LiveBirthChartProps) => {
  const signs = Object.keys(zodiacSymbols);

  const getSignAngle = (sign: string) => {
    const index = signs.indexOf(sign);
    // Align with the SVG coordinate system (30 degrees per sign)
    return (index * 30) * (Math.PI / 180);
  };

  const sunAngle = getSignAngle(sunSign);
  const moonAngle = getSignAngle(moonSign);
  const risingAngle = getSignAngle(risingSign);

  return (
    <ChartContainer>
      {/* Outer Zodiac Ring */}
      <OuterRing viewBox="0 0 500 500">
        <defs>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="95%" stopColor="rgba(248, 207, 156, 0.1)" />
            <stop offset="100%" stopColor="rgba(248, 207, 156, 0.3)" />
          </radialGradient>
        </defs>
        <circle cx="250" cy="250" r="240" fill="url(#ringGrad)" stroke="rgba(248, 207, 156, 0.2)" strokeWidth="1" />
        
        {signs.map((sign, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x = 250 + 210 * Math.cos(angle);
          const y = 250 + 210 * Math.sin(angle);
          return (
            <SignIcon key={sign}>
              <text x={x} y={y} fill="rgba(255,255,255,0.4)" fontSize="20" textAnchor="middle" alignmentBaseline="middle">
                {zodiacSymbols[sign]}
              </text>
            </SignIcon>
          );
        })}
      </OuterRing>

      {/* Inner Alignment Lines */}
      <InnerWheel viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(167, 139, 250, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
        
        {/* Connection Lines for User Signs */}
        <g stroke="rgba(248, 207, 156, 0.5)" strokeWidth="1.5">
          <line x1="250" y1="250" x2={250 + 170 * Math.cos(sunAngle)} y2={250 + 170 * Math.sin(sunAngle)} />
          <line x1="250" y1="250" x2={250 + 170 * Math.cos(moonAngle)} y2={250 + 170 * Math.sin(moonAngle)} />
          <line x1="250" y1="250" x2={250 + 170 * Math.cos(risingAngle)} y2={250 + 170 * Math.sin(risingAngle)} />
        </g>
      </InnerWheel>

      <CenterPoint />
    </ChartContainer>
  );
};

export default LiveBirthChart;
