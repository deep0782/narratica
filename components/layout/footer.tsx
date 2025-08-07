import Link from 'next/link'
import { BookOpen, Mail, Shield, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Narratica</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Creating magical, personalized stories that bring families together and spark children's imagination.
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <Heart className="h-4 w-4 mr-2 text-red-400" />
              Made with love for families
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/examples" className="hover:text-white transition-colors">Sample Stories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/safety" className="hover:text-white transition-colors">Child Safety</Link></li>
              <li><Link href="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/coppa" className="hover:text-white transition-colors">COPPA Compliance</Link></li>
              <li>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-sm">Child-Safe Platform</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Narratica. All rights reserved. Designed for families who love stories.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
