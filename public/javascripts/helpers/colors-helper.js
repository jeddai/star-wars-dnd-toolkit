var climateColors = {
  Arid: '#fd8',
  Asteroid: '#777',
  City: '#ee5',
  Dry: '#dc8',
  Forest: '#060',
  Frozen: '#ddd',
  Gas: '#fb4',
  Hot: '#d00',
  Moist: '#69a',
  Murky: '#990',
  Polluted: '#aaa',
  Station: '#333',
  Temperate: '#4b4',
  Tropical: '#0aa',
  Volcanic: '#900',
  Water: '#00f'
};

var alignmentColors = {
  'Black Sun': '#333',
  'Chiss Ascendancy': '#808',
  Contested: '#000',
  // 'Eternal Empire': '#dd0',
  Jedi: '#0b0',
  'Mando\'ade': '#00d',
  Republic: '#f70',
  Sith: '#d00',
  None: '#bbb'
};

var regionColors = {
  'Colonies': '#666',
  'Core Worlds': '#ccc',
  'Deep Core': '#eee',
  'Expansion Region': '#444',
  'Inner Rim': '#aaa',
  'Mid Rim': '#888',
  'Outer Rim Territories': '#222',
  'Unknown Regions': '#000'
};

var climates = [];
var alignments = [];
var regions = [];

for(var c in climateColors) {
  climates.push(c);
}

for(var a in alignmentColors) {
  alignments.push(a);
}

for(var r in regionColors) {
  regions.push(r);
}