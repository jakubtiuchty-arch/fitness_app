import type { Workout, AerobyOption } from '../types';

export const workoutA: Workout = {
  id: 'workout-a',
  type: 'A',
  name: 'TRENING A',
  description: 'SIŁA I BAZA',
  restBetweenSets: '90-120 sek',
  tempo: 'Wolne opuszczanie ciężaru (3 sekundy)',
  exercises: [
    {
      id: 'a1',
      name: 'Nogi: Przysiad',
      description: 'Przysiad z hantlami na barkach lub z kettlem (Goblet Squat)',
      sets: 4,
      reps: '6-8',
      restTime: '90-120 sek',
      notes: 'Tempo: 3 sek. opuszczanie'
    },
    {
      id: 'a2',
      name: 'Plecy: Podciąganie',
      description: 'Podciąganie na drążku (z obciążeniem, jeśli możliwe)',
      sets: 4,
      reps: 'MAX lub 6-8',
      restTime: '90-120 sek',
      notes: 'Dodaj obciążenie gdy robisz więcej niż 8'
    },
    {
      id: 'a3',
      name: 'Klatka: Wyciskanie hantli',
      description: 'Wyciskanie hantli płasko na ławce',
      sets: 4,
      reps: '8-10',
      restTime: '90-120 sek'
    },
    {
      id: 'a4',
      name: 'Tył uda/Plecy: Martwy ciąg',
      description: 'Martwy ciąg klasyczny z hantlami lub kettlami',
      sets: 3,
      reps: '10-12',
      restTime: '90-120 sek'
    },
    {
      id: 'a5',
      name: 'Barki: Wyciskanie żołnierskie',
      description: 'Wyciskanie żołnierskie hantli (stojąc)',
      sets: 3,
      reps: '8-10',
      restTime: '90-120 sek'
    },
    {
      id: 'a6',
      name: 'Brzuch: Unoszenie nóg',
      description: 'Unoszenie nóg w zwisie na drążku',
      sets: 3,
      reps: '10-12',
      restTime: '90-120 sek'
    }
  ]
};

export const workoutB: Workout = {
  id: 'workout-b',
  type: 'B',
  name: 'TRENING B',
  description: 'HIPERTROFIA I DETAL',
  restBetweenSets: '60-90 sek',
  tempo: 'Skupienie na precyzji ruchu i "pompie" mięśniowej',
  exercises: [
    {
      id: 'b1',
      name: 'Nogi (Jednonóż): Zakroki/Bułgarski',
      description: 'Zakroki z hantlami lub Bułgarski przysiad',
      sets: 3,
      reps: '10 na nogę',
      restTime: '60-90 sek',
      notes: 'Wykonaj wszystkie powtórzenia na jedną nogę, potem zmień'
    },
    {
      id: 'b2',
      name: 'Plecy: Wiosłowanie hantlem',
      description: 'Wiosłowanie hantlem w oparciu o ławkę',
      sets: 3,
      reps: '10-12 na rękę',
      restTime: '60-90 sek'
    },
    {
      id: 'b3',
      name: 'Klatka: Wyciskanie na piłce/Pompki',
      description: 'Wyciskanie hantli leżąc na piłce (dla stabilizacji) lub pompki na poręczach/uchwytach',
      sets: 3,
      reps: '12-15',
      restTime: '60-90 sek'
    },
    {
      id: 'b4',
      name: 'Barki (Bok): Wznosy bokiem',
      description: 'Wznosy hantli bokiem stojąc',
      sets: 3,
      reps: '15',
      restTime: '60-90 sek'
    },
    {
      id: 'b5',
      name: 'Dwugłowe: Uginanie nóg',
      description: 'Uginanie nóg leżąc przodem na ławce (z hantlem między stopami)',
      sets: 3,
      reps: '10-12',
      restTime: '60-90 sek'
    },
    {
      id: 'b6',
      name: 'Biceps/Triceps (Superseria)',
      description: 'Uginanie ramion z hantlami + Wyciskanie francuskie hantla (siedząc lub leżąc)',
      sets: 3,
      reps: '10+10',
      restTime: '60-90 sek',
      isSuperset: true,
      notes: 'Wykonaj oba ćwiczenia bez przerwy'
    }
  ]
};

export const aerobyOptions: AerobyOption[] = [
  {
    id: 'interval',
    name: 'Opcja 1: Interwał',
    description: 'Wysoka intensywność - dla maksymalnego spalania',
    phases: [
      {
        name: 'Rozgrzewka',
        duration: '5-10 min',
        description: 'Trucht'
      },
      {
        name: 'Praca właściwa',
        duration: '10-12 serii',
        description: '30 sek. szybkiego biegu (90% mocy) / 30 sek. marszu'
      },
      {
        name: 'Schłodzenie',
        duration: '5 min',
        description: 'Marsz'
      }
    ]
  },
  {
    id: 'steady',
    name: 'Opcja 2: Cardio stałe tętno',
    description: 'Umiarkowana intensywność - budowanie wytrzymałości',
    phases: [
      {
        name: 'Bieg ciągły',
        duration: '40-45 min',
        description: 'Umiarkowane tempo, tętno ok. 130-145 uderzeń/min'
      }
    ]
  }
];

export const workouts: Record<string, Workout> = {
  A: workoutA,
  B: workoutB
};
