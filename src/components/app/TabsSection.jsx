import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";
import TabHeader from "./TabHeader.jsx";

function TabsSection({activeTab, setActiveTab}) {
    return (
        <>
            <Grid size={4} sx={{
                marginTop: '2%',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <TabHeader
                    text="Inactive tasks"
                    isActive={activeTab === "inactive"}
                    onClick={() => {
                        setActiveTab("inactive");
                    }}
                />
            </Grid>
            <Grid size={4} sx={{
                marginTop: '2%',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <TabHeader
                    text="Active tasks"
                    isActive={activeTab === "active"}
                    onClick={() => {
                        setActiveTab("active");
                    }}
                />
            </Grid>
            <Grid size={4} sx={{
                marginTop: '2%',
                display: 'flex',
                justifyContent: 'center',
            }}>
                <TabHeader
                    text="Completed tasks"
                    isActive={activeTab === "completed"}
                    onClick={() => {
                        setActiveTab("completed");
                    }}
                />
            </Grid>
        </>
    );
}

TabsSection.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

export default TabsSection;

