import { useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiUsers, FiMail, FiBox, FiUser  } from 'react-icons/fi';
import { UserCircle2,User ,CircleUserRound  } from 'lucide-react';
import { Channel, Conversation } from '../api/dummyApi';
import { Skeleton } from './Skeleton';

type SidebarProps = {
  loading?: boolean;
  contacts: Conversation[];
  channels: Channel[];
  activeInbox: string;
  onInboxChange: (value: string) => void;
  activeFilter: { type: 'none' | 'team' | 'user' | 'channel'; value: string };
  onFilterChange: (filter: { type: 'none' | 'team' | 'user' | 'channel'; value: string }) => void;
};

const InboxIcon = (props: React.SVGProps<SVGSVGElement>) => (
<svg width="17" height="17" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.92398 2.33918C2.92398 1.71879 3.17043 1.12381 3.60911 0.68513C4.04779 0.246449 4.64277 0 5.26316 0C5.88355 0 6.47853 0.246449 6.91721 0.68513C7.35589 1.12381 7.60234 1.71879 7.60234 2.33918C7.60234 2.95957 7.35589 3.55455 6.91721 3.99323C6.47853 4.43191 5.88355 4.67836 5.26316 4.67836C4.64277 4.67836 4.04779 4.43191 3.60911 3.99323C3.17043 3.55455 2.92398 2.95957 2.92398 2.33918ZM2.92398 5.84795C2.14849 5.84795 1.40476 6.15601 0.856413 6.70437C0.308061 7.25272 0 7.99644 0 8.77193C0 9.23722 0.184837 9.68346 0.513848 10.0125C0.842859 10.3415 1.28909 10.5263 1.75439 10.5263H8.77193C9.23722 10.5263 9.68346 10.3415 10.0125 10.0125C10.3415 9.68346 10.5263 9.23722 10.5263 8.77193C10.5263 7.99644 10.2183 7.25272 9.6699 6.70437C9.12155 6.15601 8.37783 5.84795 7.60234 5.84795H2.92398Z" fill="black"/>
</svg>

);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5_497)">
<path d="M9.35738 6.43265C10.3281 6.43265 11.1059 5.64902 11.1059 4.67826C11.1059 3.7075 10.3281 2.92387 9.35738 2.92387C8.38662 2.92387 7.60299 3.7075 7.60299 4.67826C7.60299 5.64902 8.38662 6.43265 9.35738 6.43265ZM4.67902 6.43265C5.64978 6.43265 6.42755 5.64902 6.42755 4.67826C6.42755 3.7075 5.64978 2.92387 4.67902 2.92387C3.70826 2.92387 2.92463 3.7075 2.92463 4.67826C2.92463 5.64902 3.70826 6.43265 4.67902 6.43265ZM4.67902 7.60224C3.31644 7.60224 0.585449 8.28645 0.585449 9.64902V11.111H8.77258V9.64902C8.77258 8.28645 6.04159 7.60224 4.67902 7.60224ZM9.35738 7.60224C9.18779 7.60224 8.99481 7.61393 8.79013 7.63148C9.46849 8.1227 9.94217 8.78352 9.94217 9.64902V11.111H13.4509V9.64902C13.4509 8.28645 10.72 7.60224 9.35738 7.60224Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_5_497">
<rect width="14.0351" height="14.0351" fill="white"/>
</clipPath>
</defs>
</svg>

);

