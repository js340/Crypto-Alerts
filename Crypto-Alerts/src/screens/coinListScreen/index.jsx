import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import CoinItem from "./coinItem";
import { getMarketData } from '../../services/requests';


const CoinListScreen = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async (pageNumber) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber)
    setCoins((existingCoins) => ([...existingCoins, ...coinsData]));
    setLoading(false);
  }

  const reFetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData()
    setCoins(coinsData);
    setLoading(false);
  }

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={{fontFamily: 'DroidSans', color: 'white', fontSize: 25, letterSpacing: 1, paddingHorizontal: 20, paddingBottom: 10 }}>Crypto Assets</Text>
        <Text style={{color: 'lightgrey', fontSize: 12, paddingHorizontal: 10}}>Powered by CoinGecko</Text>
      </View>
      <FlatList
        data={coins}
        renderItem={({ item }) => <CoinItem marketCoin={item} />}
        onEndReached={() => fetchCoins((coins.length / 50) + 1)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor="white"
            onRefresh={reFetchCoins}
          />
        }
      />
    </View>
  );
};

export default CoinListScreen;