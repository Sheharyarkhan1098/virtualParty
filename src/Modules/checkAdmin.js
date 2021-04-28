import React, { useEffect } from "react";
import firebase from "./firebaseApp";
import { getUserId } from "../Redux/eventSession";
import { useSelector } from "react-redux";
import { it } from "date-fns/locale";
import { database } from "firebase-admin";

export const getUserFromSession = async (userId, sessionId) => {
  let userDoc = await firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(userId)
    .get();
  if (userDoc !== undefined) return await userDoc.data();
  else return null;
};

export const getUserDb = async (myUserId) => {
  let userDoc = await firebase
    .firestore()
    .collection("users")
    .doc(myUserId)
    .get();
  return await userDoc.data();
};
