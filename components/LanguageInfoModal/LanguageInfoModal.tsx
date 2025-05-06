import React from "react";
import HalomotButton from "@/components/HalomotButton/HalomotButton";
import LanguageIcon from "@/components/LanguageIcon";
import { useTranslation } from "react-i18next";
import 'animate.css';

// Types
interface Language {
  code: string;
  name: string;
  flag: string; // image src
}
interface Inscription {
  code: string;
  text: (inlineIconSize: number, onIconClick: () => void) => React.ReactNode;
}
interface LanguageInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageIconClick: () => void;
  languages: Language[];
  fontSizeMobile?: string;
  fontSizeDesktop?: string;
  modalWidthMobile?: number;
  modalWidthDesktop?: number;
  inlineIconSizeMobile?: number;
  inlineIconSizeDesktop?: number;
}

// Inscriptions
const DEFAULT_INSCRIPTIONS: Inscription[] = [
  {
    code: "en",
    text: (inlineIconSize, onIconClick) => (
      <>
        Click on the{" "}
        <span
          className="language-icon-inline"
          onClick={onIconClick}
          tabIndex={0}
          role="button"
          aria-label="Open language selector"
          style={{ cursor: "pointer", display: "inline-flex", verticalAlign: "middle" }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") onIconClick();
          }}
        >
          <LanguageIcon width={inlineIconSize} />
        </span>
        {" "}icon to open the language selector.
      </>
    ),
  },
  {
    code: "he",
    text: (inlineIconSize, onIconClick) => (
      <>
        {" "}כדי לבחור שפה.
        <span
          className="language-icon-inline"
          onClick={onIconClick}
          tabIndex={0}
          role="button"
          aria-label="פתח בוחר שפה"
          style={{ cursor: "pointer", display: "inline-flex", verticalAlign: "middle" }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") onIconClick();
          }}
        >
          <LanguageIcon width={inlineIconSize} />
        </span>
        לחץ על הסמל{" "}
      </>
    ),
  },
  {
    code: "es_ar",
    text: (inlineIconSize, onIconClick) => (
      <>
        Haz clic en el ícono{" "}
        <span
          className="language-icon-inline"
          onClick={onIconClick}
          tabIndex={0}
          role="button"
          aria-label="Abrir selector de idioma"
          style={{ cursor: "pointer", display: "inline-flex", verticalAlign: "middle" }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") onIconClick();
          }}
        >
          <LanguageIcon width={inlineIconSize} />
        </span>
        {" "}para seleccionar idioma.
      </>
    ),
  },
  {
    code: "de",
    text: (inlineIconSize, onIconClick) => (
      <>
        Klicke auf das{" "}
        <span
          className="language-icon-inline"
          onClick={onIconClick}
          tabIndex={0}
          role="button"
          aria-label="Sprache wählen"
          style={{ cursor: "pointer", display: "inline-flex", verticalAlign: "middle" }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") onIconClick();
          }}
        >
          <LanguageIcon width={inlineIconSize} />
        </span>
        {" "}Symbol, um die Sprache zu wählen.
      </>
    ),
  },
  {
    code: "ru",
    text: (inlineIconSize, onIconClick) => (
      <>
        Нажмите на значок{" "}
        <span
          className="language-icon-inline"
          onClick={onIconClick}
          tabIndex={0}
          role="button"
          aria-label="Открыть выбор языка"
          style={{ cursor: "pointer", display: "inline-flex", verticalAlign: "middle" }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") onIconClick();
          }}
        >
          <LanguageIcon width={inlineIconSize} />
        </span>
        {" чтобы сменить язык."}
      </>
    ),
  },
];

const ICON_SIZE_MOBILE = 54;
const ICON_SIZE_DESKTOP = 54;
const INLINE_ICON_SIZE_MOBILE = 21;
const INLINE_ICON_SIZE_DESKTOP = 36;

