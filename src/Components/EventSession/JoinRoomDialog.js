import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { joinConversation } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getParticipantsJoined,
  getSessionId,
  getUserId,
  getUserSession,
  getLiveGroupsOriginal,
  isEventOwner,
  updateParticipantsJoined
} from "../../Redux/eventSession";
import Alert from "@material-ui/lab/Alert";
import { removeUser, blockUser } from "../../Modules/removeUser";
import {
  isJoinRoomOpen,
  getJoinRoomEntity,
  closeJoinRoom
} from "../../Redux/dialogs";
import {
  Typography,
  Grid,
  Box,
  DialogTitle,
  DialogActions,
  DialogContent,
  Menu,
  MenuItem
} from "@material-ui/core";
import ParticipantAvatar from "../Misc/ParticipantAvatar";
import DialogClose from "../Misc/DialogClose";
import MUIRichTextEditor from "mui-rte";
import { getUserDb } from "../../Modules/checkAdmin";

const useStyles = makeStyles((theme) => ({
  content: {
    // position: "relative",
    // width: theme.breakpoints.values.sm
    // padding: theme.spacing(6)
    paddingBottom: theme.spacing(2)
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    paddingTop: theme.spacing(2)
  },
  hintText: {
    marginBottom: theme.spacing(4),
    display: "block",
    width: 400,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2)
  },
  emptySpaceBottom: {
    marginBottom: theme.spacing(4)
  },
  participantContainer: {
    marginBottom: theme.spacing(3)
  },
  alert: {
    marginTop: theme.spacing(2)
  },
  avatarsContainer: {
    paddingBottom: theme.spacing(3)
  },
  avatar: {
    margin: theme.spacing(0.5)
  },
  dialogTitle: { color: theme.palette.primary.main },
  button: { margin: theme.spacing(2) },
  descriptionContainer: {
    maxHeight: 250,
    overflow: "auto"
  }
}));

