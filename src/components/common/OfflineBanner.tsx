import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { useIssueStore } from '../../store/issueStore';

export const OfflineBanner: React.FC = () => {
  const isOnline = useIssueStore(s => s.isOnline);
  const syncQueue = useIssueStore(s => s.syncQueue);
  const slideY = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(slideY, {
      toValue: isOnline ? -60 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOnline, slideY]);

  const count = syncQueue.length;

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY: slideY }] }]}
      pointerEvents="none"
    >
      <View style={styles.inner}>
        <Text style={styles.text}>
          {`You're offline${count > 0 ? ` · ${count} change${count !== 1 ? 's' : ''} will sync when reconnected` : ''}`}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#FEF3C7',
  },
  inner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400E',
    textAlign: 'center',
  },
});
