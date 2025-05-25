import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const Footer = () => {
    return (
        <footer className="bg-black text-white py-8 md:py-16 px-4 md:px-6 lg:px-12 w-full">
            <div className="mx-auto w-[90%]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 leading-tight">
                            Subscribe to get tips and tactics to grow the way you want.
                        </h2>
                        <div className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-white text-black px-4 py-2 text-base md:text-lg border-4 border-white rounded-md flex-1"
                            />
                            <button className="bg-pink-500 hover:bg-pink-600 px-4 py-2 border-4 border-pink-500 hover:border-pink-600 rounded-md flex items-center justify-center">
                                <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                            </button>
                        </div>
                    </div>

                    <div className="col-span-1 pt-6 px-4 md:px-8 md:py-8">
                        <h3 className="text-lg font-bold mb-4 md:mb-6">Help</h3>
                        <ul className="space-y-3 md:space-y-4">
                            <li>
                                <Link href="/" className="text-sm md:text-base hover:text-pink-400 transition-colors">
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm md:text-base hover:text-pink-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm md:text-base hover:text-pink-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-1 pt-6 px-4 md:px-8 md:py-8">
                        <h3 className="text-lg font-bold mb-4 md:mb-6">Features</h3>
                        <ul className="space-y-3 md:space-y-4">
                            <li>
                                <Link href="/" className="text-sm md:text-base hover:text-pink-400 transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm md:text-base hover:text-pink-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm md:text-base hover:text-pink-400 transition-colors">
                                    Jobs
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <span className="text-lg md:text-xl font-bold pt-2.5">dumroad, Inc.</span>
            </div>
        </footer>
    )
}