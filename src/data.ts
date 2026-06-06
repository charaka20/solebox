import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "snkr-aj1-ts",
    name: "Air Jordan 1 Retro High 'Travis Scott'",
    brand: "Asics",
    price: 38900,
    sizes: [40, 41, 42, 43, 44, 45],
    description: "An absolute grail featuring premium sail and dark mocha leather paneling, an oversized backward Swoosh, and hidden collar pockets. A centerpiece of modern sneaker culture.",
    image: "/images/1.png"
  },
  {
    id: "snkr-nb-550",
    name: "New Balance 550 'Aime Leon Dore'",
    brand: "Asics",
    price: 24500,
    sizes: [39, 40, 41, 42, 43, 44],
    description: "A gorgeous retro basketball silhouette revitalized in collaboration with ALD. Crafted from premium eggshell-textured leather, yellowed midsoles, and rich forest green accents.",
    image: "/images/2.png"
  },
  {
    id: "snkr-dunk-low",
    name: "Dunk Low Retro 'Panda Noir'",
    brand: "Asics",
    price: 18900,
    sizes: [40, 41, 42, 43, 44, 45],
    description: "The immaculate street staple dressed in clean high-contrast black and white leather overlays. Durable construction built for daily rotational style with supreme comfort.",
    image: "/images/3.png"
  },
  {
    id: "snkr-yz-350",
    name: "Yeezy Boost 350 V2 'Onyx'",
    brand: "Asics",
    price: 36000,
    sizes: [41, 42, 43, 44, 45],
    description: "Constructed with re-engineered Primeknit weave in stealthy triple-black. Supported by full-length responsive Boost technology inside a smoky semi-translucent midsole cage.",
    image: "/images/4.png"
  }
];

export const TRACKING_CONCEPTS = [
  {
    id: "web-tags",
    title: "Server-Side Tagging & UTM Trails",
    description: "All client sneaker interactions compile tracking indicators server-side. Guarding purchase attribution metrics securely without viewport leakage."
  },
  {
    id: "pixel-sync",
    title: "Conversion API Direct Sync",
    description: "Bypassing browser blocker latency. All 'Add To Cart' events flow instantly into a custom analytical warehouse using low-latency server proxies."
  },
  {
    id: "zero-trust-cookies",
    title: "Zero-Trust Sessions",
    description: "State tokens locked with encrypted client signatures. Securing against token-hijacking while retaining persistent anonymous basket sessions."
  }
];
