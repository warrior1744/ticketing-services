import Link from "next/link";
import React from "react";
import styles from "@/styles/Header.module.css";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Tickets", href: "/tickets/my" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li className="nav-item" key={href}>
          <Link legacyBehavior href={href}>
            <a className="nav-link"> {label} </a>
          </Link>
        </li>
      );
    });

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link legacyBehavior href="/">
            <a className="navbar-brand"> Ticket Booth </a>
          </Link>
        </div>
        {/* search components */}
        <nav className="navbar navbar-light bg-light">
          <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">{links}</ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
