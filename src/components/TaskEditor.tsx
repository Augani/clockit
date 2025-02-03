"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  TextField,
  List,
  ListItem,
  IconButton,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  TrashIcon,
  PencilIcon,
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  LinkIcon,
  CodeBracketIcon,
  QueueListIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import moment from "moment";

interface Task {
  id: string;
  description: string;
  duration: number;
  createdAt: string;
}

interface TaskEditorProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  disabled?: boolean;
}

const MenuButton = ({ onClick, active, disabled, title, children }) => (
  <Tooltip title={title}>
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "hover:bg-gray-100 text-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  </Tooltip>
);

const TaskEditor: React.FC<TaskEditorProps> = ({
  tasks,
  onTasksUpdate,
  disabled = false,
}) => {
  const t = useTranslations("dashboard.tasks");
  const [duration, setDuration] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: t("descriptionPlaceholder"),
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[100px]",
      },
    },
    editable: !disabled,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const fetchedTasks = await response.json();
      onTasksUpdate(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!editor || !duration || editor.isEmpty) return;

    try {
      setIsLoading(true);
      const taskData = {
        description: editor.getHTML(),
        duration: parseInt(duration),
      };

      if (editingTask) {
        // Update existing task
        const response = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...taskData, id: editingTask.id }),
        });

        if (!response.ok) throw new Error("Failed to update task");

        const updatedTask = await response.json();
        onTasksUpdate(
          tasks.map((task) => (task.id === editingTask.id ? updatedTask : task))
        );
        setEditingTask(null);
      } else {
        // Create new task
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error("Failed to create task");

        const newTask = await response.json();
        onTasksUpdate([...tasks, newTask]);
      }

      editor.commands.clearContent();
      setDuration("");
    } catch (error) {
      console.error("Error saving task:", error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    editor?.commands.setContent(task.description);
    setDuration(task.duration.toString());
  };

  const handleDelete = async (taskId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      onTasksUpdate(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6">{t("title")}</Typography>
        {isLoading && <CircularProgress size={20} className="text-primary" />}
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          {/* Editor Menu */}
          <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
            <MenuButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              active={editor?.isActive("bold")}
              disabled={disabled}
              title={t("tooltips.bold")}
            >
              <BoldIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              active={editor?.isActive("italic")}
              disabled={disabled}
              title={t("tooltips.italic")}
            >
              <ItalicIcon className="w-4 h-4" />
            </MenuButton>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <MenuButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              active={editor?.isActive("bulletList")}
              disabled={disabled}
              title={t("tooltips.bulletList")}
            >
              <ListBulletIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              active={editor?.isActive("orderedList")}
              disabled={disabled}
              title={t("tooltips.numberedList")}
            >
              <QueueListIcon className="w-4 h-4" />
            </MenuButton>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <MenuButton
              onClick={addLink}
              active={editor?.isActive("link")}
              disabled={disabled}
              title={t("tooltips.addLink")}
            >
              <LinkIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              active={editor?.isActive("codeBlock")}
              disabled={disabled}
              title={t("tooltips.codeBlock")}
            >
              <CodeBracketIcon className="w-4 h-4" />
            </MenuButton>
          </div>

          {/* Editor Content */}
          <div className="p-3 bg-white">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:max-w-[200px]">
            <TextField
              type="number"
              label={t("duration")}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={disabled}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <div className="text-gray-500 text-sm px-2 border-l ml-2 pl-2">
                    {t("minutes")}
                  </div>
                ),
                className:
                  "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow",
              }}
              InputLabelProps={{
                className: "text-gray-600",
              }}
            />
          </div>

          <Button
            variant="contained"
            onClick={handleAddTask}
            disabled={disabled || !editor?.getText().trim() || !duration}
            className={`
              px-6 py-2 rounded-lg shadow-sm
              ${
                editingTask
                  ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-300"
                  : "bg-primary hover:bg-primary/90 focus:ring-primary/30"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              min-w-[120px] h-[40px] text-sm font-medium
            `}
          >
            <span className="flex items-center gap-2">
              {editingTask ? (
                <>
                  <PencilIcon className="w-4 h-4" />
                  {t("update")}
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  {t("add")}
                </>
              )}
            </span>
          </Button>
        </div>
      </div>

      <List className="mt-4 space-y-2">
        {tasks.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-4">{t("noTasks")}</div>
        )}
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div
                dangerouslySetInnerHTML={{ __html: task.description }}
                className="prose prose-sm max-w-none"
              />
              <Typography
                variant="caption"
                className="text-gray-600 mt-1 block"
              >
                <span className="mr-1">{t("duration")}:</span>
                <span className="font-bold">{task.duration}m</span>
                <span className="ml-2">{moment(task.createdAt).fromNow()}</span>
              </Typography>
            </div>
            <div className="flex gap-2 ml-4">
              <Tooltip title={t("tooltips.edit")}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(task)}
                  disabled={disabled || isLoading}
                  className="text-gray-600 hover:text-primary"
                >
                  <PencilIcon className="w-4 h-4" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("tooltips.delete")}>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(task.id)}
                  disabled={disabled || isLoading}
                  className="text-gray-600 hover:text-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </IconButton>
              </Tooltip>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TaskEditor;
