import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../../ui/theme';

export type StarRatingProps = {
  rating: number;
  onRate: (value: number) => void;
};

export function StarRating({ rating, onRate }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Pressable key={value} onPress={() => onRate(value)} hitSlop={8}>
          <MaterialIcons
            name={value <= rating ? 'star' : 'star-border'}
            size={40}
            color={Theme.colors.accent.goldSecondary}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
