import { ChapterItem } from '@/components/ChapterItem';
import ShareButton from '@/components/ShareButton';
import { Colors, Fonts, Sizes } from '@/constants/theme';
import { chapterService } from '@/services/chapter.service';
import { comicService } from '@/services/comic.service';
import { useAuthStore } from '@/store/auth.store';
import { useChapterStore } from '@/store/chapter.store';
import { useComicStore } from '@/store/comic.store';
import { Comic } from '@/types/comic.type';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

export default function ComicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { profile } = useAuthStore();
  const { chapters, fetchChapters, updateChapter } = useChapterStore();
  const { removeComic } = useComicStore();
  const comicId = String(id);
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasedChapters, setPurchasedChapters] = useState<Set<string>>(new Set()); // Local state for purchased chapters

  // Load purchased chapters from local storage on mount
  useEffect(() => {
    const loadPurchasedChapters = async () => {
      try {
        const stored = await AsyncStorage.getItem(`purchased_chapters_${comicId}`);
        if (stored) {
          setPurchasedChapters(new Set(JSON.parse(stored)));
        }
      } catch (error) {
        console.error('Error loading purchased chapters:', error);
      }
    };
    if (comicId) {
      loadPurchasedChapters();
    }
  }, [comicId]);

  // Save purchased chapters to local storage when they change
  useEffect(() => {
    const savePurchasedChapters = async () => {
      try {
        await AsyncStorage.setItem(`purchased_chapters_${comicId}`, JSON.stringify(Array.from(purchasedChapters)));
      } catch (error) {
        console.error('Error saving purchased chapters:', error);
      }
    };
    if (comicId) {
      savePurchasedChapters();
    }
  }, [purchasedChapters, comicId]);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = isDarkMode ? Colors.dark : Colors.light;

  console.log('Profile:', profile);
  console.log('Comic:', comic);
  const isCreator = profile?.id === comic?.creator_id;
  console.log('isCreator:', isCreator);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        setLoading(true);
        const c = await comicService.getComicById(comicId);
        setComic(c);
        if (c) {
          await fetchChapters(c.id, profile?.id, c.creator_id);
        }
        setLoading(false);
      };
      load();
    }, [comicId, profile, fetchChapters])
  );

  const handlePurchase = async (chapter: any) => {
    // For users (not creators), purchase is just a toggle to mark as purchased
    if (isCreator) {
      // Creators don't need to purchase their own chapters
      return;
    }
    
    const purchased = await chapterService.purchaseChapter(chapter.id, 'anonymous_user', chapter.price);
    if (purchased) {
      setPurchasedChapters(prev => new Set(prev).add(chapter.id));
      updateChapter({ ...chapter, purchased: true });
      Alert.alert('Sukses', 'Chapter berhasil dibeli!');
    } else {
      Alert.alert('Gagal', 'Pembelian chapter gagal.');
    }
  };

  const handleRefund = async (chapter: any) => {
    // For users (not creators), refund is just a toggle to mark as not purchased
    if (isCreator) {
      // Creators don't need to refund their own chapters
      return;
    }
    
    const refunded = await chapterService.refundChapter(chapter.id, 'anonymous_user');
    if (refunded) {
      setPurchasedChapters(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapter.id);
        return newSet;
      });
      updateChapter({ ...chapter, purchased: false });
      Alert.alert('Sukses', 'Chapter berhasil di-refund!');
    } else {
      Alert.alert('Gagal', 'Refund chapter gagal.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!comic) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Komik tidak ditemukan.</Text>
      </View>
    );
  }

  const renderChapter = ({ item }: { item: any }) => {
    const isPurchased = purchasedChapters.has(item.id) || item.purchased; // Check local state first
    let buttonLabel = 'Baca';
    let buttonAction = () => router.push(`/chapter/${item.id}`);
    let buttonColor = colors.primary;
    let showRefundButton = false;

    // For creators: always show "Baca" button, no purchase/refund logic
    if (isCreator) {
      buttonLabel = 'Baca';
      buttonAction = () => router.push(`/chapter/${item.id}`);
      buttonColor = colors.primary;
      showRefundButton = false;
    } else {
      // For regular users: apply purchase/refund logic
      if (item.is_paid) {
        if (isPurchased) {
          buttonLabel = 'Baca';
          buttonAction = () => router.push(`/chapter/${item.id}`);
          showRefundButton = true;
        } else {
          buttonLabel = `Beli (Rp ${item.price.toLocaleString()})`;
          buttonAction = () => handlePurchase(item);
          buttonColor = colors.secondary;
        }
      }
    }

    return (
      <ChapterItem
        title={item.title}
        releaseDate={item.created_at}
        isPaid={item.is_paid}
        isPurchased={isPurchased && !isCreator} // Don't show "Sudah Dibeli" tag for creators
        onPress={buttonAction}
        buttonLabel={buttonLabel}
        buttonColor={buttonColor}
        isCreator={isCreator}
        onEdit={() => router.push(`/chapter/edit/${item.id}`)}
        onDelete={() => handleDeleteChapter(item.id)}
        showRefundButton={showRefundButton && !isCreator} // Don't show refund button for creators
        onRefund={() => handleRefund(item)}
      />
    );
  };

  const handleDeleteChapter = (chapterId: string) => {
    console.log('Attempting to delete chapter with id:', chapterId);
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin menghapus chapter ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          console.log('Confirmed deletion for chapter id:', chapterId);
          await chapterService.deleteChapter(chapterId);
          if (comic) {
            fetchChapters(comicId, profile?.id, comic.creator_id);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: comic.cover_url }} style={styles.coverImage} />
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text, flex: 1 }]}>{comic.title}</Text>
            <ShareButton 
              type="comic" 
              comicId={comic.id} 
              title={comic.title} 
              size={24} 
              color={colors.primary} 
            />
          </View>
          <Text style={[styles.creator, { color: colors.text }]}>
            oleh {comic.creator?.username || 'Anonim'}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>{comic.description}</Text>
        </View>
      </View>

      {isCreator && (
        <View style={styles.creatorActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/comics/edit/${comic.id}`)}
          >
            <FontAwesome name="edit" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Edit Komik</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.danger }]}
            onPress={() => {
              Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin menghapus komik ini?', [
                { text: 'Batal', style: 'cancel' },
                {
                  text: 'Hapus',
                  style: 'destructive',
                  onPress: async () => {
                    if (!comic) return;
                    console.log('Deleting comic with id:', comic.id);
                    const deleted = await comicService.deleteComic(comic.id);
                    if (deleted) {
                      console.log('Comic deleted from service');
                      removeComic(comic.id);
                      console.log('Comic removed from store');
                      router.back();
                    } else {
                      console.error('Failed to delete comic from service');
                      Alert.alert('Error', 'Gagal menghapus komik.');
                    }
                  },
                },
              ]);
            }}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Hapus Komik</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.chapterSection}>
        <Text style={[styles.subtitle, { color: colors.text }]}>Daftar Chapter</Text>
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id}
          renderItem={renderChapter}
          scrollEnabled={false}
        />
      </View>

      {isCreator && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/chapter/add?comicId=${comicId}`)}
        >
          <FontAwesome name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: Sizes.padding,
    gap: Sizes.margin,
  },
  coverImage: {
    width: 150,
    height: 220,
    borderRadius: Sizes.radius,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: Fonts.title.fontSize,
    fontWeight: Fonts.title.fontWeight,
  },
  creator: {
    fontSize: Fonts.subtitle.fontSize,
    fontWeight: Fonts.subtitle.fontWeight,
    opacity: 0.8,
    marginBottom: Sizes.margin / 2,
  },
  description: {
    fontSize: Fonts.body.fontSize,
    fontWeight: Fonts.body.fontWeight,
  },
  creatorActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Sizes.padding,
    marginBottom: Sizes.margin,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding,
    paddingVertical: Sizes.padding / 2,
    borderRadius: Sizes.radius,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  chapterSection: {
    paddingHorizontal: Sizes.padding,
  },
  subtitle: {
    fontSize: Fonts.subtitle.fontSize,
    fontWeight: Fonts.subtitle.fontWeight,
    marginBottom: Sizes.margin / 2,
  },
  fab: {
    position: 'absolute',
    bottom: Sizes.margin * 2,
    right: Sizes.margin,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
});