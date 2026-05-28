import React, { createRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub, FaTwitter, FaEye, FaShareNodes, FaDownload } from "react-icons/fa6";
import "./App.css";

const App = () => {
  const [qrValue, setQrValue] = useState("");
  const [visitorCount, setVisitorCount] = useState(null);
  const [toast, setToast] = useState("");
  const ref = createRef(null);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("https://api.counterapi.dev/v1/projects/arvind2602-qrcode/namespaces/default/counters/visitors/up");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.value === 'number') {
            setVisitorCount(data.value + 10000);
            localStorage.setItem('qr_visitor_count', data.value.toString());
            return;
          }
        }
      } catch (e) {
        console.warn("Visitor API failed, using fallback:", e);
      }

      // Fallback local storage visitor counter
      let stored = localStorage.getItem('qr_visitor_count');
      let currentCount = 0;
      if (stored) {
        currentCount = parseInt(stored, 10) + 1;
      } else {
        currentCount = 1;
      }
      localStorage.setItem('qr_visitor_count', currentCount.toString());
      setVisitorCount(10000 + currentCount);
    };

    fetchCount();
  }, []);

  const getFileNameFromValue = (value) => {
    if (!value) return "qr-code";

    try {
      let urlString = value.trim();
      if (!/^https?:\/\//i.test(urlString)) {
        urlString = 'http://' + urlString;
      }
      const url = new URL(urlString);
      let hostname = url.hostname.replace('www.', '');
      let pathname = url.pathname.replace(/\/$/, '').replace(/\//g, '-');
      let name = hostname + pathname;
      name = name.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      return name ? `qr-${name}` : "qr-code";
    } catch (e) {
      let cleanText = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_ ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return cleanText ? `qr-${cleanText}` : "qr-code";
    }
  };

  const download = (image, { name = "Qr Code", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const downloadScreenshot = () => {
    const name = getFileNameFromValue(qrValue);
    takeScreenShot(ref.current).then((image) => {
      download(image, { name });
      showToast("Downloaded!");
    });
  };

  const shareQR = async () => {
    try {
      const screenshot = await takeScreenShot(ref.current);
      const res = await fetch(screenshot);
      const blob = await res.blob();
      const fileName = `${getFileNameFromValue(qrValue)}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QR Code",
          text: `QR Code for: ${qrValue}`,
          files: [file],
        });
        showToast("Shared!");
      } else {
        // Fallback: copy the link/text to clipboard
        await navigator.clipboard.writeText(qrValue);
        showToast("Link copied to clipboard!");
      }
    } catch (e) {
      if (e.name !== "AbortError") showToast("Share failed.");
    }
  };

  return (
    <div className="container">
      {/* Top bar */}
      <div className="banner">
        <span className="banner-title">QR Generator</span>
        <div className="social-links">
          <a href="https://github.com/arvind2602" target="_blank" rel="noopener noreferrer" className="social-link github" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/arvind-gupta-" target="_blank" rel="noopener noreferrer" className="social-link linkedin" aria-label="LinkedIn">
            <CiLinkedin />
          </a>
          <a href="https://twitter.com/arvind01_ai" target="_blank" rel="noopener noreferrer" className="social-link twitter" aria-label="Twitter">
            <FaTwitter />
          </a>
        </div>
      </div>

      {/* Card body */}
      <div className="card-body">
        <h1>Create QR Code</h1>
        <p className="subtitle">Paste any URL or text below</p>

        {/* QR preview */}
        <div className="qr-code-container" ref={ref}>
          <QRCode
            value={qrValue || " "}
            size={172}
            className="qr-code"
            viewBox="0 0 256 256"
            bgColor="transparent"
          />
        </div>

        {/* Input */}
        <div className="input-wrapper">
          <input
            type="text"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            placeholder="e.g. https://example.com"
            aria-label="QR code content"
          />
        </div>

        {/* Actions */}
        <div className="btn-row">
          <button className="btn-primary" onClick={downloadScreenshot} disabled={!qrValue.trim()}>
            <FaDownload />
            Download
          </button>
          <button className="btn-secondary" onClick={shareQR} disabled={!qrValue.trim()}>
            <FaShareNodes />
            Share
          </button>
        </div>

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}

        {/* Visitor count */}
        {visitorCount !== null && (
          <div className="visitor-badge">
            <FaEye className="visitor-icon" />
            <span>{visitorCount.toLocaleString()} visitors</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;