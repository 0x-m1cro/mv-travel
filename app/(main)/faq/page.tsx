"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Booking",
    question: "How do I make a reservation?",
    answer: "Making a reservation is easy! Simply search for your preferred destination and dates, browse through our selection of resorts, select your room type, and complete the booking form with your details. You'll receive a confirmation email immediately after booking.",
  },
  {
    category: "Booking",
    question: "Can I modify or cancel my booking?",
    answer: "Yes, you can modify or cancel your booking depending on the cancellation policy of your selected rate. Free cancellation is usually available up to 48-72 hours before check-in. Log into your account to manage your booking or contact our support team.",
  },
  {
    category: "Booking",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. Payment is processed securely through our encrypted payment system.",
  },
  {
    category: "Travel",
    question: "Do I need a visa to visit the Maldives?",
    answer: "Most nationalities receive a free 30-day tourist visa on arrival in the Maldives. You'll need a valid passport with at least 6 months validity, a return ticket, and proof of accommodation (your hotel booking confirmation).",
  },
  {
    category: "Travel",
    question: "What is the best time to visit the Maldives?",
    answer: "The Maldives enjoys warm tropical weather year-round. The dry season (November to April) is considered the best time to visit with less rainfall and calmer seas. However, the wet season (May to October) offers lower prices and excellent diving conditions.",
  },
  {
    category: "Travel",
    question: "How do I get to my resort from the airport?",
    answer: "Transportation from Malé International Airport depends on your resort's location. Options include speedboat (15-45 minutes), seaplane (20-60 minutes), or domestic flight + speedboat. Most resorts arrange transfers for you - just provide your flight details.",
  },
  {
    category: "Accommodation",
    question: "What types of accommodation are available?",
    answer: "The Maldives offers diverse accommodation options: overwater villas, beach villas, pool villas, and water bungalows. From ultra-luxury private islands to budget-friendly guesthouses, there's something for every traveler and budget.",
  },
  {
    category: "Accommodation",
    question: "What is included in my stay?",
    answer: "Inclusions vary by resort and rate plan. Options typically include Room Only, Breakfast Only, Half Board (breakfast + dinner), Full Board (all meals), and All-Inclusive (meals, drinks, activities). Check the specific inclusions when selecting your rate.",
  },
  {
    category: "Accommodation",
    question: "Are the resorts family-friendly?",
    answer: "Many Maldives resorts welcome families with dedicated kids' clubs, family villas, and child-friendly activities. Some resorts are adults-only, perfect for honeymoons and romantic getaways. Our filters help you find family-friendly options.",
  },
  {
    category: "Support",
    question: "What if I have a problem during my stay?",
    answer: "Our support team is available 24/7 to assist you. You can reach us via phone, email, or WhatsApp. We'll work directly with the resort to resolve any issues and ensure you have a wonderful experience.",
  },
  {
    category: "Support",
    question: "Do you offer travel insurance?",
    answer: "While we don't sell travel insurance directly, we strongly recommend purchasing comprehensive travel insurance that covers trip cancellation, medical emergencies, and luggage. We can recommend reputable insurance providers.",
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredFaqs = activeCategory === "All"
    ? faqs
    : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-stix text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about booking your Maldives vacation
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setActiveCategory("All")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === "All"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform",
                      openIndex === index && "transform rotate-180"
                    )}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-muted-foreground animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-gray-50 rounded-xl">
            <h2 className="font-stix text-2xl font-bold mb-2">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-4">
              Our travel experts are here to help you plan your perfect Maldives vacation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@mvtravel.com"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                Email Us
              </a>
              <a
                href="tel:+9601234567"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-input bg-background font-medium hover:bg-accent transition-colors"
              >
                Call +960 123 4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
