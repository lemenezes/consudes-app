import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import PageHero from '../components/PageHero';
import { teamMembers, teamByGroup, FLAG } from '../data/teamData';
import type { TeamMember } from '../data/teamData';

/* ── Avatar ──────────────────────────────────────────────────────── */
function Avatar({ member, size = 'md' }: { member: TeamMember; size?: 'sm' | 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const initials = member.name.split(' ').slice(0, 2).map((w) => w[0]).join('');

  const sizeClasses = {
    sm: 'w-20 h-20 text-lg',
    md: 'w-[88px] h-[88px] text-xl',
    lg: 'w-40 h-40 text-4xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ring-[1.5px] ring-[#D9A441]/50 ring-offset-2 ring-offset-white dark:ring-offset-[#0d1624] overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#003B73] to-[#0057A8] flex items-center justify-center`}
    >
      {!failed ? (
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-['Cormorant_Garamond'] font-semibold text-white/90">{initials}</span>
      )}
    </div>
  );
}

/* ── PresidentCard — branco elegante ─────────────────────────────── */
function PresidentCard({ member, roleLabel }: { member: TeamMember; roleLabel: string }) {
  return (
    <div className="relative bg-white dark:bg-white/[0.03] rounded-2xl overflow-hidden border border-[#D9A441]/25 dark:border-[#D9A441]/10 shadow-[0_2px_24px_rgba(0,59,115,0.07)] dark:shadow-none">
      {/* Barra dourada topo */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#D9A441]/20 via-[#D9A441] to-[#D9A441]/20" />

      <div className="p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-center gap-8 sm:gap-12">
        {/* Avatar grande */}
        <div className="flex-shrink-0">
          <Avatar member={member} size="lg" />
        </div>

        {/* Info */}
        <div className="text-center sm:text-left flex-1">
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#D9A441] mb-3">
            CONSUDES · DIRECTORIO 2022–2026
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-[2.6rem] font-semibold text-[#1F2937] dark:text-white leading-[1.1] mb-3 tracking-tight">
            {member.name}
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-5">
            <div className="h-px w-6 bg-[#D9A441]/60" />
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#003B73] dark:text-[#7db4e8]">
              {roleLabel}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-[#1F2937]/45 dark:text-white/35">
            <span className="text-base">{FLAG[member.countryCode]}</span>
            <span>{member.country}</span>
          </div>
        </div>

        {/* Marca d'água discreta */}
        <div className="hidden sm:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.025] dark:opacity-[0.04]">
          <span
            className="font-['Cormorant_Garamond'] font-bold text-[#003B73] dark:text-white"
            style={{ fontSize: '180px', lineHeight: 1 }}
          >
            C
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── MemberCard — horizontal, leve, institucional ────────────────── */
function MemberCard({ member, roleLabel }: { member: TeamMember; roleLabel: string }) {
  return (
    <div className="group flex items-center gap-5 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06] hover:border-[#D9A441]/40 dark:hover:border-[#D9A441]/20 shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,59,115,0.10)] dark:hover:shadow-none transition-all duration-300 hover:-translate-y-0.5 p-5 sm:p-6">
      <Avatar member={member} size="md" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D9A441] mb-1.5 leading-snug">
          {roleLabel}
        </p>
        <h3 className="font-['Cormorant_Garamond'] text-[1.25rem] font-semibold text-[#1F2937] dark:text-white leading-snug mb-2.5">
          {member.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-[#1F2937]/40 dark:text-white/30">
          <span>{FLAG[member.countryCode]}</span>
          <span>{member.country}</span>
        </div>
      </div>
    </div>
  );
}

/* ── SectionHeading numerada ────────────────────────────────────── */
function SectionHeading({ label, index }: { label: string; index: number }) {
  const num = String(index).padStart(2, '0');
  return (
    <div className="flex items-center gap-5 mb-8">
      <span className="font-['Cormorant_Garamond'] text-5xl font-bold leading-none flex-shrink-0 select-none text-[#003B73]/[0.07] dark:text-white/[0.07]">
        {num}
      </span>
      <div className="flex-1">
        <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#D9A441] mb-1.5">
          {label}
        </p>
        <div className="h-px bg-gradient-to-r from-[#003B73]/15 via-[#D9A441]/30 to-transparent dark:from-white/10 dark:via-[#D9A441]/15" />
      </div>
    </div>
  );
}

/* ── Página ─────────────────────────────────────────────────────── */
export default function TeamPage() {
  const { t } = useLanguage();
  const tp = (t as any).teamPage as {
    subtitle: string;
    mandate: string;
    introHeadline: string;
    groupPresidency: string;
    groupVicePresidency: string;
    groupBoard: string;
    groupAdvisors: string;
    membersLabel: string;
    countriesLabel: string;
    roles: Record<string, string>;
  };

  useSEO({
    title: t.nav.team,
    description: tp.subtitle,
    url: '/equipe',
  });

  const presidency     = teamByGroup('presidency');
  const vicePresidency = teamByGroup('vicePresidency');
  const board          = teamByGroup('board');
  const advisors       = teamByGroup('advisors');
  const countries = [...new Set(teamMembers.map((m) => m.countryCode))].length;

  return (
    <>
      <PageHero label="CONSUDES" title={t.nav.team} subtitle={tp.subtitle} />

      <section className="bg-gradient-to-b from-slate-50/60 to-white dark:bg-[#0d1624] dark:bg-none py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Intro institucional ───────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="flex-1">
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D9A441] mb-2">
                {tp.mandate}
              </p>
              <p className="text-2xl sm:text-3xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] dark:text-white leading-snug max-w-md">
                {tp.introHeadline}
              </p>
            </div>

            {/* Stats discretos */}
            <div className="flex items-center flex-shrink-0 divide-x divide-gray-100 dark:divide-white/10 border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden self-start sm:self-auto">
              <div className="text-center px-7 py-4">
                <p className="text-3xl font-['Cormorant_Garamond'] font-bold text-[#003B73] dark:text-white leading-none">
                  {teamMembers.length}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-[#1F2937]/40 dark:text-white/35 mt-1">
                  {tp.membersLabel}
                </p>
              </div>
              <div className="text-center px-7 py-4">
                <p className="text-3xl font-['Cormorant_Garamond'] font-bold text-[#003B73] dark:text-white leading-none">
                  {countries}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-[#1F2937]/40 dark:text-white/35 mt-1">
                  {tp.countriesLabel}
                </p>
              </div>
            </div>
          </div>

          {/* ── 01 · Presidência ─────────────────────────────── */}
          <div className="mb-14">
            <SectionHeading label={tp.groupPresidency} index={1} />
            {presidency.map((m) => (
              <PresidentCard key={m.id} member={m} roleLabel={tp.roles[m.roleKey]} />
            ))}
          </div>

          {/* ── 02 · Vice-presidência ────────────────────────── */}
          <div className="mb-14">
            <SectionHeading label={tp.groupVicePresidency} index={2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vicePresidency.map((m) => (
                <MemberCard key={m.id} member={m} roleLabel={tp.roles[m.roleKey]} />
              ))}
            </div>
          </div>

          {/* ── 03 · Diretoria ───────────────────────────────── */}
          <div className="mb-14">
            <SectionHeading label={tp.groupBoard} index={3} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {board.map((m) => (
                <MemberCard key={m.id} member={m} roleLabel={tp.roles[m.roleKey]} />
              ))}
            </div>
          </div>

          {/* ── 04 · Assessores ──────────────────────────────── */}
          <div>
            <SectionHeading label={tp.groupAdvisors} index={4} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advisors.map((m) => (
                <MemberCard key={m.id} member={m} roleLabel={tp.roles[m.roleKey]} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
