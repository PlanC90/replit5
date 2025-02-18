const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

// Store the last known username locally to avoid unnecessary API calls
let cachedUsername: string | null = null;

export async function getTelegramUsername(botToken: string, userId: number): Promise<string | null> {
  // If we have a cached username, return it
  if (cachedUsername) {
    return cachedUsername;
  }

  try {
    // First try to get the username from our local API
    const response = await fetch(`/api/telegram-username/${userId}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.username) {
        cachedUsername = data.username;
        return data.username;
      }
    }

    // If local API fails, try the Telegram API directly
    if (botToken) {
      const telegramResponse = await fetch(`${TELEGRAM_API_BASE}${botToken}/getChat?chat_id=${userId}`);
      const telegramData = await telegramResponse.json();
      
      if (telegramData.ok && telegramData.result.username) {
        const username = '@' + telegramData.result.username;
        cachedUsername = username;
        return username;
      }
    }

    // If both attempts fail, use default username
    console.warn('Using default username as fallback');
    cachedUsername = '@johndoe';
    return cachedUsername;
  } catch (error) {
    console.warn('Error fetching Telegram username, using default:', error);
    cachedUsername = '@johndoe';
    return cachedUsername;
  }
}
