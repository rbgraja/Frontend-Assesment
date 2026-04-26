import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Message, Conversation } from '../api/dummyApi';
import { Skeleton } from './Skeleton';

const CheckmarkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="3" r="1.5" fill="currentColor" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    <circle cx="9" cy="15" r="1.5" fill="currentColor" />
  </svg>
);

const Download = () => (
<svg width="18" height="18" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.69591 0.467836C1.91679 0.173327 2.26344 0 2.63158 0H7.89474C8.26287 0 8.60953 0.173326 8.83041 0.467836L10.4094 2.5731C10.4853 2.67433 10.5263 2.79744 10.5263 2.92398V8.77193C10.5263 9.74085 9.74085 10.5263 8.77193 10.5263H1.75439C0.785465 10.5263 0 9.74085 0 8.77193V2.92398C0 2.79744 0.0410397 2.67433 0.116959 2.5731L1.69591 0.467836ZM8.07018 1.40351C7.95973 1.25625 7.78641 1.16959 7.60234 1.16959H2.92398C2.73991 1.16959 2.56658 1.25625 2.45614 1.40351L1.75439 2.33918H8.77193L8.07018 1.40351ZM9.35672 3.50877H1.16959V8.77193C1.16959 9.0949 1.43141 9.35672 1.75439 9.35672H8.77193C9.0949 9.35672 9.35672 9.0949 9.35672 8.77193V3.50877ZM5.26316 4.09357C5.58613 4.09357 5.84795 4.35539 5.84795 4.67836V6.77531L6.31163 6.31163C6.54001 6.08326 6.91028 6.08326 7.13866 6.31163C7.36704 6.54001 7.36704 6.91028 7.13866 7.13866L5.67667 8.60065C5.44829 8.82902 5.07802 8.82902 4.84965 8.60065L3.38766 7.13866C3.15928 6.91028 3.15928 6.54001 3.38766 6.31163C3.61603 6.08326 3.98631 6.08326 4.21468 6.31163L4.67836 6.77531V4.67836C4.67836 4.35539 4.94018 4.09357 5.26316 4.09357Z" fill="white"/>
</svg>

);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8L14 2L8 14L6.5 9.5L2 8Z" fill="currentColor" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8V12C3 13.66 4.34 15 6 15H12C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C11.4 3 10.84 3.16 10.35 3.44M3 8L10.5 0.5C10.89 0.11 11.51 0.11 11.9 0.5L13.32 1.92C13.71 2.31 13.71 2.93 13.32 3.32L6 10.64" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SmileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="5.5" cy="6.5" r="1" fill="currentColor" />
    <circle cx="10.5" cy="6.5" r="1" fill="currentColor" />
    <path d="M5 11C6 12 7 12.5 8 12.5C9 12.5 10 12 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="5" cy="5" r="1.5" fill="currentColor" />
    <path d="M2 10L5 7L9 11L14 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1C5.24 1 3 3.24 3 6C3 9.5 8 15 8 15S13 9.5 13 6C13 3.24 10.76 1 8 1ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z" fill="currentColor" />
  </svg>
);

const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 11C9.66 11 11 9.66 11 8V3C11 1.34 9.66 0 8 0C6.34 0 5 1.34 5 3V8C5 9.66 6.34 11 8 11ZM13.3 8C13.3 10.46 11.3 12.46 8.84 12.46C6.38 12.46 4.38 10.46 4.38 8H3C3 11.53 5.61 14.5 9 14.9V16H7V14.9C10.39 14.5 13 11.53 13 8H13.3Z" fill="currentColor" />
  </svg>
);

