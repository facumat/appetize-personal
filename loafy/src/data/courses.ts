export type Ingredient = { name: string; grams: number; percent: number };

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  free: boolean;
  summary: string;
  ingredients?: Ingredient[];
  steps: string[];
  tip: string;
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalTime: string;
  pro: boolean;
  description: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    id: 'principles',
    title: 'Principles of Bread',
    subtitle: 'Flour, water, salt, yeast — and why they work',
    emoji: '🌾',
    color: '#F6D8A8',
    level: 'Beginner',
    totalTime: '1h 20m',
    pro: false,
    description:
      'Every great loaf rests on the same few ideas. Learn how gluten forms, how fermentation builds flavor, and how to read your dough so every recipe after this one makes sense.',
    lessons: [
      {
        id: 'four-ingredients',
        title: 'The four ingredients',
        minutes: 8,
        free: true,
        summary: 'Flour gives structure, water activates it, salt tightens it and yeast brings it to life.',
        steps: [
          'Flour: proteins (glutenin and gliadin) form gluten when hydrated. Bread flour has 12–14% protein.',
          'Water: hydrates the flour and controls dough temperature. More water means a more open crumb.',
          'Salt: strengthens gluten, slows fermentation and seasons the bread. Use about 2% of the flour weight.',
          'Yeast: eats sugars and releases CO₂ and alcohol, which inflate and flavor the dough.',
        ],
        tip: 'Weigh everything. A cup of flour can vary by 30 g depending on how you scoop it!',
      },
      {
        id: 'bakers-percentages',
        title: "Baker's percentages",
        minutes: 10,
        free: true,
        summary: 'Express every ingredient as a percentage of the total flour to scale any recipe.',
        ingredients: [
          { name: 'Bread flour', grams: 500, percent: 100 },
          { name: 'Water', grams: 350, percent: 70 },
          { name: 'Salt', grams: 10, percent: 2 },
          { name: 'Instant yeast', grams: 5, percent: 1 },
        ],
        steps: [
          'Flour is always 100%. Every other ingredient is divided by the flour weight.',
          'Hydration is the water percentage: 60–65% is a firm sandwich dough, 75%+ is a rustic open loaf.',
          'To scale, choose a new flour weight and multiply each percentage by it.',
        ],
        tip: 'Want two loaves? Double the flour and let the percentages do the maths.',
      },
      {
        id: 'gluten-kneading',
        title: 'Gluten & kneading',
        minutes: 14,
        free: false,
        summary: 'Develop a strong, stretchy network that traps gas.',
        steps: [
          'Mix until no dry flour remains, then rest 20 minutes (autolyse) so the flour fully hydrates.',
          'Knead with push-fold-turn motions for 8–10 minutes, or use stretch-and-folds every 30 minutes.',
          'Do the windowpane test: stretch a small piece thin enough to see light through without tearing.',
        ],
        tip: 'Sticky dough is not a problem to fix with flour — wet your hands instead.',
      },
      {
        id: 'fermentation',
        title: 'Fermentation & proofing',
        minutes: 16,
        free: false,
        summary: 'Time and temperature build flavor and volume.',
        steps: [
          'Bulk ferment at 24–26 °C until the dough grows 50–75% and feels airy.',
          'Cold retarding in the fridge (8–16 h) slows yeast and deepens flavor.',
          'The poke test: a floured finger dent should spring back slowly and leave a small mark.',
        ],
        tip: 'Watch the dough, not the clock. A warm kitchen can halve fermentation time.',
      },
      {
        id: 'shaping-scoring',
        title: 'Shaping & scoring',
        minutes: 15,
        free: false,
        summary: 'Build surface tension, then guide where the loaf opens.',
        steps: [
          'Pre-shape into a loose round and rest 20 minutes so the gluten relaxes.',
          'Final shape by folding edges to the centre and rolling to tighten the skin.',
          'Score at a shallow 30° angle, about 1 cm deep, in one confident stroke.',
        ],
        tip: 'A tight skin is what gives you that proud "ear" on a batard.',
      },
      {
        id: 'baking-steam',
        title: 'Baking & steam',
        minutes: 17,
        free: false,
        summary: 'Oven spring, crust color and knowing when it is done.',
        steps: [
          'Preheat the oven and a Dutch oven to 250 °C for 45 minutes.',
          'Bake covered 20 minutes to trap steam, then uncovered at 230 °C for 20–25 minutes.',
          'Lean breads are done at 96 °C internal and sound hollow when tapped underneath.',
        ],
        tip: 'Let it cool at least an hour. The crumb is still setting as steam escapes!',
      },
    ],
  },
  {
    id: 'brioche',
    title: 'Parisian Brioche',
    subtitle: 'Buttery, golden and cloud-soft',
    emoji: '🧈',
    color: '#FBE0A0',
    level: 'Intermediate',
    totalTime: '2h 10m',
    pro: true,
    description:
      'Brioche is an enriched dough — packed with eggs, butter and sugar. Master the slow butter incorporation, the overnight cold rest and the classic Nanterre shape.',
    lessons: [
      {
        id: 'what-is-brioche',
        title: 'What makes brioche brioche',
        minutes: 9,
        free: true,
        summary: 'Fat and eggs change everything: softer crumb, richer flavor, slower rise.',
        steps: [
          'Butter coats gluten strands, which tenderizes the crumb but slows gluten development.',
          'Eggs add structure, color and emulsifiers that keep the bread soft for days.',
          'Sugar feeds the yeast but also competes for water, so enriched doughs rise more slowly.',
        ],
        tip: 'Everything should be cold. Warm butter turns brioche greasy instead of silky.',
      },
      {
        id: 'brioche-formula',
        title: 'Formula & mise en place',
        minutes: 12,
        free: false,
        summary: 'A 50% butter brioche — rich but approachable.',
        ingredients: [
          { name: 'Bread flour', grams: 500, percent: 100 },
          { name: 'Eggs (cold)', grams: 300, percent: 60 },
          { name: 'Whole milk', grams: 60, percent: 12 },
          { name: 'Sugar', grams: 60, percent: 12 },
          { name: 'Salt', grams: 10, percent: 2 },
          { name: 'Instant yeast', grams: 7, percent: 1.4 },
          { name: 'Butter (cold, cubed)', grams: 250, percent: 50 },
        ],
        steps: [
          'Chill eggs and milk. Cube butter and keep it in the fridge until the moment you need it.',
          'Mix everything except butter until smooth and elastic, about 10 minutes on medium speed.',
        ],
        tip: 'Hold back 20 g of egg and add it only if the dough feels too stiff.',
      },
      {
        id: 'adding-butter',
        title: 'Adding the butter',
        minutes: 18,
        free: false,
        summary: 'Slow and steady keeps the emulsion together.',
        steps: [
          'Add butter a few cubes at a time, waiting until each addition disappears.',
          'Keep the dough under 26 °C. If it warms up, chill the bowl for 10 minutes.',
          'Finish when the dough pulls cleanly from the bowl and passes the windowpane test.',
        ],
        tip: 'Glossy and pulling away from the bowl means you nailed it.',
      },
      {
        id: 'cold-retard',
        title: 'The overnight rest',
        minutes: 8,
        free: false,
        summary: 'Cold dough is flavorful and easy to shape.',
        steps: [
          'Let the dough rise 1 hour at room temperature.',
          'Degas, wrap tightly and refrigerate 8–16 hours.',
        ],
        tip: 'Cold brioche shapes like play-dough. Warm brioche shapes like glue.',
      },
      {
        id: 'nanterre',
        title: 'Shaping a Nanterre loaf',
        minutes: 15,
        free: false,
        summary: 'Six tight balls in a loaf pan for the iconic bumpy top.',
        steps: [
          'Divide into six equal pieces (about 190 g each for two pans).',
          'Round each piece into a tight ball against the counter.',
          'Place three balls per buttered 23 × 13 cm loaf pan, in a zig-zag.',
        ],
        tip: 'Use a scale when dividing — even pieces mean even baking.',
      },
      {
        id: 'proof-bake-brioche',
        title: 'Proof, glaze & bake',
        minutes: 14,
        free: false,
        summary: 'A patient proof and a double egg wash.',
        steps: [
          'Proof at 26 °C for 2–3 hours until doubled and wobbly.',
          'Brush with egg yolk + a splash of cream, wait 10 minutes and brush again.',
          'Bake at 180 °C for 30–35 minutes, to 88–90 °C internal.',
        ],
        tip: 'Tent with foil if it browns too quickly — sugar and eggs color fast.',
      },
    ],
  },
  {
    id: 'panettone',
    title: 'Milanese Panettone',
    subtitle: 'The king of holiday breads',
    emoji: '🎄',
    color: '#F8C9A0',
    level: 'Advanced',
    totalTime: '3h 05m',
    pro: true,
    description:
      'A three-day project powered by lievito madre. Learn to strengthen your starter, build the two doughs, shape with pirlatura and hang your panettone upside down like the Milanese masters.',
    lessons: [
      {
        id: 'panettone-intro',
        title: 'Anatomy of a panettone',
        minutes: 10,
        free: true,
        summary: 'Why panettone is the ultimate test of a baker.',
        steps: [
          'It is naturally leavened with lievito madre, a stiff, sweet starter.',
          'It carries huge amounts of butter, yolks and sugar — and still rises tall and airy.',
          'The process spans three days: starter refreshments, first dough, second dough.',
        ],
        tip: 'Plan your schedule on paper first. Panettone rewards bakers who plan.',
      },
      {
        id: 'lievito-madre',
        title: 'Taming the lievito madre',
        minutes: 20,
        free: false,
        summary: 'A strong, mild starter is the secret.',
        steps: [
          'Refresh at 1 : 1 : 0.45 (starter : flour : water) — a stiff 45% hydration dough.',
          'Keep at 28 °C and refresh every 4 hours; it should triple in that time.',
          'Do three consecutive refreshments before mixing the first dough.',
        ],
        tip: 'Too sour? Give it a bath: slice and soak in sugared water for 15 minutes.',
      },
      {
        id: 'primo-impasto',
        title: 'First dough (primo impasto)',
        minutes: 22,
        free: false,
        summary: 'Build a strong base that ferments overnight.',
        ingredients: [
          { name: 'Panettone flour', grams: 400, percent: 100 },
          { name: 'Lievito madre', grams: 100, percent: 25 },
          { name: 'Water', grams: 150, percent: 37.5 },
          { name: 'Sugar', grams: 110, percent: 27.5 },
          { name: 'Egg yolks', grams: 90, percent: 22.5 },
          { name: 'Butter (soft)', grams: 120, percent: 30 },
        ],
        steps: [
          'Mix flour, starter and most of the water until strong and smooth.',
          'Add sugar in stages, then yolks, then butter, always waiting for full absorption.',
          'Ferment 12 hours at 26–28 °C until tripled.',
        ],
        tip: 'Mark the container. "Tripled" is hard to judge by eye at 3 a.m.',
      },
      {
        id: 'secondo-impasto',
        title: 'Second dough (secondo impasto)',
        minutes: 25,
        free: false,
        summary: 'Enrich, flavor and add the fruit.',
        steps: [
          'Add flour to the first dough and mix until strong again.',
          'Add sugar, honey and salt, then yolks in three additions.',
          'Emulsify butter with vanilla and orange zest, and add slowly.',
          'Fold in candied orange and soaked raisins at the very end.',
        ],
        tip: 'Dough should be at 26 °C when finished. Chill the bowl if needed.',
      },
      {
        id: 'pirlatura',
        title: 'Shaping (pirlatura) & proof',
        minutes: 18,
        free: false,
        summary: 'Create tension with a rolling, tucking motion.',
        steps: [
          'Divide, rest 30 minutes on a buttered counter, then shape with pirlatura.',
          'Place into paper molds and proof 6–8 hours at 28 °C.',
          'It is ready when the dome is 2 cm below the rim.',
        ],
        tip: 'Leave the proofing dough uncovered for the last 30 minutes to form a skin before scoring.',
      },
      {
        id: 'bake-hang',
        title: 'Bake & hang upside down',
        minutes: 20,
        free: false,
        summary: 'The moment of truth.',
        steps: [
          'Score a cross and place a knob of butter in the center.',
          'Bake at 170 °C for 45–55 minutes to 94 °C internal.',
          'Immediately skewer the base and hang upside down for 8–12 hours.',
        ],
        tip: 'Hanging stops the delicate crumb from collapsing under its own weight.',
      },
    ],
  },
];

export const getCourse = (id: string) => courses.find((c) => c.id === id);

export const getLesson = (courseId: string, lessonId: string) =>
  getCourse(courseId)?.lessons.find((l) => l.id === lessonId);
