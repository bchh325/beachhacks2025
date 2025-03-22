//File: example/example-node.ts

import { z } from "zod";
import axios from "axios";
import fs from 'fs/promises';
import path from 'path';

import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";

import {
  CardUIBuilder,
  TableUIBuilder,
  MapUIBuilder,
  LayoutUIBuilder,
} from "@dainprotocol/utils";

const port = Number(process.env.PORT) || 2022;

interface Assignment {
  id: number;
  name: string;
  due_at: string | null;
  points_possible: number | null;
  assignment_type: string[];
  assignment_group: {
    group_name: string;
    group_weight: number;
  };
  priorityScore?: number; // Add this line
}

// Helper function to calculate priority score
const calculatePriorityScore = (assignment: Assignment): number => {
  const now = new Date();
  const deadline = assignment.due_at ? new Date(assignment.due_at) : null;
  
  // Calculate deadline score
  const deadlineScore = deadline 
    ? Math.max(1, 10 - ((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 5; // Default score for assignments without deadline
  
  // Calculate weight score
  const weightScore = assignment.assignment_group.group_weight * 10;
  
  // Calculate type importance score
  const typeScore = assignment.assignment_type.includes("exam") ? 10 
    : assignment.assignment_type.includes("quiz") ? 8
    : assignment.assignment_type.includes("homework") ? 6
    : 4;
  
  // Calculate points score
  const pointsScore = assignment.points_possible 
    ? Math.min(10, (assignment.points_possible / 10))
    : 5;
    
  // Weight the different factors
  const priorityScore = 
    (deadlineScore * 0.4) + 
    (weightScore * 0.3) + 
    (typeScore * 0.2) + 
    (pointsScore * 0.1);
    
  return Math.round(priorityScore * 100) / 100;
};

const getTaskPriorityConfig: ToolConfig = {
  id: "get-task-priority",
  name: "Get Task Priority",
  description: "Analyzes and returns prioritized tasks based on various factors",
  input: z.object({}).describe("No input needed - uses sample data"),
  output: z.array(z.object({
    id: z.number(),
    name: z.string(),
    due_at: z.string().nullable(),
    points_possible: z.number().nullable(),
    assignment_type: z.array(z.string()),
    assignment_group: z.object({
      group_name: z.string(),
      group_weight: z.number(),
    }),
    priorityScore: z.number(),
  })).describe("Prioritized list of tasks"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async (_, agentInfo, context) => {
    // Sample data
    const sampleTasks: Assignment[] = [
      {
        id: 1330517,
        name: "Final Project",
        due_at: "2025-03-30T23:59:59Z",
        points_possible: 100,
        assignment_type: ["homework"],
        assignment_group: {
          group_name: "Projects",
          group_weight: 0.4
        }
      },
      {
        id: 1330518,
        name: "Midterm Exam",
        due_at: "2025-03-25T14:00:00Z",
        points_possible: 50,
        assignment_type: ["exam"],
        assignment_group: {
          group_name: "Exams",
          group_weight: 0.3
        }
      },
      {
        id: 1330519,
        name: "Weekly Quiz",
        due_at: "2025-03-23T23:59:59Z",
        points_possible: 10,
        assignment_type: ["quiz"],
        assignment_group: {
          group_name: "Quizzes",
          group_weight: 0.2
        }
      },
      {
        id: 1330520,
        name: "Reading Response",
        due_at: null,
        points_possible: null,
        assignment_type: ["homework"],
        assignment_group: {
          group_name: "Participation",
          group_weight: 0.1
        }
      }
    ];

    // Calculate priority scores for each task
    const prioritizedTasks = sampleTasks.map((task: Assignment) => ({
      ...task,
      priorityScore: calculatePriorityScore(task)
    }));

    // Sort by priority score
    prioritizedTasks.sort((a: Assignment, b: Assignment) => b.priorityScore - a.priorityScore);

    return {
      text: "Here are your prioritized tasks",
      data: prioritizedTasks,
      ui: new TableUIBuilder()
        .setRenderMode("page")
        .addColumns([
          { key: "name", header: "Task", type: "string" },
          { key: "due_at", header: "Deadline", type: "string" },
          { key: "priorityScore", header: "Priority Score", type: "number" },
          { key: "points_possible", header: "Points Possible", type: "number" },
          { key: "assignment_group.group_name", header: "Group", type: "string" },
        ])
        .rows(prioritizedTasks.map((task: Assignment) => ({
          ...task,
          due_at: task.due_at ? new Date(task.due_at).toLocaleDateString() : "N/A",
        })))
        .build(),
    };
  },
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
  exampleQueries: [
    {
      category: "Tasks",
      queries: [
        "What should I work on next?",
        "Show me my task priorities",
        "What are my most important tasks?",
      ],
    },
  ],
  identity: {
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [getTaskPriorityConfig],
});

dainService.startNode({ port: port }).then(({ address }) => {
  console.log("Task Priority DAIN Service is running at :" + address().port);
});
