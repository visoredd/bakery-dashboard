import React from "react";
import FadeLoader from "react-spinners/FadeLoader";
import styles from "./loader.module.scss";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loader = ({ loading }) => {
  return (
    <div className={styles.overlay}>
      <FadeLoader
        cssOverride={override}
        size={100}
        color={"#3f51b5"}
        loading={loading}
      />
    </div>
  );
};

export default Loader;
