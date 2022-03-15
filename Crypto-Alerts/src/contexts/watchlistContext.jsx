import React, { useContext, createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebase';


const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

const WatchlistProvider = ({ children }) => {
  const [watchlistCoinIds, setWatchlistCoinIds] = useState([[]]);

  const getWatchlistData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@watchlist_coins");
      setWatchlistCoinIds(jsonValue != null ? JSON.parse(jsonValue) : [[]]);
    } catch (e) {
      console.log(e);
    }
  }

  // add coinID to firebase watchlist
  const updateFirestoreDatabase = async () => {
    var userRecord = db.collection('users').doc(auth.currentUser?.uid);
    const newWatchList = JSON.stringify(watchlistCoinIds);
    userRecord.update({
      watchlist: { newWatchList },
    })
      .catch((error) => {
        console.error("Error updating watchlist on firestore : ", error);
      });
  }

  const storeWatchlistCoinId = async (coinId, thresholdAmount) => {
    try {
      const newWatchList = [...watchlistCoinIds, [coinId, thresholdAmount]];
      const jsonValue = JSON.stringify(newWatchList);
      await AsyncStorage.setItem('@watchlist_coins', jsonValue);
      setWatchlistCoinIds(newWatchList);
      updateFirestoreDatabase();
      console.log(newWatchList, "via storewatchlist method");
    } catch (e) {
      console.log(e);
    }
  }

  const updateWatchlistCoinId = async (coinId, thresholdAmount) => {
    try {
      const newWatchList = watchlistCoinIds;
      for (var i = 0; i < newWatchList.length; i++) { 
        if (newWatchList[i][0] == coinId) {
          newWatchList[i][1] = parseInt(thresholdAmount);
        };
      };
      const jsonValue = JSON.stringify(newWatchList);
      await AsyncStorage.setItem('@watchlist_coins', jsonValue);
      setWatchlistCoinIds(newWatchList);
      updateFirestoreDatabase();
      console.log(newWatchList, "via updatewatchlist method");
    } catch (e) {
      console.log(e);
    }
  }

  const removeWatchlistCoinId = async (coinId) => {
    try {
      const newWatchList = watchlistCoinIds.filter(list => list[0] !== coinId);
      const jsonValue = JSON.stringify(newWatchList);
      await AsyncStorage.setItem('@watchlist_coins', jsonValue);
      setWatchlistCoinIds(newWatchList);
      updateFirestoreDatabase();
      console.log(newWatchList, "via removewatchlist method");
    } catch (e) {
      console.long(e);
    }
  }



  useEffect(() => {
    let isMounted = true;
    getWatchlistData();
    return () => { isMounted = false };
  }, []);

  return (
    <WatchlistContext.Provider value={{ watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId, updateWatchlistCoinId }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export default WatchlistProvider;