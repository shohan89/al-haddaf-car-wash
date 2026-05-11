'use client';

import { useState, useEffect } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { reorderAreas, toggleAreaPublish, deleteArea } from '@/actions/area-actions';
import Image from 'next/image';

interface Area {
  id: string;
  title: string;
  image: string | null;
  isPublished: boolean;
  order: number;
}

function SortableRow({ area, onTogglePublish, onDelete }: {
  area: Area;
  onTogglePublish: (id: string, v: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: area.id });

  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <tr ref={setNodeRef} style={style} className={`border-b bg-white ${isDragging ? 'shadow-lg relative' : ''}`}>
      <td className="p-3 w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:bg-gray-100 p-1 rounded">
          <GripVertical className="text-gray-400 w-5 h-5" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          {area.image ? (
            <div className="w-12 h-12 relative rounded overflow-hidden">
              <Image src={area.image} alt={area.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
          )}
          <span className="font-medium">{area.title}</span>
        </div>
      </td>
      <td className="p-3">
        <button
          onClick={() => onTogglePublish(area.id, !area.isPublished)}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${area.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
        >
          {area.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {area.isPublished ? 'Published' : 'Draft'}
        </button>
      </td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/areas/${area.id}/edit`}>
            <Button variant="ghost" size="sm"><Edit className="w-4 h-4 text-blue-600" /></Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this area?')) onDelete(area.id); }}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function SortableAreaTable({ initialAreas }: { initialAreas: Area[] }) {
  const [areas, setAreas] = useState(initialAreas);
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
      const oldIndex = areas.findIndex((s) => s.id === active.id);
      const newIndex = areas.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(areas, oldIndex, newIndex);
      setAreas(newOrder);
      await reorderAreas(newOrder.map((s, i) => ({ id: s.id, order: i })));
    }
  };

  const headers = ['', 'Area', 'Status', 'Actions'];

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{headers.map((h, i) => <th key={i} className="p-3 font-medium text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody>
            {areas.map((area) => (
              <tr key={area.id} className="border-b bg-white">
                <td className="p-3 w-10" /><td className="p-3"><span className="font-medium">{area.title}</span></td>
                <td className="p-3" /><td className="p-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
        accessibility={{ announcements: { onDragStart: () => '', onDragOver: () => '', onDragEnd: () => '', onDragCancel: () => '' } }}
      >
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-10" />
              <th className="p-3 font-medium text-gray-600">Area</th>
              <th className="p-3 font-medium text-gray-600">Status</th>
              <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext items={areas.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {areas.map((area) => (
                <SortableRow
                  key={area.id}
                  area={area}
                  onTogglePublish={async (id, v) => { setAreas(areas.map(s => s.id === id ? { ...s, isPublished: v } : s)); await toggleAreaPublish(id, v); }}
                  onDelete={async (id) => { setAreas(areas.filter(s => s.id !== id)); await deleteArea(id); }}
                />
              ))}
            </SortableContext>
            {areas.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No areas found. Click "Add Area" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