const UnassignedIcon = (props: React.SVGProps<SVGSVGElement>) => (
<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.01754 0C6.54977 0 6.09202 0.0458655 5.64875 0.133557C5.26855 0.208772 5.02131 0.577958 5.09653 0.958158C5.17174 1.33836 5.54093 1.5856 5.92113 1.51038C6.27517 1.44034 6.64171 1.40351 7.01754 1.40351C7.39338 1.40351 7.75991 1.44034 8.11396 1.51038C8.49416 1.5856 8.86334 1.33836 8.93856 0.958158C9.01377 0.577958 8.76653 0.208772 8.38634 0.133557C7.94307 0.0458655 7.48531 0 7.01754 0Z" fill="black"/>
<path d="M10.9171 1.18242C10.595 0.966804 10.1592 1.05309 9.94356 1.37515C9.72795 1.69721 9.81424 2.13308 10.1363 2.34869C10.7488 2.75876 11.2763 3.28627 11.6864 3.89879C11.902 4.22085 12.3379 4.30714 12.6599 4.09153C12.982 3.87592 13.0683 3.44005 12.8527 3.11799C12.3405 2.35302 11.6821 1.69455 10.9171 1.18242Z" fill="black"/>
<path d="M3.89879 2.34869C4.22085 2.13308 4.30714 1.69721 4.09153 1.37515C3.87592 1.0531 3.44005 0.966804 3.11799 1.18242C2.35302 1.69455 1.69455 2.35302 1.18242 3.11799C0.966804 3.44005 1.05309 3.87592 1.37515 4.09153C1.69721 4.30714 2.13308 4.22085 2.34869 3.89879C2.75876 3.28627 3.28627 2.75876 3.89879 2.34869Z" fill="black"/>
<path d="M1.51038 5.92113C1.5856 5.54093 1.33836 5.17174 0.958158 5.09653C0.577958 5.02131 0.208772 5.26855 0.133557 5.64875C0.0458655 6.09202 0 6.54977 0 7.01754C0 7.48531 0.0458655 7.94307 0.133557 8.38634C0.208772 8.76653 0.577958 9.01377 0.958158 8.93856C1.33836 8.86334 1.5856 8.49416 1.51038 8.11396C1.44034 7.75991 1.40351 7.39338 1.40351 7.01754C1.40351 6.64171 1.44034 6.27517 1.51038 5.92113Z" fill="black"/>
<path d="M13.9015 5.64875C13.8263 5.26855 13.4571 5.02131 13.0769 5.09653C12.6967 5.17174 12.4495 5.54093 12.5247 5.92113C12.5947 6.27517 12.6316 6.64171 12.6316 7.01754C12.6316 7.39338 12.5947 7.75991 12.5247 8.11396C12.4495 8.49416 12.6967 8.86334 13.0769 8.93856C13.4571 9.01377 13.8263 8.76653 13.9015 8.38634C13.9892 7.94307 14.0351 7.48531 14.0351 7.01754C14.0351 6.54977 13.9892 6.09202 13.9015 5.64875Z" fill="black"/>
<path d="M12.8527 10.9171C13.0683 10.595 12.982 10.1592 12.6599 9.94356C12.3379 9.72795 11.902 9.81424 11.6864 10.1363C11.6288 10.2223 11.5689 10.3067 11.5067 10.3893C11.421 10.2864 11.3126 10.2021 11.1813 10.1365C10.5367 9.76218 9.85575 9.48668 9.1384 9.30994C8.42105 9.1332 7.68811 9.04484 6.93957 9.04484C6.19103 9.04484 5.45809 9.1332 4.74074 9.30994C4.02339 9.48668 3.34243 9.76218 2.69786 10.1365C2.61205 10.1841 2.53498 10.2405 2.46666 10.3057C2.42633 10.25 2.387 10.1935 2.34869 10.1363C2.13308 9.81424 1.69721 9.72795 1.37515 9.94356C1.0531 10.1592 0.966804 10.595 1.18242 10.9171C1.69455 11.6821 2.35302 12.3405 3.11799 12.8527C3.23794 12.933 3.37368 12.9714 3.50794 12.9714C3.80914 13.1758 4.1265 13.3537 4.46004 13.5049C4.82092 13.6685 5.19183 13.7942 5.57275 13.8821C5.59742 13.8899 5.62278 13.8964 5.64875 13.9015C5.69716 13.9111 5.74573 13.9202 5.79448 13.9288C6.16679 13.9996 6.54849 14.0351 6.93957 14.0351C6.95225 14.0351 6.96491 14.0351 6.97757 14.035C6.99089 14.0351 7.00421 14.0351 7.01754 14.0351C7.48531 14.0351 7.94307 13.9892 8.38634 13.9015C8.48223 13.8826 8.56968 13.8449 8.64562 13.793C8.90837 13.7156 9.1662 13.6195 9.4191 13.5049C9.75988 13.3504 10.0838 13.1681 10.3908 12.958C10.5669 12.9928 10.7562 12.9604 10.9171 12.8527C11.6821 12.3405 12.3405 11.6821 12.8527 10.9171Z" fill="black"/>
<path d="M8.70175 7.06433C8.21312 7.55296 7.62573 7.79727 6.93957 7.79727C6.25341 7.79727 5.66602 7.55296 5.17739 7.06433C4.68876 6.5757 4.44444 5.9883 4.44444 5.30214C4.44444 4.61598 4.68876 4.02859 5.17739 3.53996C5.66602 3.05133 6.25341 2.80702 6.93957 2.80702C7.62573 2.80702 8.21312 3.05133 8.70175 3.53996C9.19038 4.02859 9.4347 4.61598 9.4347 5.30214C9.4347 5.9883 9.19038 6.5757 8.70175 7.06433Z" fill="black"/>
</svg>


);

