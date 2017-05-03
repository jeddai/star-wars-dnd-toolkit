var climates = [];
var alignments = [];

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

for(var c in climateColors) {
  climates.push(c);
}

var alignmentColors = {
  Contested: '#dd0',
  Hutt: '#fd8',
  Mandalorian: '#00d',
  Republic: '#d00',
  Sith: '#333',
  None: '#bbb'
};

for(var a in alignmentColors) {
  alignments.push(a);
}