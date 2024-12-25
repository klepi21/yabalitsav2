import { Match, Venue } from './supabase/types';
import { format } from 'date-fns';

// Function to send notification about new match
export const sendNewMatchNotification = async (match: Match & { venue: Venue }) => {
  try {
    const matchDate = new Date(match.match_date);
    const formattedDate = format(matchDate, 'dd/MM/yyyy');
    const formattedTime = format(matchDate, 'HH:mm');

    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        included_segments: ['Subscribed Users'],
        contents: {
          en: `New match at ${match.venue.name} on ${formattedDate} at ${formattedTime}`,
        },
        headings: {
          en: 'New Match Available!',
        },
        url: `${window.location.origin}/match/${match.id}`,
        web_buttons: [{
          id: "join-match",
          text: "View Match",
          url: `${window.location.origin}/match/${match.id}`,
        }],
      }),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}; 