const Darktheme = () => (
<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.0241 7.75251C11.9164 7.72548 11.8087 7.75251 11.7145 7.82009C11.3645 8.11746 10.9607 8.36076 10.5165 8.52296C10.0993 8.68516 9.64161 8.76626 9.15704 8.76626C8.06676 8.76626 7.0707 8.32021 6.35731 7.60383C5.64392 6.88744 5.19973 5.88721 5.19973 4.79236C5.19973 4.3328 5.28049 3.88675 5.41509 3.48125C5.56316 3.04871 5.77852 2.65673 6.06118 2.31881C6.18233 2.17013 6.15541 1.95386 6.00734 1.83221C5.91312 1.76463 5.80544 1.7376 5.69776 1.76463C4.55364 2.07551 3.55758 2.76486 2.84419 3.684C2.15771 4.58961 1.75391 5.7115 1.75391 6.92799C1.75391 8.40131 2.34616 9.73946 3.31529 10.7127C4.28443 11.6859 5.60354 12.2806 7.08416 12.2806C8.3225 12.2806 9.46663 11.8481 10.3819 11.1317C11.3107 10.4018 11.9837 9.36099 12.2664 8.17153C12.3202 7.98229 12.2125 7.79306 12.0241 7.75251Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.62528 3.21626C8.43141 3.21626 8.24548 3.13924 8.10839 3.00216C7.9713 2.86507 7.89429 2.67914 7.89429 2.48527C7.89429 2.29139 7.9713 2.10546 8.10839 1.96838C8.24548 1.83129 8.43141 1.75427 8.62528 1.75427H11.5493C11.6938 1.7543 11.8351 1.79719 11.9553 1.87752C12.0755 1.95784 12.1691 2.072 12.2245 2.20555C12.2798 2.3391 12.2943 2.48605 12.2661 2.62783C12.2379 2.76961 12.1683 2.89985 12.0661 3.00208L10.3899 4.67825H11.5493C11.7431 4.67825 11.9291 4.75526 12.0661 4.89235C12.2032 5.02944 12.2803 5.21537 12.2803 5.40924C12.2803 5.60311 12.2032 5.78904 12.0661 5.92613C11.9291 6.06322 11.7431 6.14024 11.5493 6.14024H8.62528C8.48073 6.14021 8.33943 6.09732 8.21924 6.01699C8.09906 5.93667 8.00539 5.82251 7.95008 5.68896C7.89476 5.55541 7.88029 5.40845 7.90848 5.26668C7.93667 5.1249 8.00627 4.99466 8.10847 4.89243L9.78464 3.21626H8.62528Z" fill="black"/>
</svg>


);

