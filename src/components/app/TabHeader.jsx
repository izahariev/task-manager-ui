import PropTypes from "prop-types";

function TabHeader({text, onClick, isActive}) {
    return (
        <h1
            className="tab-header"
            style={{
                color: isActive ? '#2D3748' : '#718096',
                fontWeight: isActive ? 600 : 500
            }}
            onClick={onClick}
        >
            {text}
        </h1>
    );
}

TabHeader.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired
};

export default TabHeader;

