"use client";

import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useMemo } from "react";

type AdClickData = {
  adContainerId: string;
  googleQueryId: string | null;
  adClickTime: number;
  publisherId?: string | null;
  adk?: string | null;
  adf?: string | null;
  slotname?: string | null;
  adSize?: string | null;
};

// 自定义的 useEffectEvent 钩子，用于添加和移除事件监听器
function useEffectEvent(eventType: string, callback: (event: Event) => void) {
  useEffect(() => {
    window.addEventListener(eventType, callback);
    return () => {
      window.removeEventListener(eventType, callback);
    };
  }, [callback, eventType]);
}

const ElClick: React.FC = () => {
  const isBlurTriggered = useRef<boolean>(false);
  const isBeforeUnloadHandled = useRef<boolean>(false);
  const pendingAdDataRef = useRef<AdClickData | null>(null);

  const collectAdData = useCallback(() => {
    try {
      const activeElement = document.activeElement as HTMLIFrameElement | null;
      if (!activeElement || activeElement.tagName !== "IFRAME") return null;

      // 兼容 AdSense (.adsbygoogle), ADX/GPT (.gpt-slot, .ad-placeholder), 以及全屏弹窗广告 (google_vignette)
      const adContainer = activeElement.closest(".adsbygoogle, .gpt-slot, .ad-placeholder, [id^='google_vignette'], [id^='div-gpt-ad']") || activeElement.parentElement;
      const iframeSrc = activeElement.getAttribute("src") || "";
      
      if (adContainer) {
        let publisherId, adk, adf, slotname, adSize;
        try {
          if (iframeSrc && iframeSrc.startsWith("http")) {
            const formatIframeSrc = new URL(iframeSrc);
            const iframeSearchParams = new URLSearchParams(formatIframeSrc.search);
            publisherId = iframeSearchParams.get("client");
            adk = iframeSearchParams.get("adk");
            adf = iframeSearchParams.get("adf");
            slotname = iframeSearchParams.get("slotname");
            adSize = iframeSearchParams.get("format");
          }
        } catch (e) {
          console.warn("解析 iframe URL 失败:", e);
        }

        return {
          adContainerId: adContainer.getAttribute("id") || "unknown",
          googleQueryId: activeElement.getAttribute("data-google-query-id"),
          adClickTime: Date.now(),
          publisherId,
          adk,
          adf,
          slotname,
          adSize
        };
      }
      return null;
    } catch (error) {
      console.error("Error collecting ad data:", error);
      return null;
    }
  }, []);

  const trackAdClick = useCallback(() => {
    const adData = pendingAdDataRef.current ?? collectAdData();
    if (adData) {
      // window.umami.track((props) => ({
      //   ...props,
      //   name: "adClick",
      //   event: "visibilitychange",
      //   data: {
      //     ...adData,
      //   },
      // }));
      window.ttq.track("Purchase", {
        value: 0.2,
        currency: "USD",
        content_type: "product",
        content_name: "Ad Click Conversion"
      });
      pendingAdDataRef.current = null;
    }
  }, [collectAdData]);

  const debouncedTrackAdClick = useMemo(
    () => debounce(trackAdClick, 500),
    [trackAdClick]
  );

  const handleBeforeUnload = useCallback(
    () => {
      if (isBeforeUnloadHandled.current) return;
      const adData = pendingAdDataRef.current ?? collectAdData();
      if (adData) {
        // 上报数据
        // window.umami.track((props) => ({
        //   ...props,
        //   name: "adClick",
        //   event: "beforeunload",
        //   data: {
        //     ...adData,
        //   },
        // }));
        window.ttq.track("Purchase", {
          value: 0.2,
          currency: "USD",
          content_type: "product",
          content_name: "Ad Click Conversion"
        });
        console.log(JSON.stringify(adData));
        // 使用更简洁的方式触发像素跟踪
        isBeforeUnloadHandled.current = true;
        pendingAdDataRef.current = null;
      }
    },
    [collectAdData]
  );

  const handleBlur = useCallback(() => {
    const activeElement = document.activeElement as HTMLIFrameElement | null;
    if (activeElement?.tagName === "IFRAME") {
      pendingAdDataRef.current = collectAdData();
      isBlurTriggered.current = true;
      setTimeout(() => {
        isBlurTriggered.current = false;
      }, 300);
    }
  }, [collectAdData]);

  const handleVisibilityChange = useCallback(
    () => {
      if (document.visibilityState === "hidden" && isBlurTriggered.current) {
        debouncedTrackAdClick();
      }
    },
    [debouncedTrackAdClick]
  );

  // 使用自定义的 useEffectEvent 钩子添加事件监听器
  useEffectEvent("beforeunload", handleBeforeUnload);
  useEffectEvent("blur", handleBlur);
  useEffectEvent("visibilitychange", handleVisibilityChange);

  return null; // This component does not render anything
};

export default ElClick;
