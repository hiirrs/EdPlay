import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-2">About Us</h3>
            <p className="text-sm text-muted-foreground">
              We are dedicated to providing high-quality online education.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/courses" className="hover:text-primary">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-muted-foreground">
              Email: info@lms.com
              <br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LMS Website. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

