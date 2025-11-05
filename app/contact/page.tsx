import { Metadata } from 'next';
import ShowcaseLayout from '@/app/ui/showcase-layout';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Value Architecture. Located in Sulaymaniyah, Kurdistan Region of Iraq. Call us at +964 770 190 6763 or visit our office.',
  openGraph: {
    title: 'Contact Value Architecture',
    description: 'Get in touch with our architecture and engineering team in Sulaymaniyah.',
    url: 'https://valuearch.com/contact',
  },
};

export default function ContactPage() {
  return (
    <ShowcaseLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Contact Us
          </h1>
          <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Phone</h2>
              <a 
                href="tel:+9647701906763" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                +964 770 190 6763
              </a>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">WhatsApp</h2>
              <a 
                href="https://wa.me/9647701906763" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              >
                Message us on WhatsApp
              </a>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Location</h2>
              <p>Sulaymaniyah - Mix Tower - Behind Sulaymaniyah Governorate Building</p>
              <p>(S Tower - 12th Floor - Apartment 9)</p>
              <p>Kurdistan Region of Iraq</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                KEU Registered #308
              </p>
            </div>
          </div>
        </div>
      </div>
    </ShowcaseLayout>
  );
}
