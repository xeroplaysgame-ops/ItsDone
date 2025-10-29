import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTasks } from '../context/TaskContext';

type AddTaskModalProps = {
  visible: boolean;
  onClose: () => void;
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose }) => {
  const [taskText, setTaskText] = React.useState('');
  const [pickerVisible, setPickerVisible] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<Date | null>(null);
  const { addTask } = useTasks();

  const handleSave = async () => {
    if (taskText.trim().length > 0) {
      await addTask({ text: taskText.trim(), completed: false, dueDate: dueDate ? dueDate.toISOString() : null });
      setTaskText(''); // Clear input after saving
      setDueDate(null);
      onClose();
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Finish project plan"
            value={taskText}
            onChangeText={setTaskText}
            autoFocus={true}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <TouchableOpacity style={styles.dateButton} onPress={() => setPickerVisible(true)}>
            <Text style={styles.dateButtonText}>{dueDate ? dueDate.toLocaleString() : 'Add due date (optional)'}</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setTaskText('');
                setDueDate(null);
                onClose();
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={pickerVisible}
            mode="datetime"
            onConfirm={(date: Date) => {
              setDueDate(date);
              setPickerVisible(false);
            }}
            onCancel={() => setPickerVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dateButton: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#444',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonSave: {
    backgroundColor: '#007AFF',
  },
  buttonClose: {
    backgroundColor: '#ccc',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddTaskModal;
