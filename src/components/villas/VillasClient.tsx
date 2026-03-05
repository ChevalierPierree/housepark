'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Search, MapPin, Users, ChevronDown, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import VillaCard from '@/components/villas/VillaCard';
import type { Villa, Extra } from '@/lib/types';

// ─── Helpers calendrier ────────────────────────────────────────────────────
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS_FR = ['L','M','M','J','V','S','D'];

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function isSameDay(a: Date, b: Date) { return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function isInRange(day: Date, s: Date, e: Date) { return day > s && day < e; }
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDow(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function fmtShort(d: Date) { return `${d.getDate()} ${MONTHS_FR[d.getMonth()].slice(0, 3)}.`; }

// ─── CalendarMonth ─────────────────────────────────────────────────────────
interface CalMonthProps {
  year: number; month: number;
  checkIn: Date | null; checkOut: Date | null; hover: Date | null;
  onDay: (d: Date) => void; onHover: (d: Date | null) => void;
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
    <div className="flex-1 min-w-[240px]">
      <p className="text-center font-bold text-dark text-sm mb-4">
        {MONTHS_FR[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_FR.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-gray-400 pb-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} className="h-10" />;
          const isPast = day < today;
          const isStart = !!checkIn && isSameDay(day, checkIn);
          const isEnd = !!checkOut && isSameDay(day, checkOut);
          const inRange = !!checkIn && !!rangeEnd && !checkOut && isInRange(day, checkIn, rangeEnd);
          const inFinalRange = !!checkIn && !!checkOut && isInRange(day, checkIn, checkOut);
          const highlighted = inRange || inFinalRange;

          return (
            <div key={day.toISOString()}
              className={`h-10 flex items-center justify-center
                ${highlighted ? 'bg-primary/20' : ''}
                ${isStart && (checkOut || (hover && hover > checkIn!)) ? 'rounded-l-full' : ''}
                ${isEnd ? 'rounded-r-full' : ''}
                ${!isStart && !isEnd && !highlighted && hover && checkIn && isSameDay(day, hover) && day > checkIn ? 'rounded-full' : ''}
              `}
            >
              <button
                disabled={isPast}
                onClick={() => !isPast && onDay(day)}
                onMouseEnter={() => !isPast && onHover(day)}
                onMouseLeave={() => onHover(null)}
                className={`w-9 h-9 text-sm rounded-full flex items-center justify-center transition-all duration-100 select-none
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

interface VillasClientProps {
  villas: Villa[];
  allExtras: Extra[];
  allActivities: string[];
  allLocations: string[];
}

type SortOption = 'relevance' | 'price_asc' | 'capacity_desc';

export default function VillasClient({
  villas,
  allExtras,
  allActivities,
  allLocations,
}: VillasClientProps) {
  const [showFilters, setShowFilters] = useState(false);

  // États brouillon (inputs)
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('relevance');

  // Calendrier (brouillon)
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  // États appliqués (utilisés par le filtre)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedLocation, setAppliedLocation] = useState('');
  const [appliedGuests, setAppliedGuests] = useState('');
  const [appliedActivities, setAppliedActivities] = useState<string[]>([]);
  const [appliedExtras, setAppliedExtras] = useState<string[]>([]);
  const [appliedSort, setAppliedSort] = useState<SortOption>('relevance');
  const [appliedCheckIn, setAppliedCheckIn] = useState<Date | null>(null);
  const [appliedCheckOut, setAppliedCheckOut] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const [calHover, setCalHover] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false);
    }
    if (calOpen) document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [calOpen]);

  function handleDay(day: Date) {
    const d = startOfDay(day);
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d); setCheckOut(null);
    } else {
      if (d <= checkIn) { setCheckIn(d); }
      else { setCheckOut(d); setCalHover(null); }
    }
  }

  const nextMonthDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
  const prevDisabled = viewMonth <= startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const toggleActivity = (a: string) =>
    setSelectedActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const toggleExtra = (id: string) =>
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  function handleSearch() {
    setAppliedSearch(search);
    setAppliedLocation(location);
    setAppliedGuests(guests);
    setAppliedActivities(selectedActivities);
    setAppliedExtras(selectedExtras);
    setAppliedSort(sort);
    setAppliedCheckIn(checkIn);
    setAppliedCheckOut(checkOut);
  }

  const clearFilters = () => {
    setSearch(''); setAppliedSearch('');
    setLocation(''); setAppliedLocation('');
    setGuests(''); setAppliedGuests('');
    setCheckIn(null); setAppliedCheckIn(null);
    setCheckOut(null); setAppliedCheckOut(null);
    setSelectedActivities([]); setAppliedActivities([]);
    setSelectedExtras([]); setAppliedExtras([]);
    setSort('relevance'); setAppliedSort('relevance');
  };

  const filtered = useMemo(() => {
    let result = [...villas];
    if (appliedSearch) {
      const q = appliedSearch.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.location_label.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }
    if (appliedLocation) {
      result = result.filter((v) =>
        v.location_label.toLowerCase().includes(appliedLocation.toLowerCase())
      );
    }
    if (appliedGuests) {
      const g = parseInt(appliedGuests);
      result = result.filter((v) => v.capacity_max >= g);
    }
    if (appliedActivities.length > 0) {
      result = result.filter((v) =>
        appliedActivities.every((a) => v.activities.includes(a))
      );
    }
    if (appliedExtras.length > 0) {
      result = result.filter((v) =>
        appliedExtras.every((eId) =>
          v.villa_extras?.some((ve) => ve.extra_id === eId)
        )
      );
    }
    switch (appliedSort) {
      case 'price_asc':
        result.sort((a, b) => a.price_amount - b.price_amount);
        break;
      case 'capacity_desc':
        result.sort((a, b) => b.capacity_max - a.capacity_max);
        break;
    }
    return result;
  }, [villas, appliedSearch, appliedLocation, appliedGuests, appliedActivities, appliedExtras, appliedSort]);

  const hasFilters = !!(appliedSearch || appliedLocation || appliedGuests || appliedCheckIn ||
    appliedActivities.length > 0 || appliedExtras.length > 0);

  const filterCount = [appliedSearch, appliedLocation, appliedGuests, appliedCheckIn ? '1' : ''].filter(Boolean).length
    + appliedActivities.length + appliedExtras.length;

  // Indique que les inputs diffèrent des filtres appliqués (loupe "active")
  const isDirty = search !== appliedSearch || location !== appliedLocation ||
    guests !== appliedGuests || sort !== appliedSort ||
    selectedActivities.join() !== appliedActivities.join() ||
    selectedExtras.join() !== appliedExtras.join() ||
    checkIn?.getTime() !== appliedCheckIn?.getTime() ||
    checkOut?.getTime() !== appliedCheckOut?.getTime();

  const datesLabel = checkIn && checkOut
    ? `${fmtShort(checkIn)} → ${fmtShort(checkOut)}`
    : checkIn ? `${fmtShort(checkIn)} → ?`
    : 'Quand ?';

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-xs text-gray-400 uppercase tracking-[0.3em] font-semibold mb-3">Nos villas</p>
        <h1 className="text-4xl sm:text-5xl font-black text-dark leading-tight">
          Choisis ton week-end.
        </h1>
        <p className="mt-3 text-gray-400 text-base font-light">
          {filtered.length} lieu{filtered.length !== 1 ? 'x' : ''} disponible{filtered.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Tri — discret, aligné droite */}
      <div className="flex justify-end mb-3">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => { const v = e.target.value as SortOption; setSort(v); setAppliedSort(v); }}
            className="appearance-none pl-3 pr-8 py-2 text-xs font-medium text-gray-500 bg-transparent focus:outline-none cursor-pointer hover:text-dark transition-colors"
          >
            <option value="relevance">Tri : Pertinence</option>
            <option value="price_asc">Tri : Prix croissant</option>
            <option value="capacity_desc">Tri : Capacité ↓</option>
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Barre de recherche Airbnb-style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-4"
        ref={calRef}
      >
        {/* Desktop — pill unique */}
        <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">

          {/* Destination */}
          <div className="flex-1 px-6 py-3.5">
            <p className="text-xs font-bold text-dark mb-0.5">Destination</p>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-500 focus:outline-none cursor-pointer"
            >
              <option value="">Partout en France</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-9 bg-gray-200 shrink-0" />

          {/* Dates */}
          <div className="relative flex-1">
            <button
              onClick={() => setCalOpen((o) => !o)}
              className="w-full text-left px-6 py-3.5 focus:outline-none"
            >
              <p className="text-xs font-bold text-dark mb-0.5">Dates</p>
              <p className={`text-sm ${checkIn ? 'text-dark' : 'text-gray-400'}`}>{datesLabel}</p>
            </button>

            {/* Calendrier dropdown */}
            <AnimatePresence>
              {calOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 w-[600px] max-w-[95vw]"
                >
                  {/* Entête navigation */}
                  <div className="flex items-center justify-between mb-5">
                    <button
                      onClick={() => !prevDisabled && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                      disabled={prevDisabled}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Deux mois */}
                  <div className="flex gap-8">
                    <CalendarMonth
                      year={viewMonth.getFullYear()} month={viewMonth.getMonth()}
                      checkIn={checkIn} checkOut={checkOut} hover={calHover}
                      onDay={handleDay} onHover={setCalHover}
                    />
                    <CalendarMonth
                      year={nextMonthDate.getFullYear()} month={nextMonthDate.getMonth()}
                      checkIn={checkIn} checkOut={checkOut} hover={calHover}
                      onDay={handleDay} onHover={setCalHover}
                    />
                  </div>

                  {/* Footer */}
                  {(checkIn || checkOut) && (
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {checkIn && checkOut
                          ? `${fmtShort(checkIn)} → ${fmtShort(checkOut)}`
                          : 'Sélectionne la date de fin'}
                      </span>
                      <button
                        onClick={() => { setCheckIn(null); setCheckOut(null); }}
                        className="text-sm text-gray-400 hover:text-dark underline transition-colors"
                      >
                        Effacer
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-px h-9 bg-gray-200 shrink-0" />

          {/* Voyageurs */}
          <div className="flex-1 px-6 py-3.5 relative">
            <p className="text-xs font-bold text-dark mb-0.5">Voyageurs</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {guests ? `${guests} voyageur${parseInt(guests) > 1 ? 's' : ''}` : 'Ajouter des voyageurs'}
              </span>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 shrink-0">
              <button
                onClick={() => { const c = parseInt(guests) || 0; setGuests(c <= 1 ? '' : String(c - 1)); }}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-600 text-base leading-none transition-colors"
              >−</button>
              <span className="text-sm w-5 text-center text-dark font-semibold">{guests || '—'}</span>
              <button
                onClick={() => setGuests(String(Math.min(50, (parseInt(guests) || 0) + 1)))}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-600 text-base leading-none transition-colors"
              >+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pr-2 pl-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                showFilters || selectedActivities.length > 0 || selectedExtras.length > 0
                  ? 'bg-dark text-white border-dark'
                  : 'border-gray-300 text-gray-600 hover:border-gray-500'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtres
              {(selectedActivities.length + selectedExtras.length) > 0 && (
                <span className="w-4 h-4 bg-primary text-xs rounded-full flex items-center justify-center text-dark font-bold">
                  {selectedActivities.length + selectedExtras.length}
                </span>
              )}
            </button>
            <button
              onClick={handleSearch}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all shrink-0 ${
                isDirty ? 'bg-[#055043] hover:bg-[#044037] ring-2 ring-[#055043]/30' : 'bg-[#055043] hover:bg-[#044037]'
              }`}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile — cartes empilées */}
        <div className="sm:hidden flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 pl-1">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-2xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Partout</option>
                  {allLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
            <div className="w-28">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 pl-1">Voyageurs</label>
              <div className="flex items-center border border-gray-200 rounded-2xl bg-white px-3 py-3.5 gap-2">
                <button onClick={() => { const c = parseInt(guests) || 0; setGuests(c <= 1 ? '' : String(c - 1)); }} className="text-gray-500 text-lg leading-none">−</button>
                <span className="flex-1 text-center text-sm font-semibold text-dark">{guests || '—'}</span>
                <button onClick={() => setGuests(String(Math.min(50, (parseInt(guests) || 0) + 1)))} className="text-gray-500 text-lg leading-none">+</button>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <div className="flex-1 relative">
              <button
                onClick={() => setCalOpen((o) => !o)}
                className="w-full flex items-center gap-3 pl-4 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white text-left"
              >
                <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
                <span className={`text-sm ${checkIn ? 'text-dark font-medium' : 'text-gray-400'}`}>{datesLabel}</span>
              </button>
              <AnimatePresence>
                {calOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-[340px]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => !prevDisabled && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} disabled={prevDisabled} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-30">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <CalendarMonth
                      year={viewMonth.getFullYear()} month={viewMonth.getMonth()}
                      checkIn={checkIn} checkOut={checkOut} hover={calHover}
                      onDay={handleDay} onHover={setCalHover}
                    />
                    {(checkIn || checkOut) && (
                      <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => { setCheckIn(null); setCheckOut(null); }} className="text-xs text-gray-400 hover:text-dark underline">Effacer</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-sm font-semibold shrink-0 transition-all ${ showFilters || hasFilters ? 'bg-dark text-white' : 'border border-gray-200 text-gray-600' }`}>
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
              {filterCount > 0 && <span className="w-4 h-4 bg-primary text-[10px] rounded-full flex items-center justify-center text-dark font-bold">{filterCount}</span>}
            </button>
            <button
              onClick={handleSearch}
              className="w-12 h-12 bg-[#055043] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#044037] transition-colors shrink-0"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters panel — animated */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="mb-10 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-dark text-lg">Filtres avancés</h2>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Tout effacer
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <MapPin className="h-3 w-3 inline mr-1" />Destination
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Toutes</option>
                    {allLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <Users className="h-3 w-3 inline mr-1" />Personnes
                  </label>
                  <input type="number" min="1" max="50" placeholder="Combien ?" value={guests} onChange={(e) => setGuests(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Activities */}
              <div className="mt-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Activités</label>
                <div className="flex flex-wrap gap-2">
                  {allActivities.map((a) => (
                    <button
                      key={a}
                      onClick={() => toggleActivity(a)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedActivities.includes(a)
                          ? 'bg-primary text-gray-900 shadow-md shadow-primary/30'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extras */}
              {allExtras.length > 0 && (
                <div className="mt-6">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Extras</label>
                  <div className="flex flex-wrap gap-2">
                    {allExtras.map((extra) => (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedExtras.includes(extra.id)
                            ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                            : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white'
                        }`}
                      >
                        {extra.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid — chapitres cinématiques */}
      {filtered.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((villa, i) => (
            <motion.div
              key={villa.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <VillaCard villa={villa} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Search className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Rien trouvé</p>
          <p className="text-gray-400 mb-6">Modifie tes filtres, on a forcément ce qu&apos;il te faut.</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-dark text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </motion.div>
      )}
    </div>
  );
}
