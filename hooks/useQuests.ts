// hooks/useQuests.ts

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/utils/types';

export const useQuests = (userTelegramInitData: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?initData=${encodeURIComponent(userTelegramInitData)}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data.tasks);
        setCompletedTasks(data.completedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userTelegramInitData]);

  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === updatedTask.id ? { ...updatedTask } : t)));

    if (updatedTask.isCompleted) {
      setCompletedTasks((prev) => {
        // Check if task already exists in completedTasks
        const taskExists = prev.some((t) => t.id === updatedTask.id);
        if (taskExists) {
          return prev.map((t) => (t.id === updatedTask.id ? { ...updatedTask } : t));
        }
        // Add cloned task to completedTasks if it's a DAILY task
        if (updatedTask.type === 'DAILY') {
          return [...prev, { ...updatedTask, id: `completed-${Date.now()}` }];
        }
        return [...prev, { ...updatedTask }];
      });
    }
  }, []);

  return { tasks, completedTasks, isLoading, handleTaskUpdate };
};
