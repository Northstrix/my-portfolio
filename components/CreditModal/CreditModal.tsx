"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import HalomotButton from "@/components/HalomotButton/HalomotButton";
import { isRTLCheck } from "@/components/utils";

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(21, 20, 25, 0.7)",
        backdropFilter: "blur(10px) saturate(90%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000001,
      }}
    >
      <div
        style={{
          borderRadius: "var(--outer-moderate-rounding)",
          padding: "1px",
          margin: "10px",
          background: "var(--background-adjacent-color)",
          display: "inline-block",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--card-background)",
            padding: "20px",
            borderRadius: "var(--moderate-rounding)",
            display: "flex",
            flexDirection: "column",
            color: "var(--foreground)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "0.75em",
              fontSize: "2em",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            {t("credit-inscription")}
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "2em",
              color: "var(--foreground)",
              direction: isRTLCheck(t("credit-text")) ? "rtl" : "ltr",
            }}
          >
            {t("credit-text")}
          </p>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              paddingRight: "1em",
              lineHeight: 1.75,
            }}
          >
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/uchihaclan/pen/NWOyRWy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BUTTONS
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/uchihaclan"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TAYLOR
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://hextaui.com/docs/animation/spotlight-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spotlight Card
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://hextaui.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HextaUI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/tabler/tabler-icons"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tabler-icons
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/tabler"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tabler
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/lucide-icons/lucide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  lucide
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/lucide-icons"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  lucide-icons
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/fkhadra/react-toastify"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  react-toastify
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/fkhadra"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fadi Khadra
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/i18next/react-i18next"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  react-i18next
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/i18next"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  i18next
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/firebase/firebase-js-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  firebase-js-sdk
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/firebase"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  firebase
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://ui.aceternity.com/components/animated-tooltip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Animated Tooltip
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://ui.aceternity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aceternity UI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/juliepark/pen/vjMOKQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Daily UI#011 | Flash Message (Error/Success)
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/juliepark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Julie Park
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/ash_creator/pen/zYaPZLB"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  すりガラスなプロフィールカード
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/ash_creator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  あしざわ - Webクリエイター
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/HighFlyer/pen/WNXRZBv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Neon Button
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/HighFlyer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Thea
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://ui.aceternity.com/components/signup-form"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Signup Form
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://ui.aceternity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aceternity UI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/motiondivision/motion"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  motion
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/motiondivision"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  motiondivision
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/greensock/GSAP"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GSAP
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/greensock"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  greensock
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/pmndrs/react-three-fiber"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  react-three-fiber
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/pmndrs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Poimandres
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/haja-ran/pen/xxWRKNm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bouncing Cube Loader
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/haja-ran"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Haja Randriakoto
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/zzznicob/pen/GRPgKLM"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JTB studios - Link
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/zzznicob"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nico
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://redpandaai.com/tools/ai-image-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AI Image Generator
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://redpandaai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Red Panda AI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://ui.aceternity.com/components/bento-grid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bento Grid
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://ui.aceternity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aceternity UI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://ui.aceternity.com/components/lens"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lens
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://ui.aceternity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aceternity UI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://ui.aceternity.com/components/glowing-effect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Glowing Effect
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://ui.aceternity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aceternity UI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://ui.aceternity.com/components/draggable-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Draggable Card
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://ui.aceternity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aceternity UI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://ui.aceternity.com/components/canvas-reveal-effect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Canvas Reveal Effect
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://ui.aceternity.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aceternity UI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/nodws/pen/GgKErep"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog Post Header
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/nodws/pen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nodws
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://hextaui.com/docs/animation/confetti"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Confetti
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://hextaui.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HextaUI
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://codepen.io/aaroniker/pen/yLEPJXj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Card hover effect
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://codepen.io/aaroniker"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aaron Iker
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/oframe/ogl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ogl
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/oframe"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  oframe
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://www.reactbits.dev/backgrounds/balatro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Balatro
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Bits
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://www.reactbits.dev/backgrounds/aurora"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aurora
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Bits
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://www.reactbits.dev/backgrounds/letter-glitch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Letter Glitch
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Bits
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://www.reactbits.dev/text-animations/decrypted-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Decrypted Text
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Bits
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://www.reactbits.dev/text-animations/blur-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blur Text
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Bits
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://github.com/animate-css/animate.css"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  animate-css
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://github.com/animate-css"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  animate-css
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://www.reactbits.dev/text-animations/blur-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click Spark
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Bits
                </a>
              </li>
              <li>
                <a
                  className="hover-link1"
                  href="https://www.reactbits.dev/backgrounds/silk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Silk
                </a>{" "}
                by{" "}
                <a
                  className="hover-link2"
                  href="https://www.reactbits.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Bits
                </a>
              </li>
              <li>
                <a
                  className="hover-link1 link-perplexity"
                  href="https://www.perplexity.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Perplexity
                </a>
              </li>
              <li>
                <a
                  className="hover-link1 link-mistral"
                  href="https://chat.mistral.ai/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mistral's Le Chat
                </a>
              </li>
              <li>
                Used{" "}
                <a
                  className="hover-link2"
                  href="https://namer-ui.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Namer UI
                </a>{" "}
                components:
                <ul
                  style={{
                    listStyleType: "none",
                    paddingLeft: "1em",
                    textAlign: "left",
                  }}
                >
                  <li>Halomot Button</li>
                  <li>Structured Block</li>
                  <li>Unfolding Sidebar</li>
                  <li>Blog Post Header</li>
                  <li>Fancy Notification</li>
                </ul>
              </li>
            </ul>
          </div>
          <div style={{ textAlign: "center", marginTop: "2em" }}>
            <HalomotButton
              text={t("ok_button")}
              onClick={onClose}
              gradient={
                isRTL
                  ? "linear-gradient(to right, var(--second-theme-color), var(--first-theme-color))"
                  : "linear-gradient(to right, var(--first-theme-color), var(--second-theme-color))"
              }
              fillWidth
            />
          </div>
        </div>
        <style jsx>{`
          .hover-link1,
          .hover-link2 {
            color: var(--foreground);
            text-decoration: none;
            position: relative;
            transition: color 0.3s ease-in-out;
          }
          .hover-link1::before,
          .hover-link2::before {
            position: absolute;
            content: "";
            width: 100%;
            height: 1px;
            background-color: var(--foreground);
            transform: scale(1, 1);
            transition:
              background-color 0.3s ease-in-out,
              transform 0.3s ease-in-out;
            bottom: 0px;
          }
          li {
            color: var(--foreground);
          }
          .hover-link1:hover {
            color: ${isRTL ? "#9077f2" : "#bd65f7"};
          }
          .hover-link2:hover {
            color: ${isRTL ? "#bd65f7" : "#9077f2"};
          }
          .hover-link1:hover::before {
            transform: scaleX(0);
          }
          .hover-link2:hover::before {
            transform: scaleX(0);
          }
          .link-perplexity:hover {
            color: #20b8cd;
          }
          .link-mistral:hover {
            color: #fa520f;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CreditModal;
