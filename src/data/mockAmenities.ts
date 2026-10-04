import { NearbyAmenity, Property } from '../types';

export const RIYADH_DISTRICT_AMENITIES: Record<string, NearbyAmenity[]> = {
  'Hittin': [
    {
      id: 'sch-hittin-1',
      name: 'Kingdom Schools',
      nameAr: 'Kingdom International Schools',
      type: 'school',
      distanceKm: 1.4,
      driveTimeMins: 4,
      rating: 4.9,
      reviewsCount: 382,
      address: 'King Fahd Rd Branch, Hittin',
      curriculumOrSpecialty: 'IB World School & American Diploma',
      coordinates: { lat: 24.7690, lng: 46.6050 }
    },
    {
      id: 'sch-hittin-2',
      name: 'Riyadh Najd Schools',
      nameAr: 'Riyadh Najd Model Schools',
      type: 'school',
      distanceKm: 2.1,
      driveTimeMins: 6,
      rating: 4.8,
      reviewsCount: 290,
      address: 'Prince Turki Ibn Abdulaziz Al Awwal Rd',
      curriculumOrSpecialty: 'National & British Cambridge Curriculum',
      coordinates: { lat: 24.7720, lng: 46.5920 }
    },
    {
      id: 'hosp-hittin-1',
      name: 'Dr. Sulaiman Al Habib Hospital',
      nameAr: 'Dr. Sulaiman Al Habib Specialized Medical Center',
      type: 'hospital',
      distanceKm: 2.8,
      driveTimeMins: 7,
      rating: 4.9,
      reviewsCount: 1420,
      address: 'King Fahd Branch Rd, Hittin Hub',
      curriculumOrSpecialty: 'JCI Accredited · 24/7 Tertiary Emergency & Surgical Care',
      coordinates: { lat: 24.7640, lng: 46.6120 }
    },
    {
      id: 'hosp-hittin-2',
      name: 'Dallah Hospital North',
      nameAr: 'Dallah Hospital North Riyadh',
      type: 'hospital',
      distanceKm: 3.5,
      driveTimeMins: 9,
      rating: 4.7,
      reviewsCount: 960,
      address: 'Al Nakheel North Corridor',
      curriculumOrSpecialty: 'Multispecialty Healthcare & Pediatric Center',
      coordinates: { lat: 24.7550, lng: 46.6200 }
    },
    {
      id: 'park-hittin-1',
      name: 'Boulevard World & City Oasis',
      nameAr: 'Boulevard City Parks & Promenade',
      type: 'park',
      distanceKm: 1.1,
      driveTimeMins: 3,
      rating: 4.9,
      reviewsCount: 4200,
      address: 'Hittin Boulevard District',
      curriculumOrSpecialty: 'Lush Landscaped Promenade, Fountains & Cycling Tracks',
      coordinates: { lat: 24.7710, lng: 46.6020 }
    },
    {
      id: 'park-hittin-2',
      name: 'Wadi Hanifa Northern Gateway',
      nameAr: 'Wadi Hanifa Northern Gateway Eco-Park',
      type: 'park',
      distanceKm: 2.3,
      driveTimeMins: 5,
      rating: 4.8,
      reviewsCount: 1850,
      address: 'Western Hittin Valley Trail',
      curriculumOrSpecialty: 'Natural Eco-Park, Date Palm Groves & Picnic Lawns',
      coordinates: { lat: 24.7620, lng: 46.5810 }
    }
  ],
  'Al Malqa': [
    {
      id: 'sch-malqa-1',
      name: 'Al-Rowad International School',
      nameAr: 'Al-Rowad International School - Al Malqa Branch',
      type: 'school',
      distanceKm: 1.2,
      driveTimeMins: 3,
      rating: 4.8,
      reviewsCount: 310,
      address: 'Anas Ibn Malik Rd, Al Malqa',
      curriculumOrSpecialty: 'British Curriculum (IGCSE & A-Levels)',
      coordinates: { lat: 24.7890, lng: 46.6120 }
    },
    {
      id: 'sch-malqa-2',
      name: 'Dar Al Uloom Schools',
      nameAr: 'Dar Al Uloom Educational Academy',
      type: 'school',
      distanceKm: 2.4,
      driveTimeMins: 6,
      rating: 4.7,
      reviewsCount: 240,
      address: 'Al Malqa Western Boulevard',
      curriculumOrSpecialty: 'STEM Focused Bilingual Education',
      coordinates: { lat: 24.7950, lng: 46.6080 }
    },
    {
      id: 'hosp-malqa-1',
      name: 'Kingdom Hospital & Consulting Clinics',
      nameAr: 'Kingdom Hospital & Specialized Clinics',
      type: 'hospital',
      distanceKm: 3.1,
      driveTimeMins: 8,
      rating: 4.8,
      reviewsCount: 1120,
      address: 'King Abdulaziz Rd, Al Malqa Link',
      curriculumOrSpecialty: 'Comprehensive Cardiac, Orthopedic & Maternity Center',
      coordinates: { lat: 24.7810, lng: 46.6290 }
    },
    {
      id: 'hosp-malqa-2',
      name: 'Magrabi Hospitals & Centers',
      nameAr: 'Magrabi Specialized Center Al Malqa',
      type: 'hospital',
      distanceKm: 1.8,
      driveTimeMins: 5,
      rating: 4.9,
      reviewsCount: 780,
      address: 'Anas Ibn Malik Rd, Al Malqa',
      curriculumOrSpecialty: 'Advanced Eye, ENT & Dental Surgery',
      coordinates: { lat: 24.7860, lng: 46.6210 }
    },
    {
      id: 'park-malqa-1',
      name: 'Al Malqa Central Community Park',
      nameAr: 'Al Malqa Central Park & Jogging Track',
      type: 'park',
      distanceKm: 0.6,
      driveTimeMins: 2,
      rating: 4.7,
      reviewsCount: 1450,
      address: 'Street 40, Al Malqa Central',
      curriculumOrSpecialty: 'Rubberized Jogging Track, Children Playgrounds & Lawns',
      coordinates: { lat: 24.7850, lng: 46.6150 }
    },
    {
      id: 'park-malqa-2',
      name: 'Prince Abdulaziz Bin Ayyaf Park',
      nameAr: 'Prince Abdulaziz Bin Ayyaf Grand Park',
      type: 'park',
      distanceKm: 2.5,
      driveTimeMins: 6,
      rating: 4.9,
      reviewsCount: 3100,
      address: 'Al Malqa North Avenue',
      curriculumOrSpecialty: 'Sprawling 120,000 m² Botanical Park & Open Green amphitheater',
      coordinates: { lat: 24.7980, lng: 46.6250 }
    }
  ],
  'KAFD': [
    {
      id: 'sch-kafd-1',
      name: 'The British International School Riyadh (BISR KAFD)',
      nameAr: 'British International School Riyadh',
      type: 'school',
      distanceKm: 1.8,
      driveTimeMins: 5,
      rating: 4.9,
      reviewsCount: 520,
      address: 'Al Izdihar / KAFD Academic Corridor',
      curriculumOrSpecialty: 'National Curriculum for England & IB Diploma',
      coordinates: { lat: 24.7730, lng: 46.6410 }
    },
    {
      id: 'sch-kafd-2',
      name: 'Alfaisal Academy & KAFD Tech School',
      nameAr: 'Alfaisal International Academy',
      type: 'school',
      distanceKm: 2.2,
      driveTimeMins: 6,
      rating: 4.8,
      reviewsCount: 340,
      address: 'King Fahd Road opposite KAFD',
      curriculumOrSpecialty: 'American High School Diploma & AP Courses',
      coordinates: { lat: 24.7680, lng: 46.6430 }
    },
    {
      id: 'hosp-kafd-1',
      name: 'King Faisal Specialist Hospital & Research Centre',
      nameAr: 'King Faisal Specialist Hospital & Research Centre',
      type: 'hospital',
      distanceKm: 6.2,
      driveTimeMins: 12,
      rating: 4.9,
      reviewsCount: 2900,
      address: 'Zahrat Al Badiah / Specialized Hub',
      curriculumOrSpecialty: 'World-Renowned Organ Transplant & Oncology Institute',
      coordinates: { lat: 24.7500, lng: 46.6350 }
    },
    {
      id: 'hosp-kafd-2',
      name: 'Dr. Sulaiman Al Habib KAFD Tower Clinic',
      nameAr: 'Dr. Sulaiman Al Habib KAFD Tower Medical Clinic',
      type: 'hospital',
      distanceKm: 0.3,
      driveTimeMins: 1,
      rating: 4.9,
      reviewsCount: 650,
      address: 'KAFD Financial Plaza Level 2',
      curriculumOrSpecialty: 'Executive Health Screening, Urgent Care & Day Surgery',
      coordinates: { lat: 24.7675, lng: 46.6385 }
    },
    {
      id: 'park-kafd-1',
      name: 'KAFD Wadi Green Spine',
      nameAr: 'KAFD Wadi Linear Park & Shaded Walkways',
      type: 'park',
      distanceKm: 0.2,
      driveTimeMins: 1,
      rating: 4.9,
      reviewsCount: 3800,
      address: 'Central KAFD Pedestrian Spine',
      curriculumOrSpecialty: 'Climate-controlled Sunken Wadi, Water Canals & Art Sculptures',
      coordinates: { lat: 24.7680, lng: 46.6390 }
    },
    {
      id: 'park-kafd-2',
      name: 'King Salman Park Northern Promenade',
      nameAr: 'King Salman Park Northern Promenade',
      type: 'park',
      distanceKm: 4.1,
      driveTimeMins: 8,
      rating: 5.0,
      reviewsCount: 6200,
      address: 'King Salman Park Central Axis',
      curriculumOrSpecialty: '16.7 km² Mega Park with Royal Arts Complex & Equestrian Trails',
      coordinates: { lat: 24.7450, lng: 46.6500 }
    }
  ]
};

export function getNearbyAmenitiesForProperty(property: Property): NearbyAmenity[] {
  if (property.nearbyAmenities && property.nearbyAmenities.length > 0) {
    return property.nearbyAmenities;
  }

  // Match by district keyword
  const districtName = property.district.toLowerCase();
  let key = 'Hittin';
  if (districtName.includes('malqa')) {
    key = 'Al Malqa';
  } else if (districtName.includes('kafd')) {
    key = 'KAFD';
  } else if (districtName.includes('hittin')) {
    key = 'Hittin';
  }

  return RIYADH_DISTRICT_AMENITIES[key] || RIYADH_DISTRICT_AMENITIES['Hittin'];
}
