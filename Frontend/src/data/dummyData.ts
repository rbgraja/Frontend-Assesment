export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  hasNew: boolean;
  hasUnseen: boolean;
  team: string;
  assignedTo: string;
};

export type Message = {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  status?: string;
};

export type ContactProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  team: string;
  labels: string[];
  notes: string[];
  otherChat: { title: string; message: string; time: string };
};

export const contacts: Conversation[] = [
  {
    id: 'olivia',
    name: 'Olivia Mckinsey',
    lastMessage: "Oh my god 😍 I'll try it ASAP, thank..",
    time: '23:23',
    unread: 2,
    avatar: 'O',
    status: 'online',
    hasNew: true,
    hasUnseen: true,
    team: 'Customer Support',
    assignedTo: 'Michael Johnson',
  },
  {
    id: 'sara',
    name: 'Sara Williams',
    lastMessage: 'Good Evening, Emily! Hope you are..',
    time: '23:16',
    unread: 1,
    avatar: 'S',
    status: 'away',
    hasNew: false,
    hasUnseen: true,
    team: 'Sales',
    assignedTo: 'Sarah Williams',
  },
  {
    id: 'frank',
    name: 'Frank Thompson',
    lastMessage: 'Thank you for signing up Frank! If t..',
    time: '22:28',
    unread: 0,
    avatar: 'F',
    status: 'offline',
    hasNew: false,
    hasUnseen: false,
    team: 'Sales',
    assignedTo: 'Christopher Miller',
  },
  {
    id: 'grace',
    name: 'Grace Lee',
    lastMessage: 'I am sending you the report right a..',
    time: '20:43',
    unread: 1,
    avatar: 'G',
    status: 'online',
    hasNew: true,
    hasUnseen: false,
    team: 'Customer Support',
    assignedTo: 'Ashley Taylor',
  },
  {
    id: 'henry',
    name: 'Henry Adams',
    lastMessage: 'Thank you for filling out our survey!',
    time: '17:37',
    unread: 0,
    avatar: 'H',
    status: 'busy',
    hasNew: false,
    hasUnseen: false,
    team: 'Customer Support',
    assignedTo: 'Joshua Martinez',
  },
  {
    id: 'emily',
    name: 'Emily Davis',
    lastMessage: 'Got your update and I’m reviewing now.',
    time: '16:52',
    unread: 1,
    avatar: 'E',
    status: 'online',
    hasNew: true,
    hasUnseen: true,
    team: 'Customer Support',
    assignedTo: 'Emily Davis',
  },
  {
    id: 'daniel',
    name: 'Daniel Anderson',
    lastMessage: 'All set with the new account setup.',
    time: '14:18',
    unread: 0,
    avatar: 'D',
    status: 'away',
    hasNew: false,
    hasUnseen: false,
    team: 'Sales',
    assignedTo: 'Daniel Anderson',
  },
  {
    id: 'jessica',
    name: 'Jessica Thomas',
    lastMessage: 'Please send the final proof before EOD.',
    time: '13:02',
    unread: 0,
    avatar: 'J',
    status: 'busy',
    hasNew: false,
    hasUnseen: false,
    team: 'Customer Support',
    assignedTo: 'Jessica Thomas',
  },
  {
    id: 'amanda',
    name: 'Amanda Garcia',
    lastMessage: 'I have updated the ticket and assigned it.',
    time: '11:24',
    unread: 0,
    avatar: 'A',
    status: 'online',
    hasNew: false,
    hasUnseen: false,
    team: 'Sales',
    assignedTo: 'Amanda Garcia',
  },
];

