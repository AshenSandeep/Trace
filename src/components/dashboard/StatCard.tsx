import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';

interface StatCardProps {
  label: string;
  count: number;
  delta: number | null;
  color: string;
  barData: number[];
}

export const StatCard: React.FC<StatCardProps> = ({ label, count, delta, color, barData }) => {
  const { colors } = useTheme();
  const maxBar = Math.max(...barData, 1);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>

      <View style={styles.countRow}>
        <Text style={[styles.count, { color: colors.textPrimary }]}>{count}</Text>
        <View style={styles.deltaWrap}>
          {delta === null ? (
            <Text style={[styles.deltaMuted, { color: colors.textTertiary }]}>—</Text>
          ) : delta === 0 ? (
            <Text style={[styles.deltaMuted, { color: colors.textTertiary }]}>0</Text>
          ) : (
            <View style={[styles.deltaBadge, { backgroundColor: delta > 0 ? '#DCFCE7' : '#FEE2E2' }]}>
              <Text style={[styles.deltaText, { color: delta > 0 ? '#16A34A' : '#DC2626' }]}>
                {delta > 0 ? `+${delta}` : String(delta)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bars}>
        {barData.map((val, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                backgroundColor: color,
                height: Math.max(3, Math.round((val / maxBar) * 22)),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    gap: 6,
  },
  count: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 30,
  },
  deltaWrap: {
    paddingBottom: 2,
  },
  deltaBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deltaMuted: {
    fontSize: 13,
    fontWeight: '500',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
    opacity: 0.85,
  },
});
