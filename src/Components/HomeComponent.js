import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { withRouter } from "react-router-dom";
import routes from "../Config/routes";
import Page from "./Core/Page";
import MarginProvider from "./Shared/MarginProvider";
import CompatibilityInfoAlert from "./Shared/CompatibilityInfo";

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(12, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  },
  buttonJoin: {
    margin: "auto"
  },
  textField: {
    maxWidth: 300,
    margin: "auto"
  },
  button: {
    margin: 16,
    width: 250
  },
  alertDialog: {
    textAlign: "center",
    justifyContent: "center",
    // width: "100%",
    // maxWidth: 600,
    // alignSelf: "center"
  }
}));

export default withRouter(props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      {/* Hero unit */}
      <Page title="Virtual Club | Virtual events, virtual networking!"></Page>
      <div className={classes.heroContent}>
        <Container maxWidth="md">
          <div className={classes.heroButtons}>
            <Typography variant="h4" style={{ textAlign: "center", fontWeight: "lighter", marginBottom: 48, color: "white" }}>
              Virtual Party by Virtual Club
            </Typography>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => props.history.push(routes.CREATE_EVENT_SESSION())}
                >
                  Create new event
                </Button>
              </Grid>
              {/* <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => props.history.push(routes.EVENT_SESSION("demo"))}
                >
                  Try demo event
                </Button>
              </Grid> */}
            </Grid>
            <MarginProvider top={16}>
              <CompatibilityInfoAlert className={classes.alertDialog} />
            </MarginProvider>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
});
