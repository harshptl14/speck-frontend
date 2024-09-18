// Declaring YT and onYouTubeIframeAPIReady globally
declare global {
    interface Window {
        YT: typeof YT;
        onYouTubeIframeAPIReady: () => void;
    }
}

// Declare the YT namespace and the necessary interfaces/classes
declare namespace YT {
    interface PlayerOptions {
        height: string;
        width: string;
        videoId: string;
        events?: {
            onReady?: (event: PlayerEvent) => void;
            onStateChange?: (event: OnStateChangeEvent) => void;
        };
    }

    class Player {
        constructor(elementId: string | HTMLElement, options: PlayerOptions);
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        seekTo(seconds: number, allowSeekAhead: boolean): void;
    }

    interface PlayerEvent {
        target: Player;
    }

    interface OnStateChangeEvent extends PlayerEvent {
        data: number;
    }

    namespace PlayerState {
        const UNSTARTED: number;
        const ENDED: number;
        const PLAYING: number;
        const PAUSED: number;
        const BUFFERING: number;
        const CUED: number;
    }
}

declare module "https://www.youtube.com/iframe_api" {
    export interface YT {
        Player: any;
    }
}


export { YT };
