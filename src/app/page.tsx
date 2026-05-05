import Link from "next/link";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900">BioRender</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
          <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How it works</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Templates</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Pricing</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
          Trusted by 2 million+ scientists
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Create stunning{" "}
          <span className="text-teal-500">science figures</span>{" "}
          in minutes
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Drag and drop from thousands of scientifically accurate icons. Build
          publication-ready figures without any design skills.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-teal-200"
          >
            Start for Free
          </Link>
          <a
            href="#how-it-works"
            className="text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg border border-gray-200 hover:border-teal-300 hover:text-teal-600 transition-colors"
          >
            See how it works →
          </a>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 bg-white rounded-2xl shadow-2xl border border-gray-100 h-80 flex items-center justify-center">
          <div className="text-center text-gray-300">
            <div className="text-6xl mb-4">🧬</div>
            <p className="text-lg font-medium">Canvas Editor Preview</p>
            <p className="text-sm mt-1">Coming in Phase 4</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
const features = [
  {
    icon: "🎨",
    title: "Drag & Drop Editor",
    description:
      "Build figures by simply dragging icons onto a canvas. No Photoshop skills required — if you can drag a file, you can use BioRender.",
  },
  {
    icon: "🔬",
    title: "7,000+ Science Icons",
    description:
      "A massive library of scientifically accurate icons covering cell biology, microbiology, lab equipment, signaling pathways, and more.",
  },
  {
    icon: "📄",
    title: "Export for Publications",
    description:
      "Download your figures as high-resolution PNG or PDF files, ready to drop straight into your research paper or presentation.",
  },
  {
    icon: "☁️",
    title: "Save & Sync",
    description:
      "Your figures are saved to the cloud automatically. Access them from any device, pick up where you left off, and share with collaborators.",
  },
  {
    icon: "📐",
    title: "Ready-made Templates",
    description:
      "Get a head start with templates for common figure types — signaling pathways, experimental workflows, cell diagrams, and more.",
  },
  {
    icon: "✏️",
    title: "Fully Customisable",
    description:
      "Change colors, sizes, labels, and layout of any element. Every icon is fully editable so your figure looks exactly the way you want.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Everything you need to create great figures
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Powerful enough for expert researchers, simple enough for students.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ─────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Create a free account",
    description:
      "Sign up in seconds. No credit card required. You get full access to the editor immediately.",
  },
  {
    number: "02",
    title: "Pick icons and arrange them",
    description:
      "Browse the library, drag icons onto your canvas, resize and position them exactly where you want.",
  },
  {
    number: "03",
    title: "Export and publish",
    description:
      "Download your finished figure as a high-resolution image and use it in your paper, poster, or slides.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-gray-500 text-lg">Three steps. That&apos;s it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-teal-500 text-white text-xl font-extrabold rounded-2xl flex items-center justify-center mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Call to Action Banner ─────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <section className="py-20 px-6 bg-teal-500">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to create your first figure?
        </h2>
        <p className="text-teal-100 text-lg mb-8">
          Join thousands of scientists already using BioRender to communicate
          their research visually.
        </p>
        <Link
          href="/signup"
          className="bg-white text-teal-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-teal-50 transition-colors inline-block"
        >
          Get Started Free →
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">B</span>
          </div>
          <span className="text-white font-bold">BioRender</span>
        </div>
        <p className="text-sm">
          © 2026 BioRender Clone — Built as a learning project.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page Export ──────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