function ChatBubble({
  sender,
  text,
  time,
  status,
}: {
  sender: 'me' | 'them';
  text: string;
  time: string;
  status?: string;
}) {
  const isMe = sender === 'me';

  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
      
      {/* Message container */}
      
      <div className={`flex  gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : ''}`}>
        
        {/* Bubble */}
        <div
          className={`
            px-4 py-3 text-sm leading-6
            bg-[#e9e2ff] text-slate-900
            rounded-[16px]
            ${isMe ? 'rounded-br-[6px]' : 'rounded-bl-[6px]'}
          `}
        >
          <p>{text}</p>
        </div>

        {/* Time + status */}
        <div className="flex flex-col text-[10px] text-slate-400 items-center">
          <span>{time}</span>

          {isMe && (
            <span className="flex items-center gap-[2px]">
              <svg width="15" height="15" viewBox="0 0 11 7" fill="none">
                <path
                  d="M8.22924 0.659649L7.56959 0L4.60351 2.96608L5.26316 3.62573L8.22924 0.659649ZM10.2129 0L5.26316 4.94971L3.3076 2.99883L2.64795 3.65848L5.26316 6.27368L10.8772 0.659649L10.2129 0ZM0 3.65848L2.61521 6.27368L3.27485 5.61404L0.664328 2.99883L0 3.65848Z"
                  fill="#4FB6EC"
                />
              </svg>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

interface ChatWindowProps {
  loading?: boolean;
  contact: Conversation;
  messages: Message[];
  onSendMessage?: (text: string) => void;
  onBack?: () => void;
}

function ChatWindow({ loading = false, contact, messages, onSendMessage, onBack }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage?.(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onSendMessage?.(`📎 File sent: ${files[0].name}`);
      e.target.value = '';
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onSendMessage?.(`🖼️ Image sent: ${files[0].name}`);
      e.target.value = '';
    }
  };

  const handleVoiceSend = () => {
    onSendMessage?.('🎙️ Voice note sent');
  };

  if (loading) {
    return (
      <section className="rounded-[7px] bg-white p-6 shadow-soft">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Skeleton className="h-4 w-44 mb-3" />
            <Skeleton className="h-8 w-52" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>

        <Skeleton className="mb-6 h-4 w-48 rounded-full bg-slate-200" />
        <Skeleton className="mb-6 h-24 w-full rounded-[30px]" />

        <div className="mb-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className={`${index % 2 === 0 ? 'ml-auto' : ''} h-24 w-[70%] rounded-[28px]`} />
          ))}
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-[#f8f9fd] p-4">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-12 w-12" />
            <Skeleton className="min-w-0 flex-1 h-12 rounded-3xl" />
            <Skeleton className="h-12 w-12" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="max-h-[900px] rounded-[7px] bg-white  shadow-soft flex flex-col">
      <div className="mb-6 flex flex-wrap items-center p-[21px] justify-between gap-4 border-b border-slate-200 pb-5">
        {onBack && (
          <button onClick={onBack} className="md:hidden p-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <div>
          <div className="text-lg font-semibold tracking-tight text-slate-900">{contact?.name ?? 'Loading...'}</div>
        
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-[5px] bg-slate-100 text-slate-600 transition hover:bg-slate-200">
            <DotsIcon />
          </button>
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-[5px] bg-slate-100 text-slate-600 transition hover:bg-slate-200">
            <Darktheme />
          </button>
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-[5px]  bg-[#000000] text-slate-600 transition">
            <Download />
          </button>
        </div>
      </div>

      <div className="mb-6 flex px-6  justify-center">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">28 August 2025</span>
      </div>

      <div className="mb-6 flex-1  px-6 overflow-auto pr-2 scrollbar-thin">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} sender={message.sender} text={message.text} time={message.time} status={message.status} />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

<div className="rounded-[10px] border  m-6 shadow bg-[#fff] px-4 py-3">
  {/* Top Input */}
  <div className="flex items-center mt-[15px] mb-[15px] gap-3">
    <input
      ref={fileInputRef}
      type="file"
      className="hidden"
      onChange={handleFileUpload}
    />
    <input
      ref={imageInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageUpload}
    />

    <input
      type="text"
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder="Type something...."
      className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
    />
  </div>

  {/* Bottom Icons Row */}
  <div className="mt-3 flex items-center justify-between">
    {/* Left Icons */}
    <div className="flex items-center gap-3 text-slate-500">
      <button onClick={() => fileInputRef.current?.click()}>
        <svg width="22" height="22" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.24758 5.66253C5.98652 5.92352 5.63252 6.07019 5.26339 6.07019C4.89426 6.07019 4.54025 5.92352 4.27923 5.66253C4.01822 5.40151 3.87158 5.0475 3.87158 4.67837C3.87158 4.30924 4.01822 3.95523 4.27923 3.69421C4.54025 3.43319 4.89426 3.28656 5.26339 3.28656C5.63252 3.28656 5.98652 3.43319 6.24758 3.69421C6.50857 3.95523 6.65518 4.30924 6.65518 4.67837C6.65518 5.0475 6.50857 5.40151 6.24758 5.66253Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.16943 4.09359C1.16943 2.47873 2.47854 1.16962 4.09341 1.16962H9.94136C11.5562 1.16962 12.8653 2.47873 12.8653 4.09359V9.94155C12.8653 11.5564 11.5562 12.8655 9.94136 12.8655H4.09341C2.47854 12.8655 1.16943 11.5564 1.16943 9.94155V4.09359ZM4.09341 2.33921C3.12449 2.33921 2.33902 3.12468 2.33902 4.09359V9.94155C2.33902 10.1369 2.37094 10.3247 2.42983 10.5001L4.43844 9.15213C4.90628 8.83634 5.56709 8.87143 5.9823 9.234L6.18113 9.39775C6.63727 9.78956 7.37411 9.78956 7.83025 9.39775L10.263 7.31003C10.6524 6.97546 11.2465 6.92658 11.6957 7.16324V4.09359C11.6957 3.12468 10.9103 2.33921 9.94136 2.33921H4.09341Z" fill="black"/>
</svg>

      </button>
      <button onClick={() => imageInputRef.current?.click()}>
 <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 2.92398C0 1.30911 1.30911 0 2.92398 0H8.77193C10.3868 0 11.6959 1.30911 11.6959 2.92398V8.77193C11.6959 10.3868 10.3868 11.6959 8.77193 11.6959H2.92398C1.30911 11.6959 0 10.3868 0 8.77193V2.92398ZM2.92398 1.16959C1.95506 1.16959 1.16959 1.95506 1.16959 2.92398V8.77193C1.16959 9.74088 1.95506 10.5263 2.92398 10.5263H8.77193C9.74088 10.5263 10.5263 9.74088 10.5263 8.77193V2.92398C10.5263 1.95506 9.74088 1.16959 8.77193 1.16959H2.92398ZM3.50877 4.3433V7.35257C3.50877 8.00468 4.19501 8.42883 4.77825 8.13719L7.78754 6.63251C8.43409 6.3093 8.43409 5.38661 7.78754 5.06339L4.77825 3.55872C4.19501 3.2671 3.50877 3.69122 3.50877 4.3433Z" fill="black"/>
</svg>

      </button>
      <button onClick={() => imageInputRef.current?.click()}>
<svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.92398 1.16959C1.95506 1.16959 1.16959 1.95506 1.16959 2.92398V8.77193C1.16959 9.74088 1.95506 10.5263 2.92398 10.5263H7.45614V9.37901C7.45614 8.31708 8.31708 7.45614 9.37901 7.45614H10.5263V2.92398C10.5263 1.95505 9.74088 1.16959 8.77193 1.16959H2.92398ZM10.4104 8.62573H9.37901C8.96298 8.62573 8.62573 8.96298 8.62573 9.37901V10.4104L8.62754 10.4096C8.81357 10.3326 8.98251 10.2197 9.12485 10.0774L10.0773 9.12485C10.2197 8.98251 10.3326 8.81357 10.4096 8.62754L10.4104 8.62573ZM0 2.92398C0 1.30911 1.30911 0 2.92398 0H8.77193C10.3868 0 11.6959 1.30911 11.6959 2.92398V8.04094C11.6959 8.39585 11.626 8.74725 11.4902 9.07515C11.3544 9.40304 11.1553 9.70094 10.9043 9.95193L9.95193 10.9043C9.70099 11.1553 9.40304 11.3544 9.07515 11.4902C8.74725 11.626 8.39585 11.6959 8.04094 11.6959H2.92398C1.30911 11.6959 0 10.3868 0 8.77193V2.92398ZM2.63158 3.21637C2.63158 2.8934 2.8934 2.63158 3.21637 2.63158H8.47953C8.80251 2.63158 9.06433 2.8934 9.06433 3.21637C9.06433 3.53934 8.80251 3.80117 8.47953 3.80117H3.21637C2.8934 3.80117 2.63158 3.53934 2.63158 3.21637ZM2.63158 5.84795C2.63158 5.52497 2.8934 5.26316 3.21637 5.26316H8.47953C8.80251 5.26316 9.06433 5.52497 9.06433 5.84795C9.06433 6.17094 8.80251 6.43275 8.47953 6.43275H3.21637C2.8934 6.43275 2.63158 6.17094 2.63158 5.84795ZM2.63158 8.47953C2.63158 8.15655 2.8934 7.89474 3.21637 7.89474H6.14035C6.46333 7.89474 6.72515 8.15655 6.72515 8.47953C6.72515 8.80251 6.46333 9.06433 6.14035 9.06433H3.21637C2.8934 9.06433 2.63158 8.80251 2.63158 8.47953Z" fill="black"/>
</svg>


      </button>
<button onClick={() => setInputText((prev) => prev + '😊')}>
<svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.02339 4.64327L4.33333 4.95322C4.50292 5.12281 4.78363 5.12281 4.95322 4.95322C5.12281 4.78363 5.12281 4.50292 4.95322 4.33333L4.4386 3.81871C4.38449 3.7645 4.32023 3.72149 4.24949 3.69214C4.17874 3.6628 4.10291 3.64769 4.02632 3.64769C3.94973 3.64769 3.87389 3.6628 3.80314 3.69214C3.7324 3.72149 3.66814 3.7645 3.61404 3.81871L3.09357 4.33333C2.92398 4.50292 2.92398 4.78363 3.09357 4.95322C3.26316 5.12281 3.54386 5.12281 3.71345 4.95322L4.02339 4.64327ZM5.84795 9.06433C7.03509 9.06433 8.07018 8.4152 8.62573 7.45614C8.73684 7.26316 8.59649 7.01754 8.36842 7.01754H3.32749C3.10526 7.01754 2.95906 7.26316 3.07018 7.45614C3.62573 8.4152 4.66082 9.06433 5.84795 9.06433ZM6.74269 4.95322C6.91228 5.12281 7.19298 5.12281 7.36257 4.95322L7.67251 4.64327L7.98246 4.95322C8.15205 5.12281 8.43275 5.12281 8.60234 4.95322C8.77193 4.78363 8.77193 4.50292 8.60234 4.33333L8.08772 3.81871C8.03362 3.7645 7.96936 3.72149 7.89861 3.69214C7.82787 3.6628 7.75203 3.64769 7.67544 3.64769C7.59885 3.64769 7.52301 3.6628 7.45227 3.69214C7.38152 3.72149 7.31726 3.7645 7.26316 3.81871L6.74854 4.33333C6.5731 4.50292 6.5731 4.78363 6.74269 4.95322ZM5.8421 0C2.61403 0 0 2.61403 0 5.84795C0 9.08187 2.61403 11.6959 5.8421 11.6959C9.07018 11.6959 11.6959 9.08187 11.6959 5.84795C11.6959 2.61403 9.07602 0 5.8421 0ZM5.84795 10.5263C3.26316 10.5263 1.16959 8.43275 1.16959 5.84795C1.16959 3.26316 3.26316 1.16959 5.84795 1.16959C8.43275 1.16959 10.5263 3.26316 10.5263 5.84795C10.5263 8.43275 8.43275 10.5263 5.84795 10.5263Z" fill="black"/>
</svg>



</button>
      <button>
      <svg width="20" height="20" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.85526 1.51697V0.587141C3.85526 0.0666735 3.22368 -0.196484 2.85526 0.171937L0.171053 2.85615C-0.0570175 3.08422 -0.0570175 3.45264 0.171053 3.68071L2.85526 6.36492C3.22368 6.73334 3.85526 6.47603 3.85526 5.95556V4.96726C6.77924 4.96726 8.82602 5.90293 10.288 7.94971C9.70322 5.02574 7.94883 2.10176 3.85526 1.51697Z" fill="black"/>
</svg>

      </button>
    </div>

    {/* Right Icons */}
    <div className="flex items-center gap-3 text-slate-600">
      <button>
      <svg width="20" height="20" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.07579 2.30793L1.82877 5.55491H3.18304C3.64824 5.55491 3.98415 6.00023 3.85637 6.4476L3.35041 8.21836L6.59743 4.97134H5.24316C4.77795 4.97134 4.44205 4.52608 4.56982 4.07871L5.07579 2.30793ZM5.52444 0.208683C6.03538 -0.302276 6.89146 0.201449 6.69298 0.896239L5.8621 3.80424H7.7245C8.34836 3.80424 8.66082 4.55854 8.21971 4.99971L2.90175 10.3177C2.39079 10.8286 1.53472 10.3249 1.73324 9.63006L2.5641 6.72205H0.701683C0.077806 6.72205 -0.234645 5.96778 0.206513 5.52661L5.52444 0.208683Z" fill="black"/>
</svg>


      </button>
      <button onClick={handleVoiceSend}>
   <svg width="20" height="20" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.0473 7.01754C5.01806 7.01754 5.80169 6.23392 5.80169 5.26316V1.75439C5.80169 0.783626 5.01806 0 4.0473 0C3.07654 0 2.29292 0.783626 2.29292 1.75439V5.26316C2.29292 6.23392 3.07654 7.01754 4.0473 7.01754ZM7.50344 5.26316C7.21689 5.26316 6.97713 5.47368 6.93034 5.76023C6.69058 7.1345 5.49174 8.18713 4.0473 8.18713C2.60286 8.18713 1.40403 7.1345 1.16426 5.76023C1.11748 5.47368 0.877711 5.26316 0.591161 5.26316C0.234436 5.26316 -0.0462661 5.57895 0.00636546 5.92982C0.292915 7.68421 1.69642 9.05848 3.46251 9.30994V10.5263C3.46251 10.848 3.72566 11.1111 4.0473 11.1111C4.36894 11.1111 4.6321 10.848 4.6321 10.5263V9.30994C6.39818 9.05848 7.80169 7.68421 8.08824 5.92982C8.14672 5.57895 7.86017 5.26316 7.50344 5.26316Z" fill="black"/>
</svg>


      </button>
    </div>
  </div>
</div>
    </section>
  );
}

export default ChatWindow;
