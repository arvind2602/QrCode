import React, { createRef, useState } from "react";
import QRCode from "react-qr-code";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import "./App.css";

const App = () => {
  const [qrValue, setQrValue] = useState("");
  const ref = createRef(null);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  const download = (image, { name = "Qr Code", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);
  return (
    <div className="container">
      <div className="banner">
  
        <div className="social-links">
          <a href="https://github.com/arvind2602" target="_blank" rel="noopener noreferrer" className="social-link github">
            <FaGithub/>
          </a>
          <a href="https://www.linkedin.com/in/arvind-gupta-" target="_blank" rel="noopener noreferrer"className="social-link linkedin">
            <CiLinkedin/>
          </a>
          <a href="https://twitter.com/arvind01_ai" target="_blank" rel="noopener noreferrer"className="social-link twitter">
            <FaTwitter/>
          </a>
        </div>
      </div>
      <h1>QrCode Generator </h1>

      <div className="qr-code-container" ref={ref} >
        <QRCode
          value={qrValue}
          size={256}
          className="qr-code"
          viewBox={`0 0 256 256`}
        />
      </div>
      <input
        type="text"
        value={qrValue}
        onChange={(e) => setQrValue(e.target.value)}
        placeholder="Enter text or URL"
      />
      <button onClick={downloadScreenshot}>
        Download QR Code
      </button>
    </div>
  );
}

export default App;