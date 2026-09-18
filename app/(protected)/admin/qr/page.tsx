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
  const [hideLogo, setHideLogo] = useState(false);
  const [logo, setLogo] = useState("");
  const [scale, setScale] = useState(1);

  const [dotStyle, setDotStyle] = useState<DotStyle>("square");
  const [markerCenterStyle, setMarkerCenterStyle] =
    useState<MarkerCenterStyle>("square");
  const [markerBorderStyle, setMarkerBorderStyle] =
    useState<MarkerBorderStyle>("square");
  const [markerColor, setMarkerColor] = useState("#000000");

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Create a customized QR code for your URL.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Settings */}
          <div className="rounded-xl border bg-card p-6">
            <div className="space-y-6">
              {/* URL */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Website URL
                </label>

                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Foreground Color */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  QR Color
                </label>

                <div className="flex gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-11 w-14 cursor-pointer rounded border p-1"
                  />

                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 rounded-lg border bg-background px-4 outline-none"
                  />
                </div>
              </div>

              {/* Marker Color */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Marker Color
                </label>

                <div className="flex gap-3">
                  <input
                    type="color"
                    value={markerColor}
                    onChange={(e) => setMarkerColor(e.target.value)}
                    className="h-11 w-14 cursor-pointer rounded border p-1"
                  />

                  <input
                    type="text"
                    value={markerColor}
                    onChange={(e) => setMarkerColor(e.target.value)}
                    className="flex-1 rounded-lg border bg-background px-4 outline-none"
                  />
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Logo URL
                </label>

                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />

                <label className="mt-3 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hideLogo}
                    onChange={(e) => setHideLogo(e.target.checked)}
                  />

                  Hide logo
                </label>
              </div>

              {/* Dot Style */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Dot Style
                </label>

                <select
                  value={dotStyle}
                  onChange={(e) =>
                    setDotStyle(e.target.value as DotStyle)
                  }
                  className="w-full rounded-lg border bg-background px-4 py-3"
                >
                  <option value="square">Square</option>
                  <option value="dots">Dots</option>
                  <option value="rounded">Rounded</option>
                  <option value="classy">Classy</option>
                  <option value="classy-rounded">Classy Rounded</option>
                  <option value="extra-rounded">Extra Rounded</option>
                </select>
              </div>

              {/* Marker Center */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Marker Center Style
                </label>

                <select
                  value={markerCenterStyle}
                  onChange={(e) =>
                    setMarkerCenterStyle(
                      e.target.value as MarkerCenterStyle,
                    )
                  }
                  className="w-full rounded-lg border bg-background px-4 py-3"
                >
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                  <option value="rounded">Rounded</option>
                </select>
              </div>

              {/* Marker Border */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Marker Border Style
                </label>

                <select
                  value={markerBorderStyle}
                  onChange={(e) =>
                    setMarkerBorderStyle(
                      e.target.value as MarkerBorderStyle,
                    )
                  }
                  className="w-full rounded-lg border bg-background px-4 py-3"
                >
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                  <option value="dots">Dots</option>
                </select>
              </div>

              {/* Scale */}
              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-sm font-medium">
                    Scale
                  </label>

                  <span className="text-sm text-muted-foreground">
                    {scale}x
                  </span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="3"
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

          {/* Preview */}
          <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8">
            <h2 className="mb-6 text-lg font-semibold">
              Preview
            </h2>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              {url ? (
                <QRCode
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
                <div className="flex h-64 w-64 items-center justify-center text-sm text-muted-foreground">
                  Enter a URL
                </div>
              )}
            </div>

            <p className="mt-5 max-w-sm break-all text-center text-sm text-muted-foreground">
              {url}
            </p>

            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}