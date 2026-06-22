import React from 'react';
import { Trophy, Users } from 'lucide-react';
import type { CalendarEventType, CalendarEventCategory, CalendarEventStatus } from '../lib/database.aliases';

export const typeBorderColor: Record<CalendarEventType, string> = {
	championship:  'border-l-[#003B73]',
	interclubs:    'border-l-[#D9A441]',
	congress:      'border-l-indigo-600',
	assembly:      'border-l-cyan-600',
	institutional: 'border-l-emerald-600',
};

export const typeIcon: Record<CalendarEventType, React.ReactNode> = {
	championship:  <Trophy className="w-3.5 h-3.5" />,
	interclubs:    <Users  className="w-3.5 h-3.5" />,
	congress:      <Trophy className="w-3.5 h-3.5" />,
	assembly:      <Trophy className="w-3.5 h-3.5" />,
	institutional: <Trophy className="w-3.5 h-3.5" />,
};

export const categoryBadgeStyle: Record<CalendarEventCategory, string> = {
	interclubes:   'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
	sub21:         'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
	adulto:        'bg-blue-50 text-[#003B73] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
	institucional: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
	outro:         'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

export const statusBadgeStyle: Record<CalendarEventStatus, string> = {
	upcoming:           'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
	registrations_open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
	confirmed:          'bg-blue-100 text-[#003B73] dark:bg-blue-900/30 dark:text-blue-400',
	finished:           'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};
