import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import LottieView from 'lottie-react-native';

const TaskListScreen: React.FC = () => {
  const { tasks, deleteTask, toggleComplete } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const scheme = useColorScheme();

  const renderItem = ({ item }: any) => (
    <TaskItem task={item} onToggleComplete={() => toggleComplete(item.id)} onDelete={() => deleteTask(item.id)} />
  );

  return (
    <View style={[styles.container, scheme === 'dark' ? styles.dark : styles.light]}>
      <View style={styles.header}>
        <Text style={styles.title}>ItsDone</Text>
      </View>
      {tasks.length === 0 ? (
        <View style={styles.empty}>
          <LottieView source={require('../../assets/animations/empty.json')} autoPlay loop={false} style={{ width: 200, height: 200 }} />
          <Text style={styles.emptyText}>No tasks yet — add something to get focused.</Text>
        </View>
      ) : (
        <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item) => item.id} />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 12, color: '#666' },
  fab: { position: 'absolute', right: 30, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  fabIcon: { color: '#fff', fontSize: 30 },
  dark: { backgroundColor: '#0b1220' },
  light: { backgroundColor: '#f5f5f5' },
});

export default TaskListScreen;
