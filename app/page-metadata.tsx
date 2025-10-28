// Structured Data (JSON-LD) for the homepage
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Value Architecture',
    url: 'https://valuearch.com',
    logo: 'https://valuearch.com/opengraph-image.png',
    description: 'Professional architecture and engineering services in Sulaymaniyah, Kurdistan Region of Iraq. KEU Registered #308.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sulaymaniyah',
      addressRegion: 'Kurdistan Region',
      addressCountry: 'IQ'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+964-770-190-6763',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic', 'Kurdish']
    },
    sameAs: [
      // Add your social media URLs here when available
      // 'https://www.facebook.com/valuearch',
      // 'https://www.instagram.com/valuearch',
    ]
  }
}

export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Value Architecture',
    url: 'https://valuearch.com',
    description: 'Professional architecture and engineering services',
    inLanguage: ['en', 'ar', 'ku'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://valuearch.com/projects?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

export function getProfessionalServiceStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Value Architecture',
    image: 'https://valuearch.com/opengraph-image.png',
    '@id': 'https://valuearch.com',
    url: 'https://valuearch.com',
    telephone: '+964-770-190-6763',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sulaymaniyah',
      addressLocality: 'Sulaymaniyah',
      addressRegion: 'Kurdistan Region',
      addressCountry: 'IQ'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.5558,
      longitude: 45.4347
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '08:00',
      closes: '17:00'
    },
    priceRange: '$$',
    servesCuisine: null,
    acceptsReservations: true
  }
}

