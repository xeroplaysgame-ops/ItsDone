import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This path is correct because the components folder is now inside `app`
import TaskItem from './components/TaskItem';
import AddTaskModal from './components/AddTaskModal';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const TASKS_STORAGE_KEY = '@ItsDone:tasks';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const isFirstRun = useRef(true);

  // Load tasks from AsyncStorage when the app starts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load tasks.');
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever the tasks state changes
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        Alert.alert('Error', 'Failed to save tasks.');
      }
    };
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    saveTasks();
  }, [tasks]);

  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: uuid.v4() as string,
      text: text,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setModalVisible(false);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
  }, [tasks]);

  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        task={item}
        onToggleComplete={() => handleToggleComplete(item.id)}
        onDelete={() => handleDeleteTask(item.id)}
      />
    ),
    [tasks]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>ItsDone</Text>
      </View>
      <FlatList
        data={sortedTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
    headerText: { fontSize: 24, fontWeight: 'bold', color: '#000' },
    taskList: { flex: 1 },
    fab: { position: 'absolute', right: 30, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
    fabIcon: { fontSize: 30, color: '#fff' },
});

export default App;
