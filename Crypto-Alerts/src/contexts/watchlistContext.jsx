import React, { useContext, createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../../firebase';


const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

const WatchlistProvider = ({children}) => {
  const [watchlistCoinIds, setWatchlistCoinIds] = useState([]);

  const getWatchlistData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@watchlist_coins");
      setWatchlistCoinIds(jsonValue != null ? JSON.parse(jsonValue) : []);
    } catch (e) {
      console.log(e);
    }
  }

  const storeWatchlistCoinId = async (coinId) => {
    try {
      // add watchlist in async storage
      const newWatchList = [...watchlistCoinIds, coinId];
      const jsonValue = JSON.stringify(newWatchList);
      await AsyncStorage.setItem('@watchlist_coins', jsonValue);
      setWatchlistCoinIds(newWatchList);

      // add coinID to firebase watchlist


    } catch (e) {
      console.log(e);
    }
  }

  const removeWatchlistCoinId = async (coinId) => {
    // remove coinId in async storage
    const newWatchList = watchlistCoinIds.filter((coinIdValue) => coinIdValue !== coinId);
    const jsonValue = JSON.stringify(newWatchList);
    await AsyncStorage.setItem('@watchlist_coins', jsonValue);
    setWatchlistCoinIds(newWatchList);

    // remove coinId in firebase watchlist


  }

  useEffect(() => {
    getWatchlistData();
  }, []);

  return (
    <WatchlistContext.Provider value={{watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId}}>
      {children}
    </WatchlistContext.Provider>
  );
}

export default WatchlistProvider;