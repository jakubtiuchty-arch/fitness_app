import type { Workout, CardioOption } from '../types';

export const workoutSilaA: Workout = {
  id: 'sila-a',
  type: 'SILA_A',
  name: 'SIŁA A',
  description: 'Squat & Press',
  restBetweenSets: '60-90 sek',
  tempo: 'Ciężkie wielostawy, nowe wzorce ruchowe',
  exercises: [
    {
      id: 'sa1',
      name: 'Nogi: Goblet Squat z pauzą',
      description: 'Goblet Squat z hantlem/kettlem – 2 sek. pauza w dole',
      sets: 4,
      reps: '8-10',
      restTime: '90 sek',
      notes: '2 sek. pauza na dole! Więcej czasu pod napięciem'
    },
    {
      id: 'sa2',
      name: 'Klatka: Wyciskanie hantli skos +30°',
      description: 'Wyciskanie hantli na ławce skośnej (+30°)',
      sets: 4,
      reps: '8-10',
      restTime: '90 sek',
      notes: 'Zmiana kąta → więcej górnej klatki'
    },
    {
      id: 'sa3',
      name: 'Plecy: Wiosłowanie jednorącz',
      description: 'Wiosłowanie jednorącz z oparciem o ławkę',
      sets: 3,
      reps: '10-12/str',
      restTime: '60 sek',
      notes: 'Łopatka ściągnięta, kontrola ekscentryku'
    },
    {
      id: 'sa4',
      name: 'Barki: Arnold Press',
      description: 'Arnold Press siedząc – wyciskanie z rotacją nadgarstków',
      sets: 3,
      reps: '10-12',
      restTime: '60 sek',
      notes: 'Start dłonie do siebie → rotacja → wyciskanie'
    },
    {
      id: 'sa5',
      name: 'Triceps: Dipy na ławce',
      description: 'Dipy na ławce – ręce za plecami, nogi wyprostowane',
      sets: 3,
      reps: '12-15',
      restTime: '60 sek',
      notes: 'Dodaj hantla na kolana dla większego obciążenia'
    },
    {
      id: 'sa6',
      name: 'Core: Dead Bug z hantlem',
      description: 'Dead Bug – leżąc na plecach, hantla w rękach, naprzemienne nogi',
      sets: 3,
      reps: '8/str',
      restTime: '45 sek',
      notes: 'Dolna część pleców cały czas przy podłodze!'
    }
  ]
};

export const workoutSilaB: Workout = {
  id: 'sila-b',
  type: 'SILA_B',
  name: 'SIŁA B',
  description: 'Hinge & Pull',
  restBetweenSets: '60-120 sek',
  tempo: 'Łańcuch tylny, unilateralna praca, stabilizacja',
  exercises: [
    {
      id: 'sb1',
      name: 'Nogi: Martwy ciąg sumo',
      description: 'Martwy ciąg sumo z hantlem/kettlem – szeroki rozstaw nóg',
      sets: 4,
      reps: '6-8',
      restTime: '120 sek',
      notes: 'Więcej quad/adductor niż klasyczny RDL'
    },
    {
      id: 'sb2',
      name: 'Plecy: Podciąganie tempo',
      description: 'Podciąganie chwyt neutralny – tempo 3-1-0-1',
      sets: 4,
      reps: 'MAX-2',
      restTime: '90 sek',
      notes: '3 sek. opuszczanie, 1 sek. pauza na górze'
    },
    {
      id: 'sb3',
      name: 'Barki: Wyciskanie jednorącz',
      description: 'Wyciskanie żołnierskie jednorącz stojąc',
      sets: 3,
      reps: '8-10/str',
      restTime: '90 sek',
      notes: 'Wymusza stabilizację core – nie odchylaj się!'
    },
    {
      id: 'sb4',
      name: 'Nogi: Step-up',
      description: 'Step-up na wysoką ławkę z hantlami',
      sets: 3,
      reps: '10/nogę',
      restTime: '60 sek',
      notes: 'Całą stopą na ławce, naciskaj przez piętę'
    },
    {
      id: 'sb5',
      name: 'Tył: Single-leg RDL',
      description: 'Martwy ciąg na jednej nodze z hantlem',
      sets: 3,
      reps: '10/str',
      restTime: '60 sek',
      notes: 'Równowaga + pośladek + dwugłowy – wolne tempo!'
    },
    {
      id: 'sb6',
      name: 'Biceps: Uginanie młotkowe',
      description: 'Hammer Curl – hantla chwyt neutralny (kciuki do góry)',
      sets: 3,
      reps: '10-12',
      restTime: '60 sek',
      notes: 'Brachialis + przedramię'
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
