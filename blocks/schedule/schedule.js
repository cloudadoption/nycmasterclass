/**
 * Converts a name to a URL-safe slug for anchor links to the speakers block.
 * Must match the toSlug logic in speakers.js.
 * @param {string} name
 * @returns {string}
 */
function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Builds a session card element.
 * @param {string} title
 * @param {string} speaker
 * @param {string} track
 * @returns {HTMLElement}
 */
function buildSession(title, speaker, track) {
  const session = document.createElement('div');
  const isBreak = !speaker && !track;
  session.className = isBreak ? 'schedule-session schedule-session-break' : 'schedule-session';

  const titleEl = document.createElement('p');
  titleEl.className = 'schedule-title';
  titleEl.textContent = title;
  session.append(titleEl);

  if (speaker || track) {
    const meta = document.createElement('p');
    meta.className = 'schedule-meta';

    if (speaker) {
      // Multiple speakers may be comma-separated — link each individually
      const names = speaker.split(',').map((n) => n.trim()).filter(Boolean);
      names.forEach((name, i) => {
        const link = document.createElement('a');
        link.href = `#${toSlug(name)}`;
        link.textContent = name;
        meta.append(link);
        if (i < names.length - 1) meta.append(', ');
      });
    }

    if (speaker && track) meta.append(' · ');

    if (track) {
      const trackEl = document.createElement('span');
      trackEl.className = 'schedule-track';
      trackEl.textContent = track;
      meta.append(trackEl);
    }

    session.append(meta);
  }

  return session;
}

/**
 * Loads and decorates the schedule block.
 * Content model: each row = one session (4 columns: time, title, speaker, track)
 * Rows with identical time text are grouped into a single time slot.
 * @param {Element} block The schedule block element
 */
export default function decorate(block) {
  // Extract data from rows before replacing DOM
  const rows = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      time: cells[0]?.textContent.trim() || '',
      title: cells[1]?.textContent.trim() || '',
      speaker: cells[2]?.textContent.trim() || '',
      track: cells[3]?.textContent.trim() || '',
    };
  });

  // Group consecutive rows by time text
  const slots = [];
  rows.forEach((row) => {
    const last = slots[slots.length - 1];
    if (last && last.time === row.time) {
      last.sessions.push(row);
    } else {
      slots.push({ time: row.time, sessions: [row] });
    }
  });

  // Build new DOM
  const fragment = document.createDocumentFragment();
  slots.forEach(({ time, sessions }) => {
    const slot = document.createElement('div');
    slot.className = 'schedule-slot';

    const timeEl = document.createElement('div');
    timeEl.className = 'schedule-time';
    timeEl.textContent = time;
    slot.append(timeEl);

    const sessionsEl = document.createElement('div');
    sessionsEl.className = 'schedule-sessions';
    sessions.forEach(({ title, speaker, track }) => {
      sessionsEl.append(buildSession(title, speaker, track));
    });
    slot.append(sessionsEl);

    fragment.append(slot);
  });

  block.replaceChildren(fragment);
}
