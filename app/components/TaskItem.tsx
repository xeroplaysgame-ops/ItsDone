import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  const taskTextStyle = task.completed
    ? [styles.taskText, styles.completedTaskText]
    : styles.taskText;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggleComplete} style={styles.taskContent}>
        <View style={styles.checkbox}>
          {task.completed && <View style={styles.checkmark} />}
        </View>
        <Text style={taskTextStyle}>{task.text}</Text>
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
});

export default React.memo(TaskItem);
