import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { comicService } from '@/services/comic.service';
import { ComicCard } from '@/components/ComicCard';
import { Colors, Fonts, Sizes } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { Comic } from '@/types/comic.type';

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = isDarkMode ? Colors.dark : Colors.light;

  const [keyword, setKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  const genres = ['Action', 'Romance', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Horror', 'Slice of Life', 'Isekai', 'Adventure'];

  useEffect(() => {
    const loadComics = async () => {
      setLoading(true);
      let comicList: Comic[] | null = [];
      if (selectedGenre) {
        comicList = await comicService.getComicsByGenre(selectedGenre);
      } else if (keyword.trim()) {
        comicList = await comicService.searchComics(keyword);
      } else {
        comicList = await comicService.getComics();
      }
      setComics(comicList ?? []);
      setLoading(false);
    };
    loadComics();
  }, [selectedGenre, keyword]);

  const handleSearch = () => {
    setSelectedGenre(null); // Reset genre filter when searching
    // The useEffect hook will handle the search
  };

  const handleSelectGenre = (genre: string) => {
    setKeyword(''); // Reset search keyword when selecting a genre
    setSelectedGenre(genre === selectedGenre ? null : genre); // Toggle genre selection
  };

  const renderGenreChips = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreContainer}>
      {genres.map((genre) => (
        <TouchableOpacity
          key={genre}
          style={[
            styles.genreChip,
            { backgroundColor: selectedGenre === genre ? colors.primary : colors.card },
          ]}
          onPress={() => handleSelectGenre(genre)}
        >
          <Text
            style={[
              styles.genreText,
              { color: selectedGenre === genre ? '#fff' : colors.text },
            ]}
          >
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Jelajahi Dunia Komik</Text>
      
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color={colors.text} style={styles.searchIcon} />
        <TextInput
          placeholder="Cari judul komik..."
          placeholderTextColor={colors.text}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        />
      </View>

      {renderGenreChips()}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={comics}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.comicCardContainer}>
              <ComicCard
                id={item.id}
                title={item.title}
                cover={item.cover_url}
                onPress={() => router.push(`/comics/${item.id}`)}
              />
            </View>
          )}
          ListEmptyComponent={<Text style={[styles.empty, { color: colors.text }]}>Tidak ada komik yang ditemukan.</Text>}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Sizes.padding,
  },
  header: {
    fontSize: Fonts.title.fontSize,
    fontWeight: Fonts.title.fontWeight,
    marginBottom: Sizes.margin,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.margin,
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: Sizes.radius,
    paddingLeft: 45,
    paddingRight: 15,
    fontSize: Fonts.body.fontSize,
  },
  genreContainer: {
    marginBottom: Sizes.margin,
     minHeight: 40,
  },
  genreChip: {
    paddingHorizontal: Sizes.padding,
    paddingVertical: Sizes.padding / 2,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  genreText: {
    fontSize: Fonts.body.fontSize,
  },
  listContentContainer: {
    paddingBottom: Sizes.padding * 2,
  },
  comicCardContainer: {
    flex: 1 / 2,
    padding: Sizes.margin / 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: Fonts.body.fontSize,
  },
});