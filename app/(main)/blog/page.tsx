import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    id: "1",
    slug: "ultimate-guide-maldives-honeymoon",
    title: "The Ultimate Guide to Planning Your Maldives Honeymoon",
    excerpt: "Everything you need to know about planning the perfect romantic getaway in the Maldives, from choosing the right resort to timing your trip.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
    category: "Travel Tips",
    author: "Sarah Williams",
    date: "December 1, 2024",
    readTime: "8 min read",
  },
  {
    id: "2",
    slug: "best-snorkeling-spots-maldives",
    title: "10 Best Snorkeling Spots in the Maldives",
    excerpt: "Discover the most breathtaking underwater worlds the Maldives has to offer, from house reefs to protected marine areas.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    category: "Activities",
    author: "Michael Chen",
    date: "November 25, 2024",
    readTime: "6 min read",
  },
  {
    id: "3",
    slug: "overwater-villa-guide",
    title: "Overwater Villa vs Beach Villa: Which Should You Choose?",
    excerpt: "A comprehensive comparison to help you decide between the two most popular villa types in the Maldives.",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
    category: "Accommodation",
    author: "Ahmed Hassan",
    date: "November 18, 2024",
    readTime: "5 min read",
  },
  {
    id: "4",
    slug: "maldives-on-a-budget",
    title: "How to Experience the Maldives on a Budget",
    excerpt: "Yes, it's possible! Learn about local islands, guesthouses, and tips for experiencing paradise without breaking the bank.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    category: "Budget Travel",
    author: "Emma Roberts",
    date: "November 10, 2024",
    readTime: "7 min read",
  },
  {
    id: "5",
    slug: "best-time-to-visit-maldives",
    title: "Best Time to Visit the Maldives: A Month-by-Month Guide",
    excerpt: "Weather patterns, peak seasons, and what to expect throughout the year in this tropical paradise.",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800",
    category: "Planning",
    author: "Sarah Williams",
    date: "November 5, 2024",
    readTime: "6 min read",
  },
  {
    id: "6",
    slug: "maldives-sustainable-tourism",
    title: "Sustainable Tourism in the Maldives: How to Travel Responsibly",
    excerpt: "Learn about eco-friendly resorts and practices that help protect the Maldives' fragile ecosystem.",
    image: "https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=800",
    category: "Sustainability",
    author: "Michael Chen",
    date: "October 28, 2024",
    readTime: "8 min read",
  },
];

const categories = Array.from(new Set(blogPosts.map((post) => post.category)));

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-stix text-4xl md:text-5xl font-bold">
            Travel Blog
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Inspiration, tips, and guides for your Maldives adventure
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <Link href={`/blog/${blogPosts[0].slug}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto">
                    <Image
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{blogPosts[0].category}</Badge>
                    <h2 className="font-stix text-2xl md:text-3xl font-bold mb-3 hover:text-primary transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {blogPosts[0].date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {blogPosts[0].readTime}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4">{post.category}</Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-stix text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-input bg-background font-medium hover:bg-accent transition-colors">
              Load More Articles
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="font-stix text-2xl font-bold mb-2">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-6">
            Get travel tips, exclusive deals, and destination inspiration delivered to your inbox.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
