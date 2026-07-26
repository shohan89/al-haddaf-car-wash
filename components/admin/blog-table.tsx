'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { toggleBlogPublish, deleteBlog } from '@/actions/blog-actions';

interface BlogTableProps {
  initialBlogs: any[];
}

export function BlogTable({ initialBlogs }: BlogTableProps) {
  const [blogs, setBlogs] = useState(initialBlogs);

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, isPublished } : b));
    const result = await toggleBlogPublish(id, isPublished);
    if (!result.success) {
      setBlogs(blogs.map(b => b.id === id ? { ...b, isPublished: !isPublished } : b));
      toast.error(result.error || 'Failed to update status');
    } else {
      toast.success(isPublished ? 'Post published' : 'Post unpublished');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const prevBlogs = blogs;
      setBlogs(blogs.filter(b => b.id !== id));
      const result = await deleteBlog(id);
      if (!result.success) {
        setBlogs(prevBlogs);
        toast.error(result.error || 'Failed to delete blog post');
      } else {
        toast.success('Blog post deleted');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 font-medium text-gray-600">Post Title</th>
            <th className="p-4 font-medium text-gray-600">Category</th>
            <th className="p-4 font-medium text-gray-600">Date</th>
            <th className="p-4 font-medium text-gray-600">Status</th>
            <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-b bg-white hover:bg-gray-50">
              <td className="p-4">
                <span className="font-medium text-gray-900 block">{blog.title}</span>
                <span className="text-xs text-gray-500 block mt-1">/{blog.slug}</span>
              </td>
              <td className="p-4 text-gray-600">
                {blog.category?.name || 'Uncategorized'}
              </td>
              <td className="p-4 text-gray-600">
                {new Date(blog.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4">
                <button
                  onClick={() => handleTogglePublish(blog.id, !blog.isPublished)}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
                    blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {blog.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {blog.isPublished ? 'Published' : 'Draft'}
                </button>
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(blog.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {blogs.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                No blog posts found. Click "Write a Post" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
