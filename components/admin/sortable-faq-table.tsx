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
import { GripVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { reorderFaqs, toggleFaqPublish, deleteFaq } from '@/actions/faq-actions';

interface FaqTableProps {
  initialFaqs: any[];
}

function SortableRow({ faq, onTogglePublish, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: faq.id });

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
        <span className="font-medium text-gray-900 block">{faq.question}</span>
      </td>
      <td className="p-3 text-gray-600">
        {faq.category?.name || 'Uncategorized'}
      </td>
      <td className="p-3">
        <button
          onClick={() => onTogglePublish(faq.id, !faq.isPublished)}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max ${
            faq.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {faq.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {faq.isPublished ? 'Published' : 'Hidden'}
        </button>
      </td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/faqs/${faq.id}/edit`}>
            <Button variant="ghost" size="sm"><Edit className="w-4 h-4 text-blue-600" /></Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => onDelete(faq.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function SortableFaqTable({ initialFaqs }: FaqTableProps) {
  const [faqs, setFaqs] = useState(initialFaqs);
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
      const oldIndex = faqs.findIndex((s) => s.id === active.id);
      const newIndex = faqs.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(faqs, oldIndex, newIndex);
      setFaqs(newOrder);

      const orderUpdates = newOrder.map((s, index) => ({ id: s.id, order: index }));
      await reorderFaqs(orderUpdates);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    setFaqs(faqs.map(s => s.id === id ? { ...s, isPublished } : s));
    await toggleFaqPublish(id, isPublished);
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(s => s.id !== id));
      await deleteFaq(id);
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="p-3 w-10" /><th className="p-3 font-medium text-gray-600">Question</th>
            <th className="p-3 font-medium text-gray-600">Category</th><th className="p-3 font-medium text-gray-600">Status</th>
            <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
          </tr></thead>
          <tbody>{faqs.map(f => <tr key={f.id} className="border-b bg-white"><td className="p-3 w-10" /><td className="p-3"><span className="font-medium">{f.question}</span></td><td className="p-3" /><td className="p-3" /><td className="p-3" /></tr>)}</tbody>
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
              <th className="p-3 font-medium text-gray-600">Question</th>
              <th className="p-3 font-medium text-gray-600">Category</th>
              <th className="p-3 font-medium text-gray-600">Status</th>
              <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext items={faqs.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {faqs.map((faq) => (
                <SortableRow 
                  key={faq.id} 
                  faq={faq} 
                  onTogglePublish={handleTogglePublish}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
            {faqs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No FAQs found. Click "Add FAQ" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
