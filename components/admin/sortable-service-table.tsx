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
import { reorderServices, toggleServicePublish, deleteService } from '@/actions/service-actions';
import Image from 'next/image';

interface Service {
  id: string;
  title: string;
  price: number;
  image: string;
  isPublished: boolean;
  order: number;
}

interface TableProps {
  initialServices: Service[];
}

function SortableRow({ service, onTogglePublish, onDelete }: { service: Service, onTogglePublish: (id: string, v: boolean) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className={`border-b bg-white ${isDragging ? 'shadow-lg relative' : ''}`}>
      <td className="p-3 w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:bg-gray-100 p-1 rounded">
          <GripVertical className="text-gray-400 w-5 h-5" />
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          {service.image ? (
            <div className="w-12 h-12 relative rounded overflow-hidden">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
          )}
          <span className="font-medium">{service.title}</span>
        </div>
      </td>
      <td className="p-3">AED {service.price.toFixed(2)}</td>
      <td className="p-3">
        <button
          onClick={() => onTogglePublish(service.id, !service.isPublished)}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            service.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {service.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {service.isPublished ? 'Published' : 'Draft'}
        </button>
      </td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/services/${service.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => {
            if(confirm('Are you sure you want to delete this service?')) {
              onDelete(service.id);
            }
          }}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function SortableServiceTable({ initialServices }: TableProps) {
  const [services, setServices] = useState(initialServices);
  const [isMounted, setIsMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsMounted(true); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s.id === active.id);
      const newIndex = services.findIndex((s) => s.id === over.id);
      
      const newOrder = arrayMove(services, oldIndex, newIndex);
      setServices(newOrder);

      // Save order to db
      const orderUpdates = newOrder.map((s, index) => ({
        id: s.id,
        order: index,
      }));
      await reorderServices(orderUpdates);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    setServices(services.map(s => s.id === id ? { ...s, isPublished } : s));
    await toggleServicePublish(id, isPublished);
  };

  const handleDelete = async (id: string) => {
    setServices(services.filter(s => s.id !== id));
    await deleteService(id);
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="p-3 w-10" /><th className="p-3 font-medium text-gray-600">Service</th>
            <th className="p-3 font-medium text-gray-600">Price</th><th className="p-3 font-medium text-gray-600">Status</th>
            <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
          </tr></thead>
          <tbody>{services.map(s => <tr key={s.id} className="border-b bg-white"><td className="p-3 w-10" /><td className="p-3"><span className="font-medium">{s.title}</span></td><td className="p-3" /><td className="p-3" /><td className="p-3" /></tr>)}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{ announcements: { onDragStart: () => '', onDragOver: () => '', onDragEnd: () => '', onDragCancel: () => '' } }}
      >
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-10"></th>
              <th className="p-3 font-medium text-gray-600">Service</th>
              <th className="p-3 font-medium text-gray-600">Price</th>
              <th className="p-3 font-medium text-gray-600">Status</th>
              <th className="p-3 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={services.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {services.map((service) => (
                <SortableRow 
                  key={service.id} 
                  service={service} 
                  onTogglePublish={handleTogglePublish}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No services found. Click "Add Service" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
