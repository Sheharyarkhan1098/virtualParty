import React, { useEffect } from "react";
import firebase from "./firebaseApp";
import { getUserId } from "../Redux/eventSession";
import { useSelector } from "react-redux";
import { findBreakingChanges } from "graphql";
import { app } from "firebase";
import { user } from "firebase-functions/lib/providers/auth";
import { Server } from "react-feather";

export const removeUser = (sessionId, removeableUser) => {
  // console.log("sessionID", sessionId, "removeuser", removeableUser);

  removeableUser.map(
    async (user) =>
      await firebase
        .firestore()
        .collection("eventSessions")
        .doc(sessionId)
        .collection("participantsJoined")
        .doc(user)
        .update({
          currentLocation: "LOBBY"
        })
  );
  return;
  // await userDoc.data();
};
//zg1trMtMekdYhHNF0hGn87SD22u1

export const blockUser = (sessionId, removeableUser) => {
  // console.log("sessionID", sessionId, "removeuser", removeableUser);

  removeableUser.map(
    async (user) =>
      await firebase
        .firestore()
        .collection("eventSessions")
        .doc(sessionId)
        .collection("participantsJoined")
        .doc(user)
        .update({
          isBlocked: true,
          currentLocation: "BLOCKED",
          groupId: null,
          isOnline: false,
          leftTimestamp: firebase.firestore.Timestamp.now()
        })
  );
  return;
  // await userDoc.data();
};

export const setLocationToLobby = (sessionId, id) => {
  console.log(sessionId, id);
  // const data = async () => {
  firebase
    .firestore()
    .collection("eventSessions")
    .doc(sessionId)
    .collection("participantsJoined")
    .doc(id)
    .update({
      currentLocation: "LOBBY"
    });
  return;
  // };
  // data();
  // await userDoc.data();
};
