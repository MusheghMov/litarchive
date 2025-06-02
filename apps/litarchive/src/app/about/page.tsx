import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      {/* Headline */}
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary">
          Welcome to Litarchive: Your World of Stories Awaits
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover, read, create, and collaborate. Litarchive is your ultimate online library, designed for an unparalleled reading and writing experience.
        </p>
      </section>

      {/* Mission */}
      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center">Our Mission</h2>
        <p className="text-lg md:text-xl text-center max-w-2xl mx-auto">
          At Litarchive, we believe stories have the power to connect, inspire, and transform. Our mission is to provide a vibrant platform where readers can lose themselves in captivating narratives and creators can bring their literary visions to life.
        </p>
      </section>

      {/* Features & Benefits */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Dive Into a World of Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Explore a vast and growing collection of books across all genres. Our library is optimized for a comfortable and immersive reading experience, allowing you to get lost in the magic of words.
            </p>
            <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary">
              <Link href="/books">Browse the Library &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unleash Your Inner Author</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Have a story to tell? Litarchive provides intuitive tools for you to write, format, and publish your own books. Share your voice with the world and connect with readers.
            </p>
            <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary">
              <Link href="/studio/create">Start Writing Your Book &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Collaborate and Create Together</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Writing doesn't have to be a solo journey. Invite collaborators to your projects and work together in our dedicated editor. Bring your collective ideas to life seamlessly.
            </p>
            <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary">
              <Link href="/studio">Explore Collaboration Tools &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* How to Use / Get Started */}
      <section className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">Ready to Begin Your Literary Adventure?</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Whether you're here to read captivating stories, write your next masterpiece, or collaborate with fellow creators, Litarchive has something for everyone.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/books">Explore Books</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/studio/create">Create Your Own</Link>
          </Button>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="text-center">
        <p className="text-lg md:text-xl text-muted-foreground">
          Join the Litarchive community today and be part of a world where stories thrive.
        </p>
      </section>
    </div>
  );
}
