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
    `• *${task.name}*\n` +
    `  👤 ${task.assignees || 'Unassigned'} | ` +
    `${task.due_date ? `📅 ${task.due_date} | ` : "" }` +
    `${statusBadge(task.delivery_status)}`
  );
}

function formatSection(title, tasks) {
  if (!tasks.length) return '';
  return `*${title}*\n${tasks.map((task) => formatTask(task)).join('\n\n')}\n\n`;
}

export function buildMessage(tasks) {
  const today = tasks.filter((t) => t.delivery_status === 'TODAY');
  const overdue = tasks.filter((t) => t.delivery_status === 'OVERDUE');
  const upcoming = tasks.filter((t) => t.delivery_status === 'UPCOMING');
  const noDueDate = tasks.filter((t) => t.delivery_status === 'NO_DUE_DATE');

  let text = `📌 *Daily Task Update*\n\n`;

  text += formatSection('🔴 Due Today', today);
  text += formatSection('⚠️ Overdue', overdue);
  text += formatSection('🟢 Upcoming', upcoming);
  text += formatSection('⚪ No Due Date', noDueDate);

  return { text };
}
