import { useMemo, useState } from 'react';
import {  FiSearch } from 'react-icons/fi';
import { Channel, Conversation } from '../api/dummyApi';
import { Skeleton } from './Skeleton';

type ActiveFilter = { type: 'none' | 'team' | 'user' | 'channel'; value: string };

interface ChatListProps {
  loading?: boolean;
  contacts: Conversation[];
  channels: Channel[];
  selectedContactId: string;
  onContactSelect: (id: string) => void;
  onChannelSelect: (channelName: string) => void;
  activeInbox: string;
  activeFilter: ActiveFilter;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'online':
      return 'bg-emerald-400';
    case 'away':
      return 'bg-amber-400';
    case 'busy':
      return 'bg-rose-400';
    default:
      return 'bg-slate-300';
  }
}

function ChatList({ loading = false, contacts, channels, selectedContactId, onContactSelect, onChannelSelect, activeInbox, activeFilter }: ChatListProps) {
  const [selectedTab, setSelectedTab] = useState<'All' | 'New' | 'Unseen'>('All');
  const [sortNewest, setSortNewest] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    if (activeFilter.type === 'channel') return contacts;

    return contacts
      .filter((contact) => {
        if (activeInbox === 'Unassigned') return contact.unread === 0;
        return true;
      })
      .filter((contact) => {
        if (selectedTab === 'New') return contact.hasNew;
        if (selectedTab === 'Unseen') return contact.hasUnseen;
        return true;
      })
      .filter((contact) => {
        if (activeFilter.type === 'team') return contact.team === activeFilter.value;
        if (activeFilter.type === 'user') return contact.name === activeFilter.value;
        return true;
      })
      .filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortNewest) return b.time.localeCompare(a.time);
        return a.time.localeCompare(b.time);
      });
  }, [activeInbox, activeFilter, contacts, selectedTab, searchTerm, sortNewest]);

  const filteredChannels = useMemo(() => {
    return channels
      .filter((channel) => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (sortNewest ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)));
  }, [searchTerm, sortNewest]);

  if (loading) {
    return (
      <section className="rounded-[32px] bg-white p-6 shadow-soft">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-3" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-3xl" />
        </div>

        <Skeleton className="mb-6 h-14 w-full rounded-[28px]" />
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-[28px]" />
          ))}
        </div>
      </section>
    );
  }

 return (
  <section className="rounded-[32px] bg-white shadow-soft">

    {/* HEADER */}
    <div className="mb-6 flex items-center justify-between p-[21px] border-b border-slate-200 pb-5">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* SVG ICON */}
        <div className="flex items-center justify-center ">
<svg width="20" height="20" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.77193 0C9.74085 0 10.5263 0.785465 10.5263 1.75439V8.77193C10.5263 9.74085 9.74085 10.5263 8.77193 10.5263H1.75439C0.785464 10.5263 0 9.74085 0 8.77193V1.75439C0 0.785466 0.785464 0 1.75439 0H8.77193ZM7.30994 1.16959H8.77193C9.0949 1.16959 9.35672 1.43141 9.35672 1.75439V8.77193C9.35672 9.0949 9.0949 9.35672 8.77193 9.35672H7.30994V1.16959ZM6.14035 9.35672H1.75439C1.43141 9.35672 1.16959 9.0949 1.16959 8.77193V1.75439C1.16959 1.43141 1.43141 1.16959 1.75439 1.16959H6.14035V9.35672Z" fill="black"/>
</svg>
        </div>

        {/* NAME */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Raja AbdulRehman</h2>
        </div>
      </div>

      {/* RIGHT NEW MESSAGE ICON */}
      <button className="flex items-center justify-center">
       <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2_1668)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.16943 2.92387C1.16943 1.95495 1.9549 1.16948 2.92382 1.16948H7.60218C7.92516 1.16948 8.18698 1.43131 8.18698 1.75428C8.18698 2.07725 7.92516 2.33908 7.60218 2.33908H2.92382C2.60085 2.33908 2.33902 2.6009 2.33902 2.92387V11.111C2.33902 11.434 2.60085 11.6958 2.92382 11.6958H11.111C11.4339 11.6958 11.6958 11.434 11.6958 11.111V6.43264C11.6958 6.10967 11.9576 5.84785 12.2805 5.84785C12.6035 5.84785 12.8653 6.10967 12.8653 6.43264V11.111C12.8653 12.0799 12.0799 12.8654 11.111 12.8654H2.92382C1.9549 12.8654 1.16943 12.0799 1.16943 11.111V2.92387Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.3299 2.28683C11.2157 2.17264 11.0306 2.17264 10.9164 2.28683L10.5029 2.70034L11.3299 3.52737L11.7434 3.11386C11.8576 2.99967 11.8576 2.81453 11.7434 2.70034L11.3299 2.28683ZM10.5029 4.35439L9.67583 3.52737L4.67821 8.52499V9.35202H5.50523L10.5029 4.35439ZM10.5029 1.04629C10.8454 0.703726 11.4008 0.703726 11.7434 1.04629L12.9839 2.28683C13.3265 2.6294 13.3265 3.1848 12.9839 3.52737L6.16097 10.3503C6.0513 10.46 5.90256 10.5216 5.74746 10.5216H4.09341C3.77044 10.5216 3.50862 10.2598 3.50862 9.93682V8.28277C3.50862 8.12767 3.57023 7.97892 3.6799 7.86925L10.5029 1.04629Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_2_1668">
