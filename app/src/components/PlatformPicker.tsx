import React from "react";
import { Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
// Import your Android-specific picker here if you have one
// import AndroidPicker from './AndroidPicker';

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
  if (Platform.OS === "android") {
    // Use Android-specific picker
    return (
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        // Add Android-specific props here
        mode="dropdown" // or "dialog"
      >
        {children}
      </Picker>
    );
  }

  // Use iOS/default picker
  return (
    <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
      {children}
    </Picker>
  );
}

// Export both the component and the Item for convenience
PlatformPicker.Item = Picker.Item;

export default PlatformPicker;
