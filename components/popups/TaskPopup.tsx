import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/utils/game-mechanics';
import { formatNumber, triggerHapticFeedback } from '@/utils/ui';
import { imageMap, JOK_POINTS_UP } from '@/images';
import { useHydration } from '@/utils/useHydration';
import { TASK_WAIT_TIME, TASK_DAILY_RESET_TIME } from '@/utils/consts';
import { useToast } from '@/contexts/ToastContext';
import { TaskPopupProps } from '@/utils/types';
import { useTranslations } from 'next-intl';
import { calculateYieldPerHour } from '@/utils/calculations';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

const STORAGE_KEY = 'viewedTaskLinks';

const TaskButton: React.FC<{
  canStartTask: () => boolean;
  isLoading: boolean;
  isFullscreen: boolean;
  localTask: any;
  formattedTime: string;
  isExpired: boolean;
  isHydrated: boolean;
  hasViewedLink: boolean;
  handleOpenLink: () => void;
  handleStart: () => void;
  handleCheck: () => void;
  t: any;
}> = ({
  canStartTask,
  isLoading,
  isFullscreen,
  localTask,
  formattedTime,
  isExpired,
  isHydrated,
  hasViewedLink,
  handleOpenLink,
  handleStart,
  handleCheck,
  t
}) => {
    return (
      <button
        className={`${isFullscreen ? 'w-fit px-4 py-2 ' : 'w-full py-6 '}  text-xl font-bold text-white rounded-2xl 
          flex items-center justify-center 
          ${!canStartTask() || isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-customGreen-700'}`}
        onClick={
          localTask.taskAction.name === 'VISIT'
            ? localTask.taskStartTimestamp
              ? isExpired
                ? handleCheck
                : undefined
              : handleStart
            : localTask.taskData.link && !hasViewedLink
              ? handleOpenLink
              : handleCheck
        }
        disabled={!canStartTask() || isLoading}
      >
        {isLoading ? (
          <div className='w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin' />
        ) : !canStartTask() ? (
          t('completed')
        ) : localTask.taskAction.name === 'VISIT' ? (
          localTask.taskStartTimestamp ? (
            isHydrated ? (
              isExpired ? (
                t('check')
              ) : (
                formattedTime
              )
            ) : (
              t('loading')
            )
          ) : (
            t('start')
          )
        ) : (
          t('check')
        )}
      </button>
    );
  };

