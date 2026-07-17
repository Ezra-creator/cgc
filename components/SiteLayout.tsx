import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import CartStoreHydration from './CartStoreHydration'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartStoreHydration />
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </>
  )
}
