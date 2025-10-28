import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const AddTaskModal = ({ visible, onClose, onSave }) => {
  const [taskText, setTaskText] = React.useState('');

  const handleSave = () => {
    if (taskText.trim().length > 0) {
      onSave(taskText.trim());
      setTaskText(''); // Clear input after saving
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Finish project plan"
            value={taskText}
            onChangeText={setTaskText}
            autoFocus={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setTaskText('');
                onClose();
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={() => {
                handleSave();
                onClose();
              }}>
              <Text style={styles.textStyle}>Save</Text>
            </TouchableOpacity>
          </View>
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