export const messagesByContact: Record<string, Message[]> = {
  olivia: [
    {
      id: 'olivia-1',
      sender: 'them',
      text: 'Hi, I recently joined Fit4Life and I’m trying to access my workout plan, but I can’t login. Can you help?',
      time: '23:08',
    },
    {
      id: 'olivia-2',
      sender: 'me',
      text: "Hello Olivia 👋 I'm Michael, your AI customer support assistant. Let's fix this quickly. Could you confirm the email address?",
      time: '23:08',
    },
    {
      id: 'olivia-3',
      sender: 'them',
      text: 'Yes, it’s olivia.Mckinsey@gmail.com',
      time: '23:16',
    },
    {
      id: 'olivia-4',
      sender: 'me',
      text: "Thanks! Looks like your reset wasn’t completed. I’ve sent a new link - please check your inbox.",
      time: '23:16',
    },
    {
      id: 'olivia-5',
      sender: 'them',
      text: 'I see it, resetting now...',
      time: '23:17',
    },
    {
      id: 'olivia-6',
      sender: 'them',
      text: "Done! I’m logged in. Thanks!",
      time: '23:20',
    },
    {
      id: 'olivia-7',
      sender: 'me',
      text: "Perfect 🎉 Your plan is ready under “My Programs”. Since you’re starting out, I suggest our Premium Guide - it boosts results and is 20% off here 👉 www.Fit4Life.com/Premium",
      time: '23:20',
      status: 'Delivered',
    },
    {
      id: 'olivia-8',
      sender: 'them',
      text: "Oh my god 😍 I'll try it ASAP, thank you so much!!",
      time: '23:23',
    },
  ],
  sara: [
    {
      id: 'sara-1',
      sender: 'them',
      text: 'Hello, I need a quick update on the onboarding workflow. Can you send it over?',
      time: '22:45',
    },
    {
      id: 'sara-2',
      sender: 'me',
      text: 'Sure! I have sent the onboarding workflow details to your email. Anything else I can help with?',
      time: '22:47',
    },
  ],
  frank: [
    {
      id: 'frank-1',
      sender: 'them',
      text: 'Hey, I signed up but I am not seeing the pricing plans. Please advise.',
      time: '21:30',
    },
    {
      id: 'frank-2',
      sender: 'me',
      text: 'I can help with that. The plans are visible in your dashboard under Account > Pricing.',
      time: '21:31',
      status: 'Delivered',
    },
  ],
  grace: [
    {
      id: 'grace-1',
      sender: 'them',
      text: 'I am sending you the report right away, should be in your inbox in a minute.',
      time: '20:43',
    },
    {
      id: 'grace-2',
      sender: 'me',
      text: 'Great, I will review it and follow up once I have feedback.',
      time: '20:45',
      status: 'Delivered',
    },
  ],
  henry: [
    {
      id: 'henry-1',
      sender: 'them',
      text: 'Thank you for filling out our survey! I had one follow-up question.',
      time: '17:37',
    },
    {
      id: 'henry-2',
      sender: 'me',
      text: 'Happy to help! What is your next question?',
      time: '17:39',
    },
  ],
  emily: [
    {
      id: 'emily-1',
      sender: 'them',
      text: 'I received the report. Can you confirm the next deadline?',
      time: '16:52',
    },
    {
      id: 'emily-2',
      sender: 'me',
      text: 'Yes, the next milestone is due Friday at 10am.',
      time: '16:55',
      status: 'Delivered',
    },
  ],
  daniel: [
    {
      id: 'daniel-1',
      sender: 'them',
      text: 'All set with the new account setup.',
      time: '14:18',
    },
    {
      id: 'daniel-2',
      sender: 'me',
      text: 'Great, I’ve sent access details to your email.',
      time: '14:20',
    },
  ],
  jessica: [
    {
      id: 'jessica-1',
      sender: 'them',
      text: 'Please send the final proof before EOD.',
      time: '13:02',
    },
    {
      id: 'jessica-2',
      sender: 'me',
      text: 'I’ll send it in 15 minutes.',
      time: '13:04',
      status: 'Delivered',
    },
  ],
  amanda: [
    {
      id: 'amanda-1',
      sender: 'them',
      text: 'I have updated the ticket and assigned it.',
      time: '11:24',
    },
    {
      id: 'amanda-2',
      sender: 'me',
      text: 'Thanks, I’ll follow up with the team shortly.',
      time: '11:26',
    },
  ],
};

export const channelMessages: Record<string, Message[]> = {
  Fit4Life: [
    {
      id: 'fit4life-1',
      sender: 'them',
      text: '📣 Channel Announcement: Fit4Life will have a system maintenance at 01:00 AM UTC tonight.',
      time: '10:00',
    },
    {
      id: 'fit4life-2',
      sender: 'them',
      text: 'Please save your work and log out before maintenance begins.',
      time: '10:01',
    },
    {
      id: 'fit4life-3',
      sender: 'them',
      text: 'If you experience any issues after the restart, contact support immediately.',
      time: '10:03',
      status: 'Important',
    },
  ],
};

