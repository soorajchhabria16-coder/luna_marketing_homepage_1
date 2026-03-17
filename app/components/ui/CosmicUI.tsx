"use client";

import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(248, 207, 156, 0.2); }
  50% { box-shadow: 0 0 20px rgba(248, 207, 156, 0.4); }
  100% { box-shadow: 0 0 5px rgba(248, 207, 156, 0.2); }
`;

export const GlassCard = styled.div`
  background: rgba(26, 30, 50, 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(248, 207, 156, 0.3);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 30px rgba(128, 56, 150, 0.4);
  }
`;

interface CosmicButtonProps {
  primary?: boolean;
}

export const CosmicButton = styled.button<CosmicButtonProps>`
  background: ${({ primary }) => primary 
    ? "linear-gradient(135deg, #f8cf9c 0%, #d8a05c 100%)" 
    : "rgba(255, 255, 255, 0.05)"};
  color: ${({ primary }) => primary ? "#1a1a2e" : "#ffffff"};
  border: ${({ primary }) => primary ? "none" : "1px solid rgba(255, 255, 255, 0.1)"};
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${({ primary }) => primary ? css`${glowPulse} 3s infinite` : "none"};

  &:hover {
    transform: scale(1.05);
    background: ${({ primary }) => primary 
      ? "linear-gradient(135deg, #ffdfba 0%, #efb773 100%)" 
      : "rgba(255, 255, 255, 0.1)"};
    border-color: rgba(248, 207, 156, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GradientText = styled.span`
  background: linear-gradient(135deg, #f8cf9c 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;

export const Badge = styled.span`
  background: rgba(167, 139, 250, 0.15);
  color: #c4b5fd;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(167, 139, 250, 0.3);
`;