const TaskPopup: React.FC<TaskPopupProps> = React.memo(({ task: initialTask, onClose, onUpdate }) => {
  const t = useTranslations('TaskPopup');
  const { userTelegramInitData, incrementPoints, setTotalStars, setEarnedStars, bonusYieldPerHour, upgradeYieldPerHour } = useGameStore();
  const showToast = useToast();
  const isHydrated = useHydration();

  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localTask, setLocalTask] = useState(initialTask);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [hasViewedLink, setHasViewedLink] = useState(false);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const getViewedLinksFromStorage = useCallback(() => {
    try {
      if (typeof window === 'undefined') return {};
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  }, []);

  const isLinkViewed = useCallback(
    (taskId: string) => {
      try {
        const viewedLinks = getViewedLinksFromStorage();
        return !!viewedLinks[taskId];
      } catch (error) {
        console.error('Error checking viewed link:', error);
        return false;
      }
    },
    [getViewedLinksFromStorage]
  );

  const setLinkViewed = useCallback(
    (taskId: string) => {
      try {
        if (typeof window === 'undefined') return;
        const viewedLinks = getViewedLinksFromStorage();
        viewedLinks[taskId] = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedLinks));
      } catch (error) {
        console.error('Error setting viewed link:', error);
      }
    },
    [getViewedLinksFromStorage]
  );

  useEffect(() => {
    setHasViewedLink(isLinkViewed(initialTask.id));
  }, [initialTask.id, isLinkViewed]);

  // Calculate initial wait time for VISIT tasks
  const initialWaitTime = useMemo(() => {
    if (!localTask.taskStartTimestamp) return 0;
    const startTime = new Date(localTask.taskStartTimestamp);
    const now = new Date();
    const waitTime = localTask.taskData.waitTime ? localTask.taskData.waitTime * 60000 : TASK_WAIT_TIME;
    return Math.max(0, waitTime - (now.getTime() - startTime.getTime()));
  }, [localTask.taskStartTimestamp, localTask.taskData.waitTime]);

  const { formattedTime, isExpired } = useCountdownTimer(initialWaitTime);

  // Check if task can be started/completed based on daily reset time
  const canStartTask = useCallback(() => {
    if (localTask.type !== 'DAILY') return true;

    if (localTask.completedAt) {
      const completedAt = new Date(localTask.completedAt);
      const now = new Date();
      const resetTime = new Date(now);
      resetTime.setUTCHours(TASK_DAILY_RESET_TIME, 0, 0, 0);

      if (resetTime <= completedAt) {
        resetTime.setUTCDate(resetTime.getUTCDate() + 1);
      }

      return now >= resetTime;
    }

    return true;
  }, [localTask.type, localTask.completedAt]);

  // Validate submission URL
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle opening the link for non-VISIT tasks
  const handleOpenLink = async () => {
    if (!localTask.taskData.link) return;
    try {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        WebApp.openLink(localTask.taskData.link);
        setLinkViewed(localTask.id);
        setHasViewedLink(true);
      }
    } catch (err) {
      console.error('Error opening link:', err);
    }
  };

  // Handle task start
  const handleStart = async () => {
    if (!canStartTask()) {
      showToast(t('taskNotAvailable'), 'error');
      return;
    }

    setIsLoading(true);
    try {
      triggerHapticFeedback(window);
      const response = await fetch('/api/tasks/update/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData: userTelegramInitData,
          taskId: localTask.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start task');
      }

      const data = await response.json();
      const updatedTask = {
        ...localTask,
        taskStartTimestamp: new Date(data.taskStartTimestamp)
      };
      setLocalTask(updatedTask);
      onUpdate(updatedTask);
      showToast(t('taskStarted'), 'success');

      // Open link for VISIT tasks
      if (localTask.taskAction.name === 'VISIT' && localTask.taskData.link) {
        handleOpenLink();
      }
    } catch (error) {
      console.error('Error starting task:', error);
      showToast(t('taskStartError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task check/completion
  const handleCheck = async () => {
    if (!canStartTask()) {
      showToast(t('taskNotAvailable'), 'error');
      return;
    }

    // Check if the task has a link and hasn't been viewed yet
    if (localTask.taskData.link && !hasViewedLink && localTask.taskAction.name !== 'VISIT') {
      handleOpenLink();
      return;
    }

    // Validate submission URL if required
    if (
      localTask.taskData.requireSubmission &&
      localTask.taskAction.name !== 'REFERRAL' &&
      localTask.taskAction.name !== 'VISIT'
    ) {
      if (!submissionUrl || !validateUrl(submissionUrl)) {
        showToast(t('invalidUrl'), 'error');
        return;
      }
    }

    setIsLoading(true);
    try {
      triggerHapticFeedback(window);
      const basePayload = {
        initData: userTelegramInitData,
        taskId: localTask.id
      };

      const payload = localTask.taskData.requireSubmission ? { ...basePayload, submissionUrl } : basePayload;

      const endpoint = `/api/tasks/check/${localTask.taskAction.name.toLowerCase()}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('checkError'));
      }

      const data = await response.json();

      if (data.success) {
        const updatedTask = {
          ...localTask,
          taskStartTimestamp: data.taskStartTimestamp,
          isCompleted: data.isCompleted,
          completedAt: data.completedAt
        };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
        incrementPoints(data.points);
        setTotalStars(data.totalStars);
        setEarnedStars(data.earnedStars);
        showToast(data.message || t('taskCompleted'), 'success');
        handleClose();
      } else {
        if (
          localTask.taskAction.name === 'REFERRAL' &&
          data.currentReferrals !== undefined &&
          data.requiredReferrals !== undefined
        ) {
          const remaining = data.requiredReferrals - data.currentReferrals;
          showToast(
            t('referralsRemaining', {
              count: remaining,
              current: data.currentReferrals,
              required: data.requiredReferrals
            }),
            'error'
          );
        } else {
          showToast(data.message || t('taskCheckFailed'), 'error');
        }
      }
    } catch (error) {
      console.error('Error checking task:', error);
      showToast(error instanceof Error ? error.message : t('taskCheckFailed'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate points with bonuses
  const points = useMemo(() => {
    const basePoints = localTask.points || 0;
    const bonusPoints = calculateYieldPerHour(bonusYieldPerHour, upgradeYieldPerHour);
    const multiplier = localTask.multiplier || (localTask.type === 'DAILY' ? 2 : 1.5);
    return formatNumber(basePoints + (bonusPoints * multiplier));
  }, [localTask, bonusYieldPerHour, upgradeYieldPerHour]);

  const handleClose = () => {
    triggerHapticFeedback(window);
    setIsClosing(true);
    setTimeout(onClose, 280);
  };

  // const handlePaste = async () => {
  //   try {
  //     if (typeof window !== 'undefined') {
  //       const WebApp = (await import('@twa-dev/sdk')).default;
  //       WebApp.ready();
  //       WebApp.readTextFromClipboard((text: string) => {
  //         console.log('Clipboard text:', text);
  //         setSubmissionUrl(text);
  //       });
  //     }
  //   } catch (err) {
  //     console.error('Failed to read clipboard:', err);
  //     showToast(t('clipboardError'), 'error');
  //   }
  // };

  const handleInputFocus = () => {
    if (isIOS) {
      setIsInputFocused(true);
    }
  };

  const handleInputBlur = () => {
    if (isIOS) {
      setIsInputFocused(false);
    }
  };

  const isFullscreen = !!localTask.taskData.backgroundImage;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50'>
      <div
        className={`relative bg-[#272a2f] rounded-3xl p-6 w-full max-w-xl 
          ${isClosing ? 'animate-slide-down' : 'animate-slide-up'} 
          ${isFullscreen ? 'h-full' : ''}
          `}
        style={{
          backgroundImage: localTask.taskData.backgroundImage ? `url(${localTask.taskData.backgroundImage})` : 'none',
          backgroundSize: 'cover'
        }}
      >
        <div className={`${isFullscreen ? 'h-full flex flex-col justify-end' : ''} ${isIOS && isInputFocused ? 'translate-y-[-200px] transition-transform' : 'translate-y-0'}`}>
          <button
            onClick={handleClose}
            className='absolute top-0 right-0 w-6 h-6 aspect-square text-white bg-customGreen-700 rounded-full'
          >
            &times;
          </button>

          <div
            className={`flex justify-between items-center mb-4 
          ${isFullscreen ? 'absolute top-6 right-6 left-6' : ''}`}
          >
            <div className='w-8'></div>
            <h2 className={`text-3xl text-white text-center font-bold ${isFullscreen ? 'backdrop-brightness-50' : ''}`}>
              {localTask.title}
            </h2>
            <div className='w-8'></div>
          </div>

          {!isFullscreen && (
            <Image
              src={localTask.partnerImage?.includes('http') ? localTask.partnerImage : imageMap[localTask.partnerImage]}
              alt={localTask.title}
              width={80}
              height={80}
              className='mx-auto mb-4'
            />
          )}

          <p
            className={`text-gray-300 text-center mb-4 
          ${isFullscreen ? 'text-lg backdrop-brightness-50' : ''}`}
          >
            {localTask.description}
          </p>

          {localTask.taskData.requireSubmission && (
            <div className='flex justify-center mb-4'>
              <input
                type='text'
                className='w-full px-4 py-3 text-xl font-bold bg-gray-700 text-white rounded-2xl'
                placeholder={t('enterPostUrl')}
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {/* <button
                className='ml-2 px-4 py-3 text-base font-bold bg-green-500 text-white rounded-2xl'
                onClick={handlePaste}
              >
                {t('paste')}
              </button> */}
            </div>
          )}

          {isFullscreen ? (
            <div className='flex justify-center items-center gap-2'>
              <div className='flex justify-center items-center'>
                <Image src={JOK_POINTS_UP} alt='JOK Points' width={24} height={24} className='w-6 h-6' />
                <span className='text-white font-bold text-2xl ml-1'>+{points}</span>

                {localTask.rewardStars && (
                  <>
                    <span className='font-bold ml-2'>+</span>
                    <Image src={'/star.png'} alt='Star' width={24} height={24} className='w-6 h-6 mr-1 ml-2' />
                    <span className='text-customGreen-700'>{localTask.rewardStars}</span>
                  </>
                )}
              </div>

              <TaskButton
                canStartTask={canStartTask}
                isLoading={isLoading}
                isFullscreen={isFullscreen}
                localTask={localTask}
                formattedTime={formattedTime}
                isExpired={isExpired}
                isHydrated={isHydrated}
                hasViewedLink={hasViewedLink}
                handleOpenLink={handleOpenLink}
                handleStart={handleStart}
                handleCheck={handleCheck}
                t={t}
              />
            </div>
          ) : (
            <>
              <div className='flex justify-center items-center mb-4'>
                <Image src={JOK_POINTS_UP} alt='JOK Points' width={24} height={24} className='w-6 h-6' />
                <span className='text-white font-bold text-2xl ml-1'>+{points}</span>
                {localTask.rewardStars && (
                  <>
                    <span className='font-bold ml-2'>+</span>
                    <Image src={'/star.png'} alt='Star' width={24} height={24} className='w-6 h-6 mr-1 ml-2' />
                    <span className='text-customGreen-700'>{localTask.rewardStars}</span>
                  </>
                )}
              </div>

              <TaskButton
                canStartTask={canStartTask}
                isLoading={isLoading}
                isFullscreen={isFullscreen}
                localTask={localTask}
                formattedTime={formattedTime}
                isExpired={isExpired}
                isHydrated={isHydrated}
                hasViewedLink={hasViewedLink}
                handleOpenLink={handleOpenLink}
                handleStart={handleStart}
                handleCheck={handleCheck}
                t={t}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default TaskPopup;