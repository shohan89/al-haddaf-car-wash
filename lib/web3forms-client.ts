'use client';

// Web3Forms' free tier only accepts submissions made directly from the
// browser (it rejects requests that look like they came from a server) —
// same reason the two standalone landing pages post to it with a plain
// <form action="https://api.web3forms.com/submit">. This does the same
// thing from React forms: called client-side, after the real submission
// (DB write via a Server Action) has already succeeded, purely to notify
// the inbox. Best-effort — a failure here never blocks the form.
const ACCESS_KEY = '70b50a65-86fa-40fb-b16c-52ffacabbd8f';

export async function notifyByEmail(subject: string, fields: Record<string, string>): Promise<void> {
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject,
        from_name: 'Al Haddaf Car Wash Website',
        ...fields,
      }),
    });
  } catch (err) {
    console.error('Web3Forms notification failed:', err);
  }
}
