export type DonationPlatform = 'SE' | 'SL';
export type DonationType = 'superchat' | 'donation' | 'stars';

export interface IDonation {
  amount: number;
  currency: string;
  username: string;
  message?: string;
  date: Date;
  platform: DonationPlatform;
  donationType: DonationType;
}

export interface IStreamLabsSocketProps {
  authKey: string;
  onDonationAdd: (donation: IDonation) => void;
}
