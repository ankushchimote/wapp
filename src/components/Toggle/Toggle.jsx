import React from "react";
import styles from "./Toggle.module.css";

const Toggle = ({ handleChange, isChecked }) => {
  return (
    <div className={styles.toggle_container}>
      <input
        type="checkbox"
        id="check"
        className="toggle"
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check">Dark Mode</label>
    </div>
  );
};

export default Toggle;