export const contactProfiles: Record<string, ContactProfile> = {
  olivia: {
    id: 'olivia',
    firstName: 'Olivia',
    lastName: 'Mckinsey',
    phone: '+1 (312) 555-0134',
    email: 'olivia.Mckinsey@gmail.com',
    team: 'Customer Support',
    labels: ['Closed Won', 'Chicago'],
    notes: ['Add a note', 'Strong potential for future upgrades'],
    otherChat: {
      title: 'Fit4Life',
      message: 'On my way!',
      time: '08/08/25',
    },
  },
  sara: {
    id: 'sara',
    firstName: 'Sara',
    lastName: 'Williams',
    phone: '+1 (415) 889-1234',
    email: 'sara.williams@email.com',
    team: 'Sales',
    labels: ['Support', 'Remote'],
    notes: ['Follow up on onboarding', 'Potential upsell in Q3'],
    otherChat: {
      title: 'Heyy Support',
      message: 'I will check the file shortly.',
      time: '08/08/25',
    },
  },
  frank: {
    id: 'frank',
    firstName: 'Frank',
    lastName: 'Thompson',
    phone: '+1 (212) 555-0123',
    email: 'frank.thompson@email.com',
    team: 'Sales',
    labels: ['New Lead'],
    notes: ['Send plan details', 'Check plan availability'],
    otherChat: {
      title: 'Sales Team',
      message: 'Awaiting your reply.',
      time: '08/08/25',
    },
  },
  grace: {
    id: 'grace',
    firstName: 'Grace',
    lastName: 'Lee',
    phone: '+1 (310) 555-0199',
    email: 'grace.lee@email.com',
    team: 'Customer Support',
    labels: ['Priority'],
    notes: ['Review report after lunch', 'Possible renewal'],
    otherChat: {
      title: 'Project Team',
      message: 'I have updated the report.',
      time: '08/08/25',
    },
  },
  henry: {
    id: 'henry',
    firstName: 'Henry',
    lastName: 'Adams',
    phone: '+1 (917) 555-0184',
    email: 'henry.adams@email.com',
    team: 'Customer Support',
    labels: ['Survey'],
    notes: ['Send summary tomorrow', 'Check for feedback'],
    otherChat: {
      title: 'Customer Success',
      message: 'Thank you for your time!',
      time: '08/08/25',
    },
  },
  emily: {
    id: 'emily',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '+1 (310) 555-0211',
    email: 'emily.davis@email.com',
    team: 'Customer Support',
    labels: ['Support', 'Internal'],
    notes: ['Review onboarding notes', 'Confirm launch schedule'],
    otherChat: {
      title: 'Work Group',
      message: 'I’m reviewing the latest version now.',
      time: '08/08/25',
    },
  },
  daniel: {
    id: 'daniel',
    firstName: 'Daniel',
    lastName: 'Anderson',
    phone: '+1 (415) 555-0180',
    email: 'daniel.anderson@email.com',
    team: 'Sales',
    labels: ['Sales'],
    notes: ['Prepare renewal offer', 'Connect with finance team'],
    otherChat: {
      title: 'Sales Channel',
      message: 'Client is ready for the next demo.',
      time: '08/08/25',
    },
  },
  jessica: {
    id: 'jessica',
    firstName: 'Jessica',
    lastName: 'Thomas',
    phone: '+1 (415) 555-0192',
    email: 'jessica.thomas@email.com',
    team: 'Customer Support',
    labels: ['Design'],
    notes: ['Review visuals', 'Approve final draft'],
    otherChat: {
      title: 'Design Team',
      message: 'Working on the final mockups.',
      time: '08/08/25',
    },
  },
  amanda: {
    id: 'amanda',
    firstName: 'Amanda',
    lastName: 'Garcia',
    phone: '+1 (310) 555-0198',
    email: 'amanda.garcia@email.com',
    team: 'Sales',
    labels: ['Support'],
    notes: ['Follow up with customer', 'Send updated ticket'],
    otherChat: {
      title: 'Ticket Queue',
      message: 'Ticket assigned and prioritized.',
      time: '08/08/25',
    },
  },
};

export type ChannelProfile = {
  name: string;
  description: string;
  team: string;
  members: string[];
  lastActivity: string;
};

export const channelProfiles: Record<string, ChannelProfile> = {
  Fit4Life: {
    name: 'Fit4Life',
    description: 'System updates and broadcast announcements for the Fit4Life community.',
    team: 'Platform',
    members: ['Olivia Mckinsey', 'Emily Davis', 'Daniel Anderson'],
    lastActivity: '10:03',
  },
};

export const teams = [
  { name: 'Sales', count: 7, contactId: 'sara' },
  { name: 'Customer Support', count: 16, contactId: 'olivia' },
];

export const users = [
  { name: 'Sarah Williams', count: 1, contactId: 'sara' },
  { name: 'Olivia', count: 1, contactId: 'olivia' },
  { name: 'Emily Davis', count: 1, contactId: 'emily' },
  { name: 'Frank', count: 1, contactId: 'frank' },
  { name: 'Amanda Garcia', count: 1, contactId: 'amanda' },
  { name: 'Henry', count: 1, contactId: 'henry' },
  { name: 'Grace', count: 1, contactId: 'grace' },
  { name: 'Daniel Anderson', count: 1, contactId: 'daniel' },
  { name: 'Jessica Thomas', count: 1, contactId: 'jessica' },
];

export const channels = [
  { name: 'Fit4Life', contactId: 'olivia', date: '08/08/25' },
];
