export const iconOptions = [
  "desktop-outline", // computer
  "phone-portrait-outline", // cellphone
  "airplane-outline", // travel
  "home-outline", // house
  "cash-outline", // money
  "shirt-outline", // dress & short
  "briefcase-outline", // business
] as const;

export type IconName = (typeof iconOptions)[number];

export interface BaseGoal {
  goal_name: string;
  target_amount: number;
  target_date: string;
  description?: string;
  icon_name?: IconName;
}

export interface GoalPayload extends BaseGoal {}

export type GoalResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

// goal items type
export interface GoalItems extends BaseGoal {
  goal_id: string;
  current_amount: number;
  start_date: string;
  created_at: string;
}

// API Goal fetch response type
export interface FetchGoalsResponse {
  success: boolean;
  data: GoalItems[];
}

export interface addMoneyToGoalPayload {
  goal_id: string;
  amount: number;
}
