'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: "Is my child's photo safe and secure?",
    answer: "We use enterprise-grade encryption to protect all photos. Photos are automatically deleted after 30 days, and we never share or sell any personal information. We're fully COPPA compliant and prioritize your family's privacy."
  },
  {
    question: "What age groups are the stories appropriate for?",
    answer: "Our AI creates age-appropriate content for children from toddlers (0-5 years) to pre-teens (10-15 years). You can select the target age group, and our content filters ensure all stories promote positive values and learning."
  },
  {
    question: "How does the cartoon conversion work?",
    answer: "Our AI analyzes your child's photo and creates a cartoon version that maintains their unique features while making them look like a storybook character. The process takes about 15-30 seconds and works with most clear photos."
  },
  {
    question: "Can I create stories with multiple children?",
    answer: "Yes! Premium and Pro plans allow multiple children in the same story. This is perfect for siblings, friends, or classroom stories where children can go on adventures together."
  },
  {
    question: "What educational themes are available?",
    answer: "Our stories focus on important life lessons like friendship, sharing, overcoming fears, problem-solving, family values, and learning new skills. All content is designed to be both entertaining and educational."
  },
  {
    question: "Can I edit the generated stories?",
    answer: "Yes! You can edit story descriptions, scene details, and even regenerate specific scenes. You have full control over the content to ensure it matches your family's values and your child's interests."
  },
  {
    question: "How do I share stories with family members?",
    answer: "You can safely share stories with grandparents and family members through secure links. Recipients can view and download the stories without needing to create an account."
  },
  {
    question: "What formats can I export stories in?",
    answer: "Stories can be exported as high-quality PDF storybooks perfect for printing, or as animated videos with narration and background music. Premium plans include both formats."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about creating safe, magical stories for your children.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button
                className="w-full py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-purple-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="pb-6 pr-12">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
