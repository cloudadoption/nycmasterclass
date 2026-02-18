/**
 * Decorates the schedule block.
 *
 * Content model (3-column collection):
 *   Col 1 – time slot (plain text)
 *   Col 2 – first <p> = session title; subsequent <p> = speaker name(s)
 *   Col 3 – track / room (optional; may be empty)
 *
 * @param {Element} block the block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.setAttribute('role', 'list');

  [...block.children].forEach((row) => {
    const [timeCell, detailsCell, roomCell] = row.children;

    const li = document.createElement('li');
    li.className = 'schedule-session';

    // — time —
    const timeText = timeCell?.querySelector('p')?.textContent.trim() || '';
    if (timeText) {
      const time = document.createElement('p');
      time.className = 'schedule-time';
      time.textContent = timeText;
      li.append(time);
    }

    // — session details —
    const details = document.createElement('div');
    details.className = 'schedule-details';

    const paragraphs = [...(detailsCell?.querySelectorAll('p') || [])];
    if (paragraphs.length > 0) {
      // First paragraph is always the session title
      const titleEl = document.createElement('p');
      titleEl.className = 'schedule-title';
      titleEl.textContent = paragraphs[0].textContent.trim();
      details.append(titleEl);

      // Remaining paragraphs are speakers
      const speakers = paragraphs.slice(1).map((p) => p.textContent.trim()).filter(Boolean);
      if (speakers.length > 0) {
        const speakerEl = document.createElement('p');
        speakerEl.className = 'schedule-speakers';
        speakerEl.textContent = speakers.join(', ');
        details.append(speakerEl);
      }
    }

    li.append(details);

    // — room / track —
    const roomText = roomCell?.querySelector('p')?.textContent.trim() || '';
    if (roomText) {
      const room = document.createElement('span');
      room.className = 'schedule-room';
      room.textContent = roomText;
      li.append(room);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
