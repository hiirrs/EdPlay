import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Welcome to Our LMS</h1>
          <p className="text-xl text-muted-foreground mb-8">Discover a world of knowledge at your fingertips</p>
          <Button asChild size="lg">
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((course) => (
            <div key={course} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Course {course}</h3>
              <p className="text-muted-foreground mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <Button variant="outline" asChild>
                <Link href={`/courses/${course}`}>Learn More</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
