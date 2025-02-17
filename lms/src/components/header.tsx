import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          LMS
        </Link>
        <nav>
          <ul className="flex space-x-4">
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
              <Button variant="outline">Sign In</Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

