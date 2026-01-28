import { sendToGoogleChat } from "./googleChatWebhook.js";
import dotenv from "dotenv";
dotenv.config();

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_BASE_URL = "https://api.clickup.com/api/v2";

const teamMembers = [
  "Pranjali Naik",
  "Amit Mishra",
  "Kunal Mewara",
  "Abhishek Ojha",
  "Akriti Bajpai",
  "Chitvan Garg",
  "[1 DEV] Ankit Jangra",
  "[1 DEV]Abhikant Singh",
];
const excludedTasks = ["dummy", "meeting", "miscellaneous"];

function getDueStatus(epochMs) {
  if (!epochMs) return "NO_DUE_DATE";

  const due = new Date(Number(epochMs));
  const today = new Date();
  
  // Normalize both dates to start of day for comparison
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (due < today) return "OVERDUE";
  if (due.getTime() === today.getTime()) return "TODAY";
  return "UPCOMING";
}

const getSpaces = async () => {
  try {
    const url = `${CLICKUP_BASE_URL}/list/${process.env.LIST_ID}/task`;
    const response = await fetch(url, {
      method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: CLICKUP_API_TOKEN
        }
    });
    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.statusText}`);
    }
    const data = await response.json();
    const tasks = data.tasks
      .filter((task) => {
        if (!task.name) return true;
        const nameLower = task.name.toLowerCase();
        return !excludedTasks.find((excludeTask) =>
          nameLower.includes(excludeTask.toLowerCase()),
        );
      })
      .map((task) => {
        const dueDate = task.due_date ? new Date(Number(task.due_date)) : "";
        let assignees = task.assignees.map((assignee) =>
          assignee.username.trim(),
        );
        assignees = assignees
          .filter((name) => teamMembers.find((member) => name.includes(member)))
          .join(", ");
        const result = {
          name: task.name,
          status: task.status?.status,
          due_date: dueDate ? dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "",
          assignees,
          delivery_status: getDueStatus(task.due_date),
        };

        return result;
      });
    await sendToGoogleChat(tasks);
  } catch (error) {
    console.error(
      "Error fetching spaces:",
      error.message,
    );
  }
};

getSpaces();
