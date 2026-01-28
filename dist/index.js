// messageFormatter.js
function statusBadge(status) {
  switch (status) {
    case "TODAY":
      return "\u{1F534} *TODAY*";
    case "OVERDUE":
      return "\u26A0\uFE0F *OVERDUE*";
    case "UPCOMING":
      return "\u{1F7E2} UPCOMING";
    case "NO_DUE_DATE":
      return "\u26AA NO DUE DATE";
    default:
      return status;
  }
}
function formatTask(task) {
  return `\u2022 *${task.name}*
  \u{1F464} ${task.assignees || "Unassigned"} | ${task.due_date ? `\u{1F4C5} ${task.due_date} | ` : ""}${statusBadge(task.delivery_status)}`;
}
function formatSection(title, tasks) {
  if (!tasks.length) return "";
  return `*${title}*
${tasks.map(formatTask).join("\n\n")}

`;
}
function buildMessage(tasks) {
  const today = tasks.filter((t) => t.delivery_status === "TODAY");
  const overdue = tasks.filter((t) => t.delivery_status === "OVERDUE");
  const upcoming = tasks.filter((t) => t.delivery_status === "UPCOMING");
  const noDueDate = tasks.filter((t) => t.delivery_status === "NO_DUE_DATE");
  let text = `\u{1F4CC} *Daily Task Update*

`;
  text += formatSection("\u{1F534} Due Today", today);
  text += formatSection("\u26A0\uFE0F Overdue", overdue);
  text += formatSection("\u{1F7E2} Upcoming", upcoming);
  text += formatSection("\u26AA No Due Date", noDueDate);
  return { text };
}

// googleChatWebhook.js
var sendToGoogleChat = async (tasks) => {
  try {
    const message = buildMessage(tasks);
    const response = await fetch(process.env.GOOGLE_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });
    if (!response.ok) {
      throw new Error(`Google Chat API error: ${response.statusText}`);
    }
    console.log("\u2705 Message sent to Google Chat");
  } catch (error) {
    console.error("\u274C Error:", error.message);
  }
};

// script.js
var CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
var CLICKUP_BASE_URL = "https://api.clickup.com/api/v2";
var teamMembers = [
  "Pranjali Naik",
  "Amit Mishra",
  "Kunal Mewara",
  "Abhishek Ojha",
  "Akriti Bajpai",
  "Chitvan Garg",
  "[1 DEV] Ankit Jangra",
  "[1 DEV]Abhikant Singh"
];
var excludedTasks = ["dummy", "meeting", "miscellaneous"];
function getDueStatus(epochMs) {
  if (!epochMs) return "NO_DUE_DATE";
  const due = new Date(Number(epochMs));
  const today = /* @__PURE__ */ new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  if (due < today) return "OVERDUE";
  if (due.getTime() === today.getTime()) return "TODAY";
  return "UPCOMING";
}
var getSpaces = async () => {
  try {
    const url = `${CLICKUP_BASE_URL}/list/${process.env.LIST_ID}/task`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: CLICKUP_API_TOKEN
      }
    });
    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.statusText}`);
    }
    const data = await response.json();
    const tasks = data.tasks.filter((task) => {
      if (!task.name) return true;
      const nameLower = task.name.toLowerCase();
      return !excludedTasks.find(
        (excludeTask) => nameLower.includes(excludeTask.toLowerCase())
      );
    }).map((task) => {
      const dueDate = task.due_date ? new Date(Number(task.due_date)) : "";
      let assignees = task.assignees.map(
        (assignee) => assignee.username.trim()
      );
      assignees = assignees.filter((name) => teamMembers.find((member) => name.includes(member))).join(", ");
      const result = {
        name: task.name,
        status: task.status?.status,
        due_date: dueDate ? dueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "",
        assignees,
        delivery_status: getDueStatus(task.due_date)
      };
      return result;
    });
    await sendToGoogleChat(tasks);
  } catch (error) {
    console.error(
      "Error fetching spaces:",
      error.message
    );
  }
};
getSpaces();
