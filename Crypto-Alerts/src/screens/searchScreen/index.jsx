import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SearchableDropDown from 'react-native-searchable-dropdown';
import { getAllCoins } from '../../services/requests'
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchAllCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const allCoins = await getAllCoins();
    setAllCoins(allCoins);
    setLoading(false);
  }

  useEffect(() => {
    fetchAllCoins();
  }, [])

  return (
    <View>
      <SearchableDropDown
        items={allCoins}
        onItemSelect={(item) => navigation.navigate("CoinDetailedScreen", {coinId: item.id})}
        containerStyle={styles.searchableContainer}
        itemStyle={styles.itemStyles}
        itemTextStyle={styles.itemTextStyles}
        resetValue={false}
        placeholder={"Search for a coin..."}
        placeholderTextColor="white"
        textInputProps={{
          underlineColorAndroid: "transparent",
          style: {
            padding: 12,
            borderWidth: 1.5,
            borderColor: "#444444",
            borderRadius: 5,
            backgroundColor: "#1e1e1e",
            color: "white",
          },
        }}
      />
    </View>
  );
}

export default SearchScreen;


const styles = StyleSheet.create({
  searchableContainer: {
    width: '100',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  itemStyles: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 5,
  },
  itemTextStyles: {
    color: 'white',
  },
});