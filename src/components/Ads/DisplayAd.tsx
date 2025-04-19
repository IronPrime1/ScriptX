// components/AdSenseBanner.tsx
import { useEffect } from "react";

const DisplayAd = () => {
  useEffect(() => {
    try {
      // Trigger AdSense ad push
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9561931285285143"
        data-ad-slot="8741370308"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default DisplayAd;
