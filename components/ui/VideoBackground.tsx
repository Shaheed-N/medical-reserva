'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface VideoBackgroundProps {
    videoSrc?: string;
    posterSrc?: string;
    fallbackVideoSrc?: string;
    overlayClassName?: string;
    children?: React.ReactNode;
}

// Pexels medical/healthcare video URLs
const DEFAULT_VIDEOS = [
    'https://videos.pexels.com/video-files/4021775/4021775-uhd_2560_1440_25fps.mp4',
    'https://videos.pexels.com/video-files/3195709/3195709-uhd_2732_1440_25fps.mp4',
    'https://videos.pexels.com/video-files/7579977/7579977-uhd_2560_1440_25fps.mp4'
];

export function VideoBackground({
    videoSrc = DEFAULT_VIDEOS[0],
    posterSrc = 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1920',
    fallbackVideoSrc = DEFAULT_VIDEOS[1],
    overlayClassName = 'bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent',
    children
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });

    useEffect(() => {
        if (videoRef.current) {
            if (isInView) {
                videoRef.current.play().catch(() => {
                    // Autoplay was prevented, fall back to poster
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isInView]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 z-10 ${overlayClassName}`} />

            {/* Video Element */}
            <motion.video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster={posterSrc}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            >
                <source src={videoSrc} type="video/mp4" />
                <source src={fallbackVideoSrc} type="video/mp4" />
            </motion.video>

            {/* Animated Background Particles */}
            <div className="absolute inset-0 z-5 opacity-30">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-96 h-96 rounded-full bg-[#0F766E]/20 blur-3xl"
                        animate={{
                            x: [0, 100, -50, 0],
                            y: [0, -50, 100, 0],
                            scale: [1, 1.2, 0.9, 1],
                        }}
                        transition={{
                            duration: 20 + i * 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            left: `${20 * i}%`,
                            top: `${15 * i}%`,
                        }}
                    />
                ))}
            </div>

            {children}
        </div>
    );
}
