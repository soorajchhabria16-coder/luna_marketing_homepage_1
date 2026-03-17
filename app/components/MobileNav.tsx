"use client";

import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

const NavWrapper = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(13, 15, 27, 0.85);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 20px 25px;
  z-index: 1500;
  justify-content: space-around;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: var(--text-dim);
  transition: all 0.3s ease;
  
  & i {
    font-size: 1.2rem;
  }
  
  & span {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }
  
  &:hover, &.active {
    color: var(--gold-accent);
  }
`;

const MobileNav = () => {
  return (
    <NavWrapper>
      <NavItem href="/#vibe">
        <i className="fa-solid fa-calendar-day"></i>
        <span>Today</span>
      </NavItem>
      <NavItem href="/#birth-chart">
        <i className="fa-solid fa-chart-line"></i>
        <span>Chart</span>
      </NavItem>
      <NavItem href="/guide">
        <i className="fa-solid fa-book-sparkles"></i>
        <span>Guide</span>
      </NavItem>
      <NavItem href="/community">
        <i className="fa-solid fa-users-rays"></i>
        <span>Community</span>
      </NavItem>
    </NavWrapper>
  );
};

export default MobileNav;
