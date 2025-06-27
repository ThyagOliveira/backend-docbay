import axios from 'axios';

async function seedFromGithub() {
  const usersToFetch = [
    'ThyagOliveira',
    'octocat',
    'rafaballerini',
    'torvalds',
    'diego3g',
  ];

  for (const username of usersToFetch) {
    try {
      await axios.post(`http://localhost:3000/github/${username}`);
      console.log(`✅ Seeded: ${username}`);
    } catch (error) {
      console.error(
        `Failed to seed ${username}:`,
        error.response?.data || error.message,
      );
    }
  }
}

seedFromGithub();
