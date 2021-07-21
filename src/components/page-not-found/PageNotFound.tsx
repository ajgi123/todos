import Typography from "@material-ui/core/Typography";
import { useStyles } from "../shared/full-page-center";

const PageNotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.fullpage}>
      <Typography variant="h2">Page Not Found</Typography>
      <Typography variant="h1">404</Typography>
    </div>
  );
};

export default PageNotFound;