const LanguageInfoModal: React.FC<LanguageInfoModalProps> = ({
  isOpen,
  onClose,
  onLanguageIconClick,
  languages,
  fontSizeMobile = "9.6px",
  fontSizeDesktop = "18px",
  modalWidthMobile = 336,
  modalWidthDesktop = 544,
  inlineIconSizeMobile = INLINE_ICON_SIZE_MOBILE,
  inlineIconSizeDesktop = INLINE_ICON_SIZE_DESKTOP,
}) => {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP;
  const fontSize = isMobile ? fontSizeMobile : fontSizeDesktop;
  const modalWidth = isMobile ? modalWidthMobile : modalWidthDesktop;
  const inlineIconSize = isMobile ? inlineIconSizeMobile : inlineIconSizeDesktop;

  // Gradient for icon and button
  const gradient =
    i18n.language === "he"
      ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
      : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))";

  // Helper to get inscription for a language code, fallback to English
  const getInscription = (code: string) =>
    DEFAULT_INSCRIPTIONS.find(ins => ins.code === code) ||
    DEFAULT_INSCRIPTIONS.find(ins => ins.code === "en");

  if (!isOpen) return null;

  return (
    <div className="language-info-modal-overlay">
      <div
        className="language-info-modal-grid animate__animated animate__jackInTheBox"
        style={{
          width: modalWidth,
          maxWidth: "96vw",
        }}
      >
        <div className="language-info-modal-card">
          {/* Foreground content wrapper to ensure stacking */}
          <div className="language-info-modal-foreground">
            {/* Main language icon */}
            <div
              className="language-icon-top"
              onClick={onLanguageIconClick}
              tabIndex={0}
              role="button"
              aria-label="Open language selector"
              style={{
                height: iconSize,
                width: iconSize,
                minWidth: iconSize,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2em auto",
                background: gradient,
                borderRadius: "var(--mild-rounding)",
                transition: "box-shadow 0.2s",
                boxShadow: "0 0 0 0px var(--first-theme-color, #A123F4)",
              }}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") onLanguageIconClick();
              }}
            >
              <LanguageIcon width={26} />
            </div>
            <div className="inscriptions">
              {languages.map(lang => {
                const isHebrew = lang.code === "he";
                const inscription = getInscription(lang.code);
                return (
                  <div
                    key={lang.code}
                    style={{
                      direction: isHebrew ? "rtl" : "ltr",
                      fontWeight: 500,
                      color: "#fff",
                      opacity: 1,
                      display: "flex",
                      flexDirection: isHebrew ? "row-reverse" : "row",
                      justifyContent: isHebrew ? "flex-end" : "flex-start",
                      alignItems: "center",
                      gap: "0.5em",
                      fontSize,
                      marginBottom: "0.2em",
                      lineHeight: 1.5,
                      textAlign: isHebrew ? "right" : "left",
                      width: "100%",
                    }}
                  >
                    {isHebrew &&
                      inscription?.text(inlineIconSize, onLanguageIconClick)
                    }
                    {/* Flag */}
                    <img
                      src={lang.flag}
                      alt=""
                      style={{
                        width: inlineIconSize,
                        height: "auto",
                        maxHeight: inlineIconSize,
                        borderRadius: "3px",
                        objectFit: "contain",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.14)",
                        cursor: "pointer",
                        display: "block",
                        marginInlineEnd: isHebrew ? undefined : "0.2em",
                        marginInlineStart: isHebrew ? "0.2em" : undefined,
                        outline: "1px solid var(--lightened-background-adjacent-color)",
                        flexShrink: 0,
                      }}
                      onClick={onLanguageIconClick}
                      tabIndex={0}
                      role="button"
                      aria-label={t("open-language-selector")}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") onLanguageIconClick();
                      }}
                    />
                    {!isHebrew &&
                      inscription?.text(inlineIconSize, onLanguageIconClick)
                    }
                  </div>
                );
              })}
            </div>
            <div className="ok-btn-row">
              <span style={{ flex: 1 }} />
              <HalomotButton text={t("ok_button")} onClick={onClose} gradient={gradient} />
              <span style={{ flex: 1 }} />
            </div>
          </div>
          {/* Background and decorative elements */}
          <div className="shine"></div>
          <div className="background">
            <div className="tiles">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`tile tile-${i + 1}`}></div>
              ))}
            </div>
            <div className="line line-1"></div>
            <div className="line line-2"></div>
            <div className="line line-3"></div>
          </div>
        </div>
      </div>
      {/* Style block remains unchanged */}
      <style jsx>{`
        .language-info-modal-overlay { position: fixed; inset: 0; z-index: 10000; display: flex; justify-content: center; align-items: flex-end; pointer-events: none; background: transparent; }
        .language-info-modal-grid { display: grid; grid-template-columns: 1fr; gap: 0; margin-bottom: 1em; z-index: 10100; pointer-events: auto; }
        .language-info-modal-card { position: relative; border-radius: 15px; padding: 28px 18px 20px 18px; background: var(--background, #111014); box-shadow: 0 3px 12px rgba(0,0,0,0.11), 0 0 0 1px var(--background-adjacent-color, #33313d); outline: 1px solid var(--background-adjacent-color, #33313d); margin: 0 auto; overflow: hidden; width: 100%; }
        .language-info-modal-foreground { position: relative; z-index: 3; }
        .language-info-modal-card .inscriptions { margin-bottom: 2em; }
        .ok-btn-row { display: flex; justify-content: center; align-items: center; margin-top: 12px; gap: 0.5em; }
        .language-icon-top :global(svg) { width: 100%; height: 100%; display: block; }
        .language-icon-inline { display: inline-flex; align-items: center; height: 1.2em; aspect-ratio: 1 / 1; margin: 0 0.15em; }
        .language-icon-inline :global(svg) { width: 100%; height: 100%; display: block; }
        .language-info-modal-card .shine { border-radius: inherit; position: absolute; inset: 0; z-index: 1; overflow: hidden; opacity: 0; pointer-events: none; transition: opacity .5s; }
        .language-info-modal-card:hover .shine { opacity: 1; transition-delay: 0s; }
        .language-info-modal-card .shine:before { content: ''; width: 150%; padding-bottom: 150%; border-radius: 50%; position: absolute; left: 50%; bottom: 55%; filter: blur(35px); opacity: .1; transform: translateX(-50%); background-image: conic-gradient(from 205deg at 50% 50%, rgba(161,35,244,0) 0deg, #A123F4 25deg, rgba(161,35,244,0.18) 295deg, rgba(161,35,244,0) 360deg); }
        .language-info-modal-card .background { border-radius: inherit; position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 2; -webkit-mask-image: radial-gradient(circle at 60% 5%, black 0%, black 15%, transparent 60%); mask-image: radial-gradient(circle at 60% 5%, black 0%, black 15%, transparent 60%); }
        .language-info-modal-card .tiles { opacity: 0; transition: opacity .25s; }
        .language-info-modal-card:hover .tiles { opacity: 1; transition-delay: .25s; }
        .language-info-modal-card .tile { position: absolute; background: rgba(161,35,244,0.05); animation-duration: 8s; animation-iteration-count: infinite; opacity: 0; }
        .language-info-modal-card .tile.tile-1 { top: 0; left: 0; height: 10%; width: 22.5%; }
        .language-info-modal-card .tile.tile-2 { top: 0; left: 22.5%; height: 10%; width: 27.5%; }
        .language-info-modal-card .tile.tile-3 { top: 0; left: 50%; height: 10%; width: 27.5%; }
        .language-info-modal-card .tile.tile-4 { top: 0; left: 77.5%; height: 10%; width: 22.5%; }
        .language-info-modal-card .tile.tile-5 { top: 10%; left: 0; height: 22.5%; width: 22.5%; }
        .language-info-modal-card .tile.tile-6 { top: 10%; left: 22.5%; height: 22.5%; width: 27.5%; }
        .language-info-modal-card .tile.tile-7 { top: 10%; left: 50%; height: 22.5%; width: 27.5%; }
        .language-info-modal-card .tile.tile-8 { top: 10%; left: 77.5%; height: 22.5%; width: 22.5%; }
        .language-info-modal-card .tile.tile-9 { top: 32.5%; left: 50%; height: 22.5%; width: 27.5%; }
        .language-info-modal-card .tile.tile-10 { top: 32.5%; left: 77.5%; height: 22.5%; width: 22.5%; }
        .language-info-modal-card:hover .tile { animation-name: tile; }
        .language-info-modal-card .tile.tile-4, .language-info-modal-card .tile.tile-6, .language-info-modal-card .tile.tile-10 { animation-delay: -2s; }
        .language-info-modal-card .tile.tile-3, .language-info-modal-card .tile.tile-5, .language-info-modal-card .tile.tile-8 { animation-delay: -4s; }
        .language-info-modal-card .tile.tile-2, .language-info-modal-card .tile.tile-9 { animation-delay: -6s; }
        @keyframes tile { 0%, 12.5%, 100% { opacity: 1; } 25%, 82.5% { opacity: 0; } }
        .language-info-modal-card .line { position: absolute; inset: 0; opacity: 0; transition: opacity .35s; z-index: 2; }
        .language-info-modal-card:hover .line { opacity: 1; transition-duration: .15s; }
        .language-info-modal-card .line:before, .language-info-modal-card .line:after { content: ''; position: absolute; background: #2A2B2C; transition: transform .35s; }
        .language-info-modal-card .line:before { left: 0; right: 0; height: 1px; transform-origin: 0 50%; transform: scaleX(0); }
        .language-info-modal-card .line:after { top: 0; bottom: 0; width: 1px; transform-origin: 50% 0; transform: scaleY(0); }
        .language-info-modal-card .line.line-1:before { top: 10%; }
        .language-info-modal-card .line.line-1:after { left: 22.5%; }
        .language-info-modal-card .line.line-2:before { top: 32.5%; }
        .language-info-modal-card .line.line-2:after { left: 50%; }
        .language-info-modal-card .line.line-3:before { top: 55%; }
        .language-info-modal-card .line.line-3:after { right: 22.5%; }
        .language-info-modal-card:hover .line:before { transform: scaleX(1); }
        .language-info-modal-card:hover .line:after { transform: scaleY(1); }
      `}</style>
    </div>
  );
};

export default LanguageInfoModal;
