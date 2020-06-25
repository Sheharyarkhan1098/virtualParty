import React from "react";
import Layout from "./Layouts/CenteredLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../Modules/firebaseApp";
import EditProfileForm from "../Components/EditProfile/EditProfileForm";
import SplashScreen from "../Components/Misc/SplashScreen";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../Config/routes";
import {
  Card,
  CardContent,
  Container,
  makeStyles,

} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  card: {
    overflow: "visible",
    display: "flex",
    position: "relative",
    "& > *": {
      flexGrow: 1,
      flexBasis: "50%",
      width: "50%"
    }
  },
  content: {
    padding: theme.spacing(8, 5, 3, 4)
  }
}));
const EditProfileContainer = () => {
  const [userAuth, initialising, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();


  let sessionId = React.useMemo(() => {
    return location.state && location.state.sessionId
      ? location.state.sessionId.toLowerCase()
      : null;
  }, [location]);

  const redirectUser = React.useCallback(() => {
    history.push(
      location.state && location.state.from
        ? location.state.from.pathname
        : routes.HOME()
    );
  }, [history, location]);

  if (initialising) {
    return <SplashScreen />;
  }

  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }
  return (
    <Layout maxWidth="sm">
      <div style={{ padding: "48px 24px" }}>
        {userAuth && (
          <Container maxWidth="xs">
            <Card className={classes.card} style={{ backgroundColor: "#e6e6e6" }}>
              <CardContent className={classes.content}>
                <EditProfileForm
                  userAuth={userAuth}
                  sessionId={sessionId ? sessionId.toLowerCase() : null}
                  profileUpdatedCallback={redirectUser}
                />
              </CardContent>
            </Card>
          </Container>
        )}
      </div>
    </Layout>
  );
};
// EditProfileContainer.whyDidYouRender = true;
export default EditProfileContainer;
