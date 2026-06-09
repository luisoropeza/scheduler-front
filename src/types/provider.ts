export interface Provider {
  id: number;
  name: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
}

export interface ProviderRequest {
  name: string;
  specialty?: string;
  phone?: string;
  email?: string;
}
