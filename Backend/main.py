# Firestore imports
from tkinter import mainloop
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# API imports
import requests
import json
from time import time, sleep
from datetime import datetime

# Expo notification imports
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError


def getFirebaseUsers():
    db = firestore.client()
    return db.collection('users').get()


def send_push_message(token, title, message, extra=None):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        title=title,
                        body=message,
                        data=extra))
    except PushServerError as exc:
        # Encountered some likely formatting/validation error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'errors': exc.errors,
                'response_data': exc.response_data,
            })
        raise
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        rollbar.report_exc_info(
            extra_data={'token': token, 'message': message, 'extra': extra})
        raise self.retry(exc=exc)

    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # Mark the push token as inactive
        from notifications.models import PushToken
        PushToken.objects.filter(token=token).update(active=False)
    except PushTicketError as exc:
        # Encountered some other per-notification error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'push_response': exc.push_response._asdict(),
            })
        raise self.retry(exc=exc)


# checks if % change is above threshold, if so it sends user notificatoin
def checkThreshold(userCoinPair, arrayCoinPair, userRecord, usersArray):

    # check if user has already been sent a notification
    # loop through users
    userFound = False
    for users in usersArray:
        # if user exists in usersArray
        if str(users[0]) == str(userRecord['push_token']['expoPushToken']):
            userFound = True
            coinFound = False
            # loop through their coins 
            for coins in users[1]:
                # if coin exists in specific users coins array
                if str(coins) == str(userCoinPair[0]):
                    # coin has been sent a notification
                    coinFound = True
            if coinFound == False:
                # send user notification and add coin to usersArray
                users[1].append(userCoinPair[0])
                sendNotification(userCoinPair, arrayCoinPair, userRecord)
                return
    
    if userFound == False:
        # if users push token doesnt exist in usersArray, we add it along with the coin
        usersArray.append([str(userRecord['push_token']['expoPushToken']), [str(userCoinPair[0])]])
        sendNotification(userCoinPair, arrayCoinPair, userRecord)
        return
                    
                    

def sendNotification(userCoinPair, arrayCoinPair, userRecord):
    # if positive percentage change > threshold
    if arrayCoinPair[1] > userCoinPair[1]:
        send_push_message(str(userRecord['push_token']['expoPushToken']), str(userCoinPair[0]).upper(), str(
            "{} has increased by {:0.2f}% in the last 24 hours, this could be a good opportunity to sell.".format(userCoinPair[0], arrayCoinPair[1]).capitalize()))
    # if negative percentage change < threshold
    elif arrayCoinPair[1] < -userCoinPair[1]:

        send_push_message(str(userRecord['push_token']['expoPushToken']), str(userCoinPair[0]).upper(), str(
            "{} has decreased by {:0.2f}% in the last 24 hours, this could be a good opportunity to buy.".format(userCoinPair[0], arrayCoinPair[1]).capitalize()))


def mainLoop(usersArray):
    # get data from firestore database
    docs = getFirebaseUsers()

    coinsArray = [] # stores coins and their %change so only need one coingecko api call

    for doc in docs:
        userRecord = doc.to_dict()

        # skip records without push token or with empty watchlist
        if str(userRecord['push_token']) == "{'expoPushToken': ''}":
            continue
        if str(userRecord['watchlist']['newWatchList']) == '[]':
            continue

        userWatchlistArray = json.loads(
            userRecord['watchlist']['newWatchList'])
        # loop through coins in users watchlist
        for userCoinPair in userWatchlistArray:
            userCoinInCoinsArray = False
            # loop through coins in coinArray
            for arrayCoinPair in coinsArray:
                # if user coin is in coinsArray
                if userCoinPair[0] == arrayCoinPair[0]:
                    checkThreshold(userCoinPair, arrayCoinPair, userRecord, usersArray)
                    userCoinInCoinsArray = True

            # if users coin does not exist in local coinsArray
            if userCoinInCoinsArray == False:
                # make api call to coinGecko
                req = requests.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids={}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false'.format(userCoinPair[0]))
                jsonReq = req.json()

                # store coin and % change in coinsArray
                key1 = ""
                for key in jsonReq.keys():
                    key1 = key
                coinsArray.append(
                    [userCoinPair[0], jsonReq[key1]['usd_24h_change']])

                # compare % change and threshold, send notification
                checkThreshold(userCoinPair, coinsArray[-1], userRecord, usersArray)


def main():
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    currentDate = ''
    usersArray = [] # stores users notification token, along with array containing coins theyve been notified for
    while True:
        #new day? reset users array
        newDate = datetime.now()
        if currentDate != newDate:
            currentDate = newDate
            usersArray = []

        startTime = time()
        mainLoop(usersArray)
        finishTime = time()
        timeTakenToRunLoop = finishTime - startTime
        sleep(900 - timeTakenToRunLoop)



if __name__ == "__main__":
    main()


# Loop through user in users
  # Loop through coins in users watchlist
    # If API call already been made for the coin
      # If 24 hour change > threshold
        # Send user notification
    # Else
      # Make API call to get 24 hour change for coin
      # Store change in array
      # If 24 hour change > threshold
        # Send user notification

