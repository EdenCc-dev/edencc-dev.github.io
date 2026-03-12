import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    children: React.ReactNode;
    content: React.ReactNode;
    isVisible: boolean;
    gap?: number;
    safety?: number;
}

export const TooltipClamped: React.FC<Props> = ({
    children,
    content,
    isVisible,
    gap = 8,
    safety = 12,
}) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [pos, setPos] = useState({ left: 0, top: 0, arrowX: 0 });
    const anchorRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isVisible) {
            timer = setTimeout(() => setShouldRender(true), 300);
        } else {
            setShouldRender(false);
        }
        return () => clearTimeout(timer);
    }, [isVisible]);

    const updatePosition = useCallback(() => {
        const trigger = anchorRef.current;
        const tooltip = tooltipRef.current;
        if (!trigger || !tooltip || !shouldRender) return;

        const tRect = trigger.getBoundingClientRect();
        const { width: tooltipW, height: tooltipH } = tooltip.getBoundingClientRect();
        const vw = window.innerWidth;

        const triggerCenterX = tRect.left + tRect.width / 2;
        const idealLeft = triggerCenterX - tooltipW / 2;
        const idealTop = tRect.top - tooltipH - gap;

        const clampedLeft = Math.max(safety, Math.min(idealLeft, vw - tooltipW - safety));
        const rawArrowX = triggerCenterX - clampedLeft;
        const arrowX = Math.max(16, Math.min(rawArrowX, tooltipW - 16));

        setPos({ left: clampedLeft, top: idealTop, arrowX });
    }, [shouldRender, gap, safety]);

    useLayoutEffect(() => {
        if (!shouldRender) return;

        let rafId = requestAnimationFrame(function tick() {
            updatePosition();
            rafId = requestAnimationFrame(tick);
        });

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [shouldRender, updatePosition]);

    return (
        <>
            <div ref={anchorRef}>
                {children}
            </div>
            
            {createPortal(
                <AnimatePresence>
                    {shouldRender && (
                        <motion.div
                            ref={tooltipRef}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                zIndex: 99999,
                                left: pos.left,
                                top: pos.top,
                                pointerEvents: "none",
                                willChange: "transform, opacity",
                                width: 'max-content',
                                maxWidth: `calc(100vw - ${safety * 2}px)`,
                            }}
                        >
                            <div style={{
                                position: "relative",
                                pointerEvents: "auto",
                                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
                            }}>
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    {content}
                                </div>
                                
                                <div style={{
                                    position: "absolute",
                                    bottom: -6,
                                    left: pos.arrowX,
                                    transform: "translateX(-50%)",
                                    width: 14,
                                    height: 7,
                                    background: "linear-gradient(to right, #FCE9BA, #FFDC7B)",
                                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                                }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};