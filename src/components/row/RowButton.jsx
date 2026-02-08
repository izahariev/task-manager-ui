import {IconButton} from "@mui/material";
import PropTypes from "prop-types";

export default function RowButton({backgroundColor, hoverBackgroundColor, onClick, icon, marginLeft}) {
    return (
      <IconButton
        sx={{
            backgroundColor: backgroundColor,
            ...(marginLeft && {marginLeft: marginLeft}),
            "&:hover": {
                backgroundColor: hoverBackgroundColor
            },
            transition: "background-color 0.2s ease"
        }}
        size="small"
        onClick={onClick}
      >
          {icon}
      </IconButton>
    );
}

RowButton.propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    hoverBackgroundColor: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
    marginLeft: PropTypes.string
};
