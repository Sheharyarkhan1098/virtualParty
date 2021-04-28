import React, { useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CardMedia, Button } from "@material-ui/core";
import * as moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import {
  DEFAULT_EVENT_OPEN_MINUTES,
  DEFAULT_EVENT_CLOSES_MINUTES
} from "../../Config/constants";
import routes from "../../Config/routes";
import JoinEventIcon from "@material-ui/icons/MeetingRoom";
import { joinConversation } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";
import firebase from "../../Modules/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getParticipantsJoined,
  getSessionId,
  getUserId,
  getUserSession,
  getLiveGroupsOriginal
} from "../../Redux/eventSession";
import Alert from "@material-ui/lab/Alert";
import { isJoinRoomOpen, getJoinRoomEntity } from "../../Redux/dialogs";
import MUIRichTextEditor from "mui-rte";
import { getUserFromSession } from "../../Modules/checkAdmin";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
    position: "relative"
  },
  contentContainer: ({ isSmallContainer }) => ({
    padding: isSmallContainer ? 16 : 32,
    [theme.breakpoints.down("xs")]: {
      padding: 20
    }
  }),
  ctaContainer: {
    // [theme.breakpoints.down("xs")]: {},
    width: "100%",
    textAlign: "center",
    marginTop: 16
  },
  joinButton: {
    height: 48,
    align: "center"
  }
}));

export default function EventPage(props) {
  let {
    bannerUrl,
    eventBeginDate,
    eventEndDate,
    title,
    description,
    website,
    id,
    eventOpens,
    eventCloses,
    owner
  } = props.event;
  let {
    isPreview,
    hideButtons,
    enabledFeatures,
    isSmallContainer,
    hideBanner
  } = props;
  let { roomId, roomDetails, handleJoinRoom, roomNotFound } = props;
  const classes = useStyles({ isSmallContainer });
  // const snackbar = useSnackbar();
  // const dispatch = useDispatch();
  // const [url, setUrl] = React.useState(null);
  const [isBlocked, setIsBlocked] = React.useState(true);

  // const open = useSelector(isJoinRoomOpen);
  // const room = useSelector(getJoinRoomEntity, shallowEqual);
  // const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  // const liveGroups = useSelector(getLiveGroupsOriginal, shallowEqual);
  // const userSession = useSelector(getUserSession, shallowEqual);
  // // const sessionId = useSelector(getSessionId);
  const sessionId = id;
  // const userId = useSelector(getUserId);

  const [userAuth] = useAuthState(firebase.auth());

  const userId = useMemo(() => (userAuth ? userAuth.uid : null), [userAuth]);

  const history = useHistory();

  let beginDate = eventBeginDate ? moment(eventBeginDate.toDate()) : null;
  let endDate = eventEndDate ? moment(eventEndDate.toDate()) : null;

  const isSameDay = beginDate ? beginDate.isSame(endDate, "day") : false;

  useEffect(() => {
    async function data() {
      let myUser = null;
      if (
        userId !== null &&
        userId !== undefined &&
        sessionId !== null &&
        sessionId !== undefined
      )
        myUser = await getUserFromSession(userId, sessionId);
      if (myUser !== undefined && myUser !== null) {
        if (myUser.isBlocked === true) setIsBlocked(true);
        else setIsBlocked(false);
      } else setIsBlocked(false);
    }
    data();
  });
  // console.log("isBlocked", isBlocked);
  const handleJoinEvent = (e) => {
    e.preventDefault();
    firebase
      .firestore()
      .collection("eventSessions")
      .doc(sessionId)
      .collection("participantsJoined")
      .doc(userId)
      .set({
        currentLocation: "ROOMS",
        joinedTimestamp: firebase.firestore.Timestamp.now()
      })
      .then(() => history.push(routes.JOIN_ROOM_LIVE(id, roomId)));
  };

  const isLive = React.useMemo(() => {
    if (!eventBeginDate) {
      return true;
    }
    let openMinutes = eventOpens
      ? Number(eventOpens)
      : DEFAULT_EVENT_OPEN_MINUTES;
    let beginDate = moment(eventBeginDate.toDate());

    return beginDate.subtract(openMinutes, "minutes").isBefore(moment());
  }, [eventBeginDate, eventOpens]);

  const isOver = React.useMemo(() => {
    if (!eventEndDate) {
      return true;
    }
    let closeMinutes = eventCloses
      ? Number(eventCloses)
      : DEFAULT_EVENT_CLOSES_MINUTES;
    let endDate = moment(eventEndDate.toDate());

    return endDate.add(closeMinutes, "minutes").isBefore(moment());
  }, [eventCloses, eventEndDate]);

  return (
    <Card className={classes.root}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {bannerUrl && bannerUrl.trim() !== "" && (
        <CardMedia
          component="img"
          alt={title}
          image={bannerUrl}
          title={title}
        />
      )}
      {(!bannerUrl || bannerUrl.trim() === "") && (
        <CardMedia
          component="img"
          alt={title}
          image="/DefaultEventBanner.svg"
          title={title}
        />
      )}
      {roomDetails && !isBlocked && (
        <div className={classes.contentContainer}>
          <Typography
            variant="h6"
            color="primary"
            align="left"
            style={{ marginBottom: 24 }}
          >
            Room Name{`: ${roomDetails}`}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            // disableElevation
            onClick={handleJoinRoom}
            size="large"
            startIcon={<JoinEventIcon />}
            className={classes.joinButton}
          >
            Join Room now
          </Button>
        </div>
      )}
      <div className={classes.contentContainer}>
        <Typography
          variant="h4"
          color="primary"
          align="left"
          // style={{ marginBottom: 24 }}
        >
          {title}
        </Typography>
        <div style={{ margin: 10 }}>
          {beginDate && (
            <Typography color="textSecondary">
              <span
                role="img"
                aria-label="calendar"
                style={{ marginRight: isSmallContainer ? 4 : 16 }}
              >
                📅
              </span>
              {isSameDay
                ? beginDate.format("lll") + " to " + endDate.format("LT")
                : beginDate.format("lll") + " to " + endDate.format("lll")}
            </Typography>
          )}
        </div>

        {isBlocked && (
          <Typography
            variant="h6"
            color="primary"
            align="left"
            // style={{ marginBottom: 24 }}
          >
            <Alert severity="error">You are Blocked from this Event!</Alert>
          </Typography>
        )}

        {roomNotFound && (
          <Typography
            variant="h6"
            color="primary"
            align="left"
            // style={{ marginBottom: 24 }}
          >
            <Alert severity="error">No room is linked with this URL!</Alert>
          </Typography>
        )}

        {!roomDetails && isOver && !roomNotFound && (
          <Typography
            variant="h6"
            color="primary"
            align="left"
            // style={{ marginBottom: 24 }}
          >
            <Alert severity="info">This event has finished</Alert>
          </Typography>
        )}

        {isLive && !isOver && !isBlocked && (
          <Button
            variant="contained"
            color="primary"
            // disableElevation
            // onClick={() => history.push(routes.JOIN_ROOM_LIVE(id, roomId))}
            onClick={handleJoinEvent}
            size="large"
            startIcon={<JoinEventIcon />}
            className={classes.joinButton}
          >
            Join Event now
          </Button>
        )}
      </div>
    </Card>
  );
}
