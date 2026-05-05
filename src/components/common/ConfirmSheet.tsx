import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../theme';
import { Button } from './Button';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  subtitle: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'danger';
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const ConfirmSheet: React.FC<ConfirmSheetProps> = ({
  visible,
  title,
  subtitle,
  confirmLabel,
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
}) => {
  const { colors } = useTheme();
  const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [visible, slideY]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sheet,
                { backgroundColor: colors.surface, transform: [{ translateY: slideY }] },
              ]}
            >
              <View style={[styles.handle, { backgroundColor: colors.border }]} />

              <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
                <Text style={styles.checkmark}>✓</Text>
              </View>

              <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>

              <View style={styles.buttons}>
                <Button
                  variant="secondary"
                  label="Cancel"
                  onPress={onCancel}
                  style={styles.btn}
                />
                <TouchableOpacity
                  style={[
                    styles.btn,
                    styles.confirmBtn,
                    { backgroundColor: confirmVariant === 'danger' ? '#EF4444' : '#10B981' },
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmLabel}>{confirmLabel}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 50,
  },
  confirmBtn: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
