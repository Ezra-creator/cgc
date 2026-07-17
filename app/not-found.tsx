import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image
          src="/images/logo.jpg"
          alt="Cary Grant Clothing"
          width={56}
          height={56}
          className="mx-auto mb-6 object-contain opacity-30"
        />
        <h1 className="font-display text-8xl text-cgc-red font-black mb-2">404</h1>
        <h2 className="text-xl font-bold text-cgc-ink mb-3">Page not found</h2>
        <p className="text-cgc-slate text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary">Go home</Link>
          <Link href="/shop" className="btn btn-outline">Shop now</Link>
        </div>
      </div>
    </div>
  )
}
