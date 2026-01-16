// Shared fields
export interface BaseIncome {
  source: string;
  amount: number;
  description?: string;
}

// insert Payloads
export interface IncomePayload extends BaseIncome {}

// insert Response
export type IncomeResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

// Income items type
export interface IncomeItem extends BaseIncome {
  id: string;
  created_at: string;
}

// API Income fetch response type
export interface FetchIncomesResponse {
  success: boolean;
  data: IncomeItem[];
}
