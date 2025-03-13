// components/Quests.tsx

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useGameStore } from '@/utils/game-mechanics';
import { triggerHapticFeedback } from '@/utils/ui';
import { JOK_POINTS, pageBackground } from '@/images';
import TaskPopup from './popups/TaskPopup';
import { Task } from '@/utils/types';
import { useTranslations } from 'next-intl';
import Button from './ui/button';
import { useQuests } from '@/hooks/useQuests';
import TONTaskPopup from './popups/TONTaskPopup';
import { getTaskSearchString } from '@/utils/taskUtils';
import { TASK_DAILY_RESET_TIME } from '@/utils/consts';
import TaskList from './quests/TaskList';

interface QuestsProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Quests = ({ currentView, setCurrentView }: QuestsProps) => {
  const t = useTranslations('Quests');
  const searchParams = useSearchParams();
  const { userTelegramInitData } = useGameStore();
  const { tasks, completedTasks, isLoading, handleTaskUpdate } = useQuests(userTelegramInitData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks.length > 0) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    const taskParam = searchParams.get('task');
    if (taskParam && tasks.length > 0) {
      const searchString = getTaskSearchString(taskParam);
      if (searchString) {
        const task = tasks.find((t) => t.title.toLowerCase().includes(searchString.toLowerCase()));
        if (task) {
          handleTaskSelection(task);
        }
      }
    }
  }, [searchParams, tasks]);

  const handleClosePopup = () => {
    setSelectedTask(null);
    // Remove the task parameter from URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('task');
    window.history.pushState({}, '', `?${newParams.toString()}`);
  };

  const handleViewChange = (view: string) => {
    triggerHapticFeedback(window);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('task');
    newParams.delete('view', 'quests');
    window.history.pushState({}, '', `?${newParams.toString()}`);
    setCurrentView(view);
  };

  const handleTaskSelection = useCallback((task: Task) => {
    triggerHapticFeedback(window);
    // Check if the task is already completed and within cooldown period
    if (task.type === 'DAILY' && task.completedAt) {
      const completedAt = new Date(task.completedAt);
      const now = new Date();
      const resetTime = new Date(now);
      resetTime.setUTCHours(TASK_DAILY_RESET_TIME, 0, 0, 0);

      if (resetTime <= completedAt) {
        resetTime.setUTCDate(resetTime.getUTCDate() + 1);
      }

      if (now < resetTime) {
        return; // Don't allow selection if task is in cooldown
      }
    }

    setSelectedTask(task);
  }, []);

  const handleEnhancedTaskUpdate = useCallback(
    (updatedTask: Task) => {
      setLocalTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      handleTaskUpdate(updatedTask);
    },
    [handleTaskUpdate]
  );

  return (
    <div className='bg-black flex justify-center min-h-screen'>
      <div className='w-full bg-black text-white font-bold flex flex-col max-w-xl'>
        <div
          className='h-screen mt-4 bg-customGreen-700 rounded-t-[48px] relative top-glow z-0'
          style={{
            backgroundImage: `url(${pageBackground.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className='flex-grow mt-[2px] rounded-t-[46px] h-full overflow-y-auto no-scrollbar relative'>
            <div className='px-4 pt-1 pb-24'>
              <div className='relative mt-4'>
                <div className='flex justify-center mb-4'>
                  <Image src={JOK_POINTS} alt='JOK Points' width={40} height={40} className='w-24 h-24 mx-auto' />
                </div>
                <h1 className='text-2xl text-center mb-4'>{t('title')}</h1>

                {isLoading ? (
                  <div className='text-center text-gray-400 mt-8 mb-4'>{t('loading')}</div>
                ) : (
                  <TaskList tasks={localTasks} onTaskSelect={handleTaskSelection} completedTasks={completedTasks} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTask &&
        (selectedTask.type === 'DAILY' && selectedTask.title === 'TON Daily Check-In' ? (
          <TONTaskPopup
            task={selectedTask}
            onClose={handleClosePopup}
            onUpdate={handleEnhancedTaskUpdate}
          />
        ) : (
          <TaskPopup
            task={selectedTask}
            onClose={handleClosePopup}
            onUpdate={handleEnhancedTaskUpdate}
          />
        ))}
    </div>
  );
};

export default Quests;