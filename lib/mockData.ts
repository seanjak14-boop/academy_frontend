export type StudentTier = "new" | "intermediate" | "professional";

export type Student = {
  id: string;
  name: string;
  tier: StudentTier;
  joinedAt: string; // ISO date
  presentToday: boolean;
  feeStatus: "paid" | "pending";
  feeAmount: number;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string; // ISO
  priority: "normal" | "high";
};

export type Match = {
  id: string;
  home: string;
  away: string;
  date: string;
  venue: string;
  status: "upcoming" | "completed";
  homeScore?: number;
  awayScore?: number;
  competition: string;
};

export const students: Student[] = [
  {
    id: "1",
    name: "James Okonkwo",
    tier: "new",
    joinedAt: "2026-04-18T10:00:00.000Z",
    presentToday: true,
    feeStatus: "paid",
    feeAmount: 120,
  },
  {
    id: "2",
    name: "Marcus Silva",
    tier: "new",
    joinedAt: "2026-04-22T14:00:00.000Z",
    presentToday: true,
    feeStatus: "pending",
    feeAmount: 120,
  },
  {
    id: "3",
    name: "Noah Williams",
    tier: "new",
    joinedAt: "2026-04-28T09:30:00.000Z",
    presentToday: false,
    feeStatus: "paid",
    feeAmount: 120,
  },
  {
    id: "4",
    name: "Liam Chen",
    tier: "intermediate",
    joinedAt: "2025-11-10T11:00:00.000Z",
    presentToday: true,
    feeStatus: "paid",
    feeAmount: 150,
  },
  {
    id: "5",
    name: "Diego Fernández",
    tier: "intermediate",
    joinedAt: "2025-12-02T16:00:00.000Z",
    presentToday: true,
    feeStatus: "pending",
    feeAmount: 150,
  },
  {
    id: "6",
    name: "Amir Hassan",
    tier: "intermediate",
    joinedAt: "2026-01-15T10:00:00.000Z",
    presentToday: false,
    feeStatus: "paid",
    feeAmount: 150,
  },
  {
    id: "7",
    name: "Theo Berg",
    tier: "intermediate",
    joinedAt: "2026-02-20T13:00:00.000Z",
    presentToday: true,
    feeStatus: "paid",
    feeAmount: 150,
  },
  {
    id: "8",
    name: "Leo Petrov",
    tier: "professional",
    joinedAt: "2024-08-01T09:00:00.000Z",
    presentToday: true,
    feeStatus: "paid",
    feeAmount: 220,
  },
  {
    id: "9",
    name: "Samuel Adeyemi",
    tier: "professional",
    joinedAt: "2024-09-12T15:00:00.000Z",
    presentToday: true,
    feeStatus: "paid",
    feeAmount: 220,
  },
  {
    id: "10",
    name: "Ryan O'Connor",
    tier: "professional",
    joinedAt: "2025-03-05T10:00:00.000Z",
    presentToday: false,
    feeStatus: "pending",
    feeAmount: 220,
  },
  {
    id: "11",
    name: "Yuki Tanaka",
    tier: "professional",
    joinedAt: "2025-06-18T11:00:00.000Z",
    presentToday: true,
    feeStatus: "paid",
    feeAmount: 220,
  },
];

export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "Pitch maintenance — Saturday closure",
    body: "Pitch B will be closed this Saturday morning for aeration and line marking. All U14 sessions move to Pitch A.",
    date: "2026-05-02T09:00:00.000Z",
    priority: "high",
  },
  {
    id: "a2",
    title: "New kit collection window",
    body: "Academy-branded kits are ready for pickup at reception from Tue–Thu next week.",
    date: "2026-04-29T08:30:00.000Z",
    priority: "normal",
  },
  {
    id: "a3",
    title: "Summer trial dates published",
    body: "Open trials for prospective players begin 12 June — full schedule is on notice boards and in tournaments.",
    date: "2026-04-20T17:15:00.000Z",
    priority: "normal",
  },
];

export const matches: Match[] = [
  {
    id: "m1",
    home: "XYZ Academy U14",
    away: "Riverside FC U14",
    date: "2026-05-04T17:45:00.000Z",
    venue: "Academy Pitch A",
    status: "upcoming",
    competition: "Junior District Cup — Group B",
  },
  {
    id: "m2",
    home: "Northvale SC",
    away: "XYZ Academy U17",
    date: "2026-05-09T13:30:00.000Z",
    venue: "Northvale Sports Ground",
    status: "upcoming",
    competition: "Regional Youth League — Matchday 14",
  },
  {
    id: "m3",
    home: "XYZ Academy Reserves",
    away: "City Athletic II",
    date: "2026-05-11T18:15:00.000Z",
    venue: "Academy Pitch B",
    status: "upcoming",
    competition: "City Reserve Division",
  },
  {
    id: "m4",
    home: "Parkside Colts",
    away: "XYZ Academy U14",
    date: "2026-04-26T10:30:00.000Z",
    venue: "Parkside Oval",
    status: "completed",
    competition: "Friendly",
    homeScore: 2,
    awayScore: 3,
  },
  {
    id: "m4b",
    home: "XYZ Academy U17",
    away: "Eaglecrest United U17",
    date: "2026-04-19T16:00:00.000Z",
    venue: "Academy Pitch A",
    status: "completed",
    competition: "Regional Youth League — Matchday 13",
    homeScore: 1,
    awayScore: 1,
  },
  {
    id: "m5",
    home: "Metro Academy XI",
    away: "XYZ Academy Reserves",
    date: "2026-04-12T19:45:00.000Z",
    venue: "Metro Dome",
    status: "completed",
    competition: "City Reserve Division",
    homeScore: 0,
    awayScore: 2,
  },
];