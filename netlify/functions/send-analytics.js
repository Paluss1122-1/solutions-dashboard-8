import { createClient } from '@supabase/supabase-js';

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { browser, device, link, username, action } = JSON.parse(event.body);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { error } = await supabase.from('analytics').insert([{
      browser: browser || 'Unknown',
      device: device || 'Unknown',
      datum: new Date().toISOString(),
      link: link || '',
      username: username || null,
      Action: action || ''
    }]);

    if (error) {
      // Fehler auch in Fehlerberichte schreiben
      await supabase.from('Fehlerberichte').insert([{
        userAgent: device || 'Unknown',
        zeit: new Date().toISOString(),
        fehler: error.message || error
      }]);

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
}