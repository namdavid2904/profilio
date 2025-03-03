import { Request, Response } from 'express';
import { prisma } from '../app';

// Projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, repoUrl, liveUrl, featured, technologies } = req.body;
    
    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        repoUrl,
        liveUrl,
        featured: featured || false,
        technologies,
      },
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, repoUrl, liveUrl, featured, technologies } = req.body;
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        repoUrl,
        liveUrl,
        featured,
        technologies,
      },
    });
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.project.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Messages
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
      },
    });
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const message = await prisma.message.update({
      where: { id },
      data: {
        read: true,
      },
    });
    
    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Skills
export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, level } = req.body;
    
    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level: level || 0,
      },
    });
    
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, level } = req.body;
    
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        level,
      },
    });
    
    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.skill.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};

// Experiences
export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const { company, position, startDate, endDate, current, description, skills, location, logo } = req.body;
    
    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        current,
        description,
        skills,
        location,
        logo,
      },
    });
    
    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company, position, startDate, endDate, current, description, skills, location, logo } = req.body;
    
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company,
        position,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        current,
        description,
        skills,
        location,
        logo,
      },
    });
    
    res.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.experience.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
};