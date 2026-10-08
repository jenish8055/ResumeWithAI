/**
 * Formats activity logs into clean, human-readable developer TXT files.
 * Matches exact format from Specification #60.
 */

export function formatActivityLogsToTxt(logs, sessionId) {
  const generatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  let txt = `==================================================
RESUMEWITHAI ACTIVITY LOG
==================================================

Session:
${sessionId || (logs[0] && logs[0].sessionId) || 'session_general'}

Generated:
${generatedAt}

==================================================

`;

  if (!logs || logs.length === 0) {
    txt += `[${generatedAt}]\n\nEVENT:\nNO_LOGS_RECORDED\n\n--------------------------------------------------\n`;
    return txt;
  }

  logs.forEach((log) => {
    const timestampStr = log.timestamp
      ? new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)
      : generatedAt;

    txt += `[${timestampStr}]\n\nEVENT:\n${log.event}\n\n`;

    if (log.resumeId) {
      txt += `Resume ID:\n${log.resumeId}\n\n`;
    }
    if (log.resumeName) {
      txt += `Resume Name:\n${log.resumeName}\n\n`;
    }
    if (log.section) {
      txt += `Section:\n${log.section}\n\n`;
    }
    if (log.field) {
      txt += `Field:\n${log.field}\n\n`;
    }
    if (log.action) {
      txt += `Action:\n${log.action}\n\n`;
    }
    if (log.fromTemplate || log.toTemplate) {
      txt += `From:\n${log.fromTemplate || 'none'}\n\nTo:\n${log.toTemplate || 'none'}\n\n`;
    }
    if (log.format) {
      txt += `Format:\n${log.format}\n\n`;
    }
    if (log.pageSize) {
      txt += `PageSize:\n${log.pageSize}\n\n`;
    }

    if (log.metadata && Object.keys(log.metadata).length > 0) {
      Object.entries(log.metadata).forEach(([k, v]) => {
        if (typeof v === 'object') {
          txt += `${k}:\n${JSON.stringify(v, null, 2)}\n\n`;
        } else {
          txt += `${k}:\n${v}\n\n`;
        }
      });
    }

    txt += `--------------------------------------------------\n\n`;
  });

  txt += `==================================================\nEND OF LOG\n==================================================\n`;

  return txt;
}
