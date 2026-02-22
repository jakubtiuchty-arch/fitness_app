import type { Workout, CardioOption } from '../types';

export const workoutSilaA: Workout = {
  id: 'sila-a',
  type: 'SILA_A',
  name: 'SIŁA A',
  description: 'Push & Legs Dominant',
  restBetweenSets: '90-120 sek',
  tempo: 'Ciężkie wielostawy, praca nad siłą pchającą',
  exercises: [
    {
      id: 'sa1',
      name: 'Nogi: Przysiad',
      description: 'Przysiad z hantlami na barkach / Goblet Squat',
      sets: 4,
      reps: '6-8',
      restTime: '90-120 sek',
      tempo: '3-1-0-0',
      notes: 'Tempo 3 sek. opuszczanie'
    },
    {
      id: 'sa2',
      name: 'Klatka: Wyciskanie hantli',
      description: 'Wyciskanie hantli płasko (możesz dodać lekki skos dodatni)',
      sets: 4,
      reps: '8-10',
      restTime: '90-120 sek'
    },
    {
      id: 'sa3',
      name: 'Plecy: Wiosłowanie',
      description: 'Wiosłowanie dwoma hantlami w opadzie tułowia (chwyt neutralny)',
      sets: 3,
      reps: '10-12',
      restTime: '90-120 sek',
      notes: 'Grubość pleców'
    },
    {
      id: 'sa4',
      name: 'Barki: Wznosy bokiem',
      description: 'Wznosy hantli bokiem stojąc',
      sets: 3,
      reps: '12-15',
      restTime: '60-90 sek'
    },
    {
      id: 'sa5',
      name: 'Triceps: Wyciskanie francuskie',
      description: 'Wyciskanie francuskie hantla oburącz (siedząc lub stojąc)',
      sets: 3,
      reps: '10-12',
      restTime: '60-90 sek'
    },
    {
      id: 'sa6',
      name: 'Core: Spacer Farmera',
      description: 'Spacer Farmera z jednym hantlem (stabilizacja antyrotacyjna)',
      sets: 3,
      reps: '40s na stronę',
      restTime: '60 sek',
      notes: 'Trzymaj hantel w jednej ręce, utrzymuj prosty tułów'
    }
  ]
};

export const workoutSilaB: Workout = {
  id: 'sila-b',
  type: 'SILA_B',
  name: 'SIŁA B',
  description: 'Pull & Hinge Dominant',
  restBetweenSets: '90-120 sek',
  tempo: 'Łańcuch tylny, praca nad siłą ciągnącą i stabilizacją',
  exercises: [
    {
      id: 'sb1',
      name: 'Tył uda/Plecy: RDL',
      description: 'Martwy ciąg na prostych nogach (RDL) z hantlami/kettlami',
      sets: 4,
      reps: '8-10',
      restTime: '90-120 sek',
      notes: 'Powoli w dół!'
    },
    {
      id: 'sb2',
      name: 'Plecy: Podciąganie',
      description: 'Podciąganie na drążku (szeroki lub neutralny chwyt)',
      sets: 4,
      reps: 'MAX lub 6 z ciężarem',
      restTime: '90-120 sek',
      notes: 'Szerokość pleców'
    },
    {
      id: 'sb3',
      name: 'Barki: Wyciskanie żołnierskie',
      description: 'Wyciskanie żołnierskie hantli (stojąc – angażuje też brzuch)',
      sets: 3,
      reps: '8-10',
      restTime: '90-120 sek'
    },
    {
      id: 'sb4',
      name: 'Nogi: Wykroki chodzone',
      description: 'Walking Lunges z hantlami',
      sets: 3,
      reps: '12 kroków/nogę',
      restTime: '90 sek',
      notes: 'Uzupełnienie nóg'
    },
    {
      id: 'sb5',
      name: 'Pośladki/Dwugłowe: Hip Thrust',
      description: 'Hip Thrust z hantlem na biodrach (plecy oparte o ławkę)',
      sets: 3,
      reps: '10-12',
      restTime: '60-90 sek',
      notes: 'Ściskaj pośladki na górze, 2 sek. pauza'
    },
    {
      id: 'sb6',
      name: 'Biceps: Uginanie z supinacją',
      description: 'Uginanie ramion z hantlami z supinacją (skrętem nadgarstka)',
      sets: 3,
      reps: '10-12',
      restTime: '60-90 sek'
    }
  ]
};

export const cardioOptions: CardioOption[] = [
  {
    id: 'hiit',
    name: 'CARDIO 1: Interwały (HIIT)',
    description: 'Budowa progu beztlenowego, dynamika. Bardzo obciążający trening.',
    phases: [
      {
        name: 'Rozgrzewka',
        duration: '10 min',
        description: 'Trucht + krążenia ramion'
      },
      {
        name: 'Praca właściwa',
        duration: '8-10 serii',
        description: '45 sek. SZYBKO (90% HRmax) / 45 sek. TRUCHT'
      },
      {
        name: 'Schłodzenie',
        duration: '5-10 min',
        description: 'Marsz/trucht'
      }
    ]
  }
];

export const workouts: Record<string, Workout> = {
  SILA_A: workoutSilaA,
  SILA_B: workoutSilaB
};

// Helper do pobrania opisu cardio
export const getCardioOption = (): CardioOption => {
  return cardioOptions[0];
};
