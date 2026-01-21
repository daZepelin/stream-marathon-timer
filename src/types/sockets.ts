export type DonationPlatform = 'SE' | 'SL';
export type DonationType = 'superchat' | 'donation' | 'stars' | 'tip';

export interface IDonation {
  id: string;
  amount: number;
  currency: string;
  username: string;
  message?: string;
  date: Date;
  platform: DonationPlatform;
  donationType: DonationType;
  displayed?: boolean;
  minutesAdded?: number;
}

export interface IStreamLabsSocketProps {
  authKey: string;
}
