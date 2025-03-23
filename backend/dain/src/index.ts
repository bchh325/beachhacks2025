// import { z } from "zod";
// import axios from "axios";
// import fs from 'fs/promises';
// import path from 'path';

// import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";

// import {
//   CardUIBuilder,
//   TableUIBuilder,
//   MapUIBuilder,
//   LayoutUIBuilder,
// } from "@dainprotocol/utils";

// const port = Number(process.env.PORT) || 2022;

// interface Assignment {
//   id: number;
//   name: string;
//   due_at: string | null;
//   points_possible: number | null;
//   assignment_type: string[];
//   assignment_group: {
//     group_name: string;
//     group_weight: number;
//   };
//   priorityScore?: number; // Add this line
// }

// interface CompletionHistory {
//   assignment_type: string[];
//   points_possible: number;
//   time_spent_minutes: number;
// }

// // Helper function to calculate priority score
// const calculatePriorityScore = (assignment: Assignment): number => {
//   const now = new Date();
//   const deadline = assignment.due_at ? new Date(assignment.due_at) : null;
  
//   // Calculate deadline score
//   const deadlineScore = deadline 
//     ? Math.max(1, 10 - ((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
//     : 5; // Default score for assignments without deadline
  
//   // Calculate weight score
//   const weightScore = assignment.assignment_group.group_weight * 10;
  
//   // Calculate type importance score
//   const typeScore = assignment.assignment_type.includes("exam") ? 10 
//     : assignment.assignment_type.includes("quiz") ? 8
//     : assignment.assignment_type.includes("homework") ? 6
//     : 4;
  
//   // Calculate points score
//   const pointsScore = assignment.points_possible 
//     ? Math.min(10, (assignment.points_possible / 10))
//     : 5;
    
//   // Weight the different factors
//   const priorityScore = 
//     (deadlineScore * 0.4) + 
//     (weightScore * 0.3) + 
//     (typeScore * 0.2) + 
//     (pointsScore * 0.1);
    
//   return Math.round(priorityScore * 100) / 100;
// };

// const estimateCompletionTime = (
//   assignment: Assignment,
//   historicalData: CompletionHistory[]
// ): number => {
//   // Filter historical data by assignment type
//   const relevantHistory = historicalData.filter(hist => 
//     hist.assignment_type.some(type => assignment.assignment_type.includes(type))
//   );
  
//   if (relevantHistory.length === 0) {
//     // Fallback estimates if no historical data
//     if (assignment.assignment_type.includes("exam")) return 180;
//     if (assignment.assignment_type.includes("quiz")) return 30;
//     if (assignment.assignment_type.includes("homework")) return 120;
//     return 60;
//   }
  
//   // Calculate average time per point for similar assignments
//   const avgTimePerPoint = relevantHistory.reduce((sum, hist) => 
//     sum + (hist.time_spent_minutes / hist.points_possible), 0
//   ) / relevantHistory.length;
  
//   // Estimate time based on points and type
//   const baseEstimate = assignment.points_possible 
//     ? avgTimePerPoint * assignment.points_possible
//     : avgTimePerPoint * 10; // Default points if none specified
    
//   // Adjust based on assignment type
//   const typeMultiplier = 
//     assignment.assignment_type.includes("exam") ? 1.5 :
//     assignment.assignment_type.includes("quiz") ? 0.8 :
//     1.0;
    
//   return Math.round(baseEstimate * typeMultiplier);
// };