<rect width="14.0351" height="14.0351" fill="white"/>
</clipPath>
</defs>
</svg>

      </button>
    </div>

    {/* SEARCH + FILTER LINE */}
    <div className="mb-5 flex items-center px-6  justify-between">

      {/* SEARCH (no bg, no border) */}
      <div className="flex items-center gap-2 flex-1">
        <FiSearch className="" />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search Chat"
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      {/* FILTER ICON */}
      <button
        onClick={() => setSortNewest((prev) => !prev)}
        className="ml-3 "
      >
      <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.50951 7.60222C4.27317 7.60222 4.92124 8.0907 5.16224 8.77181H11.6966C12.0196 8.77181 12.2814 9.03362 12.2814 9.3566C12.2814 9.67959 12.0196 9.9414 11.6966 9.9414H5.16224C4.92124 10.6225 4.27317 11.111 3.50951 11.111C2.54059 11.111 1.75513 10.3256 1.75513 9.3566C1.75513 8.38766 2.54059 7.60222 3.50951 7.60222ZM3.50951 8.77181C3.18654 8.77181 2.92472 9.03362 2.92472 9.3566C2.92472 9.67959 3.18654 9.9414 3.50951 9.9414C3.83248 9.9414 4.09431 9.67959 4.09431 9.3566C4.09431 9.03362 3.83248 8.77181 3.50951 8.77181Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5271 2.92397C11.496 2.92397 12.2814 3.70943 12.2814 4.67835C12.2814 5.64727 11.496 6.43274 10.5271 6.43274C9.76337 6.43274 9.1153 5.94426 8.87431 5.26315H2.33992C2.01695 5.26315 1.75513 5.00132 1.75513 4.67835C1.75513 4.35538 2.01695 4.09356 2.33992 4.09356H8.87431C9.1153 3.41246 9.76337 2.92397 10.5271 2.92397ZM10.5271 4.09356C10.2041 4.09356 9.94226 4.35538 9.94226 4.67835C9.94226 5.00132 10.2041 5.26315 10.5271 5.26315C10.85 5.26315 11.1119 5.00132 11.1119 4.67835C11.1119 4.35538 10.85 4.09356 10.5271 4.09356Z" fill="black"/>
</svg>

      </button>
    </div>

    {/* OPEN / NEWEST ROW */}
    <div className="mb-5 flex items-center px-6 justify-between text-sm font-medium ">
      <button className="flex items-center justify-center gap-[10px] font-semibold">Open <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.47227 4.31362C3.58194 4.42325 3.73065 4.48484 3.88572 4.48484C4.04079 4.48484 4.18951 4.42325 4.29917 4.31362L7.60736 1.00543C7.66321 0.951486 7.70776 0.886957 7.73841 0.81561C7.76906 0.744263 7.78519 0.667526 7.78587 0.589877C7.78654 0.512228 7.77174 0.435223 7.74234 0.363354C7.71294 0.291484 7.66951 0.22619 7.61461 0.171282C7.5597 0.116374 7.4944 0.0729516 7.42254 0.0435476C7.35067 0.0141435 7.27366 -0.000652666 7.19601 2.20801e-05C7.11836 0.000696827 7.04163 0.0168292 6.97028 0.0474777C6.89893 0.0781262 6.8344 0.122677 6.78046 0.178531L3.88572 3.07327L0.990983 0.178531C0.880689 0.0720058 0.732969 0.0130617 0.579638 0.0143941C0.426307 0.0157265 0.279633 0.0772287 0.171206 0.185655C0.0627809 0.29408 0.0012784 0.440754 -5.43594e-05 0.594086C-0.00138664 0.747417 0.0575576 0.895138 0.164083 1.00543L3.47227 4.31362Z" fill="black"/>
