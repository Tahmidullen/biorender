import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-xl font-extrabold text-gray-900">BioRender</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <a href="#" className="hover:text-primary transition-colors">Templates</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Log in
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
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
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-blue-50 py-28 px-6 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-100/40 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <Badge variant="secondary" className="mb-6 bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100 gap-1.5 px-3 py-1">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full inline-block" />
          Trusted by 2 million+ scientists
        </Badge>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.08] mb-6 tracking-tight">
          Create stunning{" "}
          <span className="text-primary relative">
            science figures
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 9.5C50 3 100 1 150 2.5C200 4 250 6 298 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30"/>
            </svg>
          </span>{" "}
          in minutes
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Drag and drop from thousands of scientifically accurate icons. Build
          publication-ready figures without any design skills.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "text-base px-8 shadow-lg shadow-primary/20")}
          >
            Start for Free
          </Link>
          <a
            href="#how-it-works"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-base px-8")}
          >
            See how it works →
          </a>
        </div>

        {/* Social proof row */}
        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-400">
          <span>✓ No credit card required</span>
          <Separator orientation="vertical" className="h-4" />
          <span>✓ Free forever plan</span>
          <Separator orientation="vertical" className="h-4" />
          <span>✓ Instant access</span>
        </div>

        {/* Hero canvas placeholder */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 h-72 flex items-center justify-center">
            <div className="text-center text-gray-300">
              <div className="text-7xl mb-4 animate-bounce">🧬</div>
              <p className="text-base font-semibold">Canvas Editor Preview</p>
              <p className="text-sm mt-1 text-gray-400">Your figure goes here</p>
            </div>
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
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-50">
            Features
          </Badge>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Everything you need to create great figures
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Powerful enough for expert researchers, simple enough for students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
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
          <Badge variant="secondary" className="mb-4 bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-50">
            How it works
          </Badge>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Three steps. That&apos;s it.</h2>
          <p className="text-gray-500 text-lg">No design experience needed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-0.5 bg-primary/20" />

          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              <div className="w-16 h-16 bg-primary text-white text-xl font-extrabold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 relative z-10">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
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
    <section className="py-20 px-6 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 text-9xl">🔬</div>
        <div className="absolute bottom-0 right-1/4 text-9xl">🧬</div>
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Ready to create your first figure?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of scientists already using BioRender to communicate
          their research visually.
        </p>
        <Link
          href="/signup"
          className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "text-primary font-bold text-base px-8 bg-white hover:bg-teal-50")}
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="text-white font-bold">BioRender</span>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">Templates</a>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <Separator className="bg-gray-800 mb-6" />
        <p className="text-center text-xs text-gray-600">
          © 2026 BioRender Clone — Built as a learning project.
        </p>
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
