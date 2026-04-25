import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import DetailsPanel from './components/DetailsPanel';
import {
  Conversation,
  Channel,
  Message,
  fetchChannels,
  fetchContacts,
  fetchMessages,
  sendMessage,
} from './api/dummyApi';

function App() {
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [contacts, setContacts] = useState<Conversation[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [activeInbox, setActiveInbox] = useState('My Inbox');
  const [activeFilter, setActiveFilter] = useState<{ type: 'none' | 'team' | 'user' | 'channel'; value: string }>({ type: 'none', value: '' });
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apiContacts, apiChannels] = await Promise.all([fetchContacts(), fetchChannels()]);
        setContacts(apiContacts);
        setChannels(apiChannels);
        setSelectedContactId(apiContacts[0]?.id ?? '');
      } catch (error) {
        console.error('Failed to load dummy API data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const target = activeFilter.type === 'channel' ? activeFilter.value : selectedContactId;
    if (!target) return;

    const fetchMessagesForTarget = async () => {
      setChatLoading(true);
      try {
        const apiMessages = await fetchMessages(target, activeFilter.type === 'channel' ? 'channel' : 'contact');
        const key = activeFilter.type === 'channel' ? `channel_${target}` : target;
        setMessages((prev) => ({
          ...prev,
          [key]: apiMessages,
        }));
      } catch (error) {
        console.error('Failed to load chat messages', error);
      } finally {
        setChatLoading(false);
      }
    };

    fetchMessagesForTarget();
  }, [activeFilter, selectedContactId]);

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? null;
  const defaultContact: Conversation = {
    id: 'unknown',
    name: 'Unknown',
    lastMessage: '',
    time: '',
    unread: 0,
    avatar: 'U',
    status: 'offline',
    hasNew: false,
    hasUnseen: false,
    team: '',
    assignedTo: '',
  };

  const channelContact = {
    id: 'channel',
    name: activeFilter.value || 'Channel',
    lastMessage: '',
    time: '',
    unread: 0,
    avatar: 'C',
    status: 'online' as const,
    hasNew: false,
    hasUnseen: false,
    team: '',
    assignedTo: '',
  };

  const activeConversation = activeFilter.type === 'channel' ? channelContact : selectedContact ?? defaultContact;
  const chatMessages =
    activeFilter.type === 'channel'
      ? messages[`channel_${activeFilter.value}`] ?? []
      : messages[selectedContact?.id ?? ''] ?? [];

  const markContactAsRead = (contactId: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? { ...contact, unread: 0, hasNew: false, hasUnseen: false }
          : contact
      )
    );
  };

  const handleContactSelect = (contactId: string) => {
    if (contactId === selectedContactId) return;
    setActiveFilter({ type: 'none', value: '' });
    setSelectedContactId(contactId);
    markContactAsRead(contactId);
  };

  const handleFilterChange = (filter: { type: 'none' | 'team' | 'user' | 'channel'; value: string }) => {
    setActiveFilter(filter);

    if (filter.type === 'team') {
      const matchingContact = contacts.find((contact) => contact.team === filter.value);
      if (matchingContact) {
        setSelectedContactId(matchingContact.id);
        markContactAsRead(matchingContact.id);
      }
    }

    if (filter.type === 'user') {
      const matchingContact = contacts.find((contact) => contact.name === filter.value);
      if (matchingContact) {
        setSelectedContactId(matchingContact.id);
        markContactAsRead(matchingContact.id);
      }
    }
  };

  const handleChannelSelect = (channelName: string) => {
    setActiveFilter({ type: 'channel', value: channelName });
  };

  const autoReplies = [
    'I\'m currently offline, try again later.',
    'Thanks for your message, I\'ll get back to you soon.',
    'Can\'t respond right now, sorry!',
    'Thanks for reaching out, I\'m busy at the moment.',
    'Got your message, will reply shortly.',
  ];

  const handleSendMessage = async (text: string) => {
    const target = activeFilter.type === 'channel' ? activeFilter.value : selectedContactId;
    if (!target) return;

    const messageKey = activeFilter.type === 'channel' ? `channel_${target}` : target;
    const newMessage = await sendMessage(text, target, activeFilter.type === 'channel' ? 'channel' : 'contact', 'me');

    setMessages((prev) => ({
      ...prev,
      [messageKey]: [...(prev[messageKey] || []), newMessage],
    }));

    const delay = Math.random() * 3000 + 2000;
    const replyTimeout = window.setTimeout(async () => {
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMessage = await sendMessage(randomReply, target, activeFilter.type === 'channel' ? 'channel' : 'contact', 'them');
      setMessages((prev) => ({
        ...prev,
        [messageKey]: [...(prev[messageKey] || []), replyMessage],
      }));
    }, delay);

    return () => window.clearTimeout(replyTimeout);
  };

  return (
    <div className="min-h-screen bg-[#eff3fa] p-4 sm:p-6">
      <Navbar loading={loading} />
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-full gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_320px_minmax(0,1fr)_320px]">
        <Sidebar
          loading={loading}
          contacts={contacts}
          channels={channels}
          activeInbox={activeInbox}
          onInboxChange={setActiveInbox}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        <ChatList
          loading={loading}
          contacts={contacts}
          channels={channels}
          selectedContactId={selectedContactId}
          onContactSelect={handleContactSelect}
          onChannelSelect={handleChannelSelect}
          activeInbox={activeInbox}
          activeFilter={activeFilter}
        />
        <ChatWindow loading={chatLoading} contact={activeConversation} messages={chatMessages} onSendMessage={handleSendMessage} />
        <DetailsPanel loading={loading} contactId={selectedContactId} activeFilter={activeFilter} channels={channels} onChannelSelect={handleChannelSelect} />
      </div>
    </div>
  );
}

export default App;
