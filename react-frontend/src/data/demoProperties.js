export const demoProperties = [
  {
    id: 'demo-noida-62',
    name: 'Prime Residence — Sector 62',
    city: 'Noida, Uttar Pradesh, India',
    latitude: 28.627,
    longitude: 77.362,
    label: 'DEMONSTRATION PROPERTY',
    model: { url: null, type: 'procedural-building', heightOffset: 0, scale: 1 },
    scenario: 'High connectivity. Nearby metro, bus, hospital, school, market, and major roads.'
  },
  {
    id: 'demo-noida-137',
    name: 'Family Enclave — Sector 137',
    city: 'Noida, Uttar Pradesh, India',
    latitude: 28.508,
    longitude: 77.408,
    label: 'DEMONSTRATION PROPERTY',
    model: { url: null, type: 'procedural-building', heightOffset: 0, scale: 1 },
    scenario: 'Family-oriented neighborhood. Nearby schools, hospitals, parks, grocery, and metro.'
  },
  {
    id: 'demo-gurugram-core',
    name: 'Cyber Hub Heights',
    city: 'Gurugram, Haryana, India',
    latitude: 28.482,
    longitude: 77.087,
    label: 'DEMONSTRATION PROPERTY',
    model: { url: null, type: 'procedural-building', heightOffset: 0, scale: 1 },
    scenario: 'High commercial/connectivity environment. Nearby offices, metro, restaurants, and healthcare.'
  },
];

export function findDemoProperty(latitude, longitude) {
  // Using a slightly more forgiving tolerance for demo property detection
  return demoProperties.find((property) => 
    Math.abs(property.latitude - latitude) < 0.01 && 
    Math.abs(property.longitude - longitude) < 0.01
  );
}
