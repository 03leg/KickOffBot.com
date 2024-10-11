import { makeStyles } from "tss-react/mui";

const baseCssProps = {
  borderRadius: "5px",
  color: "white",
  paddingLeft: "5px",
  paddingRight: "5px",
  paddingBottom: "1px",
  paddingTop: "1px",
};

export const useEntriesHtmlStyles = makeStyles()(() => ({
  variable: {
    backgroundColor: "#FF5722",
    ...baseCssProps,
  },
  objectProperty: {
    backgroundColor: "#4CAF50",
    ...baseCssProps,
  },
  notFoundEntry: {
    backgroundColor: "#F44336",
    ...baseCssProps,
  },
  propertyName: {
    backgroundColor: "#ff9800",
    ...baseCssProps,
  },
  template: {
    backgroundColor: "#4CAF50",
    ...baseCssProps,
  },
}));