// const sampleTasks: Assignment[] = [
//   {
//     id: 1330517,
//     name: "Final Project",
//     due_at: "2025-03-30T23:59:59Z",
//     points_possible: 100,
//     assignment_type: ["homework"],
//     assignment_group: {
//       group_name: "Projects",
//       group_weight: 0.4
//     }
//   },
//   {
//     id: 1330518,
//     name: "Midterm Exam",
//     due_at: "2025-03-25T14:00:00Z",
//     points_possible: 50,
//     assignment_type: ["exam"],
//     assignment_group: {
//       group_name: "Exams",
//       group_weight: 0.3
//     }
//   },
//   {
//     id: 1330519,
//     name: "Weekly Quiz",
//     due_at: "2025-03-23T23:59:59Z",
//     points_possible: 10,
//     assignment_type: ["quiz"],
//     assignment_group: {
//       group_name: "Quizzes",
//       group_weight: 0.2
//     }
//   },
//   {
//     id: 1330520,
//     name: "Reading Response",
//     due_at: null,
//     points_possible: null,
//     assignment_type: ["homework"],
//     assignment_group: {
//       group_name: "Participation",
//       group_weight: 0.1
//     }
//   }
// ];

// const getTaskPriorityConfig: ToolConfig = {
//   id: "get-task-priority",
//   name: "Get Task Priority",
//   description: "Analyzes and returns prioritized tasks based on various factors",
//   input: z.object({}).describe("No input needed - uses sample data"),
//   output: z.array(z.object({
//     id: z.number(),
//     name: z.string(),
//     due_at: z.string().nullable(),
//     points_possible: z.number().nullable(),
//     assignment_type: z.array(z.string()),
//     assignment_group: z.object({
//       group_name: z.string(),
//       group_weight: z.number(),
//     }),
//     priorityScore: z.number(),
//   })).describe("Prioritized list of tasks"),
//   pricing: { pricePerUse: 0, currency: "USD" },
//   handler: async (_, agentInfo, context) => {
//     // Calculate priority scores for each task
//     const prioritizedTasks = sampleTasks.map((task: Assignment) => ({
//       ...task,
//       priorityScore: calculatePriorityScore(task)
//     }));

//     // Sort by priority score
//     prioritizedTasks.sort((a: Assignment, b: Assignment) => b.priorityScore - a.priorityScore);

//     return {
//       text: "Here are your prioritized tasks",
//       data: prioritizedTasks,
//       ui: new TableUIBuilder()
//         .setRenderMode("page")
//         .addColumns([
//           { key: "name", header: "Task", type: "string" },
//           { key: "due_at", header: "Deadline", type: "string" },
//           { key: "priorityScore", header: "Priority Score", type: "number" },
//           { key: "points_possible", header: "Points Possible", type: "number" },
//           { key: "assignment_group.group_name", header: "Group", type: "string" },
//         ])
//         .rows(prioritizedTasks.map((task: Assignment) => ({
//           ...task,
//           due_at: task.due_at ? new Date(task.due_at).toLocaleDateString() : "N/A",
//         })))
//         .build(),
//     };
//   }
// };

// const getCompletionTimeConfig: ToolConfig = {
//   id: "get-completion-time",
//   name: "Get Completion Time Estimate",
//   description: "Estimates time needed to complete assignments based on historical data",
//   input: z.object({}).describe("No input needed - uses sample data"),
//   output: z.array(z.object({
//     id: z.number(),
//     name: z.string(),
//     estimated_minutes: z.number(),
//     assignment_type: z.array(z.string()),
//     points_possible: z.number().nullable(),
//   })).describe("Estimated completion times for tasks"),
//   pricing: { pricePerUse: 0, currency: "USD" },
//   handler: async (_, agentInfo, context) => {
//     // Sample historical completion data
//     const historicalData: CompletionHistory[] = [
//       {
//         assignment_type: ["homework"],
//         points_possible: 100,
//         time_spent_minutes: 180
//       },
//       {
//         assignment_type: ["quiz"],
//         points_possible: 10,
//         time_spent_minutes: 20
//       },
//       {
//         assignment_type: ["exam"],
//         points_possible: 50,
//         time_spent_minutes: 120
//       }
//     ];

