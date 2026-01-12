import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Colors } from '../../constants/theme';
import useStore from '../../store/useStore';

interface ShoppingItemProps {
  name: string;
  quantity: number;
  price?: number;
  purchased: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({
  name,
  quantity,
  price,
  purchased,
  onToggle,
  onDelete,
  onPress,
}) => {
  const { colorScheme } = useStore();
  const theme = Colors[colorScheme];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDelete();
    });
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}>
      <Pressable onPress={onPress}>
        <View style={[styles.item, { borderBottomColor: theme.icon }]}>
          <Text style={[styles.itemName, { color: theme.text }]}>{name}</Text>
          <Text style={[styles.itemQuantity, { color: theme.icon }]}>Qty: {quantity}</Text>
          {price && <Text style={[styles.itemPrice, { color: theme.tint }]}>Price: ${price}</Text>}
          <Pressable onPress={onToggle}>
            <Text>{purchased ? '✔️' : '❌'}</Text>
          </Pressable>
          <Pressable onPress={handleDelete}>
            <Text style={styles.deleteButton}>Delete</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  itemName: {
    fontSize: 16,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
  },
  deleteButton: {
    color: 'red',
  },
});

export default ShoppingItem;