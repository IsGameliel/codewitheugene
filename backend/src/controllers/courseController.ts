import { Request, Response } from 'express';
import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const [courses] = await pool.execute(`
      SELECT * FROM courses
      WHERE is_published = true
      ORDER BY created_at DESC
    `);
    res.json({ courses: courses as any[] });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course: (rows as any[])[0] });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      language,
      level,
      price,
      thumbnail,
      duration,
      lessons,
      learningObjectives,
      requirements,
      totalDuration,
      isPublished
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const id = uuidv4();
    await pool.execute(
      `INSERT INTO courses (id,title,subtitle,description,category,language,level,price,thumbnail,duration,lessons,learning_objectives,requirements,total_duration,is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        subtitle || null,
        description,
        category || null,
        language || 'English',
        level || 'Beginner',
        price || 0,
        thumbnail || null,
        duration || null,
        lessons || 0,
        learningObjectives ? JSON.stringify(learningObjectives) : null,
        requirements ? JSON.stringify(requirements) : null,
        totalDuration || null,
        isPublished ? 1 : 0
      ]
    );

    const [addedRow] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);

    res.status(201).json({ course: (addedRow as any[])[0] });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      category,
      language,
      level,
      price,
      thumbnail,
      duration,
      lessons,
      learningObjectives,
      requirements,
      totalDuration,
      isPublished
    } = req.body;

    const [existing] = await pool.execute('SELECT id FROM courses WHERE id = ?', [id]);
    if ((existing as any[]).length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await pool.execute(`
      UPDATE courses
      SET title = ?, subtitle = ?, description = ?, category = ?, language = ?, level = ?, price = ?, thumbnail = ?, duration = ?, lessons = ?, learning_objectives = ?, requirements = ?, total_duration = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title,
      subtitle || null,
      description,
      category || null,
      language || 'English',
      level || 'Beginner',
      price || 0,
      thumbnail || null,
      duration || null,
      lessons || 0,
      learningObjectives ? JSON.stringify(learningObjectives) : null,
      requirements ? JSON.stringify(requirements) : null,
      totalDuration || null,
      isPublished ? 1 : 0,
      id
    ]);

    const [updated] = await pool.execute('SELECT * FROM courses WHERE id = ?', [id]);
    res.json({ course: (updated as any[])[0] });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
