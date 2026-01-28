export const iconOptions = ["fast-food-outline", "car-outline"] as const;
export type IconName = (typeof iconOptions)[number];

export interface BaseGoal {
  goal_name: string;
  target_amount: number;
  target_date: string;
  description?: string;
  icon_name?: IconName; // <- use exact allowed icons
}

export interface GoalPayload extends BaseGoal {}

export type PayloadGoalResponse =
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
