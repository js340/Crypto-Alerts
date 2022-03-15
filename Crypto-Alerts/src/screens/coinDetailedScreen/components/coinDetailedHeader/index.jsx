import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWatchlist } from '../../../../contexts/watchListContext';

const CoinDetailHeader = (props) => {
  const {
    coinId,
    image,
    symbol,
    market_cap_rank,
    thresholdAmount,
  } = props;

  const navigation = useNavigation();

  const { watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId } = useWatchlist();

  const checkIfCoinIsWatchlisted = () => JSON.stringify(watchlistCoinIds).includes(coinId);

  const handleWatchlistCoin = () => {
    if (checkIfCoinIsWatchlisted()) {
      return removeWatchlistCoinId(coinId, thresholdAmount);
    }
    return storeWatchlistCoinId(coinId, thresholdAmount);
  };

  return (
    <View style={styles.headerContainer}>
      <Ionicons
        name="chevron-back-sharp"
        size={30}
        color="white"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.tickerContainer}>
        <Image source={{ url: image }} style={{ width: 25, height: 25 }} />
        <Text style={styles.tickerTitle}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={styles.tickerRank}>#{market_cap_rank}</Text>
        </View>
      </View>
      <FontAwesome 
        name={checkIfCoinIsWatchlisted() ? "star" : "star-o"} 
        size={25} 
        color={checkIfCoinIsWatchlisted() ? "#ffbf00" : "white"}
        onPress={handleWatchlistCoin} 
      />
    </View>
  );
};

export default CoinDetailHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tickerTitle: {
    color: 'white', 
    fontWeight: 'bold', 
    marginHorizontal: 5,
    fontSize: 20,
  },
  rankContainer: {
    backgroundColor: '#585858',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tickerRank: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 15,
  },
});