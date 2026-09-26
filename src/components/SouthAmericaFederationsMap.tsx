import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import worldMap from "@svg-maps/world";

import { useLanguage } from "../context/LanguageContext";
import type { Federation } from "../data/federationsData";

type Props = {
  federations: Federation[];
};

type MapLocation = {
  id: string;
  name: string;
  path: string;
};

const SOUTH_AMERICA_ISO2 = [
  "ar",
  "bo",
  "br",
  "cl",
  "co",
  "ec",
  "gy",
  "pe",
  "py",
  "sr",
  "uy",
  "ve"
] as const;

const COUNTRY_TO_ISO2: Record<string, string> = {
  argentina: "ar",
  bolivia: "bo",
  brasil: "br",
  brazil: "br",
  chile: "cl",
  colombia: "co",
  ecuador: "ec",
  equador: "ec",
  guyana: "gy",
  guiana: "gy",
  paraguay: "py",
  paraguai: "py",
  peru: "pe",
  suriname: "sr",
  uruguay: "uy",
  uruguai: "uy",
  venezuela: "ve"
};

const MAP_MEMBER_FILL = "#0057A8";
const MAP_MEMBER_ACTIVE_FILL = "#D9A441";
const MAP_NON_MEMBER_FILL = "#E5E7EB";
const MAP_STROKE = "#FFFFFF";

function normalizeCountryName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getIso2FromFederation(federation: Federation) {
  const candidates = [
    federation.country,
    federation.countryEs,
    federation.countryEn
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const iso2 = COUNTRY_TO_ISO2[normalizeCountryName(candidate)];

    if (iso2) {
      return iso2;
    }
  }

  return null;
}

