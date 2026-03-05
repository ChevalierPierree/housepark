'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS_FR = ['L','M','M','J','V','S','D'];

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function isSameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function isInRange(day: Date, s: Date, e: Date) { return day > s && day < e; }
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDow(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

export function fmtDateFR(d: Date) {
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()].slice(0, 3)}.`;
}

export function dateToISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ─── Mois calendrier ─────────────────────────────────────────────────────────
interface CalMonthProps {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  hover: Date | null;
  onDay: (d: Date) => void;
  onHover: (d: Date | null) => void;
}

function CalendarMonth({ year, month, checkIn, checkOut, hover, onDay, onHover }: CalMonthProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDow(year, month);
  const today = startOfDay(new Date());
  const rangeEnd = checkOut || hover;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 mb-1">
        {DAYS_FR.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-gray-400 pb-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} className="h-9" />;
          const isPast = day < today;
          const isStart = !!checkIn && isSameDay(day, checkIn);
          const isEnd = !!checkOut && isSameDay(day, checkOut);
          const inRange = !!checkIn && !!rangeEnd && !checkOut && isInRange(day, checkIn, rangeEnd);
          const inFinalRange = !!checkIn && !!checkOut && isInRange(day, checkIn, checkOut);
          const highlighted = inRange || inFinalRange;

          return (
            <div
              key={day.toISOString()}
              className={`h-9 flex items-center justify-center
                ${highlighted ? 'bg-primary/20' : ''}
                ${isStart && (checkOut || (hover && checkIn && hover > checkIn)) ? 'rounded-l-full' : ''}
                ${isEnd ? 'rounded-r-full' : ''}
              `}
            >
              <button
                type="button"
                disabled={isPast}
                onClick={() => !isPast && onDay(day)}
                onMouseEnter={() => !isPast && onHover(day)}
                onMouseLeave={() => onHover(null)}
                className={`w-8 h-8 text-xs rounded-full flex items-center justify-center transition-all duration-100 select-none
                  ${isPast ? 'text-gray-300 cursor-default' : 'cursor-pointer'}
                  ${isStart || isEnd ? 'bg-[#055043] text-white font-bold shadow-sm' : ''}
                  ${!isStart && !isEnd && !isPast ? 'hover:bg-gray-100' : ''}
                `}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
interface BookingCalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
}

export default function BookingCalendar({ checkIn, checkOut, onChange }: BookingCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hover, setHover] = useState<Date | null>(null);

  function handleDay(day: Date) {
    if (!checkIn || checkOut || day <= checkIn) {
      // reset ou point de départ
      onChange(day, null);
    } else {
      // sélection du départ
      onChange(checkIn, day);
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const isPrevDisabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  // Label sélection
  const labelIn = checkIn ? fmtDateFR(checkIn) : 'Arrivée';
  const labelOut = checkOut ? fmtDateFR(checkOut) : 'Départ';

  return (
    <div className="w-full">
      {/* Pills arrivée / départ */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className={`rounded-xl border px-3 py-2 text-center transition-colors ${checkIn ? 'border-[#055043] bg-[#055043]/5' : 'border-gray-200 bg-gray-50'}`}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Arrivée</p>
          <p className={`text-sm font-semibold ${checkIn ? 'text-[#055043]' : 'text-gray-400'}`}>{labelIn}</p>
        </div>
        <div className={`rounded-xl border px-3 py-2 text-center transition-colors ${checkOut ? 'border-[#055043] bg-[#055043]/5' : 'border-dashed border-gray-200 bg-gray-50'}`}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Départ</p>
          <p className={`text-sm font-semibold ${checkOut ? 'text-[#055043]' : 'text-gray-400'}`}>{labelOut}</p>
        </div>
      </div>

      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-1">
        <button
          type="button"
          onClick={prevMonth}
          disabled={isPrevDisabled}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-dark">
          {MONTHS_FR[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <CalendarMonth
        year={viewYear}
        month={viewMonth}
        checkIn={checkIn}
        checkOut={checkOut}
        hover={hover}
        onDay={handleDay}
        onHover={setHover}
      />

      {/* Reset */}
      {(checkIn || checkOut) && (
        <button
          type="button"
          onClick={() => onChange(null, null)}
          className="mt-3 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
        >
          Effacer les dates
        </button>
      )}
    </div>
  );
}
