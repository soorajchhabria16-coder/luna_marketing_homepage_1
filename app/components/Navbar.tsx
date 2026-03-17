"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <header className="navbar">
      <Link href="/" className="logo">
        <i className="fa-solid fa-moon"></i> Luna
      </Link>
      <nav className="nav-links">
        <Link href="/#vibe" className={pathname === '/' ? 'active' : ''}>Today</Link>
        <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link href="/#birth-chart" className={pathname === '/' ? 'active' : ''}>Birth Chart</Link>
        <Link href="/star-map" className={pathname === '/star-map' ? 'active' : ''}>Star Map</Link>
        <Link href="/guide" className={pathname === '/guide' ? 'active' : ''}>Guide</Link>
        <Link href="/community" className={pathname === '/community' ? 'active' : ''}>Community</Link>
        <Link href="/#podcasts" className={pathname === '/' ? 'active' : ''}>Podcasts</Link>
        <Link href="/#about" className={pathname === '/' ? 'active' : ''}>About</Link>
        {isSignedIn && (
          <Link href="/dashboard" className={`nav-dashboard-link ${pathname === '/dashboard' ? 'active' : ''}`}>
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
