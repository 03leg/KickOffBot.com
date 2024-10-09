import { makeStyles } from "tss-react/mui";

export const useEntriesHtmlStyles = makeStyles()(() => ({
  variable: {
    backgroundColor: "#FF5722",
    borderRadius: "5px",
    color: "white",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "1px",
    paddingTop: "1px",
  },
  notFoundEntry: {
    backgroundColor: "#F44336",
    borderRadius: "5px",
    color: "white",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "1px",
    paddingTop: "1px",
  },
  propertyName: {
    backgroundColor: "#ff9800",
    borderRadius: "5px",
    color: "white",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "1px",
    paddingTop: "1px",
  },
  template: {
    backgroundColor: "#4CAF50",
    borderRadius: "5px",
    color: "white",
    paddingLeft: "5px",
    paddingRight: "5px",
    paddingBottom: "1px",
    paddingTop: "1px",
  },
}));
