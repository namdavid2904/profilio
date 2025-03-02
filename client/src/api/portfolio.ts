const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface CreateMessageData {
  name: string;
  email: string;
  message: string;
}

export async function sendMessage(messageData: CreateMessageData) {
  try {
    const response = await fetch(`${API_URL}/portfolio/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getProjects() {
  try {
    const response = await fetch(`${API_URL}/portfolio/projects`);

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getSkills() {
  try {
    const response = await fetch(`${API_URL}/portfolio/skills`);

    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
}