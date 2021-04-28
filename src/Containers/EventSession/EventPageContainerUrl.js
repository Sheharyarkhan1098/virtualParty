import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import firebase from "../../Modules/firebaseApp";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import Page from "../../Components/Core/Page";
import EventPageUrl from "../../Components/Event/EventPageUrl";
import CenteredTopbar from "../Layouts/CenteredTopbar";
import SplashScreen from "../../Components/Misc/SplashScreen";
import Error404View from "../Error404View";
import JoinRoom from "../../Components/EventSession/JoinRoomDialogUrl";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    },
    position: "relative"
  },

  pageContainer: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down("xs")]: {
      padding: 0
    }
  }
}));

const EventPageContainer = (props) => {
  const classes = useStyles();

  let originalSessionId = props.match.params.sessionId;
  let roomId = props.match.params.roomId;

  let sessionId = originalSessionId ? originalSessionId.toLowerCase() : null;

  const [
    eventSessionDetails,
    loadingSessionDetails,
    errorSessionDetails
  ] = useDocumentData(
    firebase.firestore().collection("eventSessionsDetails").doc(sessionId)
  );
  const [
    eventSessionsEnabledFeatures,
    loadingEventSessionsEnabledFeatures,
    errorEventSessionsEnabledFeatures
  ] = useDocumentData(
    firebase
      .firestore()
      .collection("eventSessionsEnabledFeatures")
      .doc(sessionId)
  );

  if (loadingSessionDetails || loadingEventSessionsEnabledFeatures) {
    return <SplashScreen />;
  }
  if (errorSessionDetails || errorEventSessionsEnabledFeatures) {
    console.error(errorSessionDetails);
    return <p>Error :(</p>;
  }

  if (!eventSessionDetails) {
    return <Error404View />;
    // return (
    //   <Page title={"Veertly | Event not found"}>
    //     <div className={classes.root}>
    //       <CenteredTopbar />
    //       <div>
    //         <br />
    //         <br />
    //         <br />
    //         <br />
    //         <br />
    //         <br />
    //         <Typography align="center" variant="overline" style={{ display: "block" }}>
    //           Event not found!
    //         </Typography>
    //         <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
    //           <Button
    //             variant="contained"
    //             color="primary"
    //             className={classes.button}
    //             onClick={() => history.push(routes.CREATE_EVENT_SESSION())}
    //           >
    //             Create Event
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </Page>
    // );
  }

  return (
    <div className={classes.root}>
      <Page title={`Virtual Club | ${eventSessionDetails.title}`}> </Page>

      <CenteredTopbar showCreate={true} />
      <div className={classes.pageContainer}>
        <EventPageUrl
          event={eventSessionDetails}
          enabledFeatures={eventSessionsEnabledFeatures}
          roomId={roomId}
        />
        <JoinRoom />
      </div>
    </div>
  );
};

export default withRouter(EventPageContainer);
