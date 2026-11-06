import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Theme } from '../../ui/theme';

// One captured photo, shown large — part of the "brief and catchy" opening
// beat of the reveal. RevealScreen gives each photo its own top-level page
// in the reveal pager rather than nesting a second swiper in here: nesting
// two horizontal SwipeablePagers (this card's own carousel inside the
// reveal's card-by-card pager) risks the exact gesture-ownership fights
// SwipeablePager's own comments describe fixing for a single level of
// paging.
export function PhotoPageCard({ photo, testID }: { photo: string; testID?: string }) {
  return (
    <View style={styles.photoPage} testID={testID}>
      <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.photoLarge} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  photoPage: {
    justifyContent: 'center',
  },
  photoLarge: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface.glassBackground,
  },
});
