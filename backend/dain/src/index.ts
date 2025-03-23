import { z } from "zod";
import axios from "axios";
import {
  defineDAINService,
  ToolConfig,
} from "@dainprotocol/service-sdk";

const API_BASE_URL = 'https://your-api-endpoint.com'; // Replace with your actual API base URL

interface Assignment {
  id: string;
  dueDate: string;
  courseGrade: number;
}

const getTaskPriorityConfig: ToolConfig = {
  id: "get-task-priority",
  name: "Get Task Priority",
  description: "Calculates and updates task priority based on assignment details fetched from the API",
  input: z.object({
    assignmentId: z.string().describe("Assignment ID"),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  handler: async ({ assignmentId }, agentInfo) => {
    try {
      // Fetch assignment details from the API
      const response = await axios.get<Assignment>(`${API_BASE_URL}/assignments/${assignmentId}`);
      const assignment = response.data;

      // Calculate priority score
      const today = new Date();
      const due = new Date(assignment.dueDate);
      const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      let priority = 0;
      if (daysUntilDue <= 1) priority = 10;
      else if (daysUntilDue <= 3) priority = 8;
      else if (daysUntilDue <= 7) priority = 6;
      else priority = 4;

      if (assignment.courseGrade < 70) priority += 2;
      else if (assignment.courseGrade < 80) priority += 1;

      // Update assignment with priority via REST API
      await axios.patch(`${API_BASE_URL}/assignments/${assignmentId}`, {
        priority: priority
      });

      return {
        text: `Priority updated for assignment ${assignmentId}`,
        data: {
          success: true,
          message: `Priority updated for assignment ${assignmentId}`
        },
        ui: null
      };
    } catch (error) {
      return {
        text: "Failed to update task priority",
        data: {
          success: false,
          message: "Failed to fetch assignment details or update task priority"
        },
        ui: null
      };
    };
  }
};

const dainService = defineDAINService({
  metadata: {
    title: "Task Priority Service",
    description: "A service to calculate and update task priorities based on assignment details",
    version: "1.0.0",
    author: "Your Name",
    tags: ["task", "priority", "assignment"],
  },
  identity: {
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [getTaskPriorityConfig],
});

dainService.startNode().then(({ address }) => {
  console.log("DAIN Service is running at :" + address().port);
});
