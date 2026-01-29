import apiClient from "@/utils/apiClient";
import { getUserToken } from "@/utils/authStorage";
import {
  GoalPayload,
  PayloadGoalResponse,
  FetchGoalsResponse,
  addMoneyToGoalPayload,
} from "@/types/goal";

// save Goal data to the backend
export const saveGoal = async (
  payload: GoalPayload,
): Promise<PayloadGoalResponse> => {
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
): Promise<PayloadGoalResponse> => {
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
