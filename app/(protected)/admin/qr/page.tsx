"use client";

import { useState } from "react";
import { QRCode } from "@/components/shared/qr-code";
import {
  DotStyle,
  MarkerBorderStyle,
  MarkerCenterStyle,
} from "@/lib/qr/types";

export default function QRGeneratorPage() {
  const [url, setUrl] = useState("https://example.com");

  const [fgColor, setFgColor] = useState("#000000");
  const [markerColor, setMarkerColor] = useState("#000000");

  const [hideLogo, setHideLogo] = useState(false);
  const [logo, setLogo] = useState("");

  const [scale, setScale] = useState(1);

  const [dotStyle, setDotStyle] =
    useState<DotStyle>("square");

  const [markerCenterStyle, setMarkerCenterStyle] =
    useState<MarkerCenterStyle>("square");

  const [markerBorderStyle, setMarkerBorderStyle] =
    useState<MarkerBorderStyle>("square");

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            QR Code Generator
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Create a customized QR code for your link.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 md:grid-cols-[1fr_360px]">

          {/* ========================================= */}
          {/* SETTINGS */}
          {/* ========================================= */}

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="space-y-7">

              {/* URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  URL
                </label>

                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
                />
              </div>

              {/* ========================================= */}
              {/* LOGO */}
              {/* ========================================= */}

              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium text-neutral-700">
                    Logo
                  </label>

                  <p className="mt-1 text-xs text-neutral-500">
                    Add your logo to the center of the QR code.
                  </p>
                </div>

                {/* SHOW / HIDE */}
                <div className="flex rounded-lg border border-neutral-200 p-1">
                  <button
                    type="button"
                    onClick={() => setHideLogo(false)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm transition ${
                      !hideLogo
                        ? "bg-neutral-100 font-medium text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Show
                  </button>

                  <button
                    type="button"
                    onClick={() => setHideLogo(true)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm transition ${
                      hideLogo
                        ? "bg-neutral-100 font-medium text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    Hide
                  </button>
                </div>

                {/* LOGO UPLOAD */}
                {!hideLogo && (
                  <div className="mt-3">

                    <label
                      htmlFor="logo-upload"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 py-6 transition hover:border-neutral-400 hover:bg-neutral-50"
                    >
                      {logo ? (
                        <>
                          <img
                            src={logo}
                            alt="Logo preview"
                            className="mb-3 h-12 w-12 object-contain"
                          />

                          <span className="text-sm font-medium text-neutral-700">
                            Logo uploaded
                          </span>

                          <span className="mt-1 text-xs text-neutral-400">
                            Click to replace
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="mb-2 h-8 w-8 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 16V4m0 0L8 8m4-4 4 4M5 20h14"
                            />
                          </svg>

                          <span className="text-sm font-medium text-neutral-700">
                            Upload your logo
                          </span>

                          <span className="mt-1 text-xs text-neutral-400">
                            PNG, JPG or SVG
                          </span>
                        </>
                      )}
                    </label>

                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (!file) return;

                        const reader = new FileReader();

                        reader.onload = () => {
                          setLogo(reader.result as string);
                        };

                        reader.readAsDataURL(file);
                      }}
                    />

                    {logo && (
                      <button
                        type="button"
                        onClick={() => setLogo("")}
                        className="mt-2 text-xs text-red-500 hover:text-red-600"
                      >
                        Remove logo
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ========================================= */}
              {/* COLORS */}
              {/* ========================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ColorInput
                  label="QR Color"
                  value={fgColor}
                  onChange={setFgColor}
                />

                <ColorInput
                  label="Marker Color"
                  value={markerColor}
                  onChange={setMarkerColor}
                />
              </div>

              {/* ========================================= */}
              {/* DOT STYLE */}
              {/* ========================================= */}

              <StyleSelector
                label="Dot Style"
                value={dotStyle}
                options={[
                  "square",
                  "dots",
                  "rounded",
                  "classy",
                  "classy-rounded",
                  "extra-rounded",
                ]}
                onChange={(value) =>
                  setDotStyle(value as DotStyle)
                }
              />

              {/* ========================================= */}
              {/* MARKER CENTER */}
              {/* ========================================= */}

              <StyleSelector
                label="Marker Center"
                value={markerCenterStyle}
                options={[
                  "square",
                  "dot",
                  "rounded",
                ]}
                onChange={(value) =>
                  setMarkerCenterStyle(
                    value as MarkerCenterStyle,
                  )
                }
              />

              {/* ========================================= */}
              {/* MARKER BORDER */}
              {/* ========================================= */}

              <StyleSelector
                label="Marker Border"
                value={markerBorderStyle}
                options={[
                  "square",
                  "rounded",
                  "dots",
                ]}
                onChange={(value) =>
                  setMarkerBorderStyle(
                    value as MarkerBorderStyle,
                  )
                }
              />

              {/* ========================================= */}
              {/* SIZE */}
              {/* ========================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">
                    Size
                  </label>

                  <span className="text-xs text-neutral-500">
                    {scale.toFixed(1)}x
                  </span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) =>
                    setScale(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* PREVIEW */}
          {/* ========================================= */}

          <QRPreview
            url={url}
            fgColor={fgColor}
            hideLogo={hideLogo}
            logo={logo}
            scale={scale}
            dotStyle={dotStyle}
            markerCenterStyle={markerCenterStyle}
            markerBorderStyle={markerBorderStyle}
            markerColor={markerColor}
          />
        </div>
      </div>
    </main>
  );
}

/* ====================================================== */
/* COLOR INPUT */
/* ====================================================== */

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        {label}
      </label>

      <div className="flex h-10 items-center gap-2 rounded-lg border text-black border-neutral-200 px-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
        />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm uppercase outline-none"
        />
      </div>
    </div>
  );
}

/* ====================================================== */
/* STYLE SELECTOR */
/* ====================================================== */

function StyleSelector({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        {label}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                active
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {option.replace("-", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ====================================================== */
/* QR PREVIEW */
/* ====================================================== */

function QRPreview({
  url,
  fgColor,
  hideLogo,
  logo,
  scale,
  dotStyle,
  markerCenterStyle,
  markerBorderStyle,
  markerColor,
}: {
  url: string;
  fgColor: string;
  hideLogo: boolean;
  logo?: string;
  scale: number;
  dotStyle: DotStyle;
  markerCenterStyle: MarkerCenterStyle;
  markerBorderStyle: MarkerBorderStyle;
  markerColor: string;
}) {
  /* ================================================== */
  /* DOWNLOAD SVG */
  /* ================================================== */

  const downloadSVG = () => {
    const svg = document.getElementById(
      "qr-code-preview",
    ) as SVGElement | null;

    if (!svg) {
      console.error("QR SVG not found");
      return;
    }

    const serializer = new XMLSerializer();

    let source = serializer.serializeToString(svg);

    /*
     * Add XML namespace if it doesn't already exist.
     */
    if (!source.includes("xmlns=")) {
      source = source.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    /*
     * Add XML declaration.
     */
    source =
      '<?xml version="1.0" standalone="no"?>\r\n' +
      source;

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "qr-code.svg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  };

  /* ================================================== */
  /* DOWNLOAD PNG */
  /* ================================================== */

  const downloadPNG = async () => {
    const svg = document.getElementById(
      "qr-code-preview",
    ) as SVGElement | null;

    if (!svg) {
      console.error("QR SVG not found");
      return;
    }

    const serializer = new XMLSerializer();

    let source = serializer.serializeToString(svg);

    if (!source.includes("xmlns=")) {
      source = source.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    /*
     * Convert SVG to Base64.
     */
    const svgBlob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl = URL.createObjectURL(svgBlob);

    const image = new Image();

    image.onload = () => {
      /*
       * Higher resolution PNG.
       */
      const multiplier = 3;

      const width = image.width * multiplier;
      const height = image.height * multiplier;

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(svgUrl);
        return;
      }

      /*
       * White background.
       *
       * This is important because transparent PNGs can
       * sometimes cause issues with QR scanners.
       */
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      context.drawImage(
        image,
        0,
        0,
        width,
        height,
      );

      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (!blob) return;

        const pngUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = pngUrl;
        link.download = "qr-code.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      console.error("Unable to convert QR code to PNG");
    };

    image.src = svgUrl;
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex flex-col items-center">

        {/* Preview Header */}
        <div className="mb-5 text-center">
          <h2 className="text-sm font-medium text-neutral-900">
            Preview
          </h2>

          <p className="mt-1 max-w-[280px] truncate text-xs text-neutral-500">
            {url || "Enter a URL"}
          </p>
        </div>

        {/* QR CONTAINER */}
        <div className="flex min-h-[300px] min-w-[300px] items-center justify-center rounded-xl border border-neutral-100 bg-white p-5">
          {url ? (
            <QRCode
              id="qr-code-preview"
              url={url}
              fgColor={fgColor}
              hideLogo={hideLogo}
              logo={logo || undefined}
              scale={scale}
              dotStyle={dotStyle}
              markerCenterStyle={markerCenterStyle}
              markerBorderStyle={markerBorderStyle}
              markerColor={markerColor}
            />
          ) : (
            <div className="text-center">
              <p className="text-sm text-neutral-400">
                Enter a URL
              </p>
            </div>
          )}
        </div>

        {/* DOWNLOAD BUTTONS */}
        <div className="mt-6 grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            onClick={downloadSVG}
            disabled={!url}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download SVG
          </button>

          <button
            type="button"
            onClick={downloadPNG}
            disabled={!url}
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download PNG
          </button>
        </div>

        {/* INFO */}
        <p className="mt-4 text-center text-xs leading-5 text-neutral-400">
          SVG is recommended for printing.
          <br />
          PNG is convenient for digital sharing.
        </p>
      </div>
    </div>
  );
}