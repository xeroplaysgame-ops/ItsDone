import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task as TaskType } from '../context/TaskContext';
import LottieView from 'lottie-react-native';

type TaskItemProps = {
  task: TaskType;
  onToggleComplete: () => void;
  onDelete: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
  const taskTextStyle = task.completed ? [styles.taskText, styles.completedTaskText] : styles.taskText;

  return (
    <View style={[styles.container, task.completed ? styles.completedContainer : null]}>
      <TouchableOpacity onPress={onToggleComplete} style={styles.taskContent} activeOpacity={0.7}>
        <View style={[styles.checkbox, task.completed ? styles.checkboxActive : null]}>
          {task.completed && (
            // small lottie check animation placeholder; actual JSON to be added later
            <LottieView source={require('../../assets/animations/check.json')} style={{ width: 28, height: 28 }} autoPlay loop={false} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={taskTextStyle}>{task.text}</Text>
          {task.dueDate ? <Text style={styles.dueText}>Due: {new Date(task.dueDate).toLocaleString()}</Text> : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#ff3b30',
  },
  completedContainer: {
    backgroundColor: '#f0f8ff',
  },
  checkboxActive: {
    backgroundColor: '#007AFF',
  },
  dueText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default React.memo(TaskItem);
