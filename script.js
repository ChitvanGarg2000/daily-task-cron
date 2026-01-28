import axios from "axios";
import dayjs from "dayjs";
import dotenv from "dotenv";
import { sendToGoogleChat } from "./googleChatWebhook.js";

dotenv.config();

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;

const teamMembers = ["Pranjali Naik", "Amit Mishra", "Kunal Mewara", "Abhishek Ojha","Akriti Bajpai", "Chitvan Garg", "[1 DEV] Ankit Jangra", "[1 DEV]Abhikant Singh"]
const excludedTasks = ["dummy", "meeting", "miscellaneous"];

const clickUp = axios.create({
    baseURL: "https://api.clickup.com/api/v2",
    headers: {
        Authorization: CLICKUP_API_TOKEN,
    },
})

function getDueStatus(epochMs) {
  if (!epochMs) return 'NO_DUE_DATE';

  const due = dayjs(Number(epochMs));
  const today = dayjs().startOf('day');

  if (due.isBefore(today)) return 'OVERDUE';
  if (due.isSame(today, 'day')) return 'TODAY';
  return 'UPCOMING';
}

const getSpaces = async () => {
    try{

                const response = await clickUp.get(`/list/175430309/task`);
                const tasks = response.data.tasks
                    .filter(task => {
                        if (!task.name) return true;
                        const nameLower = task.name.toLowerCase();
                        return !excludedTasks.find((excludeTask) => nameLower.includes(excludeTask.toLowerCase()));
                    })
                    .map((task) => {
            const dueDate = task.due_date ? dayjs(Number(task.due_date)) : '';
            let assignees = task.assignees.map(assignee => assignee.username.trim());
            assignees = assignees.filter(name => teamMembers.find(member => name.includes(member))).join(", ");
            const result = {
                name: task.name,
                status: task.status?.status,
                due_date: dueDate ? dueDate.format('DD/MM/YYYY') : '',
                assignees,
                delivery_status: getDueStatus(task.due_date),
            }

            return result;
            
        })
        await sendToGoogleChat(tasks);
    }catch(error){
        console.error("Error fetching spaces:", error.response ? error.response.data : error.message);
    }
}

getSpaces();