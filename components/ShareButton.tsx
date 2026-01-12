import React from 'react';
import { TouchableOpacity, Alert, Share, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { generateComicShareLink, generateChapterShareLink } from '@/utils/deep-linking';

interface ShareButtonProps {
  type: 'comic' | 'chapter';
  comicId: string;
  chapterId?: string;
  title?: string;
  size?: number;
  color?: string;
}

/**
 * Share Button Component
 * 
 * Usage:
 * <ShareButton 
 *   type="comic" 
 *   comicId="123" 
 *   title="Naruto" 
 * />
 * 
 * <ShareButton 
 *   type="chapter" 
 *   comicId="123" 
 *   chapterId="456" 
 *   title="Chapter 1" 
 * />
 */
export default function ShareButton({ 
  type, 
  comicId, 
  chapterId, 
  title, 
  size = 24, 
  color = '#007AFF' 
}: ShareButtonProps) {
  const handleShare = async () => {
    try {
      let shareData;
      
      if (type === 'comic') {
        shareData = generateComicShareLink(comicId, title);
      } else if (type === 'chapter' && chapterId) {
        shareData = generateChapterShareLink(comicId, chapterId, title);
      } else {
        Alert.alert('Error', 'Invalid share parameters');
        return;
      }

      const result = await Share.share({
        message: `${shareData.message}\n${shareData.url}`,
        title: shareData.title,
        url: Platform.OS === 'ios' ? shareData.url : undefined,
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share content');
    }
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <FontAwesome name="share-alt" size={size} color={color} />
    </TouchableOpacity>
  );
}