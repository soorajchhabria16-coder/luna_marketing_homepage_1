"use client";

import Link from 'next/link';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="navbar">
      <Link href="/" className="logo">
        <i className="fa-solid fa-moon"></i> Luna
      </Link>
      <nav className="nav-links">
        <Link href="/#vibe">Today</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/#birth-chart">Birth Chart</Link>
        <Link href="/star-map">Star Map</Link>
        <Link href="/#vibe">Astro 101</Link>
        <Link href="/#app">App</Link>
        <Link href="/#app">Podcasts</Link>
        <Link href="/#about">About</Link>
        {isSignedIn && (
          <Link href="/dashboard" className="nav-dashboard-link">
            <i className="fa-solid fa-stars"></i> My Dashboard
          </Link>
        )}
      </nav>
      <div className="nav-actions">
        <i className="fa-solid fa-magnifying-glass"></i>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="btn-nav-signin">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary btn-nav-signup">Join Free</button>
            </SignUpButton>
          </>
        )}
      </div>
    </header>
  );
}
