import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'
import Hero from '@/components/home/Hero'
import Categories from '@/components/home/Categories'
import NewArrivals from '@/components/home/NewArrivals'
import BrandStory from '@/components/home/BrandStory'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/home/Newsletter'

export const metadata: Metadata = {
  title: 'Cary Grant Clothing — Premium Canadian Streetwear',
  description: 'Premium Canadian streetwear for the whole family. Hoodies, tracksuits, African prints, women\'s wear and kids clothing. Est. 2002, Barrie, Ontario.',
}

export default function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <Categories />
      <NewArrivals />
      <BrandStory />
      <Testimonials />
      <Newsletter />
    </SiteLayout>
  )
}
