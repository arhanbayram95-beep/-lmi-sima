import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { GradientBackground } from '../../../../components/common/GradientBackground';
import { Theme } from '../../../../ui/theme';

export type SubpageLayoutProps = {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
};

export function SubpageLayout({ title, onBack, children }: SubpageLayoutProps) {
  return (
    <GradientBackground style={styles.fill}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={Theme.colors.text.primary} />
          </Pressable>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: Theme.typography.headlineMd.fontSize,
    color: Theme.colors.text.primary,
  },
  content: {
    gap: Theme.spacing.sm,
  },
});
