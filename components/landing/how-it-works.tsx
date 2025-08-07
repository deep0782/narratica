import { Card, CardContent } from '@/components/ui/card'
import { Upload, Wand2, BookOpen, Download } from 'lucide-react'
import Image from 'next/image'

const steps = [
  {
    step: 1,
    icon: Upload,
    title: 'Upload Your Child\'s Photo',
    description: 'Simply upload a clear photo of your child. Our AI will safely process it and create a cartoon version.',
    image: '/parent-uploading-child-photo.png'
  },
  {
    step: 2,
    icon: Wand2,
    title: 'Describe Your Story',
    description: 'Tell us what kind of adventure you want. Choose themes like friendship, courage, or learning new skills.',
    image: '/parent-typing-story-ideas.png'
  },
  {
    step: 3,
    icon: BookOpen,
    title: 'AI Creates Your Story',
    description: 'Our AI generates a personalized story with your child as the main character, complete with beautiful illustrations.',
    image: '/colorful-storybook-page.png'
  },
  {
    step: 4,
    icon: Download,
    title: 'Share & Enjoy',
    description: 'Download as a PDF storybook or animated video. Share with family and read together at bedtime!',
    image: '/personalized-storybook-reading.png'
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating personalized stories for your child is as easy as 1-2-3-4! No technical skills required.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {steps.map((step, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}>
              <div className="flex-1">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                        {step.step}
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    width={300}
                    height={200}
                    className="rounded-2xl shadow-lg w-full"
                  />
                  <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2 shadow-lg">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