function Sidebar({ loading = false, contacts, channels, activeInbox, onInboxChange, activeFilter, onFilterChange }: SidebarProps) {
  const [selectedNav, setSelectedNav] = useState(activeInbox);
  const [sections, setSections] = useState({ teams: true, users: true, channels: true });

  const inboxCount = contacts.filter((contact) => contact.unread > 0).length;
  const allCount = contacts.length;
  const unassignedCount = contacts.filter((contact) => contact.unread === 0).length;

  const navItems = [
    { label: 'My Inbox', badge: inboxCount, icon: InboxIcon },
    { label: 'All', badge: allCount, icon: UsersIcon },
    { label: 'Unassigned', badge: unassignedCount, icon: UnassignedIcon },
  ];

  const teams = useMemo(() => {
    const map = new Map<string, { name: string; count: number; contactId: string }>();
    contacts.forEach((contact) => {
      const key = contact.team || 'Other';
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { name: key, count: 1, contactId: contact.id });
      }
    });
    return Array.from(map.values());
  }, [contacts]);

  const users = useMemo(() => {
    const map = new Map<string, { name: string; count: number; contactId: string }>();

    contacts.forEach((contact) => {
      const name = contact.name;
      const existing = map.get(name);

      if (existing) {
        existing.count += 1;
      } else {
        map.set(name, { name, count: 1, contactId: contact.id });
      }
    });

    return Array.from(map.values());
  }, [contacts]);

  useEffect(() => {
    setSelectedNav(activeInbox);
  }, [activeInbox]);

  const toggleSection = (section: 'teams' | 'users' | 'channels') => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <aside className="bg-[#FAFAF8] p-6 shadow-soft">
        <div className="mb-8">
          <Skeleton className="h-9 w-28 mb-4 rounded-[18px]" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-[12px]" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-[#FAFAF8] p-6 shadow-soft">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Inbox</h1>
      </div>

      {/* NAV */}
      <div className="space-y-3">
  {navItems.map((item) => {
  const Icon = item.icon;
  const isActive = selectedNav === item.label;

  return (
    <button
      key={item.label}
      onClick={() => {
        setSelectedNav(item.label);
        onInboxChange(item.label);
        onFilterChange({ type: 'none', value: '' });
      }}
      className={`flex w-full items-center justify-between px-4 py-4 transition ${
        isActive
          ? 'bg-white border border-[#FAFAF8] shadow-sm rounded-[8px] text-slate-900'
          : 'bg-transparent text-slate-700'
      }`}
    >
      <span className="inline-flex items-center gap-3 font-medium">
        <span className="flex h-10 w-10 items-center justify-center">
          <Icon className="w-[18px] h-[18px]" />
        </span>
        {item.label}
      </span>

      <span className=" px-3 py-1 text-sm font-semibold ">
        {item.badge}
      </span>
    </button>
  );
})}
      </div>

      {/* TEAMS */}
      <div className="mt-8 ">
        <button
          onClick={() => toggleSection('teams')}
          className="mb-3 flex w-full items-center justify-between px-3 py-3 text-sm font-semibold text-slate-700"
        >
          <span>Teams</span>
          <FiChevronDown className={`${sections.teams ? 'rotate-0' : 'rotate-180'} transition-transform`} />
        </button>

        {sections.teams && (
          <div className="space-y-3">
            {teams.map((team) => (
              <button
                key={team.name}
                onClick={() => onFilterChange({ type: 'team', value: team.name })}
                className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition ${
                  activeFilter.type === 'team' && activeFilter.value === team.name
                    ? 'bg-white border border-[#FAFAF8] shadow-sm rounded-[8px] text-slate-900'
                    : 'bg-transparent text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.01787 1.16959C3.7898 1.16959 1.16992 3.78947 1.16992 7.01754C1.16992 10.2456 3.7898 12.8655 7.01787 12.8655C10.2459 12.8655 12.8658 10.2456 12.8658 7.01754C12.8658 3.78947 10.2459 1.16959 7.01787 1.16959ZM9.12898 4.87719C9.75472 4.87719 10.2576 5.38011 10.2576 6.00584C10.2576 6.63157 9.75472 7.1345 9.12898 7.1345C8.50325 7.1345 8.00033 6.63157 8.00033 6.00584C7.99448 5.38011 8.50325 4.87719 9.12898 4.87719ZM5.62021 3.95321C6.38045 3.95321 7.00033 4.57309 7.00033 5.33333C7.00033 6.09356 6.38045 6.71344 5.62021 6.71344C4.85998 6.71344 4.2401 6.09356 4.2401 5.33333C4.2401 4.56725 4.85413 3.95321 5.62021 3.95321ZM5.62021 9.29239V11.4854C4.2167 11.0468 3.10559 9.96491 2.61437 8.58479C3.2284 7.92982 4.76056 7.59649 5.62021 7.59649C5.93015 7.59649 6.32197 7.64327 6.73132 7.72514C5.77226 8.23391 5.62021 8.90643 5.62021 9.29239ZM7.01787 11.6959C6.85998 11.6959 6.70793 11.6901 6.55589 11.6725V9.29239C6.55589 8.46198 8.27518 8.04678 9.12898 8.04678C9.75472 8.04678 10.8366 8.27485 11.3746 8.71929C10.6904 10.4561 9.00033 11.6959 7.01787 11.6959Z" fill="#AFBFC0"/>
</svg>

                  {team.name}
                </span>

                <span className=" px-2.5 py-1 text-xs font-semibold ">
                  {team.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* USERS */}
      <div className="mt-8 ">
        <button
          onClick={() => toggleSection('users')}
          className="mb-3 flex w-full items-center justify-between px-3 py-3 text-sm font-semibold text-slate-700"
        >
          <span>Users</span>
          <FiChevronDown className={`${sections.users ? 'rotate-0' : 'rotate-180'} transition-transform`} />
        </button>

        {sections.users && (
          <div className="space-y-3 max-h-[340px] overflow-auto scrollbar-thin">
            {users.map((user) => (
              <button
                key={user.name}
                onClick={() => onFilterChange({ type: 'user', value: user.name })}
                className={`flex w-full items-center justify-between  py-3 transition ${
                  activeFilter.type === 'user' && activeFilter.value === user.name
                    ? 'bg-white border border-[#FAFAF8] shadow-sm rounded-[8px] text-slate-900'
                    : 'bg-transparent text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center ">
                    <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.84795 0C2.61988 0 0 2.61988 0 5.84795C0 9.07602 2.61988 11.6959 5.84795 11.6959C9.07602 11.6959 11.6959 9.07602 11.6959 5.84795C11.6959 2.61988 9.07602 0 5.84795 0ZM5.84795 2.33918C6.97661 2.33918 7.89474 3.25731 7.89474 4.38596C7.89474 5.51462 6.97661 6.43275 5.84795 6.43275C4.7193 6.43275 3.80117 5.51462 3.80117 4.38596C3.80117 3.25731 4.7193 2.33918 5.84795 2.33918ZM5.84795 10.5263C4.66082 10.5263 3.25731 10.0468 2.25731 8.8421C3.24561 8.07018 4.49123 7.60234 5.84795 7.60234C7.20468 7.60234 8.45029 8.07018 9.43859 8.8421C8.43859 10.0468 7.03509 10.5263 5.84795 10.5263Z" fill="#AFBFC0"/>
</svg>

                  </div>
                  <div className="text-sm font-medium">{user.name}</div>
                </div>

                <span className="rounded-full  px-3 py-1 text-xs font-semibold ">
                  {user.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CHANNELS (unchanged) */}
      <div className="mt-8 ">
        <button
          onClick={() => toggleSection('channels')}
          className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-slate-700"
        >
          <span>Channels</span>
          <FiChevronDown className={`${sections.channels ? 'rotate-0' : 'rotate-180'} transition-transform`} />
        </button>

        {sections.channels && (
          <div className="space-y-3">
            {channels.map((channel) => (
              <button
                key={channel.name}
                onClick={() => onFilterChange({ type: 'channel', value: channel.name })}
                className={`flex w-full   px-2 py-4 text-sm font-medium transition ${
                  activeFilter.type === 'channel' && activeFilter.value === channel.name
                    ? 'bg-white border border-[#FAFAF8] shadow-sm rounded-[8px]  bg-shadow text-slate-900'
                    : 'bg-transparent text-slate-700'
                }`}
              > 
                <span className='flex gap-5 text-left items-center'><svg width="20" height="20" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5_613)">
<path d="M0.200713 4.65615C0.200494 5.44804 0.407407 6.22126 0.800849 6.90279L0.163086 9.23137L2.5461 8.60654C3.20521 8.96535 3.94369 9.15336 4.69414 9.15341H4.69611C7.17348 9.15341 9.19011 7.13751 9.19117 4.6597C9.19165 3.45902 8.72449 2.32999 7.87572 1.48056C7.0271 0.631209 5.89846 0.163207 4.69593 0.162659C2.21826 0.162659 0.201773 2.17846 0.20075 4.65615" fill="url(#paint0_linear_5_613)"/>
<path d="M0.0400651 4.65467C0.0398093 5.47505 0.254138 6.27593 0.661608 6.98186L0.000976562 9.39391L2.46943 8.74669C3.14957 9.11752 3.91534 9.31303 4.69455 9.31332H4.69656C7.26281 9.31332 9.35189 7.2249 9.35299 4.6584C9.35343 3.41458 8.86946 2.24496 7.99037 1.3651C7.11117 0.485355 5.94217 0.000511438 4.69656 0C2.12987 0 0.0410879 2.08813 0.0400651 4.65467ZM1.51012 6.86029L1.41795 6.71398C1.0305 6.09791 0.825999 5.38599 0.826292 4.65496C0.827095 2.52172 2.56321 0.786153 4.69802 0.786153C5.73186 0.786592 6.70345 1.18961 7.43422 1.92082C8.16495 2.6521 8.56705 3.6242 8.5668 4.65811C8.56585 6.79135 6.8297 8.52713 4.69656 8.52713H4.69503C4.00046 8.52677 3.31926 8.34024 2.72519 7.98775L2.58381 7.90391L1.11898 8.28796L1.51012 6.86029Z" fill="url(#paint1_linear_5_613)"/>
<path d="M3.5333 2.70874C3.44614 2.51502 3.35441 2.51111 3.27152 2.50771C3.20364 2.50479 3.12605 2.50501 3.04853 2.50501C2.97094 2.50501 2.84487 2.5342 2.73831 2.65055C2.63163 2.76701 2.33105 3.04845 2.33105 3.62086C2.33105 4.19327 2.74799 4.7465 2.80611 4.8242C2.8643 4.90175 3.611 6.11401 4.79359 6.58037C5.77643 6.96793 5.97644 6.89085 6.18975 6.87141C6.40309 6.85205 6.87814 6.59005 6.97506 6.31836C7.07205 6.04672 7.07205 5.81387 7.04297 5.76521C7.01389 5.71673 6.9363 5.68762 6.81995 5.62946C6.7036 5.5713 6.13155 5.28979 6.02492 5.25096C5.91825 5.21216 5.84069 5.1928 5.7631 5.3093C5.6855 5.42561 5.4627 5.68762 5.39479 5.76521C5.32695 5.84298 5.25904 5.85266 5.14272 5.79447C5.0263 5.73609 4.6516 5.61338 4.20705 5.21706C3.86117 4.90866 3.62766 4.52782 3.55978 4.41132C3.49191 4.29501 3.55252 4.23195 3.61086 4.17398C3.66313 4.12185 3.72724 4.03812 3.78548 3.97021C3.84349 3.90226 3.86285 3.85378 3.90164 3.77619C3.94048 3.69852 3.92104 3.63057 3.892 3.57238C3.86285 3.51419 3.63676 2.93878 3.5333 2.70874Z" fill="white"/>
</g>
<defs>
<linearGradient id="paint0_linear_5_613" x1="451.568" y1="907.034" x2="451.568" y2="0.162659" gradientUnits="userSpaceOnUse">
<stop stop-color="#1FAF38"/>
<stop offset="1" stop-color="#60D669"/>
</linearGradient>
<linearGradient id="paint1_linear_5_613" x1="467.602" y1="939.391" x2="467.602" y2="0" gradientUnits="userSpaceOnUse">
<stop stop-color="#F9F9F9"/>
<stop offset="1" stop-color="white"/>
</linearGradient>
<clipPath id="clip0_5_613">
<rect width="9.35439" height="9.35439" fill="white"/>
</clipPath>
</defs>
</svg>


{channel.name}</span>
               
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;