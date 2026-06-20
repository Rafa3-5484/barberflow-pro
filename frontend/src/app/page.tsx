import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/landing/hero'
import { PlatformFeatures } from '@/components/landing/platform-features'
import { PlatformPricing } from '@/components/landing/platform-pricing'
import { ContactSection } from '@/components/landing/contact-section'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PlatformFeatures />
        <PlatformPricing />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
