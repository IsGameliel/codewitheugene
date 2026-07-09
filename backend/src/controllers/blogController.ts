import { Request, Response } from 'express';
import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const [posts] = await pool.execute(
      `SELECT id, title, content, excerpt, cover_image, is_published, published_at, author_id, created_at, updated_at
       FROM blog_posts
       WHERE is_published = true
       ORDER BY published_at DESC
       LIMIT ? OFFSET ?`,
      [Number(limit), offset]
    );

    const [totalCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM blog_posts WHERE is_published = true'
    );

    res.json({
      posts: posts as any[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: (totalCount as any[])[0].count,
        pages: Math.ceil((totalCount as any[])[0].count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [posts] = await pool.execute(
      `SELECT bp.*, u.full_name as author_name
       FROM blog_posts bp
       JOIN users u ON bp.author_id = u.id
       WHERE bp.id = ? AND bp.is_published = true`,
      [id]
    );

    if ((posts as any[]).length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ post: (posts as any[])[0] });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, coverImage, isPublished } = req.body;
    const authorId = (req as any).user.id;

    const postId = uuidv4();
    await pool.execute(
      `INSERT INTO blog_posts (id, title, content, excerpt, cover_image, is_published, published_at, author_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postId,
        title,
        content,
        excerpt,
        coverImage,
        isPublished,
        isPublished ? new Date() : null,
        authorId
      ]
    );

    res.status(201).json({
      message: 'Blog post created successfully',
      postId
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    if ((error as any)?.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ error: 'Cover image is too large for the current database schema' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, coverImage, isPublished } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Check if post exists and user has permission
    const [posts] = await pool.execute(
      'SELECT author_id FROM blog_posts WHERE id = ?',
      [id]
    );

    if ((posts as any[]).length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const post = (posts as any[])[0];
    if (post.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await pool.execute(
      `UPDATE blog_posts
       SET title = ?, content = ?, excerpt = ?, cover_image = ?, is_published = ?, published_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        content,
        excerpt,
        coverImage,
        isPublished,
        isPublished ? new Date() : null,
        id
      ]
    );

    res.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Update blog post error:', error);
    if ((error as any)?.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ error: 'Cover image is too large for the current database schema' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllBlogPosts = async (req: Request, res: Response) => {
  try {
    const [posts] = await pool.execute(
      `SELECT bp.*, u.full_name as author_name
       FROM blog_posts bp
       JOIN users u ON bp.author_id = u.id
       ORDER BY bp.created_at DESC`,
      []
    );

    res.json({ posts: posts as any[] });
  } catch (error) {
    console.error('Get all blog posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Check if post exists and user has permission
    const [posts] = await pool.execute(
      'SELECT author_id FROM blog_posts WHERE id = ?',
      [id]
    );

    if ((posts as any[]).length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const post = (posts as any[])[0];
    if (post.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [id]);

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
