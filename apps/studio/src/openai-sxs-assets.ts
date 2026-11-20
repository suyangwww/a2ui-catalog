function svgUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SXS_IMAGES = {
  // San Francisco Landmarks (3-up photo strip)
  sfGoldenGate: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4BA3E3"/>
          <stop offset="68%" stop-color="#9ED2F5"/>
          <stop offset="100%" stop-color="#DDF0FC"/>
        </linearGradient>
      </defs>
      <rect width="480" height="320" fill="url(#sky)"/>
      <path d="M0 212 Q120 165 245 204 T480 188 L480 245 L0 245 Z" fill="#6E8274"/>
      <rect y="232" width="480" height="88" fill="#2A6F97"/>
      <rect x="118" y="68" width="16" height="172" fill="#D14936"/>
      <rect x="344" y="82" width="15" height="158" fill="#D14936"/>
      <path d="M0 162 Q60 192 126 78 Q240 208 352 92 Q415 178 480 186" fill="none" stroke="#D14936" stroke-width="5"/>
      <line x1="0" y1="196" x2="480" y2="196" stroke="#C03E2C" stroke-width="7"/>
      <path d="M0 278 Q180 264 480 286 L480 320 L0 320 Z" fill="#D8C9A8"/>
    </svg>`,
  ),
  sfLombard: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320">
      <rect width="480" height="320" fill="#527A54"/>
      <rect x="0" y="0" width="96" height="320" fill="#EAE2D6"/>
      <rect x="384" y="0" width="96" height="320" fill="#E3DACB"/>
      <path d="M120 20 C340 20 140 95 350 95 C140 95 340 170 135 170 C340 170 145 245 355 245 C180 245 260 305 240 320" fill="none" stroke="#C56E61" stroke-width="34" stroke-linecap="round"/>
      <path d="M120 20 C340 20 140 95 350 95 C140 95 340 170 135 170 C340 170 145 245 355 245" fill="none" stroke="#F4EDE4" stroke-width="3" stroke-dasharray="6 6"/>
      <circle cx="165" cy="64" r="18" fill="#3D6B43"/><circle cx="315" cy="132" r="20" fill="#355E3B"/>
      <circle cx="170" cy="206" r="19" fill="#3D6B43"/><circle cx="292" cy="62" r="10" fill="#E87A90"/>
      <circle cx="198" cy="136" r="10" fill="#E87A90"/><circle cx="304" cy="208" r="11" fill="#F2B84B"/>
    </svg>`,
  ),
  sfPalace: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320">
      <rect width="480" height="205" fill="#4696D8"/>
      <rect y="205" width="480" height="115" fill="#1E5F8C"/>
      <ellipse cx="240" cy="118" rx="64" ry="38" fill="#D9A773"/>
      <rect x="176" y="118" width="128" height="84" fill="#CFA06E"/>
      <g fill="#A8794D">
        <rect x="188" y="128" width="10" height="74"/><rect x="212" y="128" width="10" height="74"/>
        <rect x="236" y="128" width="10" height="74"/><rect x="260" y="128" width="10" height="74"/>
        <rect x="284" y="128" width="10" height="74"/>
      </g>
      <rect x="92" y="142" width="76" height="60" fill="#C99867"/>
      <rect x="312" y="142" width="76" height="60" fill="#C99867"/>
      <ellipse cx="240" cy="248" rx="72" ry="26" fill="rgba(217,167,115,0.38)"/>
      <circle cx="80" cy="176" r="34" fill="#396642"/><circle cx="404" cy="174" r="36" fill="#396642"/>
    </svg>`,
  ),

  // Dog Vest Moodboard (3 gallery cards + 2 material macro shots)
  vestTrail: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 270">
      <defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4A5240"/><stop offset="100%" stop-color="#282E22"/></linearGradient></defs>
      <rect width="360" height="270" fill="url(#bg1)"/>
      <circle cx="290" cy="56" r="64" fill="rgba(235,205,145,0.14)"/>
      <ellipse cx="176" cy="168" rx="84" ry="44" fill="#D29B56"/>
      <circle cx="254" cy="116" r="34" fill="#DDA762"/>
      <ellipse cx="282" cy="122" rx="18" ry="12" fill="#C98E49"/>
      <path d="M126 126 L218 122 L226 192 L134 196 Z" rx="12" fill="#556347" stroke="#36402C" stroke-width="4"/>
      <line x1="146" y1="146" x2="206" y2="144" stroke="#22271D" stroke-width="6"/>
      <line x1="148" y1="168" x2="208" y2="166" stroke="#D97706" stroke-width="4"/>
      <rect x="118" y="198" width="16" height="52" rx="7" fill="#C98E49"/>
      <rect x="212" y="196" width="16" height="54" rx="7" fill="#C98E49"/>
    </svg>`,
  ),
  vestUrban: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 270">
      <rect width="360" height="270" fill="#23252A"/>
      <ellipse cx="180" cy="242" rx="92" ry="14" fill="rgba(0,0,0,0.4)"/>
      <path d="M142 128 L218 128 L228 228 L132 228 Z" fill="#D58A44"/>
      <circle cx="180" cy="96" r="34" fill="#DC934E"/>
      <polygon points="150,72 164,44 174,72" fill="#C87C38"/>
      <polygon points="210,72 196,44 186,72" fill="#C87C38"/>
      <path d="M144 132 L216 132 L222 198 L138 198 Z" fill="#181A1F" stroke="#3E434F" stroke-width="3"/>
      <rect x="166" y="150" width="28" height="10" rx="3" fill="#94A3B8"/>
    </svg>`,
  ),
  vestCozy: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 270">
      <rect width="360" height="270" fill="#F1EFEA"/>
      <ellipse cx="180" cy="242" rx="86" ry="12" fill="rgba(0,0,0,0.08)"/>
      <circle cx="180" cy="92" r="38" fill="#9C6B49"/>
      <circle cx="146" cy="98" r="16" fill="#8B5C3C"/><circle cx="214" cy="98" r="16" fill="#8B5C3C"/>
      <rect x="138" y="126" width="84" height="92" rx="22" fill="#DDD3C2" stroke="#C5B8A2" stroke-width="3"/>
      <line x1="138" y1="154" x2="222" y2="154" stroke="#C5B8A2" stroke-width="2"/>
      <line x1="138" y1="182" x2="222" y2="182" stroke="#C5B8A2" stroke-width="2"/>
      <rect x="148" y="212" width="20" height="34" rx="9" fill="#9C6B49"/>
      <rect x="192" y="212" width="20" height="34" rx="9" fill="#9C6B49"/>
    </svg>`,
  ),
  fabricRipstop: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260">
      <rect width="420" height="260" fill="#6C7046"/>
      <defs>
        <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="420" height="260" fill="url(#grid)"/>
      <path d="M0 260 L190 0 L240 0 L50 260 Z" fill="rgba(0,0,0,0.16)"/>
      <circle cx="210" cy="96" r="14" fill="rgba(235,245,215,0.45)" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
      <circle cx="248" cy="128" r="10" fill="rgba(235,245,215,0.45)" stroke="rgba(255,255,255,0.7)" stroke-width="1.8"/>
      <circle cx="186" cy="144" r="18" fill="rgba(235,245,215,0.42)" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
      <circle cx="234" cy="176" r="12" fill="rgba(235,245,215,0.45)" stroke="rgba(255,255,255,0.7)" stroke-width="1.8"/>
    </svg>`,
  ),
  hardwareBuckle: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260">
      <rect width="420" height="260" fill="#F3F4F6"/>
      <path d="M40 220 L380 40" stroke="#1E2028" stroke-width="44"/>
      <g transform="translate(210,130) rotate(-28)">
        <rect x="-54" y="-32" width="108" height="64" rx="12" fill="#374151" stroke="#111827" stroke-width="4"/>
        <rect x="-26" y="-20" width="52" height="40" rx="6" fill="#6B7280"/>
        <circle cx="0" cy="0" r="7" fill="#D97706"/>
      </g>
    </svg>`,
  ),

  // Mediterranean Lamb Roast Dish Thumbnails
  herbSalad: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
      <rect width="320" height="200" fill="#2A2927"/>
      <circle cx="160" cy="100" r="78" fill="#F8F6F0" stroke="#E2DDD2" stroke-width="6"/>
      <circle cx="136" cy="86" r="16" fill="#D93829"/><circle cx="184" cy="112" r="15" fill="#D93829"/>
      <circle cx="168" cy="74" r="14" fill="#558B2F"/><circle cx="132" cy="118" r="15" fill="#558B2F"/>
      <rect x="148" y="92" width="22" height="18" rx="3" fill="#FFFDF9"/>
      <circle cx="192" cy="84" r="6" fill="#4A2545"/><circle cx="146" cy="128" r="6" fill="#4A2545"/>
    </svg>`,
  ),
  oliveCake: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
      <rect width="320" height="200" fill="#2A2927"/>
      <ellipse cx="160" cy="126" rx="88" ry="42" fill="#F5F2EB"/>
      <path d="M96 96 Q160 56 224 96 L224 126 Q160 148 96 126 Z" fill="#D98A2B"/>
      <path d="M96 96 Q160 72 224 96 Q160 116 96 96 Z" fill="#F0B44C"/>
      <circle cx="122" cy="84" r="16" fill="#EA580C"/><circle cx="122" cy="84" r="11" fill="#FB923C"/>
      <ellipse cx="176" cy="96" rx="22" ry="10" fill="#FFFDF9"/>
    </svg>`,
  ),

  // Trattoria Receipt
  trattoriaReceipt: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220">
      <rect width="360" height="220" fill="#D6CEBC"/>
      <rect x="86" y="14" width="188" height="192" rx="6" fill="#FAF7EE" stroke="#CEC5B0"/>
      <text x="180" y="38" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#1F1D1A">TRATTORIA ROMA</text>
      <text x="180" y="52" text-anchor="middle" font-family="monospace" font-size="9" fill="#6C665D">TABLE 05 · PARTY OF 5</text>
      <line x1="104" y1="62" x2="256" y2="62" stroke="#C8C0AE" stroke-dasharray="3 2"/>
      <g font-family="monospace" font-size="10" fill="#2B2925">
        <text x="104" y="80">2x Margherita</text><text x="256" y="80" text-anchor="end">$28.00</text>
        <text x="104" y="96">1x Cacio e Pepe</text><text x="256" y="96" text-anchor="end">$16.00</text>
        <text x="104" y="112">1x Rigatoni Vodka</text><text x="256" y="112" text-anchor="end">$17.00</text>
        <text x="104" y="128">1x Insalata</text><text x="256" y="128" text-anchor="end">$14.00</text>
        <text x="104" y="144">1x House Red (L)</text><text x="256" y="144" text-anchor="end">$24.00</text>
      </g>
      <line x1="104" y1="156" x2="256" y2="156" stroke="#C8C0AE" stroke-dasharray="3 2"/>
      <g font-family="monospace" font-size="10" fill="#1F1D1A">
        <text x="104" y="172">Tax</text><text x="256" y="172" text-anchor="end">$8.78</text>
        <text x="104" y="190" font-weight="700" font-size="11">TOTAL</text><text x="256" y="190" text-anchor="end" font-weight="700" font-size="11">$107.78</text>
      </g>
    </svg>`,
  ),
};
