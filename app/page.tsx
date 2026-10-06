import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AvatarEditor from '@/components/AvatarEditor';
import Instructions from '@/components/Instructions';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-pattern min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        {/* Decorative divider */}
        <div className="divider max-w-7xl mx-auto px-4 sm:px-6" aria-hidden="true" />

        <AvatarEditor />

        {/* Decorative divider */}
        <div className="divider max-w-7xl mx-auto px-4 sm:px-6" aria-hidden="true" />

        <Instructions />
      </main>
      <Footer />
    </div>
  );
}
