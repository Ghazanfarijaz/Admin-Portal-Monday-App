import React from "react";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable row item
export const SortableField = ({ field, children }) => {
  const { setNodeRef, transform, transition, listeners, attributes } =
    useSortable({ id: field.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full flex items-center gap-2"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={18} />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

// DnD wrapper
export const DraggableFields = ({ fields, onReorder, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="overflow-hidden w-full flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = fields.findIndex((f) => f.tempId === active.id);
            const newIndex = fields.findIndex((f) => f.tempId === over.id);
            onReorder(arrayMove(fields, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext
          items={fields.map((f) => f.tempId)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
      </DndContext>
    </div>
  );
};