</svg>
 </button>
      <button className="flex items-center justify-center gap-[10px] font-semibold" onClick={() => setSortNewest((prev) => !prev)}>
        {sortNewest ? 'Newest' : 'Oldest'}<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.47227 4.31362C3.58194 4.42325 3.73065 4.48484 3.88572 4.48484C4.04079 4.48484 4.18951 4.42325 4.29917 4.31362L7.60736 1.00543C7.66321 0.951486 7.70776 0.886957 7.73841 0.81561C7.76906 0.744263 7.78519 0.667526 7.78587 0.589877C7.78654 0.512228 7.77174 0.435223 7.74234 0.363354C7.71294 0.291484 7.66951 0.22619 7.61461 0.171282C7.5597 0.116374 7.4944 0.0729516 7.42254 0.0435476C7.35067 0.0141435 7.27366 -0.000652666 7.19601 2.20801e-05C7.11836 0.000696827 7.04163 0.0168292 6.97028 0.0474777C6.89893 0.0781262 6.8344 0.122677 6.78046 0.178531L3.88572 3.07327L0.990983 0.178531C0.880689 0.0720058 0.732969 0.0130617 0.579638 0.0143941C0.426307 0.0157265 0.279633 0.0772287 0.171206 0.185655C0.0627809 0.29408 0.0012784 0.440754 -5.43594e-05 0.594086C-0.00138664 0.747417 0.0575576 0.895138 0.164083 1.00543L3.47227 4.31362Z" fill="black"/>
</svg>

      </button>
    </div>

    {/* FILTER TAG */}
    {activeFilter.type !== 'none' && (
      <div className="mb-4">
        <span className="rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#3730a3]">
          {activeFilter.type === 'team'
            ? `Team: ${activeFilter.value}`
            : activeFilter.type === 'user'
            ? `User: ${activeFilter.value}`
            : `Channel: ${activeFilter.value}`}
        </span>
      </div>
    )}

    {/* CHAT LIST */}
    <div className="space-y-2 px-4">

      {activeFilter.type === 'channel'
        ? filteredChannels.map((channel) => (
            <button
              key={channel.name}
              onClick={() => onChannelSelect(channel.name)}
              className={`flex w-full items-center justify-between px-3 py-3 text-left transition rounded-[5px]
              ${
                activeFilter.value === channel.name
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#ede9ff] text-[#5b46ff]">
                  {channel.name.charAt(0)}
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-900 flex gap-2">
                    {channel.name}
                    <span className="text-xs text-slate-400">{channel.date}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Channel announcements
                  </p>
                </div>
              </div>
            </button>
          ))
        : filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onContactSelect(contact.id)}
              className={`flex w-full items-center justify-between px-3 py-3 text-left transition rounded-[5px]
${
  selectedContactId === contact.id
    ? 'bg-white shadow-md ring-1 ring-[#ede9ff]'
    : 'hover:bg-white hover:shadow-md hover:ring-1 hover:ring-slate-100'
}`}
            >
              <div className="flex items-center gap-3">

                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#ede9ff] text-[#5b46ff] relative">
                  {contact.avatar}
                  <span
                    className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(
                      contact.status
                    )} border-2 border-white`}
                  />
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-900 flex gap-2">
                    {contact.name}
                    <span className="text-xs text-slate-400">
                      {contact.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>

              {contact.unread > 0 && (
                <span className=" px-2 py-1 text-xs font-semibold ">
                  {contact.unread}
                </span>
              )}
            </button>
          ))}
    </div>
  </section>
);
}

export default ChatList;
