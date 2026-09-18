"use client";

import {
  getQRAsCanvas,
  getQRAsSVGDataUri,
  getQRData,
} from "@/lib/qr";
import { toast } from "sonner";
import { QRCode } from "@/components/shared/qr-code";

import {
  DotStyle,
  MarkerBorderStyle,
  MarkerCenterStyle,
} from "@/lib/qr/types";
import LayoutHeader from "@/components/dashboard/header";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShimmerDots } from "@/components/ui/shimmer-dots";
import { Icons } from "@/components/shared/icons";

/* ============================================================
   DEFAULT COLORS
   ============================================================ */

const DEFAULT_COLORS = [
  "#000000",
  "#C73E33",
  "#DF6547",
  "#F4B3D7",
  "#F6CF54",
  "#49A065",
  "#2146B7",
  "#AE49BF",
];

/* ============================================================
   PAGE
   ============================================================ */

export default function QRGeneratorPage() {
  /* ----------------------------------------------------------
     URL
  ---------------------------------------------------------- */

  const [url, setUrl] = useState("https://example.com");

  /* ----------------------------------------------------------
     QR DESIGN
  ---------------------------------------------------------- */

  const [fgColor, setFgColor] = useState("#000000");

  const [markerColor, setMarkerColor] =
    useState("#000000");

  const [hideLogo, setHideLogo] = useState(false);

  const [logo, setLogo] = useState("");

  const [dotStyle, setDotStyle] =
    useState<DotStyle>("square");

  const [markerCenterStyle, setMarkerCenterStyle] =
    useState<MarkerCenterStyle>("square");

  const [markerBorderStyle, setMarkerBorderStyle] =
    useState<MarkerBorderStyle>("square");

  /* ----------------------------------------------------------
     Hidden file input
  ---------------------------------------------------------- */

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ----------------------------------------------------------
     QR DATA
  ---------------------------------------------------------- */

  const qrData = useMemo(() => {
    if (!url) return null;

    return getQRData({
      url,
      fgColor,
      hideLogo,
      logo: logo || undefined,
      dotStyle,
      markerCenterStyle,
      markerBorderStyle,
      markerColor,
    });
  }, [
    url,
    fgColor,
    hideLogo,
    logo,
    dotStyle,
    markerCenterStyle,
    markerBorderStyle,
    markerColor,
  ]);

  /* ==========================================================
     LOGO UPLOAD
  ========================================================== */

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  /* ==========================================================
     DOWNLOAD
  ========================================================== */

  const downloadQR = async (
    format: "svg" | "png" | "jpg",
  ) => {
    if (!qrData) return;

    try {
      let downloadUrl: string;

      if (format === "svg") {
        downloadUrl = await getQRAsSVGDataUri(qrData);
      } else {
        downloadUrl = (await getQRAsCanvas(
          qrData,
          format === "png"
            ? "image/png"
            : "image/jpeg",
        )) as string;
      }

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `qr-code.${format}`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  /* ==========================================================
     COPY QR
  ========================================================== */

  const copyQR = async () => {
    if (!qrData) return;

    try {
      const canvas = (await getQRAsCanvas(
        qrData,
        "image/png",
        true,
      )) as HTMLCanvasElement;

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        try {
          const item = new ClipboardItem({
            "image/png": blob,
          });

          await navigator.clipboard.write([
            item,
          ]);

          toast.success("QR code copied!");
        } catch (error) {
          console.error(
            "Failed to copy QR code:",
            error,
          );
        }
      });
    } catch (error) {
      console.error(
        "Failed to generate QR image:",
        error,
      );
    }
  };

  /* ==========================================================
     RESET
  ========================================================== */

  const resetDesign = () => {
    setFgColor("#000000");
    setMarkerColor("#000000");
    setHideLogo(false);
    setLogo("");
    setDotStyle("square");
    setMarkerCenterStyle("square");
    setMarkerBorderStyle("square");
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <LayoutHeader
        heading="QR Code Generator"
        text="Create and customize a QR code for your link."
      />
      <div className="w-full">
        {/* ====================================================
            URL INPUT
        ==================================================== */}

        <div className="mb-4 rounded-xl border p-4">
          <label className="mb-2 block text-sm font-medium">
            URL
          </label>

          <Input
            type="url"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            placeholder="https://example.com"
            className="h-10 w-full rounded-lg"
          />
        </div>

        {/* ====================================================
            QR DESIGN CARD
        ==================================================== */}

        <div className="rounded-2xl border p-4 shadow-sm">
          {/* ==================================================
              PREVIEW
          ================================================== */}

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">
                  QR Code Preview
                </span>
              </div>

              {qrData && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadQR("png")
                    }
                    title="Download QR code"
                  >
                    <Icons.download size={15} />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={copyQR}
                    title="Copy QR code"
                  >
                    <Icons.copy size={15} />
                  </Button>
                </div>
              )}
            </div>

            {/* Preview box */}

            <div className="relative flex h-44 items-center justify-center overflow-hidden bg-white rounded-md border">

              <ShimmerDots className="opacity-30 [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />

              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="h-full w-full bg-[radial-gradient(#d4d4d4_0.7px,transparent_0.7px)] [background-size:4px_4px]" />
              </div>

              {/* QR */}

              <div className="relative z-10 flex items-center justify-center">
                {url && (
                  <QRCode
                    url={url}
                    fgColor={fgColor}
                    hideLogo={hideLogo}
                    logo={logo || undefined}
                    scale={1}
                    dotStyle={dotStyle}
                    markerCenterStyle={
                      markerCenterStyle
                    }
                    markerBorderStyle={
                      markerBorderStyle
                    }
                    markerColor={markerColor}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ==================================================
              LOGO + DOT STYLE
          ================================================== */}

          <div className="mb-5 grid grid-cols-2 gap-4">

            {/* LOGO */}

            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <label className="text-sm font-medium">
                  Logo
                </label>
              </div>

              <SegmentedControl
                count={2}
                activeIndex={
                  hideLogo ? 1 : 0
                }
              >
                <SegmentTab
                  active={!hideLogo}
                  onClick={() =>
                    setHideLogo(false)
                  }
                >
                  <span className="text-sm">
                    Show
                  </span>
                </SegmentTab>

                <SegmentTab
                  active={hideLogo}
                  onClick={() =>
                    setHideLogo(true)
                  }
                >
                  <span className="text-sm">
                    Hide
                  </span>
                </SegmentTab>
              </SegmentedControl>

              {/* Upload */}

              {!hideLogo && (
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  <Button
                    variant="secondary"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="w-full rounded-lg"
                  >
                    {logo
                      ? "Change logo"
                      : "Upload logo"}
                  </Button>
                </div>
              )}
            </div>

            {/* DOT STYLE */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Dot style
              </label>

              <SegmentedControl
                count={3}
                activeIndex={
                  dotStyle === "rounded"
                    ? 1
                    : dotStyle ===
                      "extra-rounded"
                      ? 2
                      : 0
                }
              >
                <SegmentTab
                  active={
                    dotStyle === "square"
                  }
                  onClick={() =>
                    setDotStyle("square")
                  }
                  ariaLabel="Square dots"
                >
                  <SquareDotIcon />
                </SegmentTab>

                <SegmentTab
                  active={
                    dotStyle === "rounded"
                  }
                  onClick={() =>
                    setDotStyle("rounded")
                  }
                  ariaLabel="Rounded dots"
                >
                  <RoundedDotIcon />
                </SegmentTab>

                <SegmentTab
                  active={
                    dotStyle ===
                    "extra-rounded"
                  }
                  onClick={() =>
                    setDotStyle(
                      "extra-rounded",
                    )
                  }
                  ariaLabel="Extra rounded dots"
                >
                  <ExtraRoundedDotIcon />
                </SegmentTab>
              </SegmentedControl>
            </div>
          </div>

          {/* ==================================================
              MARKER CENTER + BORDER
          ================================================== */}

          <div className="mb-5 grid grid-cols-2 gap-4">

            {/* MARKER CENTER */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Marker center
              </label>

              <SegmentedControl
                count={2}
                activeIndex={
                  markerCenterStyle ===
                    "circle"
                    ? 1
                    : 0
                }
              >
                <SegmentTab
                  active={
                    markerCenterStyle ===
                    "square"
                  }
                  onClick={() =>
                    setMarkerCenterStyle(
                      "square",
                    )
                  }
                  ariaLabel="Square marker center"
                >
                  <MarkerCenterSquareIcon />
                </SegmentTab>

                <SegmentTab
                  active={
                    markerCenterStyle ===
                    "circle"
                  }
                  onClick={() =>
                    setMarkerCenterStyle(
                      "circle",
                    )
                  }
                  ariaLabel="Circle marker center"
                >
                  <MarkerCenterCircleIcon />
                </SegmentTab>
              </SegmentedControl>
            </div>

            {/* MARKER BORDER */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Marker border
              </label>

              <SegmentedControl
                count={3}
                activeIndex={
                  markerBorderStyle ===
                    "rounded-square"
                    ? 1
                    : markerBorderStyle ===
                      "circle"
                      ? 2
                      : 0
                }
              >
                <SegmentTab
                  active={
                    markerBorderStyle ===
                    "square"
                  }
                  onClick={() =>
                    setMarkerBorderStyle(
                      "square",
                    )
                  }
                  ariaLabel="Square marker border"
                >
                  <MarkerBorderSquareIcon />
                </SegmentTab>

                <SegmentTab
                  active={
                    markerBorderStyle ===
                    "rounded-square"
                  }
                  onClick={() =>
                    setMarkerBorderStyle(
                      "rounded-square",
                    )
                  }
                  ariaLabel="Rounded marker border"
                >
                  <MarkerBorderRoundedIcon />
                </SegmentTab>

                <SegmentTab
                  active={
                    markerBorderStyle ===
                    "circle"
                  }
                  onClick={() =>
                    setMarkerBorderStyle(
                      "circle",
                    )
                  }
                  ariaLabel="Circle marker border"
                >
                  <MarkerBorderCircleIcon />
                </SegmentTab>
              </SegmentedControl>
            </div>
          </div>

          {/* ==================================================
              DOT COLOR
          ================================================== */}

          <ColorSection
            label="Dot Color"
            color={fgColor}
            onChange={setFgColor}
          />

          {/* ==================================================
              MARKER COLOR
          ================================================== */}

          <div className="mt-5">
            <ColorSection
              label="Marker Color"
              color={markerColor}
              onChange={setMarkerColor}
            />

            {markerColor !== fgColor && (
              <button
                type="button"
                onClick={() =>
                  setMarkerColor(fgColor)
                }
                className="mt-1 text-xs underline-offset-2 hover:text-neutral-600 hover:underline"
              >
                Match dot color
              </button>
            )}
          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="mt-6 flex items-center justify-between gap-2 pt-4">
            <Button
              variant="outline"
              onClick={resetDesign}
            >
              <Icons.reset size={15} className="lg:mr-2 mr-0"/>
              <span className="lg:block hidden">Reset</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  downloadQR("png")
                }
              >
                <Icons.download size={15} className="lg:mr-2 mr-0 lg:block hidden"/>
                Download PNG
              </Button>

              <Button
                onClick={() =>
                  downloadQR("svg")
                }
              >
                <Icons.download size={15} className="lg:mr-2 mr-0 lg:block hidden"/>
                Download SVG
              </Button>
            </div>

            {/* <Button
              onClick={() =>
                downloadQR("jpg")
              }
              >
              Download JPG
              </Button> */}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   SEGMENTED CONTROL
   ============================================================ */

function SegmentedControl({
  activeIndex,
  count,
  children,
}: {
  activeIndex: number;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-1 flex h-11 rounded-xl bg-secondary p-1">

      {/* Active background */}

      <div
        className="pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-primary-foreground dark:bg-primary transition-all"
        style={{
          width: `calc((100% - 8px) / ${count})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
          transition:
            "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)",
          boxShadow:
            "0px 2px 6px 0px rgba(0,0,0,0.10), 0px 0px 2px 0px rgba(0,0,0,0.05)",
        }}
      />

      {children}
    </div>
  );
}

/* ============================================================
   SEGMENT TAB
   ============================================================ */

function SegmentTab({
  active,
  onClick,
  children,
  ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className="relative flex flex-1 items-center justify-center rounded-lg hover:bg-transparent focus:bg-transparent focus"
    >
      {children}
    </Button>
  );
}

/* ============================================================
   COLOR SECTION
   ============================================================ */

function ColorSection({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div className="flex items-center gap-5">

        {/* Color input */}

        <div className="flex h-9 w-32 shrink-0 rounded-md shadow-sm justify-between items-center">

          <Input
            type="color"
            value={color}
            onChange={(e) =>
              onChange(e.target.value)
            }
            className="w-12 cursor-pointer p-1"
          />

          <Input
            type="text"
            value={color}
            onChange={(e) =>
              onChange(e.target.value)
            }
            className="flex-1"
          />
        </div>

        {/* Swatches */}

        <div className="flex flex-wrap items-center gap-3">
          {DEFAULT_COLORS.map(
            (swatch) => {
              const selected =
                color.toUpperCase() ===
                swatch.toUpperCase();

              return (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Use ${swatch}`}
                  aria-pressed={selected}
                  onClick={() =>
                    onChange(swatch)
                  }
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${selected
                    ? "ring-1 ring-black ring-offset-[3px]"
                    : "hover:ring-4 hover:ring-black/10 dark:hover:ring-white/10"
                    }`}
                  style={{
                    backgroundColor: swatch,
                  }}
                >
                  {selected && (
                    <Icons.check size={15} className="text-white" />
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ICONS
   ============================================================ */
function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3V15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M7.5 11L12 15.5L16.5 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 20H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================
   DOT STYLE ICONS
   ============================================================ */

function SquareDotIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <rect width="5" height="5" />
      <rect x="10" width="5" height="5" />
      <rect x="5" y="10" width="5" height="5" />
      <rect x="15" width="5" height="5" />
      <rect x="15" y="10" width="5" height="5" />
      <rect y="5" width="5" height="5" />
      <rect y="15" width="5" height="5" />
      <rect x="10" y="5" width="5" height="5" />
      <rect x="15" y="15" width="5" height="5" />
      <rect x="10" y="15" width="5" height="5" />
    </svg>
  );
}

function RoundedDotIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <circle cx="2.5" cy="2.5" r="2.5" />
      <circle cx="12.5" cy="2.5" r="2.5" />
      <circle cx="7.5" cy="12.5" r="2.5" />
      <circle cx="17.5" cy="2.5" r="2.5" />
      <circle cx="17.5" cy="12.5" r="2.5" />
      <circle cx="2.5" cy="7.5" r="2.5" />
      <circle cx="2.5" cy="17.5" r="2.5" />
      <circle cx="12.5" cy="7.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <circle cx="12.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function ExtraRoundedDotIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <circle
        cx="7.5"
        cy="12.5"
        r="2.5"
      />

      <path d="M0 7.5C0 8.88 1.12 10 2.5 10S5 8.88 5 7.5V2.5C5 1.12 3.88 0 2.5 0S0 1.12 0 2.5V7.5Z" />

      <circle
        cx="2.5"
        cy="17.5"
        r="2.5"
      />

      <path d="M15 7.5C15 8.88 13.88 10 12.5 10S10 8.88 10 7.5V5C10 2.24 12.24 0 15 0H17.5C18.88 0 20 1.12 20 2.5S18.88 5 17.5 5H15V7.5Z" />

      <path d="M20 15C20 17.76 17.76 20 15 20H12.5C11.12 20 10 18.88 10 17.5S11.12 15 12.5 15H15V12.5C15 11.12 16.12 10 17.5 10S20 11.12 20 12.5V15Z" />
    </svg>
  );
}

/* ============================================================
   MARKER CENTER ICONS
   ============================================================ */

function MarkerCenterSquareIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <rect
        x="1.25"
        y="1.25"
        width="17.5"
        height="17.5"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="2.5"
      />

      <rect
        x="5"
        y="5"
        width="10"
        height="10"
        fill="currentColor"
      />
    </svg>
  );
}

function MarkerCenterCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <rect
        x="1.25"
        y="1.25"
        width="17.5"
        height="17.5"
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="2.5"
      />

      <circle
        cx="10"
        cy="10"
        r="5"
        fill="currentColor"
      />
    </svg>
  );
}

/* ============================================================
   MARKER BORDER ICONS
   ============================================================ */

function MarkerBorderSquareIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <rect
        x="1.25"
        y="1.25"
        width="17.5"
        height="17.5"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function MarkerBorderRoundedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <rect
        x="1.25"
        y="1.25"
        width="17.5"
        height="17.5"
        rx="3.75"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function MarkerBorderCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle
        cx="10"
        cy="10"
        r="8.75"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}