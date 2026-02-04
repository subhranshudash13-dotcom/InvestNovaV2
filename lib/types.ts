export type RiskTolerance = 'low' | 'med' | 'high';
export type InvestmentHorizon = 'short' | 'med' | 'long';

export interface Profile {
  id: string;
  risk_tolerance: RiskTolerance;
  horizon: InvestmentHorizon;
  investment_amount: number;
}

export interface Recommendation {
  id?: string;
  user_id?: string;
  symbol: string;
  company_name: string;
  current_price: number;
  match_score: number;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  reasoning: string;
  confidence_score: number;
  projected_return: number;
  created_at?: string;
}

export interface ML_Data {
  consensus_prediction: number;
  model_weights: {
    LSTM: number;
    XGBoost: number;
    Transformer: number;
  };
  confidence_score: number;
}
