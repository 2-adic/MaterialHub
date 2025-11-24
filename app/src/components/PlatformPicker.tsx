import React, { useState, useRef } from "react";
import {
  Platform,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const ITEM_HEIGHT = 50;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const [tempValue, setTempValue] = useState(selectedValue);
  const scrollViewRef = useRef<ScrollView>(null);

  // Extract items from children
  const items: PickerItem[] = React.Children.map(children, (child: any) => ({
    label: child.props.label,
    value: child.props.value,
  })) || [];

  const selectedLabel = items.find((item) => item.value === selectedValue)?.label || "";

  const handleModalOpen = () => {
    setTempValue(selectedValue);
    setModalVisible(true);
    // Scroll to selected item after modal opens
    setTimeout(() => {
      const selectedIndex = items.findIndex((item) => item.value === selectedValue);
      if (selectedIndex >= 0 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: selectedIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, 100);
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < items.length) {
      setTempValue(items[index].value);
    }
  };

  const handleConfirm = () => {
    onValueChange(tempValue);
    setModalVisible(false);
  };

  if (Platform.OS === "android") {
    return (
      <>
        <TouchableOpacity
          style={styles.androidButton}
          onPress={handleModalOpen}
        >
          <Text style={styles.androidButtonText}>{selectedLabel}</Text>
          <Text style={styles.androidButtonIcon}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.wheelContainer}>
              <View style={styles.wheelHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.wheelPickerContainer}>
                <View style={styles.highlightOverlay} />
                <ScrollView
                  ref={scrollViewRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleScroll}
                  contentContainerStyle={styles.scrollContent}
                >
                  <View style={{ height: ITEM_HEIGHT * 2 }} />
                  {items.map((item) => (
                    <View key={String(item.value)} style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          item.value === tempValue && styles.wheelItemTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  ))}
                  <View style={{ height: ITEM_HEIGHT * 2 }} />
                </ScrollView>
              </View>
            </View>
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  wheelContainer: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  wheelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a4e",
  },
  cancelButton: {
    color: "#aaa",
    fontSize: 16,
  },
  doneButton: {
    color: "#4a90e2",
    fontSize: 16,
    fontWeight: "600",
  },
  wheelPickerContainer: {
    height: ITEM_HEIGHT * 5,
    position: "relative",
  },
  highlightOverlay: {
    position: "absolute",
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#4a90e2",
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    zIndex: 1,
    pointerEvents: "none",
  },
  scrollContent: {
    paddingVertical: 0,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  wheelItemText: {
    fontSize: 18,
    color: "#666",
  },
  wheelItemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});

PlatformPicker.Item = Picker.Item;

export default PlatformPicker;
