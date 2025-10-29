import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform, LayoutAnimation } from 'react-native';
import { scheduleNotificationAsync, cancelScheduledNotificationAsync } from 'expo-notifications';
import { useAuth } from '../../hooks/useAuth';
import { firestore } from '../../services/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string | null; // ISO string
  notificationId?: string | null;
};

type TaskContextValue = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'notificationId'>) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  reload: () => Promise<void>;
};

const TASKS_STORAGE_KEY = '@ItsDone:tasks';

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = (() => {
    try {
      return useAuth();
    } catch (e) {
      return { user: null } as any;
    }
  })();

  // Load tasks from AsyncStorage on mount; when user logs in, we'll subscribe to Firestore
  const loadLocal = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load tasks', e);
    }
  }, []);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  // Persist local copy always
  useEffect(() => {
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)).catch((e) => console.warn('save failed', e));
  }, [tasks]);

  // When user is logged in, subscribe to Firestore collection and mirror changes locally.
  useEffect(() => {
    if (!user || !user.uid) return;
    const db = firestore();
    if (!db) return;

    const col = collection(db, 'users', user.uid, 'tasks');
    const q = query(col, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const serverTasks: Task[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          serverTasks.push({
            id: docSnap.id,
            text: data.text,
            completed: !!data.completed,
            dueDate: data.dueDate ?? null,
            notificationId: data.notificationId ?? null,
          });
        });
        // update local tasks to reflect server authoritative state
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(serverTasks);
      },
      (err) => console.warn('tasks onSnapshot error', err)
    );

    return () => unsub();
  }, [user]);

  const scheduleForTask = async (taskId: string, dueDateISO?: string | null) => {
    if (!dueDateISO) return null;
    try {
      const trigger = new Date(dueDateISO);
      if (trigger <= new Date()) return null; // don't schedule past
      const nid = await Notifications.scheduleNotificationAsync({
        content: { title: 'Task Reminder', body: 'Reminder for your task', data: { taskId } },
        trigger,
      } as any);
      return nid;
    } catch (e) {
      console.warn('schedule failed', e);
      return null;
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'notificationId'>) => {
    const id = String(Date.now());
    const newTask: Task = { ...task, id, notificationId: null };
    // schedule notification if dueDate
    if (newTask.dueDate) {
      const nid = await scheduleForTask(id, newTask.dueDate);
      newTask.notificationId = nid;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => [newTask, ...prev]);

    // If user is logged in, persist to Firestore
    try {
      if (user && user.uid) {
        const db = firestore();
        if (db) {
          const col = collection(db, 'users', user.uid, 'tasks');
          await addDoc(col, {
            text: newTask.text,
            completed: newTask.completed,
            dueDate: newTask.dueDate ?? null,
            notificationId: newTask.notificationId ?? null,
            createdAt: Date.now(),
          });
        }
      }
    } catch (e) {
      console.warn('firestore add failed', e);
    }
  };

  const updateTask = async (id: string, patch: Partial<Task>) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
      return next;
    });

    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    // handle notification reschedule
    if (patch.dueDate !== undefined) {
      if (t.notificationId) {
        try {
          cancelScheduledNotificationAsync(t.notificationId);
        } catch (_) {}
      }
      if (patch.dueDate) {
        const nid = await scheduleForTask(id, patch.dueDate as string);
        setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, notificationId: nid } : x)));
      } else {
        setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, notificationId: null } : x)));
      }
    }

    // persist patch to Firestore if logged in
    try {
      if (user && user.uid) {
        const db = firestore();
        if (db) {
          const docRef = doc(db, 'users', user.uid, 'tasks', id);
          await updateDoc(docRef, {
            ...patch,
          } as any);
        }
      }
    } catch (e) {
      console.warn('firestore update failed', e);
    }
  };

  const deleteTask = async (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (t?.notificationId) {
      try {
        await cancelScheduledNotificationAsync(t.notificationId);
      } catch (_) {}
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => prev.filter((x) => x.id !== id));

    // delete from firestore if logged in
    try {
      if (user && user.uid) {
        const db = firestore();
        if (db) {
          const docRef = doc(db, 'users', user.uid, 'tasks', id);
          await deleteDoc(docRef);
        }
      }
    } catch (e) {
      console.warn('firestore delete failed', e);
    }
  };

  const toggleComplete = async (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      return next;
    });
  };

  const value: TaskContextValue = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reload: loadLocal,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskContext;
