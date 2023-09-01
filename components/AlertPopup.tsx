import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { colors } from "../constants";

type AlertPopupProps = {
  message: string;
  duration?: number;
  clearMessage: () => void;
};

export default function AlertPopup({
  message,
  clearMessage,
  duration = 2000,
}: AlertPopupProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (message === "") return;

    setIsVisible(true);
    setTimeout(() => {
      clearMessage();
      setIsVisible(false);
    }, duration);
  }, [message]);

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={0}
      onBackdropPress={() => setIsVisible(false)}
      avoidKeyboard={true}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.border,
    marginBottom: 50,
    marginHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: colors.text,
  },
});
