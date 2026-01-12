import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/theme';

type Props = {
  id: string;
  title: string;
  cover?: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
};

export const ComicCard: React.FC<Props> = ({
  id,
  title,
  cover,
  onPress,
  onEdit,
  onDelete,
  showActions,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: colors.card }]}>
      {!!cover && <Image source={{ uri: cover }} style={styles.cover} />}
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <FontAwesome name="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <FontAwesome name="trash" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Sizes.radius,
    marginBottom: Sizes.margin,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cover: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: Sizes.radius,
    borderTopRightRadius: Sizes.radius,
    backgroundColor: '#eee',
  },
  info: {
    padding: Sizes.padding / 2,
  },
  title: {
    fontSize: Fonts.body.fontSize,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Sizes.margin,
    marginTop: Sizes.margin / 2,
  },
  actionButton: {
    padding: 8,
  },
});