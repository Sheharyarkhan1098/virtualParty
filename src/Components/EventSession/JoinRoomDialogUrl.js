import React from "react";
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
  getLiveGroupsOriginal
} from "../../Redux/eventSession";
import Alert from "@material-ui/lab/Alert";
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
  DialogContent
} from "@material-ui/core";
import ParticipantAvatar from "../Misc/ParticipantAvatar";
import DialogClose from "../Misc/DialogClose";
import MUIRichTextEditor from "mui-rte";

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
  const [url, setUrl] = React.useState(null);

  const open = useSelector(isJoinRoomOpen);
  const room = useSelector(getJoinRoomEntity, shallowEqual);
  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  const liveGroups = useSelector(getLiveGroupsOriginal, shallowEqual);
  const userSession = useSelector(getUserSession, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const handleClose = () => {
    dispatch(closeJoinRoom());
  };

  if (!room) {
    return null;
  }

  const handleJoinRoom = (e) => {
    e.preventDefault();
    joinConversation(
      sessionId,
      participantsJoined,
      liveGroups,
      userId,
      url,
      snackbar,
      false
    );
    handleClose();
  };

  const handleChangeUrl = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setUrl(value);
  };

  const isMyGroup =
    room.participants.find((participant) => participant.id === userId) !==
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
        <Box mt={2}>
          <Box mb={4}>
            <Alert severity="info">
              <center>
                <label> Enter Room's URL:</label>
                <input
                  name="Url"
                  value={url}
                  onChange={handleChangeUrl}
                  required
                />
              </center>
            </Alert>
          </Box>
        </Box>
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