export default function SouthAmericaFederationsMap({ federations }: Props) {
  const { lang } = useLanguage();

  const mapPathsRef = useRef<SVGGElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [activeCountryIso2, setActiveCountryIso2] = useState<string | null>(
    null
  );

  const [southAmericaViewBox, setSouthAmericaViewBox] = useState(
    worldMap.viewBox
  );

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);

  const federationByIso2 = useMemo(() => {
    const map = new Map<string, Federation>();

    federations.forEach(federation => {
      const iso2 = getIso2FromFederation(federation);

      if (iso2) {
        map.set(iso2, federation);
      }
    });

    return map;
  }, [federations]);

  const southAmericaLocations = useMemo(() => {
    const isoSet = new Set<string>(SOUTH_AMERICA_ISO2);

    return (worldMap.locations as MapLocation[]).filter(location =>
      isoSet.has(location.id)
    );
  }, []);

  const getCountryName = useCallback(
    (federation: Federation) => {
      if (lang === "es") {
        return federation.countryEs ?? federation.country;
      }

      if (lang === "en") {
        return federation.countryEn ?? federation.country;
      }

      return federation.country;
    },
    [lang]
  );

  const texts = {
    pt: {
      eyebrow: "Federações afiliadas",
      title: "CONSUDES na América do Sul",
      description:
        "Conheça os países representados pelas federações nacionais afiliadas à CONSUDES.",
      button: "Conheça nossas federações"
    },
    es: {
      eyebrow: "Federaciones afiliadas",
      title: "CONSUDES en América del Sur",
      description:
        "Conoce los países representados por las federaciones nacionales afiliadas a la CONSUDES.",
      button: "Conoce nuestras federaciones"
    },
    en: {
      eyebrow: "Member federations",
      title: "CONSUDES in South America",
      description:
        "Discover the countries represented by the national federations affiliated with CONSUDES.",
      button: "Meet our federations"
    }
  };

  const copy = texts[lang];

  const placeTooltipAt = useCallback((x: number, y: number, label: string) => {
    const containerRect = mapContainerRef.current?.getBoundingClientRect();

    if (!containerRect) {
      return;
    }

    const tooltipRect = tooltipRef.current?.getBoundingClientRect();

    const tooltipWidth = tooltipRect?.width ?? 110;
    const tooltipHeight = tooltipRect?.height ?? 30;

    const padding = 8;
    const arrowHeight = 6;
    const verticalOffset = 4;

    const preferredLeft = x - tooltipWidth / 2;
    const preferredTop = y - tooltipHeight - arrowHeight - verticalOffset;

    const clampedX = Math.max(
      padding,
      Math.min(preferredLeft, containerRect.width - tooltipWidth - padding)
    );

    const clampedY = Math.max(
      padding,
      Math.min(preferredTop, containerRect.height - tooltipHeight - padding)
    );

    setTooltip({
      x: clampedX,
      y: clampedY,
      label
    });
  }, []);

  const placeTooltipByCountry = useCallback(
    (iso2: string) => {
      const container = mapContainerRef.current;

      if (!container) {
        return;
      }

      const path = container.querySelector<SVGPathElement>(
        `#south-country-${iso2}`
      );

      const svg = container.querySelector<SVGSVGElement>("svg");

      if (!path || !svg) {
        return;
      }

      const federation = federationByIso2.get(iso2);

      if (!federation) {
        return;
      }

      const bbox = path.getBBox();
      const matrix = path.getScreenCTM();

      if (!matrix) {
        return;
      }

      let anchorX = bbox.x + bbox.width / 2;
      let anchorY = bbox.y + bbox.height / 2;

      /*
       * Países com formato muito estreito/comprido precisam
       * de um ponto visual melhor.
       */
      if (iso2 === "cl") {
        anchorX = bbox.x + bbox.width * 0.82;
        anchorY = bbox.y + bbox.height * 0.22;
      }

      const svgPoint = svg.createSVGPoint();

      svgPoint.x = anchorX;
      svgPoint.y = anchorY;

      const screenPoint = svgPoint.matrixTransform(matrix);

      const containerRect = container.getBoundingClientRect();

      const x = screenPoint.x - containerRect.left;

      const y = screenPoint.y - containerRect.top;

      placeTooltipAt(x, y, getCountryName(federation));
    },
    [federationByIso2, getCountryName, placeTooltipAt]
  );

  const hideTooltip = () => {
    setActiveCountryIso2(null);
    setTooltip(null);
  };

  useEffect(() => {
    if (!mapPathsRef.current) {
      return;
    }

    const box = mapPathsRef.current.getBBox();

    const paddingX = 30;
    const paddingTop = 15;
    const paddingBottom = 15;

    setSouthAmericaViewBox(
      `${box.x - paddingX} ${box.y - paddingTop} ${
        box.width + paddingX * 2
      } ${box.height + paddingTop + paddingBottom}`
    );
  }, [southAmericaLocations]);

  useEffect(() => {
    if (!activeCountryIso2) {
      return;
    }

    placeTooltipByCountry(activeCountryIso2);
  }, [activeCountryIso2, lang, southAmericaViewBox, placeTooltipByCountry]);

  useEffect(() => {
    if (!activeCountryIso2) {
      return;
    }

    const recalculate = () => {
      placeTooltipByCountry(activeCountryIso2);
    };

    window.addEventListener("resize", recalculate);

    return () => {
      window.removeEventListener("resize", recalculate);
    };
  }, [activeCountryIso2, placeTooltipByCountry]);

  return (
    <section className="bg-white dark:bg-consudes-dark pt-14 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Cabeçalho */}
        <div className="mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-consudes-blue-mid dark:text-white/60 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-5 h-0.5 bg-consudes-gold inline-block" />
            {copy.eyebrow}
          </span>

          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-consudes-blue-text dark:text-white mb-3 leading-tight">
            {copy.title}
          </h2>

          <p className="text-consudes-blue-text/65 dark:text-white/50 text-sm max-w-2xl leading-relaxed">
            {copy.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 sm:gap-8 lg:gap-20 items-center">
          {/* Mapa */}
          <div
            ref={mapContainerRef}
            className="relative mx-auto w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[640px]">
            <svg
              viewBox={southAmericaViewBox}
              className="block w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              aria-label={copy.title}
              role="img">
              <g ref={mapPathsRef}>
                {southAmericaLocations.map(location => {
                  const federation = federationByIso2.get(location.id);

                  const isMember = Boolean(federation);

                  const isActive = activeCountryIso2 === location.id;

                  const countryName = federation
                    ? getCountryName(federation)
                    : location.name;

                  return (
                    <path
                      key={location.id}
                      id={`south-country-${location.id}`}
                      d={location.path}
                      fill={
                        isMember
                          ? isActive
                            ? MAP_MEMBER_ACTIVE_FILL
                            : MAP_MEMBER_FILL
                          : MAP_NON_MEMBER_FILL
                      }
                      stroke={MAP_STROKE}
                      strokeWidth={isActive ? 1.5 : 0.7}
                      vectorEffect="non-scaling-stroke"
                      tabIndex={isMember ? 0 : -1}
                      role={isMember ? "button" : undefined}
                      aria-label={isMember ? countryName : undefined}
                      style={{
                        cursor: isMember ? "pointer" : "default",
                        outline: "none",
                        transition: "fill 180ms ease, stroke-width 180ms ease"
                      }}
                      onPointerEnter={() => {
                        if (!isMember) {
                          return;
                        }

                        setActiveCountryIso2(location.id);

                        placeTooltipByCountry(location.id);
                      }}
                      onPointerMove={() => {
                        if (!isMember) {
                          return;
                        }

                        placeTooltipByCountry(location.id);
                      }}
                      onPointerLeave={() => {
                        if (!isMember) {
                          return;
                        }

                        hideTooltip();
                      }}
                      onFocus={() => {
                        if (!isMember) {
                          return;
                        }

                        setActiveCountryIso2(location.id);

                        placeTooltipByCountry(location.id);
                      }}
                      onBlur={() => {
                        if (!isMember) {
                          return;
                        }

                        hideTooltip();
                      }}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Tooltip */}
            {tooltip ? (
              <div
                ref={tooltipRef}
                role="tooltip"
                className="pointer-events-none absolute z-20 rounded-md bg-consudes-navy px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg"
                style={{
                  left: tooltip.x,
                  top: tooltip.y
                }}>
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-consudes-navy" />

                {tooltip.label}
              </div>
            ) : null}
          </div>

          {/* Países */}
          <div className="lg:pl-8 xl:pl-12">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-2 lg:gap-3">
              {federations.map(federation => {
                const iso2 = getIso2FromFederation(federation);

                if (!iso2) {
                  return null;
                }

                const isActive = activeCountryIso2 === iso2;

                const countryName = getCountryName(federation);

                return (
                  <div
                    key={federation.acronym}
                    tabIndex={0}
                    aria-label={countryName}
                    onPointerEnter={() => {
                      setActiveCountryIso2(iso2);
                      placeTooltipByCountry(iso2);
                    }}
                    onPointerLeave={hideTooltip}
                    onFocus={() => {
                      setActiveCountryIso2(iso2);
                      placeTooltipByCountry(iso2);
                    }}
                    onBlur={hideTooltip}
                    className={`flex min-h-[60px] lg:min-h-[76px] items-center justify-center gap-2 lg:gap-3 rounded-lg border px-2 py-2 lg:px-4 lg:py-3 text-center transition-all duration-200 ${
                      isActive
                        ? "border-consudes-gold bg-consudes-gold/10 shadow-sm"
                        : "border-consudes-border/60 bg-white hover:border-consudes-blue-mid/30 hover:bg-blue-50/40 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
                    }`}>
                    <span
                      className="text-2xl sm:text-3xl lg:text-4xl leading-none shrink-0"
                      role="img"
                      aria-hidden="true">
                      {federation.flag}
                    </span>

                    <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-semibold text-consudes-blue-text dark:text-white/80">
                      {countryName}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link
              to="/federacoes"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-consudes-blue-mid dark:text-white/70 hover:text-consudes-navy dark:hover:text-white transition-colors hover:underline">
              {copy.button}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