//     // Use the same sample tasks from before
//     const tasksWithEstimates = sampleTasks.map(task => ({
//       id: task.id,
//       name: task.name,
//       assignment_type: task.assignment_type,
//       points_possible: task.points_possible,
//       estimated_minutes: estimateCompletionTime(task, historicalData)
//     }));

//     return {
//       text: "Here are your estimated completion times",
//       data: tasksWithEstimates,
//       ui: new TableUIBuilder()
//         .setRenderMode("page")
//         .addColumns([
//           { key: "name", header: "Task", type: "string" },
//           { key: "estimated_minutes", header: "Estimated Time (minutes)", type: "number" },
//           { key: "points_possible", header: "Points", type: "number" },
//           { key: "assignment_type", header: "Type", type: "string" },
//         ])
//         .rows(tasksWithEstimates)
//         .build(),
//     };
//   }
// };

// const dainService = defineDAINService({
//   metadata: {
//     title: "Task Priority DAIN Service",
//     description: "A DAIN service for analyzing and prioritizing academic tasks",
//     version: "1.0.0",
//     author: "Your Name",
//     tags: ["tasks", "priority", "academic"],
//     logo: "https://cdn-icons-png.flaticon.com/512/1950/1950715.png",
//   },
//   exampleQueries: [
//     {
//       category: "Tasks",
//       queries: [
//         "What should I work on next?",
//         "Show me my task priorities",
//         "What are my most important tasks?",
//       ],
//     },
//   ],
//   identity: {
//     apiKey: process.env.DAIN_API_KEY,
//   },
//   tools: [getTaskPriorityConfig, getCompletionTimeConfig],
// });

// dainService.startNode({ port: port }).then(({ address }) => {
//   console.log("Task Priority DAIN Service is running at :" + address().port);
// });



// New Condensed Version
import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";
import { z } from "zod";
import { DainResponse, CardUIBuilder, TableUIBuilder } from "@dainprotocol/utils";

const taskInsightsTool: ToolConfig = {
  id: "task-insights",
  name: "Task Insights",
  description: "Provides AI insights for task prioritization",
  input: z.object({
    tasks: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      dueDate: z.string()
    }))
  }),
  output: z.object({
    insights: z.array(z.object({
      taskId: z.string(),
      priority: z.number(),
      suggestion: z.string()
    }))
  }),
  handler: async (input, agentInfo) => {
    // This is where you'd implement your AI logic to analyze tasks
    // For this example, we'll use a simple prioritization based on due date
    const insights = input.tasks.map(task => {
      const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const priority = daysUntilDue <= 1 ? 1 : daysUntilDue <= 3 ? 2 : 3;
      return {
        taskId: task.id,
        priority,
        suggestion: priority === 1 ? "Urgent: Complete ASAP" : priority === 2 ? "Important: Plan to complete soon" : "Normal priority"
      };
    });

    const tableUI = new TableUIBuilder()
      .addColumns([
        { key: 'title', header: 'Task', type: 'string' },
        { key: 'priority', header: 'Priority', type: 'number' },
        { key: 'suggestion', header: 'Suggestion', type: 'string' }
      ])
      .rows(insights.map(insight => ({
        ...insight,
        title: input.tasks.find(task => task.id === insight.taskId)?.title
      })))
      .build();

    const cardUI = new CardUIBuilder()
      .title("AI Task Insights")
      .addChild(tableUI)
      .build();

    return new DainResponse({
      text: "Generated AI insights for tasks",
      data: { insights },
      ui: cardUI
    });
  }
};

const dainService = defineDAINService({
  metadata: {
    title: "Task Priority DAIN Service",
    description: "A DAIN service for analyzing and prioritizing academic tasks",
    version: "1.0.0",
    author: "Your Name",
    tags: ["tasks", "priority", "academic"],
    logo: "https://cdn-icons-png.flaticon.com/512/1950/1950715.png",
  },
  identity: {
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [taskInsightsTool],
});

dainService.startNode().then(({ address }) => {
  console.log("DAIN Service is running at :" + address().port);
});
