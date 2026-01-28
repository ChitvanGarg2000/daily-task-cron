function statusBadge(status) {
  switch (status) {
    case 'TODAY':
      return '🔴 *TODAY*';
    case 'OVERDUE':
      return '⚠️ *OVERDUE*';
    case 'UPCOMING':
      return '🟢 UPCOMING';
    case 'NO_DUE_DATE':
      return '⚪ NO DUE DATE';
    default:
      return status;
  }
}

function formatTask(task) {
  return (
    `\t• *${task.name}*\n` +
    `\t${task.due_date ? `📅 ${task.due_date} | ` : "" }` +
    `${statusBadge(task.delivery_status)}`
  );
}

function formatSection(title, tasks) {
  if (!tasks.length) return '';
  return `*${title}*\n\n${tasks.map((task) => formatTask(task)).join('\n\n')}\n\n`;
}

export function buildMessage(tasks) {
  // Group tasks by assignee
  const tasksByAssignee = {};
  
  tasks.forEach((task) => {
    const assignee = task.assignees || 'Unassigned';
    if (!tasksByAssignee[assignee]) {
      tasksByAssignee[assignee] = [];
    }
    tasksByAssignee[assignee].push(task);
  });

  let text = `📌 *Daily Task Update*\n\n`;

  // Sort assignees alphabetically and format each section
  Object.keys(tasksByAssignee)
    .sort()
    .forEach((assignee) => {
      text += formatSection(`👤 ${assignee}`, tasksByAssignee[assignee]);
    });

  return { text };
}
