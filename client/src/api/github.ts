interface GitHubRepo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    created_at: string;
    updated_at: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
    fork: boolean;
}

export async function getRepos(username: string): Promise<GitHubRepo[]> {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
        if (!response.ok) {
            throw new Error(`Failed to fetch repos`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching github repos', error);
        return [];
    }
}