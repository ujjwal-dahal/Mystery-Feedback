import Link from 'next/link';
import './Footer.scss';

export default function Footer() {
  return (
    <>
      <footer className="footer-container">
          <p className="footer-text">
            &copy; 2025 Mystery Feedback. All rights reserved.
          </p>
          <p className="footer-creator">
            Created by <Link href="/" className="footer-link">Ujjwal Dahal</Link>
          </p>
      </footer>
    </>
  );
}
