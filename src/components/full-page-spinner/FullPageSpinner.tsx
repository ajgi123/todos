import { CircularProgress } from "@material-ui/core";
import { useStyles } from "../shared/full-page-center";

const FullPageSpinner = () => {
  const classes = useStyles();
  return (
    <div className={classes.fullpage}>
      <CircularProgress size={100} />
    </div>
  );
};

export default FullPageSpinner;
