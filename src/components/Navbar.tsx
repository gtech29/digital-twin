"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null); // restore focus on close

  // Close on Esc (global)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Body scroll lock + focus move/restore
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);

    if (open && panelRef.current) {
      // Move focus to first focusable in the drawer
      const first = panelRef.current.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), summary'
      );
      first?.focus();
    } else if (!open) {
      // Restore focus to hamburger
      buttonRef.current?.focus();
    }

    return () => {
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  // Focus trap inside the drawer
  function onKeyDownTrap(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), summary'
      )
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      {/* Top bar with hamburger on the left */}
      <header className="nav-topbar" role="banner">
        <button
          ref={buttonRef}
          className="hamburger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          {/* Simple hamburger icon */}
          <span />
          <span />
          <span />
        </button>

        <Link href="/" className="brand" aria-label="Digital Twin, home">
          Digital Twin
        </Link>
      </header>

      {/* Overlay */}
      <div
        className={`nav-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Sliding left drawer */}
      <aside
        id="nav-drawer"
        ref={panelRef}
        className={`nav-drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        onKeyDown={onKeyDownTrap}
      >
        <div className="drawer-header">
          <strong>Menu</strong>
          <button
            className="close-btn"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="drawer-nav" aria-label="Primary">
          <ul className="menu-root">
            <li>
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>

            <li>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
