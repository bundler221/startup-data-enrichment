export interface Founder {
  name: string;
  role?: string;
  linkedin_url?: string;
}

export interface FundingRound {
  round_name: string;
  amount?: number;
  date?: string;
  investors?: string[];
}

export interface StartupData {
  startup_name: string;
  url_slug: string;
  short_description?: string;
  full_description?: string;
  startup_logo?: string;
  website?: string;
  headquarters?: string;
  founding_year?: number;
  sector?: string;
  funding_stage?: string;
  company_status?: string;
  company_size?: string;
  employees?: number;
  public_status?: string;
  total_funding_amount?: number;
  revenue?: string;
  valuation?: string;
  cin?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  founders?: Founder[];
  funding_stages?: FundingRound[];
}
