"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Top bar with hamburger on the left */}
      <header className="nav-topbar">
        <button
          className="hamburger"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen(true)}
        >
          {/* Simple hamburger icon */}
          <span />
          <span />
          <span />
        </button>

        <Link href="/" className="brand">
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

        <nav className="drawer-nav" onClick={() => setOpen(false)}>
          <ul className="menu-root">
            <li>
              <Link href="/">Home</Link>
            </li>

            {/* Submenu (Reports) */}
            <li className="has-sub">
              <details>
                <summary>
                  <span>Reports</span>
                  <span className="arrow" aria-hidden>
                    ▸
                  </span>
                </summary>
                <ul className="submenu">
                  <li>
                    <Link href="/dashboard/reports">Overview</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/reports/daily">Daily</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/reports/monthly">Monthly</Link>
                  </li>
                </ul>
              </details>
            </li>

            {/* Submenu (Settings) */}
            <li className="has-sub">
              <details>
                <summary>
                  <span>Settings</span>
                  <span className="arrow" aria-hidden>
                    ▸
                  </span>
                </summary>
                <ul className="submenu">
                  <li>
                    <Link href="/dashboard/settings">General</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/settings/users">Users</Link>
                  </li>
                  <li>
                    <Link href="/dashboard/settings/billing">Billing</Link>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
