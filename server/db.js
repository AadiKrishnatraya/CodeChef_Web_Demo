import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

/* ---------- helpers ---------- */

function isoDate(offsetDays) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function isoStamp(offsetDays, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function regDate(offsetDays, hour) {
  return isoStamp(offsetDays, hour, 24);
}

let uid = 0;
const id = (p) => `${p}_${(++uid).toString(36)}${crypto.randomBytes(4).toString('hex')}`;

/* ---------- seed data ---------- */

function seedEvents() {
  return [
    {
      id: id('evt'),
      name: 'HackNova 4.0 — 36-Hour Hackathon',
      date: isoDate(9),
      time: '10:00 AM',
      venue: 'Innovation Lab, Block C',
      category: 'Hackathon',
      description:
        'Our flagship 36-hour build sprint. Teams of 2–4 pick a problem statement at kickoff, hack through the night with mentor checkpoints, and demo to a judging panel of industry engineers. ₹40k prize pool, unlimited coffee.',
      featured: true,
      createdAt: isoStamp(-12, 11),
    },
    {
      id: id('evt'),
      name: 'CP Arena: Weekly Contest #47',
      date: isoDate(3),
      time: '8:00 PM',
      venue: 'Online — CodeChef Platform',
      category: 'Contest',
      description:
        'Rated-style contest with 5 problems across greedy, number theory and graphs. Virtual rank list, live editorial right after, and a problem-setting walkthrough for anyone curious about the setter side.',
      featured: false,
      createdAt: isoStamp(-8, 15),
    },
    {
      id: id('evt'),
      name: 'Git & GitHub Bootcamp',
      date: isoDate(5),
      time: '4:30 PM',
      venue: 'Seminar Hall 2, IT Block',
      category: 'Workshop',
      description:
        'Hands-on session covering branching strategies, pull requests, conflict resolution and open-source workflow. Bring a laptop — every participant ships a real PR to our club repo before leaving.',
      featured: false,
      createdAt: isoStamp(-6, 9),
    },
    {
      id: id('evt'),
      name: 'Systems Deep Dive: What Really Happens When You Run ./a.out',
      date: isoDate(12),
      time: '5:00 PM',
      venue: 'Auditorium, Main Block',
      category: 'Tech Talk',
      description:
        'Alumni engineer (currently at a compiler team) traces a program from shell to silicon — linking, loaders, virtual memory and the runtime. Ends with a live GDB session dissecting a real binary.',
      featured: false,
      createdAt: isoStamp(-5, 17),
    },
    {
      id: id('evt'),
      name: 'Web Wizardry: React & Tailwind Build-Along',
      date: isoDate(16),
      time: '11:00 AM',
      venue: 'Computer Lab 3, IT Block',
      category: 'Workshop',
      description:
        'Pair up and build a polished dashboard from scratch — component thinking, state management, responsive layout and deployment. Perfect follow-up for members who finished the Git bootcamp.',
      featured: false,
      createdAt: isoStamp(-4, 10),
    },
    {
      id: id('evt'),
      name: 'Bug Bounty CTF: Capture The Flag',
      date: isoDate(21),
      time: '9:30 AM',
      venue: 'Innovation Lab, Block C',
      category: 'Contest',
      description:
        'Jeopardy-style CTF with web, crypto, forensics and reversing categories. Beginner-friendly intro track in the first hour, then a six-hour scoreboard battle. Team registration encouraged.',
      featured: false,
      createdAt: isoStamp(-3, 14),
    },
    {
      id: id('evt'),
      name: 'Alumni Fireside: Careers in Backend Engineering',
      date: isoDate(26),
      time: '6:00 PM',
      venue: 'Seminar Hall 1, IT Block',
      category: 'Tech Talk',
      description:
        'Three alumni working on payments, infra and developer platforms answer everything about interviews, first years on the job, and what actually matters in your portfolio. Chai and Q&A till late.',
      featured: false,
      createdAt: isoStamp(-2, 16),
    },
    {
      id: id('evt'),
      name: 'HackNova Wrap-Up & Demo Showcase',
      date: isoDate(-4),
      time: '5:00 PM',
      venue: 'Auditorium, Main Block',
      category: 'Meetup',
      description:
        'Winning teams demo their HackNova builds, judges share feedback, and we announce mentors for the next cycle. Open to the whole campus.',
      featured: false,
      createdAt: isoStamp(-20, 12),
    },
  ];
}

function seedRegistrations(events) {
  const byName = Object.fromEntries(events.map((e) => [e.name, e]));
  const raw = [
    ['Aarav Mehta', 'aarav.mehta@campus.edu', 'CSE — 3rd Year', '9876500123', 'HackNova 4.0 — 36-Hour Hackathon', -9, 10],
    ['Ishita Rao', 'ishita.rao@campus.edu', 'IT — 2nd Year', '9845012345', 'HackNova 4.0 — 36-Hour Hackathon', -9, 12],
    ['Kabir Shah', 'kabir.shah@campus.edu', 'ECE — 4th Year', '9900112233', 'HackNova 4.0 — 36-Hour Hackathon', -8, 18],
    ['Diya Nair', 'diya.nair@campus.edu', 'CSE — 1st Year', '9123456780', 'Git & GitHub Bootcamp', -7, 9],
    ['Rohan Iyer', 'rohan.iyer@campus.edu', 'CSE — 2nd Year', '9871234500', 'Git & GitHub Bootcamp', -7, 15],
    ['Ananya Gupta', 'ananya.gupta@campus.edu', 'ISE — 3rd Year', '9886600099', 'CP Arena: Weekly Contest #47', -6, 20],
    ['Vivaan Joshi', 'vivaan.joshi@campus.edu', 'CSE — 2nd Year', '9740011223', 'CP Arena: Weekly Contest #47', -6, 21],
    ['Sara Khan', 'sara.khan@campus.edu', 'MCA — 1st Year', '9611223344', 'Systems Deep Dive: What Really Happens When You Run ./a.out', -5, 11],
    ['Aditya Verma', 'aditya.verma@campus.edu', 'CSE — 4th Year', '9377788899', 'Systems Deep Dive: What Really Happens When You Run ./a.out', -5, 13],
    ['Meera Pillai', 'meera.pillai@campus.edu', 'IT — 3rd Year', '9845123412', 'Web Wizardry: React & Tailwind Build-Along', -4, 10],
    ['Arjun Reddy', 'arjun.reddy@campus.edu', 'CSE — 1st Year', '9012345678', 'Bug Bounty CTF: Capture The Flag', -3, 9],
    ['Nikita Singh', 'nikita.singh@campus.edu', 'ECE — 2nd Year', '9966332211', 'Bug Bounty CTF: Capture The Flag', -3, 14],
    ['Farhan Ali', 'farhan.ali@campus.edu', 'CSE — 3rd Year', '9765432100', 'Alumni Fireside: Careers in Backend Engineering', -2, 18],
    ['Tanvi Kulkarni', 'tanvi.k@campus.edu', 'ISE — 2nd Year', '9822334455', 'Git & GitHub Bootcamp', -2, 19],
  ];

  return raw.map(([name, email, collegeYear, phone, eventName, d, h]) => ({
    id: id('reg'),
    eventId: byName[eventName]?.id ?? null,
    name,
    email,
    collegeYear,
    phone,
    createdAt: regDate(d, h),
  }));
}

/* ---------- init + store ---------- */

function initDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const events = seedEvents();
    const db = { events, registrations: seedRegistrations(events) };
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(db) {
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_PATH);
}

export const store = {
  getEvents() {
    return readDb().events;
  },
  saveEvents(events) {
    const db = readDb();
    db.events = events;
    writeDb(db);
  },
  getRegistrations() {
    return readDb().registrations;
  },
  saveRegistrations(regs) {
    const db = readDb();
    db.registrations = regs;
    writeDb(db);
  },
  newId(prefix) {
    return id(prefix);
  },
};

export { initDb };
