export interface ISpecialMultiplier {
    word: string[];
    multiplier: number;
    active: boolean;
}

export type StreamLabsDonationType = 'donation' | 'superchat' | 'stars';
export type StreamElementsDonationType = 'tip' | 'superchat';

export interface IDonationSourceToggles {
    streamLabs: Record<StreamLabsDonationType, boolean>;
    streamElements: Record<StreamElementsDonationType, boolean>;
}

export interface ISubathonTimerConfig {
    minutes: number;
    amount: number;
    donationSourceToggles?: Partial<IDonationSourceToggles>;
}

export const DEFAULT_DONATION_SOURCE_TOGGLES: IDonationSourceToggles = {
    streamLabs: {
        donation: true,
        superchat: true,
        stars: true,
    },
    streamElements: {
        tip: true,
        superchat: true,
    },
};

export const DEFAULT_TIMER_CONFIG: ISubathonTimerConfig = {
    minutes: 1,
    amount: 1,
    donationSourceToggles: DEFAULT_DONATION_SOURCE_TOGGLES,
};