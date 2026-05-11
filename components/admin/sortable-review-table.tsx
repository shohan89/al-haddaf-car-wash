'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Eye, EyeOff, Star, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { reorderReviews, toggleReviewStatus, deleteReview } from '@/actions/review-actions';
import Image from 'next/image';

interface ReviewTableProps {
  initialReviews: any[];
}

function SortableRow({ review, onToggleStatus, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: review.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`border-b bg-white ${isDragging ? 'shadow-lg relative' : 'hover:bg-gray-50'}`}>
      <td className="p-3 w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:bg-gray-100 p-1 rounded">
          <GripVertical className="text-gray-400 w-5 h-5" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {review.avatar ? (
              <Image src={review.avatar} alt={review.author} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-gray-500">{review.author.charAt(0)}</div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{review.author}</div>
            <div className="text-xs text-gray-500">{review.location || review.role}</div>
          </div>
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1 text-yellow-400">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold text-gray-700">{review.rating}</span>
        </div>
      </td>
      <td className="p-3">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onToggleStatus(review.id, 'isPublished', !review.isPublished)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
              review.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {review.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {review.isPublished ? 'Published' : 'Hidden'}
          </button>
          <button
            onClick={() => onToggleStatus(review.id, 'isFeatured', !review.isFeatured)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
              review.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <BadgeCheck className="w-3 h-3" />
            {review.isFeatured ? 'Featured' : 'Standard'}
          </button>
        </div>
      </td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/reviews/${review.id}/edit`}>
            <Button variant="ghost" size="sm"><Edit className="w-4 h-4 text-blue-600" /></Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => onDelete(review.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function SortableReviewTable({ initialReviews }: ReviewTableProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [isMounted, setIsMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsMounted(true); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = reviews.findIndex((s) => s.id === active.id);
      const newIndex = reviews.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(reviews, oldIndex, newIndex);
      setReviews(newOrder);

      const orderUpdates = newOrder.map((s, index) => ({ id: s.id, order: index }));
      await reorderReviews(orderUpdates);
    }
  };

  const handleToggleStatus = async (id: string, field: 'isPublished' | 'isFeatured' | 'isVerified', value: boolean) => {
    setReviews(reviews.map(s => s.id === id ? { ...s, [field]: value } : s));
    await toggleReviewStatus(id, field, value);
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(s => s.id !== id));
      await deleteReview(id);
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="p-3 w-10" /><th className="p-3 font-medium text-gray-600">Customer</th>
            <th className="p-3 font-medium text-gray-600">Rating</th><th className="p-3 font-medium text-gray-600">Status</th>
            <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
          </tr></thead>
          <tbody>{reviews.map(r => <tr key={r.id} className="border-b bg-white"><td className="p-3 w-10" /><td className="p-3"><span className="font-medium">{r.author}</span></td><td className="p-3" /><td className="p-3" /><td className="p-3" /></tr>)}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
        accessibility={{ announcements: { onDragStart: () => '', onDragOver: () => '', onDragEnd: () => '', onDragCancel: () => '' } }}>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-10"></th>
              <th className="p-3 font-medium text-gray-600">Customer</th>
              <th className="p-3 font-medium text-gray-600">Rating</th>
              <th className="p-3 font-medium text-gray-600">Status</th>
              <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext items={reviews.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {reviews.map((review) => (
                <SortableRow 
                  key={review.id} 
                  review={review} 
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No reviews found. Click "Add Review" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
