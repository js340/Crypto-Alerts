import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import CoinDetailHeader from './components/coinDetailedHeader';
import FilterComponent from './components/filterComponents';
import { LineChart, CandlestickChart } from 'react-native-wagmi-charts';
import { useRoute } from '@react-navigation/native';
import { getDetailedCoinData, getCoinMarketChart, getCandleChartData } from '../../services/requests'
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useWatchlist } from '../../contexts/watchListContext';

export const getThresholdAmount = () => useContext(thresholdAmount);

const CoinDetailedScreen = () => {

  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [coinCandleChartData, setCoinCandleChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinValue, setCoinValue] = useState("1");
  const [usdValue, setUsdValue] = useState("");
  const [selectedRange, setSelectedRange] = useState("1");
  const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);
  const [thresholdAmount, setThresholdAmount] = useState(2);

  const route = useRoute();
  const { params: { coinId } } = route;

  const fetchCoinData = async () => {
    setLoading(true);
    const fetchedCoinData = await getDetailedCoinData(coinId);
    setCoin(fetchedCoinData);
    setUsdValue(fetchedCoinData.market_data.current_price.usd.toString());
    setLoading(false);
  };

  const fetchMarketCoinData = async (selectedRangeValue) => {
    const fetchCoinMarketData = await getCoinMarketChart(coinId, selectedRangeValue);
    setCoinMarketData(fetchCoinMarketData);
  };

  const fetchCandleStickChartData = async (selectedRangeValue) => {
    const fetchedSelectedCandleChartData = await getCandleChartData(coinId, selectedRangeValue);
    setCoinCandleChartData(fetchedSelectedCandleChartData);
  };

  // watchlist context - updates threshold value in watchlist context
  const { watchlistCoinIds, updateWatchlistCoinId } = useWatchlist();
  const checkIfCoinIsWatchlisted = () => JSON.stringify(watchlistCoinIds).includes(coinId);
  const thresholdValueChanged = (value) => {
    if (value != 0) {
      setThresholdAmount(value);
      if (checkIfCoinIsWatchlisted()) {
        return updateWatchlistCoinId(coinId, value);
      }
    }
  };
  const updateThresholdValueOnStartup = () => {
    if (checkIfCoinIsWatchlisted()) {
      for (var i = 0; i < watchlistCoinIds.length; i++) {
        if (watchlistCoinIds[i][0] == coinId) {
          setThresholdAmount(watchlistCoinIds[i][1]);
        };
      };
    };
  };

  useEffect(() => {
    fetchCoinData();
    fetchMarketCoinData(1);
    fetchCandleStickChartData();
    updateThresholdValueOnStartup();
  }, []);

  const onSelectedRangeChange = (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
    fetchCandleStickChartData(selectedRangeValue);
  };

  const memoOnSelectedRangeChange = React.useCallback(
    (range) => onSelectedRangeChange(range),
    []
  );

  if (loading || !coin || !coinMarketData || !coinCandleChartData) {
    return <ActivityIndicator size="large" />
  };

  const {
    id,
    name,
    symbol,
    image: { small },
    market_data: {
      market_cap_rank,
      current_price,
      price_change_percentage_24h,
    },
  } = coin;

  const { prices } = coinMarketData;

  const percentageColor = price_change_percentage_24h < 0 ? '#ea3943' : '#16c784' || 'white';
  const chartColor = current_price.usd > prices[0][1] ? "#16c784" : "#ea3943";
  const screenWidth = Dimensions.get('window').width;

  const formatCurrency = ({ value }) => {
    "worklet";
    if (value === "") {
      if (current_price.usd < 1) {
        return `$${current_price.usd}`;
      }
      return `$${current_price.usd.toFixed(2)}`
    }
    if (current_price.usd < 1) {
      return `$${parseFloat(value)}`;
    }
    return `$${parseFloat(value).toFixed(2)}`
  };
  const changeCoinValue = (value) => {
    setCoinValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setUsdValue((floatValue * current_price.usd).toString());
  };
  const changeUsdValue = (value) => {
    setUsdValue(value);
    const floatValue = parseFloat(value.replace(',', '.')) || 0;
    setCoinValue((floatValue / current_price.usd).toString());
  };


  return (
    <View style={{ paddingHorizontal: 10 }}>
      <LineChart.Provider data={prices.map(([timestamp, value]) => ({ timestamp, value }))}>
        <CoinDetailHeader
          coinId={id}
          image={small}
          symbol={symbol}
          market_cap_rank={market_cap_rank}
          thresholdAmount={thresholdAmount}
        />

        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <LineChart.PriceText style={styles.currentPrice} format={formatCurrency} />
          </View>
          <View style={{ backgroundColor: percentageColor, padding: 5, borderRadius: 5, flexDirection: 'row', height: 35 }}>
            <AntDesign
              name={price_change_percentage_24h < 0 ? 'caretdown' : 'caretup'}
              size={12}
              color={'white'}
              style={{ alignSelf: 'center', marginRight: 5 }}
            />
            <Text style={styles.priceChange}>
              {price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <FilterComponent filterDay="1" filterText="24H" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="7" filterText="7D" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="30" filterText="30D" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="365" filterText="1Y" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          <FilterComponent filterDay="max" filterText="All" selectedRange={selectedRange} setSelectedRange={memoOnSelectedRangeChange} />
          {isCandleChartVisible ? (
            <MaterialIcons name="show-chart" size={24} color="#16c784" onPress={() => setIsCandleChartVisible(false)} />
          ) : (
            <MaterialIcons name="waterfall-chart" size={24} color="#16c784" onPress={() => setIsCandleChartVisible(true)} />
          )}
        </View>

        <View>
          {isCandleChartVisible ? (
            <CandlestickChart.Provider
              data={coinCandleChartData.map(
                ([timestamp, open, high, low, close]) => ({ timestamp, open, high, low, close })
              )}
            >
              <CandlestickChart height={screenWidth / 2} width={screenWidth - 20}>
                <CandlestickChart.Candles />
                <CandlestickChart.Crosshair>
                  <CandlestickChart.Tooltip />
                </CandlestickChart.Crosshair>
              </CandlestickChart>
              <View style={styles.candleStickTextContainer}>
                <View>
                  <Text style={styles.candleStickTextLabel}>Open</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="open" />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>High</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="high" />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>Low</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="low" />
                </View>
                <View>
                  <Text style={styles.candleStickTextLabel}>Close</Text>
                  <CandlestickChart.PriceText style={styles.candleStickText} type="close" />
                </View>
              </View>
              <CandlestickChart.DatetimeText style={{ color: 'white', fontWeight: '700', margin: 10 }} />
            </CandlestickChart.Provider>
          ) : (
            <LineChart height={screenWidth / 2} width={screenWidth - 20}>
              <LineChart.Path color={chartColor}>
                <LineChart.Gradient color={chartColor} />
              </LineChart.Path>
              <LineChart.CursorCrosshair color={chartColor} />
            </LineChart>
          )}
        </View>

        <View style={{ flexDirection: 'row', paddingTop: 50 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={{ color: 'white', alignSelf: 'center' }}>{symbol.toUpperCase()}</Text>
            <TextInput
              style={styles.input}
              value={coinValue}
              keyboardType="numeric"
              onChangeText={changeCoinValue}
            />
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={{ color: 'white', alignSelf: 'center' }}>USD</Text>
            <TextInput
              style={styles.input}
              value={usdValue}
              keyboardType="numeric"
              onChangeText={changeUsdValue}
            />
          </View>
        </View>

        <View >
          <View style={{ alignContent: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Picker
              style={styles.picker}
              selectedValue={thresholdAmount}
              onValueChange={(value, index) => { thresholdValueChanged(value) }}
              mode="dropdown" // Android only
            >
              <Picker.Item label="Change Threshold" value="0" color="white" />
              <Picker.Item label="1%" value="1" color="white" />
              <Picker.Item label="2%" value="2" color="white" />
              <Picker.Item label="3%" value="3" color="white" />
              <Picker.Item label="4%" value="4" color="white" />
              <Picker.Item label="5%" value="5" color="white" />
              <Picker.Item label="6%" value="6" color="white" />
              <Picker.Item label="7%" value="7" color="white" />
              <Picker.Item label="8%" value="8" color="white" />
              <Picker.Item label="9%" value="9" color="white" />
              <Picker.Item label="10%" value="10" color="white" />
            </Picker>
          </View>
          <Text style={{ color: 'white', fontSize: 18, alignSelf: 'center', padding: 10 }}>
            {checkIfCoinIsWatchlisted() ?
              <Text>Current threshold is {thresholdAmount}%</Text> :
              <Text>Watchlist coin to recieve notifications</Text>
            }
          </Text>
        </View>
      </LineChart.Provider>
    </View >
  );
};

export default CoinDetailedScreen;


const styles = StyleSheet.create({
  currentPrice: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 1,
  },
  name: {
    color: 'white',
    fontSize: 15,
  },
  priceContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceChange: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    width: 130,
    height: 40,
    margin: 12,
    padding: 10,
    fontSize: 16,
    color: 'white',
    backgroundColor: "#2b2b2b",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    color: 'white',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2b2b2b',
    paddingVertical: 5,
    borderRadius: 5,
    margin: 12,
  },
  filtersText: {
    color: 'white',
  },
  candleStickTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  candleStickText: {
    color: 'white',
    fontWeight: '700',
  },
  candleStickTextLabel: {
    color: 'grey',
    fontSize: 13,
  },
  thresholdButtons: {
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    width: 75,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  thresholdText: {
    fontSize: 24,
    padding: 10,
  },
  picker: {
    width: 300,
    padding: 10,
  },
  pickerItem: {
    fontSize: 10,
    color: 'green'
  }
});