export default function (props) {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const [removeableUserDb, setRemoveableUserDb] = React.useState([]);
  const [removeableUser, setRemoveableUser] = React.useState(null);
  const [blockAbleUser, setBlockAbleUser] = React.useState(null);
  const [blockAbleUserDb, setBlockAbleUserDb] = React.useState([]);
  const [menuAnchorElUser, setMenuAnchorElUser] = React.useState(null);
  const [roomParticipants, setRoomParticipants] = React.useState([]);
  const [checkRoomParticipant, setCheckRoomParticipants] = React.useState(true);
  const [blockUserActive, setBlockUserActive] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const openUserMenu = Boolean(menuAnchorElUser);
  const open = useSelector(isJoinRoomOpen);
  const room = useSelector(getJoinRoomEntity, shallowEqual);
  let participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  const liveGroups = useSelector(getLiveGroupsOriginal, shallowEqual);
  const userSession = useSelector(getUserSession, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);
  const isOwner = useSelector(isEventOwner);

  useEffect(() => {
    async function data() {
      const myUser = await getUserDb(userId);
      if (myUser.userType === "Admin") setIsAdmin(true);
      else setIsAdmin(false);
    }
    data();
  });

  if (
    room !== null &&
    room.participants.length !== roomParticipants.length &&
    checkRoomParticipant === true
  ) {
    setRoomParticipants(room.participants);
    setCheckRoomParticipants(true);
  }

  // console.log("roomParticipants", roomParticipants);
  // console.log(removeableUser, "removaeAbleuser");
  // console.log(removeableUserDb, "removaeAbleuserdatabase");
  // console.log(blockAbleUserDb, "blockAbleUser");
  // console.log(participantsJoined, liveGroups);
  const handleClose = () => {
    dispatch(closeJoinRoom());
    setRoomParticipants(room.participants);
    setRemoveableUserDb([]);
    setBlockAbleUserDb([]);
    setRemoveableUser(null);
  };

  const handleCloseWithSave = () => {
    dispatch(closeJoinRoom());
    setRemoveableUserDb([]);
    setBlockAbleUserDb([]);
    setRemoveableUser(null);
    setCheckRoomParticipants(true);
  };

  if (!room) {
    return null;
  }

  const handleMenuClose = (e) => {
    e.stopPropagation();
    closeMenu();
  };

  const closeMenu = () => {
    setMenuAnchorElUser(null);
  };

  const handleUserMenu = (id) => {
    // if (removeableUser === null) {
    setRemoveableUser(id);
    // } else {
    // }
  };

  const handleRemoveUser = (e) => {
    e.stopPropagation();
    const data = roomParticipants.filter((p) => p.id !== removeableUser);
    removeableUserDb.push(removeableUser);
    setRoomParticipants(data);
    setCheckRoomParticipants(false);
    closeMenu();
  };

  const handleBlockUser = (e) => {
    e.stopPropagation();
    handleRemoveUser(e);
    blockAbleUserDb.push(removeableUser);
    setBlockUserActive(true);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    removeUser(sessionId, removeableUserDb);
    if (blockUserActive) {
      blockUser(sessionId, blockAbleUserDb);
    }
    setBlockUserActive(false);
    handleCloseWithSave();
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    //delete participantsJoined[removeableUser];
    // updateParticipantsJoined(participantsJoined);
    joinConversation(
      sessionId,
      participantsJoined,
      liveGroups,
      userId,
      room.id,
      snackbar,
      false
    );
    handleClose();
  };

  const isMyGroup =
    roomParticipants.find((participant) => participant.id === userId) !==
    undefined;

  let userInConversation = userSession && !!userSession.groupId;

  return (
    <div>
      <DialogClose
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className={classes.dialogTitle}>
          {room.roomName}
        </DialogTitle>
        <DialogContent>
          {room.roomDescription && room.roomDescription.trim() !== "" && (
            <Box className={classes.descriptionContainer}>
              <MUIRichTextEditor
                value={room.roomDescription}
                readOnly={true}
                placeholder=""
                toolbar={false}
              />
            </Box>
          )}
          <Box
            mt={
              room.roomDescription && room.roomDescription.trim() !== "" ? 5 : 2
            }
            mb={5}
          >
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              {roomParticipants.map((participant) => {
                if (!participant) return null;
                return (
                  <div
                    key={participant.id}
                    style={{ bacgroundColor: "red" }}
                    className={classes.avatar}
                  >
                    <ParticipantAvatar
                      participant={participant}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAnchorElUser(e.currentTarget);
                        handleUserMenu(participant.id);
                      }}
                    />
                    {((isOwner && isMyGroup) || isAdmin) && (
                      <Menu
                        id="menu-appbar"
                        anchorEl={menuAnchorElUser}
                        keepMounted
                        open={openUserMenu}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleRemoveUser}>Remove</MenuItem>
                        <MenuItem onClick={handleBlockUser}>Block</MenuItem>
                      </Menu>
                    )}
                  </div>
                );
              })}
              {roomParticipants.length === 0 && (
                <Typography color="textSecondary">
                  No one is currently on this room!
                </Typography>
              )}
            </Grid>
          </Box>
          <Box mt={2}>
            {!isMyGroup && (
              <>
                {!userInConversation && (
                  <Alert severity="info" className={classes.alert}>
                    You will join this room's video conferencing call
                  </Alert>
                )}

                {userInConversation && (
                  <Alert severity="warning" className={classes.alert}>
                    You will leave your current conversation and join this room
                  </Alert>
                )}
              </>
            )}
            {isMyGroup && (
              <Box mb={4}>
                <Alert severity="info" className={classes.alert}>
                  You are already part of this room{" "}
                  <span role="img" aria-label="happy">
                    🙂
                  </span>
                </Alert>
                {(isOwner || isAdmin) && (
                  <Button
                    onClick={handleSaveChanges}
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        {!isMyGroup && (
          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
              className={classes.button}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinRoom}
              className={classes.button}
              color="primary"
              variant="contained"
              type="submit"
            >
              Join Room
            </Button>
          </DialogActions>
        )}
      </DialogClose>
    </div>
  );
}
