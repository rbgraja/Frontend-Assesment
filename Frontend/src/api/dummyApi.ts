const API_BASE = 'https://dummyjson.com';

const statusOptions = ['online', 'away', 'busy', 'offline'] as const;
const teamNames = ['Sales', 'Customer Support', 'Marketing', 'Product', 'Success'];
const sampleLabels = ['High Priority', 'Follow Up', 'Renewal', 'Support', 'Upsell'];
const sampleNotes = [
  'Customer is interested in the new plan.',
  'Follow up after the next sprint review.',
  'Needs a personalized onboarding walkthrough.',
  'Send contract and pricing details.',
];

const randomTime = () => {
  const hour = Math.floor(Math.random() * 12) + 1;
  const minute = Math.floor(Math.random() * 60);
  const suffix = Math.random() > 0.5 ? 'AM' : 'PM';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${suffix}`;
};

const pick = <T,>(items: readonly T[], index: number): T => items[index % items.length];

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

export type Channel = {
  name: string;
  contactId: string;
  date: string;
};

export type Team = {
  name: string;
  count: number;
  contactId: string;
};

export type User = {
  name: string;
  count: number;
  contactId: string;
};

export type ChannelProfile = {
  name: string;
  description: string;
  team: string;
  members: string[];
  lastActivity: string;
};

const createRandomTime = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const mapUserToConversation = (user: any): Conversation => {
  const id = String(user.id);
  const name = `${user.firstName} ${user.lastName}`;
  const team = user.company?.department || pick(teamNames, user.id);
  const assignedTo = user.company?.name || pick(['Michael Johnson', 'Ashley Taylor', 'Sara Williams'], user.id);
  const lastMessage = user.company?.title || "Checking in on the latest update.";
  const status = pick(statusOptions, user.id);

  return {
    id,
    name,
    lastMessage,
    time: randomTime(),
    unread: user.id % 3,
    avatar: name.charAt(0).toUpperCase(),
    status,
    hasNew: user.id % 2 === 0,
    hasUnseen: user.id % 3 === 0,
    team,
    assignedTo,
  };
};

const mapCommentToMessage = (comment: any, index: number, senderOverride?: 'me' | 'them'): Message => {
  return {
    id: `msg-${comment.id}`,
    sender: senderOverride ?? (index % 2 === 0 ? 'them' : 'me'),
    text: comment.body || comment.message || 'No message available.',
    time: createRandomTime(),
    status: index % 3 === 0 ? 'Delivered' : undefined,
  };
};

const createLocalMessage = (text: string, sender: 'me' | 'them', status?: string): Message => {
  return {
    id: `local-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    sender,
    text,
    time: createRandomTime(),
    status,
  };
};

const mapUserToProfile = (user: any): ContactProfile => {
  const name = `${user.firstName} ${user.lastName}`;
  const team = user.company?.department || pick(teamNames, user.id);
  const labels = [user.company?.title || 'Customer', pick(sampleLabels, user.id)];
  const notes = [pick(sampleNotes, user.id), `Met on ${new Date().toLocaleDateString()}`];
  return {
    id: String(user.id),
    firstName: user.firstName || 'Unknown',
    lastName: user.lastName || 'Contact',
    phone: user.phone || '+1 (000) 000-0000',
    email: user.email || `${user.firstName?.toLowerCase() || 'user'}@example.com`,
    team,
    labels,
    notes,
    otherChat: {
      title: user.company?.department || 'Support Team',
      message: user.company?.title ? `Working on ${user.company.title}` : 'Following up on the project.',
      time: user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '08/08/25',
    },
  };
};

const mapProductToChannel = (product: any): Channel => {
  return {
    name: product.title || `Channel ${product.id}`,
    contactId: String(product.id),
    date: new Date().toLocaleDateString('en-GB'),
  };
};

const mapProductToChannelProfile = (product: any): ChannelProfile => {
  return {
    name: product.title || `Channel ${product.id}`,
    description: product.description || 'This channel shares announcements and updates.',
    team: pick(teamNames, product.id),
    members: [product.brand || 'Fit4Life', product.category || 'Platform', 'Olivia Mckinsey'],
    lastActivity: createRandomTime(),
  };
};

const fetchJson = async (resource: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${resource}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Dummy API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchContacts = async (): Promise<Conversation[]> => {
  const json = await fetchJson('/users?limit=8');
  return (json.users || []).map(mapUserToConversation);
};

export const fetchChannels = async (): Promise<Channel[]> => {
  const json = await fetchJson('/products?limit=2');
  return (json.products || []).map(mapProductToChannel);
};

export const fetchMessages = async (target: string, type: 'contact' | 'channel'): Promise<Message[]> => {
  const json = await fetchJson('/comments?limit=8');
  return (json.comments || []).map((comment: any, index: number) => mapCommentToMessage(comment, index));
};

export const fetchContactProfile = async (contactId: string): Promise<ContactProfile> => {
  const json = await fetchJson(`/users/${contactId}`);
  return mapUserToProfile(json);
};

export const fetchChannelProfile = async (channelName: string): Promise<ChannelProfile> => {
  const json = await fetchJson(`/products/search?q=${encodeURIComponent(channelName)}&limit=1`);
  if (json.products?.length) {
    return mapProductToChannelProfile(json.products[0]);
  }

  return {
    name: channelName,
    description: 'Broadcast and announcement channel',
    team: 'Platform',
    members: ['Olivia Mckinsey', 'Emily Davis', 'Daniel Anderson'],
    lastActivity: createRandomTime(),
  };
};

export const sendMessage = async (
  text: string,
  target: string,
  type: 'contact' | 'channel',
  sender: 'me' | 'them' = 'me',
): Promise<Message> => {
  const body = {
    body: text,
    postId: Number(target) || 1,
    userId: 1,
  };
  const json = await fetchJson('/comments/add', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return createLocalMessage(json.body || text, sender, sender === 'me' ? 'Delivered' : undefined);
};

export const saveNote = async (contactId: string, note: string): Promise<string> => {
  await fetchJson('/comments/add', {
    method: 'POST',
    body: JSON.stringify({ body: note, postId: Number(contactId) || 1, userId: 1 }),
  });
  return note;
};

export const createContact = async (contact: Partial<Conversation>): Promise<Conversation> => {
  const json = await fetchJson('/users/add', {
    method: 'POST',
    body: JSON.stringify({ ...contact, firstName: contact.name?.split(' ')[0] || 'New', lastName: contact.name?.split(' ')[1] || 'Contact' }),
  });
  return mapUserToConversation(json);
};

export const updateContact = async (contactId: string, updates: Partial<Conversation>): Promise<Conversation> => {
  const json = await fetchJson(`/users/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return mapUserToConversation(json);
};

export const updateMessage = async (messageId: string, updates: Partial<Message>): Promise<Message> => {
  const id = messageId.replace('msg-', '');
  const json = await fetchJson(`/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return mapCommentToMessage(json, 0);
};
