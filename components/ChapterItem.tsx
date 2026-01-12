import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/theme';

type Props = {
  title: string;
  isPaid?: boolean;
  isPurchased?: boolean;
  onPress?: () => void;
  buttonLabel: string;
  buttonColor?: string;
  releaseDate: string;
  isCreator?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showRefundButton?: boolean;
  onRefund?: () => void;
};

export const ChapterItem: React.FC<Props> = ({
  title,
  isPaid,
  isPurchased,
  onPress,
  buttonLabel,
  buttonColor,
  releaseDate,
  isCreator,
  onEdit,
  onDelete,
  showRefundButton,
  onRefund,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = isDarkMode ? Colors.dark : Colors.light;

  const formattedDate = new Date(releaseDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.date, { color: colors.icon }]}>{formattedDate}</Text>
        {isPaid && !isPurchased && !isCreator && (
          <View style={[styles.paidTag, { backgroundColor: colors.primary }]}>
            <Text style={styles.paidTagText}>Berbayar</Text>
          </View>
        )}
        {isPurchased && !isCreator && (
          <View style={[styles.paidTag, { backgroundColor: colors.success }]}>
            <Text style={styles.paidTagText}>Sudah Dibeli</Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        {isCreator && (
          <>
            <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
              <FontAwesome name="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
              <FontAwesome name="trash" size={20} color={colors.danger} />
            </TouchableOpacity>
          </>
        )}
        {!isCreator && showRefundButton && (
          <TouchableOpacity
            onPress={onRefund}
            style={[styles.button, { backgroundColor: colors.warning, marginRight: 8 }]}
          >
            <Text style={styles.buttonText}>Refund</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.button,
            { backgroundColor: buttonColor || colors.primary },
            !isCreator && isPurchased && !showRefundButton && styles.disabledButton,
          ]}
          disabled={!isCreator && isPurchased && !showRefundButton}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.padding,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    marginRight: Sizes.margin,
  },
  title: {
    fontSize: Fonts.body.fontSize,
    fontWeight: Fonts.body.fontWeight,
  },
  date: {
    fontSize: Fonts.caption.fontSize,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  button: {
    paddingHorizontal: Sizes.padding,
    paddingVertical: Sizes.padding / 2,
    borderRadius: Sizes.radius,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Fonts.body.fontSize,
    color: '#fff',
    fontWeight: '600',
  },
  paidTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});