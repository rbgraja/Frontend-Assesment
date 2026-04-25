import { useEffect, useState } from 'react';
import { FiChevronDown, FiMail, FiUser, FiUsers, FiPlus, FiMessageSquare, FiPlus as FiAddIcon } from 'react-icons/fi';
import {
  Channel,
  ChannelProfile,
  ContactProfile,
  fetchChannelProfile,
  fetchContactProfile,
  saveNote,
} from '../api/dummyApi';
import { Skeleton } from './Skeleton';

type ActiveFilter = { type: 'none' | 'team' | 'user' | 'channel'; value: string };

type DetailsPanelProps = {
  loading?: boolean;
  contactId: string;
  activeFilter: ActiveFilter;
  channels: Channel[];
  onChannelSelect: (channelName: string) => void;
};

function DetailsPanel({ loading = false, contactId, activeFilter, channels, onChannelSelect }: DetailsPanelProps) {
  const [openSections, setOpenSections] = useState({ chatData: true, contactData: true, labels: true, notes: true, otherChats: true });
  const isChannel = activeFilter.type === 'channel';
  const otherChannelName = channels[0]?.name ?? 'Fit4Life';

  const [profile, setProfile] = useState<ContactProfile | null>(null);
  const [currentChannel, setCurrentChannel] = useState<ChannelProfile | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [showLabelInput, setShowLabelInput] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (isChannel) {
          setProfile(null);
          const channel = await fetchChannelProfile(activeFilter.value);
          setCurrentChannel(channel);
          setLabels([]);
          setNotes([]);
        } else {
          setCurrentChannel(null);
          const contact = await fetchContactProfile(contactId);
          setProfile(contact);
          setLabels(contact.labels ?? []);
          setNotes(contact.notes ?? []);
        }
      } catch (error) {
        console.error('Failed to load details profile', error);
      }
    };

    loadProfile();
  }, [contactId, activeFilter, isChannel]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [labelInput, setLabelInput] = useState('');

  const addLabel = () => {
    if (!labelInput.trim()) return;

    setLabels((prev) => [...prev, labelInput.trim()]);
    setLabelInput('');
    setShowLabelInput(false); // hide after add
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addLabel();
    }
  };

  const addNote = async () => {
    if (!noteInput.trim() || !profile) return;

    try {
      const savedNote = await saveNote(profile.id, noteInput.trim());
      setNotes((prev) => [...prev, savedNote]);
      setNoteInput('');
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNote();
    }
  };
  if (loading) {
    return (
      <aside className="h-full min-h-0 rounded-[32px] bg-white p-6 shadow-soft overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Skeleton className="h-12 w-12 rounded-3xl" />
        </div>

        <div className="h-full min-h-0 overflow-auto space-y-4 pb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <Skeleton className="h-6 w-36 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-[20px]" />
                <Skeleton className="h-10 w-full rounded-[20px]" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full min-h-0 rounded-[7px] bg-white shadow-soft overflow-hidden">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 p-[21px]">
        <div className="text-lg font-semibold tracking-tight text-slate-900">
          Details
        </div>
        <svg width="20" height="20" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.77193 0C9.74085 0 10.5263 0.785465 10.5263 1.75439V8.77193C10.5263 9.74085 9.74085 10.5263 8.77193 10.5263H1.75439C0.785464 10.5263 0 9.74085 0 8.77193V1.75439C0 0.785466 0.785464 0 1.75439 0H8.77193ZM7.30994 1.16959H8.77193C9.0949 1.16959 9.35672 1.43141 9.35672 1.75439V8.77193C9.35672 9.0949 9.0949 9.35672 8.77193 9.35672H7.30994V1.16959ZM6.14035 9.35672H1.75439C1.43141 9.35672 1.16959 9.0949 1.16959 8.77193V1.75439C1.16959 1.43141 1.43141 1.16959 1.75439 1.16959H6.14035V9.35672Z" fill="black"/>
        </svg>
      </div>

      <div className="h-full min-h-0 overflow-auto space-y-4 pb-6">
          <section className=" border-b border-slate-200">
            <button
              onClick={() => toggleSection('chatData')}
              className="flex w-full items-center justify-between gap-3  border-slate-200 px-5 py-4 text-left text-sm font-semibold text-slate-900"
            >
              <span className="flex items-center gap-3">
                {isChannel ? 'Channel Data' : 'Chat Data'}
              </span>
              <FiChevronDown className={`${openSections.chatData ? 'rotate-0' : 'rotate-180'} transition-transform `} />
            </button>
            {openSections.chatData && (
              <div className="space-y-3 px-5 py-4 text-sm text-slate-700">
                <div className="flex  items-center gap-4   py-3">
                  <div  className=" w-28 inline-flex items-center gap-2 text-slate-500">
                    
                    {isChannel ? 'Channel Name' : 'Assignee'}
                  </div>
                  <span className="font-semibold text-slate-900 flex gap-1"><svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.01754 0C6.54977 0 6.09202 0.0458655 5.64875 0.133557C5.26855 0.208772 5.02131 0.577958 5.09653 0.958158C5.17174 1.33836 5.54093 1.5856 5.92113 1.51038C6.27517 1.44034 6.64171 1.40351 7.01754 1.40351C7.39338 1.40351 7.75991 1.44034 8.11396 1.51038C8.49416 1.5856 8.86334 1.33836 8.93856 0.958158C9.01377 0.577958 8.76653 0.208772 8.38634 0.133557C7.94307 0.0458655 7.48531 0 7.01754 0Z" fill="black"/>
<path d="M10.9171 1.18242C10.595 0.966804 10.1592 1.05309 9.94356 1.37515C9.72795 1.69721 9.81424 2.13308 10.1363 2.34869C10.7488 2.75876 11.2763 3.28627 11.6864 3.89879C11.902 4.22085 12.3379 4.30714 12.6599 4.09153C12.982 3.87592 13.0683 3.44005 12.8527 3.11799C12.3405 2.35302 11.6821 1.69455 10.9171 1.18242Z" fill="black"/>
<path d="M3.89879 2.34869C4.22085 2.13308 4.30714 1.69721 4.09153 1.37515C3.87592 1.0531 3.44005 0.966804 3.11799 1.18242C2.35302 1.69455 1.69455 2.35302 1.18242 3.11799C0.966804 3.44005 1.05309 3.87592 1.37515 4.09153C1.69721 4.30714 2.13308 4.22085 2.34869 3.89879C2.75876 3.28627 3.28627 2.75876 3.89879 2.34869Z" fill="black"/>
<path d="M1.51038 5.92113C1.5856 5.54093 1.33836 5.17174 0.958158 5.09653C0.577958 5.02131 0.208772 5.26855 0.133557 5.64875C0.0458655 6.09202 0 6.54977 0 7.01754C0 7.48531 0.0458655 7.94307 0.133557 8.38634C0.208772 8.76653 0.577958 9.01377 0.958158 8.93856C1.33836 8.86334 1.5856 8.49416 1.51038 8.11396C1.44034 7.75991 1.40351 7.39338 1.40351 7.01754C1.40351 6.64171 1.44034 6.27517 1.51038 5.92113Z" fill="black"/>
<path d="M13.9015 5.64875C13.8263 5.26855 13.4571 5.02131 13.0769 5.09653C12.6967 5.17174 12.4495 5.54093 12.5247 5.92113C12.5947 6.27517 12.6316 6.64171 12.6316 7.01754C12.6316 7.39338 12.5947 7.75991 12.5247 8.11396C12.4495 8.49416 12.6967 8.86334 13.0769 8.93856C13.4571 9.01377 13.8263 8.76653 13.9015 8.38634C13.9892 7.94307 14.0351 7.48531 14.0351 7.01754C14.0351 6.54977 13.9892 6.09202 13.9015 5.64875Z" fill="black"/>
<path d="M12.8527 10.9171C13.0683 10.595 12.982 10.1592 12.6599 9.94356C12.3379 9.72795 11.902 9.81424 11.6864 10.1363C11.6288 10.2223 11.5689 10.3067 11.5067 10.3893C11.421 10.2864 11.3126 10.2021 11.1813 10.1365C10.5367 9.76218 9.85575 9.48668 9.1384 9.30994C8.42105 9.1332 7.68811 9.04484 6.93957 9.04484C6.19103 9.04484 5.45809 9.1332 4.74074 9.30994C4.02339 9.48668 3.34243 9.76218 2.69786 10.1365C2.61205 10.1841 2.53498 10.2405 2.46666 10.3057C2.42633 10.25 2.387 10.1935 2.34869 10.1363C2.13308 9.81424 1.69721 9.72795 1.37515 9.94356C1.0531 10.1592 0.966804 10.595 1.18242 10.9171C1.69455 11.6821 2.35302 12.3405 3.11799 12.8527C3.23794 12.933 3.37368 12.9714 3.50794 12.9714C3.80914 13.1758 4.1265 13.3537 4.46004 13.5049C4.82092 13.6685 5.19183 13.7942 5.57275 13.8821C5.59742 13.8899 5.62278 13.8964 5.64875 13.9015C5.69716 13.9111 5.74573 13.9202 5.79448 13.9288C6.16679 13.9996 6.54849 14.0351 6.93957 14.0351C6.95225 14.0351 6.96491 14.0351 6.97757 14.035C6.99089 14.0351 7.00421 14.0351 7.01754 14.0351C7.48531 14.0351 7.94307 13.9892 8.38634 13.9015C8.48223 13.8826 8.56968 13.8449 8.64562 13.793C8.90837 13.7156 9.1662 13.6195 9.4191 13.5049C9.75988 13.3504 10.0838 13.1681 10.3908 12.958C10.5669 12.9928 10.7562 12.9604 10.9171 12.8527C11.6821 12.3405 12.3405 11.6821 12.8527 10.9171Z" fill="black"/>
<path d="M8.70175 7.06433C8.21312 7.55296 7.62573 7.79727 6.93957 7.79727C6.25341 7.79727 5.66602 7.55296 5.17739 7.06433C4.68876 6.5757 4.44444 5.9883 4.44444 5.30214C4.44444 4.61598 4.68876 4.02859 5.17739 3.53996C5.66602 3.05133 6.25341 2.80702 6.93957 2.80702C7.62573 2.80702 8.21312 3.05133 8.70175 3.53996C9.19038 4.02859 9.4347 4.61598 9.4347 5.30214C9.4347 5.9883 9.19038 6.5757 8.70175 7.06433Z" fill="black"/>
</svg>
{isChannel ? currentChannel?.name ?? activeFilter.value : profile?.firstName ?? 'Unknown'}</span>
                </div>
                <div className="flex  items-center gap-4  py-3">
                  <div className="w-28  inline-flex items-center gap-2 text-slate-500">
               
                    Team
                  </div>
                  <span className="font-semibold text-slate-900 flex gap-1"><svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.01754 0C6.54977 0 6.09202 0.0458655 5.64875 0.133557C5.26855 0.208772 5.02131 0.577958 5.09653 0.958158C5.17174 1.33836 5.54093 1.5856 5.92113 1.51038C6.27517 1.44034 6.64171 1.40351 7.01754 1.40351C7.39338 1.40351 7.75991 1.44034 8.11396 1.51038C8.49416 1.5856 8.86334 1.33836 8.93856 0.958158C9.01377 0.577958 8.76653 0.208772 8.38634 0.133557C7.94307 0.0458655 7.48531 0 7.01754 0Z" fill="black"/>
<path d="M10.9171 1.18242C10.595 0.966804 10.1592 1.05309 9.94356 1.37515C9.72795 1.69721 9.81424 2.13308 10.1363 2.34869C10.7488 2.75876 11.2763 3.28627 11.6864 3.89879C11.902 4.22085 12.3379 4.30714 12.6599 4.09153C12.982 3.87592 13.0683 3.44005 12.8527 3.11799C12.3405 2.35302 11.6821 1.69455 10.9171 1.18242Z" fill="black"/>
<path d="M3.89879 2.34869C4.22085 2.13308 4.30714 1.69721 4.09153 1.37515C3.87592 1.0531 3.44005 0.966804 3.11799 1.18242C2.35302 1.69455 1.69455 2.35302 1.18242 3.11799C0.966804 3.44005 1.05309 3.87592 1.37515 4.09153C1.69721 4.30714 2.13308 4.22085 2.34869 3.89879C2.75876 3.28627 3.28627 2.75876 3.89879 2.34869Z" fill="black"/>
<path d="M1.51038 5.92113C1.5856 5.54093 1.33836 5.17174 0.958158 5.09653C0.577958 5.02131 0.208772 5.26855 0.133557 5.64875C0.0458655 6.09202 0 6.54977 0 7.01754C0 7.48531 0.0458655 7.94307 0.133557 8.38634C0.208772 8.76653 0.577958 9.01377 0.958158 8.93856C1.33836 8.86334 1.5856 8.49416 1.51038 8.11396C1.44034 7.75991 1.40351 7.39338 1.40351 7.01754C1.40351 6.64171 1.44034 6.27517 1.51038 5.92113Z" fill="black"/>
<path d="M13.9015 5.64875C13.8263 5.26855 13.4571 5.02131 13.0769 5.09653C12.6967 5.17174 12.4495 5.54093 12.5247 5.92113C12.5947 6.27517 12.6316 6.64171 12.6316 7.01754C12.6316 7.39338 12.5947 7.75991 12.5247 8.11396C12.4495 8.49416 12.6967 8.86334 13.0769 8.93856C13.4571 9.01377 13.8263 8.76653 13.9015 8.38634C13.9892 7.94307 14.0351 7.48531 14.0351 7.01754C14.0351 6.54977 13.9892 6.09202 13.9015 5.64875Z" fill="black"/>
<path d="M12.8527 10.9171C13.0683 10.595 12.982 10.1592 12.6599 9.94356C12.3379 9.72795 11.902 9.81424 11.6864 10.1363C11.6288 10.2223 11.5689 10.3067 11.5067 10.3893C11.421 10.2864 11.3126 10.2021 11.1813 10.1365C10.5367 9.76218 9.85575 9.48668 9.1384 9.30994C8.42105 9.1332 7.68811 9.04484 6.93957 9.04484C6.19103 9.04484 5.45809 9.1332 4.74074 9.30994C4.02339 9.48668 3.34243 9.76218 2.69786 10.1365C2.61205 10.1841 2.53498 10.2405 2.46666 10.3057C2.42633 10.25 2.387 10.1935 2.34869 10.1363C2.13308 9.81424 1.69721 9.72795 1.37515 9.94356C1.0531 10.1592 0.966804 10.595 1.18242 10.9171C1.69455 11.6821 2.35302 12.3405 3.11799 12.8527C3.23794 12.933 3.37368 12.9714 3.50794 12.9714C3.80914 13.1758 4.1265 13.3537 4.46004 13.5049C4.82092 13.6685 5.19183 13.7942 5.57275 13.8821C5.59742 13.8899 5.62278 13.8964 5.64875 13.9015C5.69716 13.9111 5.74573 13.9202 5.79448 13.9288C6.16679 13.9996 6.54849 14.0351 6.93957 14.0351C6.95225 14.0351 6.96491 14.0351 6.97757 14.035C6.99089 14.0351 7.00421 14.0351 7.01754 14.0351C7.48531 14.0351 7.94307 13.9892 8.38634 13.9015C8.48223 13.8826 8.56968 13.8449 8.64562 13.793C8.90837 13.7156 9.1662 13.6195 9.4191 13.5049C9.75988 13.3504 10.0838 13.1681 10.3908 12.958C10.5669 12.9928 10.7562 12.9604 10.9171 12.8527C11.6821 12.3405 12.3405 11.6821 12.8527 10.9171Z" fill="black"/>
<path d="M8.70175 7.06433C8.21312 7.55296 7.62573 7.79727 6.93957 7.79727C6.25341 7.79727 5.66602 7.55296 5.17739 7.06433C4.68876 6.5757 4.44444 5.9883 4.44444 5.30214C4.44444 4.61598 4.68876 4.02859 5.17739 3.53996C5.66602 3.05133 6.25341 2.80702 6.93957 2.80702C7.62573 2.80702 8.21312 3.05133 8.70175 3.53996C9.19038 4.02859 9.4347 4.61598 9.4347 5.30214C9.4347 5.9883 9.19038 6.5757 8.70175 7.06433Z" fill="black"/>
</svg>{isChannel ? currentChannel?.team ?? 'Platform' : profile?.team ?? 'Unknown'}</span>
                </div>
                {isChannel && (
                  <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="inline-flex items-center gap-2 text-slate-500">
                      <FiPlus className="text-slate-400" />
                      Members
                    </div>
                    <span className="font-semibold text-slate-900">{currentChannel?.members.length ?? 0} active</span>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className=" border-t-1 border-b border-slate-200">
            <button
              onClick={() => toggleSection('contactData')}
              className="flex w-full items-center justify-between gap-3  border-slate-200 px-5 py-4 text-left text-sm font-semibold text-slate-900"
            >
              <span>{isChannel ? 'Channel Info' : 'Contact Data'}</span>
              <FiChevronDown className={`${openSections.contactData ? 'rotate-0' : 'rotate-180'} transition-transform `} />
            </button>
            {openSections.contactData && (
              <div className="space-y-3 px-5 py-4 text-sm text-slate-700">
                {isChannel ? (
                  <>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Description</span>
                      <span className="font-semibold text-slate-900">{currentChannel?.description ?? 'Broadcast and announcement channel'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Members</span>
                      <span className="font-semibold text-slate-900">{currentChannel?.members.join(', ')}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Last Activity</span>
                      <span className="font-semibold text-slate-900">{currentChannel?.lastActivity}</span>
                    </div>
                    <button className="mt-3 text-sm font-semibold text-[#4338ca]">View channel info</button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">First Name</span>
                      <span className="font-semibold text-slate-900">{profile?.firstName ?? 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Last Name</span>
                      <span className="font-semibold text-slate-900">{profile?.lastName ?? 'Contact'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Phone number</span>
                      <span className="font-semibold text-slate-900">{profile?.phone ?? '+1 (000) 000-0000'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Email</span>
                      <span className="font-semibold text-slate-900">{profile?.email ?? 'unknown@example.com'}</span>
                    </div>
                    <button className="mt-3 text-sm font-semibold ">See all</button>
                  </>
                )}
              </div>
            )}
          </section>

<section className=" border-b border-slate-200 ">
  <button
    onClick={() => toggleSection('labels')}
    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-900"
  >
    <span>{isChannel ? 'Channel Labels' : 'Contact Labels'}</span>
    <FiChevronDown className={`${openSections.labels ? 'rotate-0' : 'rotate-180'} transition-transform`} />
  </button>

  {openSections.labels && (
    <div className="px-5 py-4 space-y-3">

      {/* Labels */}
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-[#E5F1FC]  flex items-center justify-center min-w-[125px] gap-[6px] border-2 border-[#007AEC] px-3 py-1 text-xs font-semibold text-[#007AEC]"
          ><svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.81974 0.232357C8.51252 0.295333 9.06138 0.844208 9.12435 1.53697L9.35079 4.0277C9.38952 4.45362 9.23705 4.87471 8.93464 5.17708L5.17708 8.93469C4.61436 9.49741 3.70196 9.49741 3.13921 8.93469L0.42206 6.2175C-0.140687 5.65479 -0.140687 4.74236 0.42206 4.17965L4.17965 0.422065C4.48201 0.119665 4.90311 -0.0327935 5.32903 0.00592459L7.81974 0.232357ZM8.16767 1.62394C8.14667 1.39302 7.9637 1.21006 7.73277 1.18907L5.24206 0.96264C5.10007 0.949737 4.95972 1.00055 4.8589 1.10135L1.10135 4.85895C0.913765 5.0465 0.913765 5.35065 1.10135 5.5382L3.81853 8.25539C4.00608 8.44295 4.31022 8.44295 4.49778 8.25539L8.25539 4.49783C8.35616 4.39701 8.40697 4.25666 8.39411 4.11467L8.16767 1.62394ZM6.53567 2.82106C6.34807 2.63348 6.04398 2.63348 5.85638 2.82106C5.66877 3.00864 5.66877 3.31277 5.85638 3.50035C6.04398 3.68793 6.34807 3.68793 6.53567 3.50035C6.72323 3.31277 6.72323 3.00864 6.53567 2.82106ZM5.17708 2.14177C5.73984 1.57903 6.65221 1.57903 7.21497 2.14177C7.77769 2.70452 7.77769 3.6169 7.21497 4.17965C6.65221 4.74236 5.73984 4.74236 5.17708 4.17965C4.61436 3.6169 4.61436 2.70452 5.17708 2.14177Z" fill="#007AEC"/>
</svg>

            {label}
          </span>
        ))}
      </div>

      {/* Input (only show when clicking +) */}
      {showLabelInput && (
        <input
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          onKeyDown={handleLabelKeyDown}
          autoFocus
          placeholder="Type label & press Enter"
          className="w-full rounded border px-3 py-2 text-sm"
        />
      )}

      {/* Add button */}
      <button
        onClick={() => setShowLabelInput(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4338ca] text-[#4338ca]"
      >
        <FiPlus size={16} />
      </button>

    </div>
  )}
</section>

          <section className=" border-b border-slate-200">
            <button
              onClick={() => toggleSection('notes')}
              className="flex w-full items-center justify-between gap-3  border-slate-200 px-5 py-4 text-left text-sm font-semibold text-slate-900"
            >
              <span>{isChannel ? 'Channel Notes' : 'Notes'}</span>
              <FiChevronDown className={`${openSections.notes ? 'rotate-0' : 'rotate-180'} transition-transform `} />
            </button>
            {openSections.notes && (
              <div className="space-y-3 px-5 py-4">
                <input
                  type="text"
                  placeholder="Add a note"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={handleNoteKeyDown}
                  className="w-full rounded-[5px] bg-[#F5E096] px-4 py-3 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition focus:bg-[#ffe8a3]"
                />
                {notes.map((note, index) => (
                  <div key={index} className="rounded-[5px] bg-[#F5E096] px-4 py-3 text-sm text-slate-700">
                    {note}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="  ">
            <button
              onClick={() => toggleSection('otherChats')}
              className="flex w-full items-center justify-between gap-3  border-slate-200 px-5 py-4 text-left text-sm font-semibold text-slate-900"
            >
              <span>Other Chats</span>
              <FiChevronDown className={`${openSections.otherChats ? 'rotate-0' : 'rotate-180'} transition-transform `} />
            </button>
            {openSections.otherChats && (
              <button
                onClick={() => !isChannel && onChannelSelect(otherChannelName)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50 active:bg-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-[linear-gradient(180deg,_#A032C2_0%,_#DB4186_44.23%,_#EF4C5E_69.71%,_#FF8646_100%)] text-white">
                  <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.6864 6.23623C3.82411 6.23623 3.12484 5.5382 3.12484 4.67745C3.12484 3.8167 3.82411 3.11867 4.6864 3.11867C5.54868 3.11867 6.24796 3.8167 6.24796 4.67745C6.24796 5.5382 5.54868 6.23623 4.6864 6.23623Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.1237 7.74041C8.88033 8.36915 8.38237 8.86623 7.75251 9.10916C7.45586 9.22415 7.114 9.30494 6.61604 9.32679C6.11606 9.34893 5.95709 9.35439 4.68468 9.35439C3.41228 9.35439 3.25301 9.34893 2.75332 9.32679C2.25536 9.30494 1.91494 9.22444 1.61657 9.10944C1.30524 8.99272 1.02155 8.80787 0.787116 8.5704C0.549224 8.33638 0.364325 8.05493 0.24538 7.7407C0.12989 7.44487 0.0492482 7.10304 0.0273599 6.60597C0.00547156 6.10718 0 5.94819 0 4.67806C0 3.40792 0.00547177 3.24894 0.0293761 2.74813C0.0512645 2.25106 0.131906 1.91124 0.247108 1.6134C0.364325 1.30291 0.549224 1.01973 0.787116 0.785714C1.02155 0.546234 1.30351 0.363389 1.6183 0.244655C1.91494 0.129659 2.25709 0.0491613 2.75505 0.027312C3.25474 0.00546268 3.41429 0 4.68641 0C5.95853 0 6.11779 0.00546289 6.6195 0.0293247C7.11746 0.051174 7.45788 0.131671 7.75625 0.246668C8.06758 0.363389 8.35127 0.547959 8.5857 0.785714C8.82532 1.01944 9.00849 1.3009 9.12744 1.61513C9.24264 1.91124 9.32328 2.25278 9.34517 2.74985C9.34892 2.83093 9.3518 2.90309 9.35439 2.97237V6.29347C9.35064 6.3915 9.34661 6.48925 9.34143 6.60569C9.31954 7.10276 9.2389 7.44257 9.1237 7.74041ZM7.18859 1.61886C7.49906 1.61886 7.75078 1.86984 7.75078 2.17976C7.75078 2.48967 7.49877 2.74065 7.18859 2.74065C6.87841 2.74065 6.6267 2.48938 6.6267 2.17976C6.6267 1.87013 6.87812 1.61886 7.18859 1.61886ZM7.24965 4.67719C7.24965 6.09792 6.09792 7.24965 4.67719 7.24965C3.25646 7.24965 2.10474 6.09792 2.10474 4.67719C2.10474 3.25646 3.25646 2.10474 4.67719 2.10474C6.09792 2.10474 7.24965 3.25646 7.24965 4.67719Z" fill="white"/>
</svg>

                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{otherChannelName}</div>
                </div>
              </button>
            )}
          </section>
        </div>
      </aside>
  );
}

export default DetailsPanel;
