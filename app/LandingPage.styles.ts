import styled, { css } from "styled-components";

export const maxSectionWidth = "1536px";

export const Container = styled.div<{ isRTL: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isRTL ? "row-reverse" : "row")};
  height: 100vh;
`;

export const ContentArea = styled.div<{ isRTL: boolean; isMobile: boolean }>`
  flex: 1;
  height: ${(props) => (props.isMobile ? "calc(100vh - 56px)" : "100vh")};
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  ${({ isRTL }) =>
    isRTL
      ? css`
          direction: rtl;
        `
      : css`
          direction: ltr;
        `}
`;

export const Section1 = styled.div<{}>`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Section = styled.div<{ id: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const addRTLProps = (props: any, isRTL: boolean) => ({
  ...props,
  desktopTextAlign: isRTL ? ("right" as "right") : ("left" as "left"),
  textDirection: isRTL ? ("rtl" as "rtl") : ("ltr" as "ltr"),
});

export const headlineProps = {
  textColor: "var(--foreground)",
  desktopPadding: { left: "20px", right: "20px", top: "0px", bottom: "0px" },
  mobilePadding: { left: "4px", right: "4px", top: "0px", bottom: "0px" },
  desktopFontSize: "56px",
  mobileFontSize: "32px",
};

export const textProps = {
  textColor: "var(--foreground)",
  desktopPadding: { left: "23px", right: "23px", top: "6px", bottom: "24px" },
  mobilePadding: { left: "10px", right: "10px", top: "3px", bottom: "16px" },
  desktopFontSize: "18px",
  mobileFontSize: "14px",
};

export const contentProps = {
  textColor: "var(--foreground)",
  desktopPadding: { left: "24px", right: "24px", top: "2px", bottom: "40px" },
  mobilePadding: { left: "10px", right: "10px", top: "0px", bottom: "40px" },
  desktopFontSize: "18px",
  mobileFontSize: "14px",
};

export const footerContentProps = {
  textColor: "var(--foreground)",
  desktopPadding: { left: "24px", right: "24px", top: "16px", bottom: "16px" },
  mobilePadding: { left: "10px", right: "10px", top: "16px", bottom: "16px" },
  desktopFontSize: "18px",
  mobileFontSize: "14px",
};
