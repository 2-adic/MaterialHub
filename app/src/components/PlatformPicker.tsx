import React, { useState } from "react";
import {
  Platform,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

type PickerItem = {
  label: string;
  value: any;
};

type PlatformPickerProps<T> = {
  selectedValue: T;
  onValueChange: (value: T) => void;
  children: React.ReactNode;
};

function PlatformPicker<T>({
  selectedValue,
  onValueChange,
  children,
}: PlatformPickerProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  // Extract items from children
  const items: PickerItem[] = React.Children.map(children, (child: any) => ({
    label: child.props.label,
    value: child.props.value,
  })) || [];

  const selectedLabel = items.find((item) => item.value === selectedValue)?.label || "";

  if (Platform.OS === "android") {
    return (
      <>
        <TouchableOpacity
          style={styles.androidButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.androidButtonText}>{selectedLabel}</Text>
          <Text style={styles.androidButtonIcon}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <ScrollView>
                {items.map((item) => (
                  <TouchableOpacity
                    key={String(item.value)}
                    style={styles.modalItem}
                    onPress={() => {
                      onValueChange(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                    {item.value === selectedValue && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  // Use iOS/default picker
  return (
    <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
      {children}
    </Picker>
  );
}

const styles = StyleSheet.create({
  androidButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  androidButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  androidButtonIcon: {
    color: "#4a90e2",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    width: "80%",
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "#2a2a4e",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a4e",
  },
  modalItemText: {
    color: "#fff",
    fontSize: 16,
  },
  checkmark: {
    color: "#4a90e2",
    fontSize: 20,
    fontWeight: "bold",
  },
});

PlatformPicker.Item = Picker.Item;

export default PlatformPicker;
