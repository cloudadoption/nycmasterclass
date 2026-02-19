/**
 * Groups rows by their time value and builds the schedule DOM.
 * @param {Element} block The schedule block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Parse each row into a structured object
  const entries = rows.map((row) => {
    const cells = [...row.children];
    const time = cells[0]?.textContent.trim() || '';
    const titleContent = cells[1];
    const speaker = cells[2]?.textContent.trim() || '';
    const track = cells[3]?.textContent.trim() || '';
    return {
      time, titleContent, speaker, track,
    };
  });

  // Group consecutive entries by time
  const slots = [];
  entries.forEach((entry) => {
    const last = slots[slots.length - 1];
    if (last && last.time === entry.time) {
      last.sessions.push(entry);
    } else {
      slots.push({ time: entry.time, sessions: [entry] });
    }
  });

  // Build new DOM
  block.replaceChildren();

  slots.forEach((slot) => {
    const isBreak = slot.sessions.every((s) => !s.speaker && !s.track);

    const slotEl = document.createElement('div');
    slotEl.className = isBreak ? 'schedule-slot schedule-break' : 'schedule-slot';

    const timeEl = document.createElement('div');
    timeEl.className = 'schedule-time';
    timeEl.textContent = slot.time;
    slotEl.append(timeEl);

    const sessionsEl = document.createElement('div');
    sessionsEl.className = 'schedule-sessions';

    slot.sessions.forEach((session) => {
      const sessionEl = document.createElement('div');
      sessionEl.className = 'schedule-session';

      const titleEl = document.createElement('div');
      titleEl.className = 'schedule-title';
      // Move original rich content nodes from the authored cell
      if (session.titleContent) {
        while (session.titleContent.firstChild) {
          titleEl.append(session.titleContent.firstChild);
        }
      }
      sessionEl.append(titleEl);

      if (session.speaker || session.track) {
        const metaEl = document.createElement('div');
        metaEl.className = 'schedule-meta';

        if (session.speaker) {
          const speakerEl = document.createElement('span');
          speakerEl.className = 'schedule-speaker';
          speakerEl.textContent = session.speaker;
          metaEl.append(speakerEl);
        }

        if (session.track) {
          const trackEl = document.createElement('span');
          trackEl.className = 'schedule-track';
          trackEl.textContent = session.track;
          metaEl.append(trackEl);
        }

        sessionEl.append(metaEl);
      }

      sessionsEl.append(sessionEl);
    });

    slotEl.append(sessionsEl);
    block.append(slotEl);
  });
}
