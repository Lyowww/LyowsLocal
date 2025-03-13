// utils/twitter.ts

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

async function twitterHandleExists(twitterHandle: string) {
  const url = `https://api.twitter.com/2/users/by/username/${twitterHandle}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.data !== undefined;
}

async function getTweetData(tweetId: string) {
  const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=author_id,text`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data || null;
}

async function getTwitterUserId(twitterHandle: string) {
  const url = `https://api.twitter.com/2/users/by/username/${twitterHandle}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data?.id || null;
}

async function getTwitterUserData(twitterHandle: string) {
  const url = `https://api.twitter.com/2/users/by/username/${twitterHandle}?user.fields=profile_image_url`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (data.data) {
    return {
      id: data.data.id,
      name: data.data.name,
      username: data.data.username,
      profile_image_url: data.data.profile_image_url
    };
  }

  return null;
}

async function checkUserFollowsTwitterChannel(twitterUserId: string, twitterChannelId: string) {
  const url = `https://api.twitter.com/2/users/${twitterUserId}/following?user.fields=created_at&max_results=1000`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`
    }
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  if (!data.data) {
    return false;
  }

  return data.data.some((user: any) => user.id === twitterChannelId);
}

export { twitterHandleExists, getTweetData, getTwitterUserId, getTwitterUserData, checkUserFollowsTwitterChannel };
