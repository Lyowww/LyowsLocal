import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Task } from '@/utils/types';
import TaskCard from './TaskCard';
import SocialMediaTasks from './SocialMediaTasks';
import CompletedTasks from './CompletedTasks';
import { useTranslations } from 'next-intl';

interface TaskListProps {
    tasks: Task[];
    onTaskSelect: (task: Task) => void;
    completedTasks: Task[];
}


const isWithin24Hours = (createdAt: Date, currentTime: Date) => {
    return currentTime.getTime() - createdAt.getTime() <= 24 * 60 * 60 * 1000;
};

const TaskList = ({ tasks, onTaskSelect, completedTasks }: TaskListProps) => {
    const t = useTranslations('Quests');

    const [currentTime, setCurrentTime] = useState(() => new Date());

    const updateCurrentTime = useCallback(() => {
        setCurrentTime(new Date());
    }, []);

    useEffect(() => {
        const timer = setInterval(updateCurrentTime, 60000); // Update every minute
        return () => clearInterval(timer);
    }, [updateCurrentTime]);

    const filteredTasks = useMemo(() => {
        const officialTasks = tasks.filter((task) => task.type === 'OFFICIAL' && !task.isCompleted);

        const tempAndDailyTasks = tasks.filter((task) => {
            if (task.type === 'DAILY') return true;
            if (task.type === 'TEMPORARY' && !task.isCompleted) {
                return isWithin24Hours(new Date(task.createdAt), currentTime);
            }
            return false;
        });

        const socialTasks = tasks.filter(
            (task) =>
                task.type === 'TEMPORARY' && !task.isCompleted && !isWithin24Hours(new Date(task.createdAt), currentTime)
        );

        return {
            officialTasks,
            tempAndDailyTasks,
            socialTasks
        };
    }, [tasks, currentTime]);

    const handleTaskSelect = useCallback(
        (task: Task) => {
            onTaskSelect(task);
        },
        [onTaskSelect]
    );

    const { officialTasks, tempAndDailyTasks, socialTasks } = filteredTasks;

    return (
        <div>
            {officialTasks.length > 0 && (
                <section>
                    <h2 className='text-base mt-8 mb-4'>{t('official')}</h2>
                    <div className='space-y-2'>
                        {officialTasks.map((task) => (
                            <TaskCard key={task.id} task={task} onSelect={handleTaskSelect} />
                        ))}
                    </div>
                </section>
            )}

            {tempAndDailyTasks.length > 0 && (
                <section>
                    <h2 className='text-base mt-8 mb-4'>{t('daily')}</h2>
                    <div className='space-y-2'>
                        {tempAndDailyTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onSelect={handleTaskSelect}
                                gradient={task.type === 'TEMPORARY'}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Social Tasks */}
            <SocialMediaTasks tasks={socialTasks} onTaskSelect={handleTaskSelect} />

            {/* Completed Tasks */}
            <CompletedTasks tasks={completedTasks} />
        </div>
    );
};

export default memo(TaskList);
