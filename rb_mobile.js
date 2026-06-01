const fs = require('fs');

// Add mobile CSS to globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');

const mobileCss = `
/* ── MOBILE RESPONSIVENESS ──────────────────────────────────────────────── */
@media (max-width: 768px) {

  /* Nav */
  .v-nav { padding: 0 20px; height: 64px; }
  .v-nav-links { display: none; }
  .v-logo-name { font-size: 16px; letter-spacing: 0.16em; }
  .v-nav-right { gap: 8px; }
  .v-nav-right .btn-faucet { display: none; }

  /* Hero */
  .v-hero { padding: 100px 24px 60px; }
  .v-hero-h1 { font-size: clamp(48px,12vw,72px); }
  .v-hero-sub { font-size: 13px; }
  .v-hero-actions { flex-direction: column; align-items: center; gap: 12px; }
  .v-hero-actions .btn-primary,
  .v-hero-actions .btn-ghost { width: 100%; max-width: 280px; }
  .v-stats-bar { flex-wrap: wrap; width: 100%; }
  .v-stat { flex: 1 1 40%; padding: 16px 20px; }
  .v-showcase-card { margin: 32px 0 0; }

  /* Sections */
  .v-section { padding: 64px 24px; }
  .v-section-head { flex-direction: column; gap: 16px; align-items: flex-start; }

  /* Ticker */
  .v-ticker-wrap { padding: 12px 0; }

  /* Strip */
  .v-strip-grid { grid-template-columns: repeat(2,1fr); }
  .v-strip-col { height: 240px; }

  /* Product grid */
  .v-product-grid { grid-template-columns: repeat(2,1fr); }

  /* Bento grid */
  .v-bento-grid { grid-template-columns: 1fr; }
  .v-bcard-wide { grid-column: 1; }
  .v-bcard-wide > div { grid-template-columns: 1fr !important; gap: 32px !important; }

  /* Editorial */
  .v-editorial { padding: 64px 24px; }
  .v-editorial-inner { grid-template-columns: 1fr !important; gap: 40px !important; }

  /* Sellers */
  .v-section > div[style*="grid-template-columns: 1fr 1fr"] {
    display: flex !important;
    flex-direction: column !important;
    gap: 32px !important;
  }

  /* Store grid */
  .v-store-card { width: 100%; }

  /* Footer */
  .v-footer { flex-direction: column; gap: 16px; padding: 24px 24px; text-align: center; }
  .v-footer-links { justify-content: center; }

  /* Cart drawer */
  .v-cart-drawer { width: 100% !important; }

  /* Modal */
  .v-modal { padding: 28px 20px; margin: 0 16px; }
  .v-modal-bg { padding: 0; align-items: flex-end; }
  .v-modal { border-radius: 0; max-height: 90vh; overflow-y: auto; }

  /* Profile */
  .v-profile-stat { padding: 16px; }
  .v-profile-stat-val { font-size: 28px; }

  /* App Kit dropdown */
  div[style*="position:'absolute',top:'calc(100% + 8px)'"] {
    position: fixed !important;
    top: auto !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    border-radius: 0 !important;
  }
}

@media (max-width: 480px) {
  /* Hero */
  .v-hero-h1 { font-size: clamp(40px,10vw,56px); }
  .v-stats-bar { flex-direction: column; }
  .v-stat { border-right: none; border-bottom: 1px solid var(--b1); }
  .v-stat:last-child { border-bottom: none; }

  /* Strip */
  .v-strip-grid { grid-template-columns: 1fr 1fr; }

  /* Products */
  .v-product-grid { grid-template-columns: 1fr; }

  /* Store grid */
  div[style*="grid-template-columns: repeat(3"] {
    grid-template-columns: 1fr !important;
  }

  /* Profile stats */
  div[style*="grid-template-columns: repeat(5"] {
    grid-template-columns: repeat(2,1fr) !important;
  }
  div[style*="grid-template-columns: repeat(4"] {
    grid-template-columns: repeat(2,1fr) !important;
  }

  /* Nav widget dropdowns */
  div[style*="width:320"] { width: calc(100vw - 32px) !important; }

  /* Checkout */
  div[style*="maxWidth:600"] { padding: 100px 16px 60px !important; }
  div[style*="maxWidth:580"] { padding: 100px 16px 60px !important; }
  div[style*="maxWidth:560"] { padding: 100px 16px 60px !important; }
  div[style*="maxWidth:520"] { padding: 100px 16px 60px !important; }
  div[style*="maxWidth:480"] { padding: 80px 16px 60px !important; }
}
`;

css += mobileCss;
fs.writeFileSync('app/globals.css', css, 'utf8');
console.log('Mobile CSS added to globals.css');
