import { useState, useEffect, useMemo } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl" />
        <div className="relative bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-3 min-w-[80px]">
          <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400">
            {String(value).padStart(2, '0')}
          </div>
        </div>
      </div>
      <div className="text-xs md:text-sm text-purple-300 mt-2 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex gap-4 md:gap-6 justify-center items-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-3xl text-purple-400 animate-pulse">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-3xl text-purple-400 animate-pulse">:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="text-3xl text-purple-400 animate-pulse">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}