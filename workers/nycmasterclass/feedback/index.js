const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    if (!env.SLACK_WEBHOOK_URL) {
      return jsonResponse({ error: 'Worker not configured' }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const fullName = body?.fullName?.trim();
    const email = body?.email?.trim();
    const feedback = body?.feedback?.trim();

    if (!fullName || !email || !feedback) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ error: 'Invalid email address' }, 400);
    }

    const payload = {
      text: 'New Feedback Received',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'New Feedback Received',
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Name:*\n${fullName}` },
            { type: 'mrkdwn', text: `*Email:*\n${email}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Feedback:*\n${feedback}`,
          },
        },
      ],
    };

    try {
      const webhookResponse = await fetch(env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        return jsonResponse({ error: 'Failed to send to Slack' }, 500);
      }
    } catch {
      return jsonResponse({ error: 'Failed to send to Slack' }, 500);
    }

    return jsonResponse({
      success: true,
      message: 'Feedback submitted successfully',
    });
  },
};
