import apiClient from "@/utils/apiClient";
import { getUserToken } from "@/utils/authStorage";
import {
  GoalPayload,
  GoalResponse,
  FetchGoalsResponse,
  addMoneyToGoalPayload,
} from "@/types/goal";

// save Goal data to the backend
export const saveGoal = async (payload: GoalPayload): Promise<GoalResponse> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.post("/goal", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Goal saved:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};

// fetch Goal data from the backend
export const fetchGoals = async (): Promise<FetchGoalsResponse> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.get("/goal", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};

// add money to a specific goal
export const addMoneyToGoal = async (
  payload: addMoneyToGoalPayload,
): Promise<GoalResponse> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.patch(
      `/goal/${payload.goal_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};

// delete a specific goal
export const deleteGoal = async (goal_id: string): Promise<GoalResponse> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.delete(`/goal/${goal_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};
