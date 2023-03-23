import { css, StyleSheet } from "aphrodite";
import { useState, useRef, useEffect } from "react";
import colors from "~/config/themes/colors";

type Args = {
  handleClick: Function;
  children: any;
};

const ShareDropdown = ({ handleClick, children }: Args) => {
  const options = [
    {
      label: "Twitter",
      value: "twitter",
      icon: <i className="fa-brands fa-twitter"></i>,
    },
    {
      label: "LinkedIn",
      value: "linkedin",
      icon: <i className="fa-brands fa-linkedin"></i>,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const triggerEl = useRef(null);

  useEffect(() => {
    const _handleOutsideClick = (e) => {
      if (
        !(
          triggerEl.current.contains(e.target) || e.target === triggerEl.current
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", _handleOutsideClick);

    return () => {
      document.removeEventListener("click", _handleOutsideClick);
    };
  }, []);

  return (
    <div className={css(styles.shareDropdown)}>
      <div
        className={css(styles.trigger)}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerEl}
      >
        {children}
      </div>
      {isOpen && (
        <div className={css(styles.dropdown)}>
          {options.map((opt) => (
            <div
              className={css(styles.opt)}
              key={opt.value}
              onClick={() => handleClick(opt)}
            >
              <div className={css(styles.optIcon)}>{opt.icon}</div>
              <div className={css(styles.optLabel)}>{opt.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  shareDropdown: {
    position: "relative",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    boxShadow: "0px 0px 10px 0px #00000026",
    top: 40,
    left: 0,
    border: `1px solid ${colors.GREY_LINE(1)}`,
    borderRadius: 4,
    fontSize: 15,
    userSelect: "none",
    background: "white",
    width: 150,
  },
  trigger: {},
  opt: {
    background: "white",
    display: "flex",
    columnGap: "10px",
    padding: "10px 14px",
    ":hover": {
      backgroundColor: colors.GREY(0.1),
    },
  },
  optIcon: {},
  optLabel: {},
});

export default ShareDropdown;
