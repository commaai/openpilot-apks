import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { request as Request, drives as Drives } from '@commaai/comma-api';
import ChffrPlus from '../../native/ChffrPlus';
import Logging from '../../native/Logging';
import { Params } from '../../config';

import X from '../../themes';
import Styles from './DriveRatingStyles';

const RatingFaces = {
    rating_1_color: require('../../img/illustration_rating_1_color.png'),
    rating_1_white: require('../../img/illustration_rating_1_white.png'),
    rating_2_color: require('../../img/illustration_rating_2_color.png'),
    rating_2_white: require('../../img/illustration_rating_2_white.png'),
    rating_3_color: require('../../img/illustration_rating_3_color.png'),
    rating_3_white: require('../../img/illustration_rating_3_white.png'),
}

class DriveRating extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedRating: null,
        };
    }

    handleRatingSelection = (rating) => {
        const { lastRouteName } = this.props;
        this.setState({ selectedRating: rating });
        setTimeout(() => {
            this.props.selectRating(lastRouteName, rating);
        }, 500);
    }

    renderRatingFaces() {
        const { selectedRating } = this.state;
        let ratings = ['3', '2', '1'];
        return ratings.map((r) => {
            const ratingColor = selectedRating == r ? 'color' : 'white';
            const ratingStyle = [
                Styles.driveRatingSelection,
                selectedRating == r && Styles.driveRatingSelectionSelected,
            ];
            return (
                <View style={ ratingStyle }>
                    <X.Button
                        color='transparent'
                        size='full'
                        onPress={ () => this.handleRatingSelection(r) }>
                        <X.Image
                            source={ RatingFaces[`rating_${ r }_${ ratingColor }`] }
                            style={ Styles.driveRatingSelectionImage } />
                    </X.Button>
                </View>
            )
        })
    }

    render() {
        return (
            <X.Gradient
                color='dark_blue'>
                <View style={ Styles.driveRating }>
                    <View style={ Styles.driveRatingTitle }>
                        <X.Text
                            color='white'
                            size='jumbo'
                            weight='bold'>
                            How was your drive?
                        </X.Text>
                    </View>
                    <View style={ Styles.driveRatingSubtitle }>
                        <X.Text
                            color='lightGrey200'
                            size='medium'
                            weight='regular'>
                            Tell us how openpilot performed for this drive.
                        </X.Text>
                    </View>
                    <X.Entrance style={ Styles.driveRatingSelections }>
                        { this.renderRatingFaces() }
                    </X.Entrance>
                </View>
            </X.Gradient>
        )
    }
}

const mapStateToProps = state => ({
    lastRouteName: state.host.lastRouteName,
});

const mapDispatchToProps = (dispatch) => ({
    selectRating: async(lastRouteName, rating) => {
        const isUpdateAvailableStr = await ChffrPlus.readParam(Params.KEY_IS_UPDATE_AVAILABLE);
        const isUpdateAvailable = ((isUpdateAvailableStr && isUpdateAvailableStr.trim() === "1") || false);

        if (lastRouteName) {
            try {
                const dongleId = await ChffrPlus.readParam("DongleId");
                const token = await ChffrPlus.createJwt({"identity": dongleId});
                await Request.configure(token);
                await Drives.setRouteRating(lastRouteName, rating);
            } catch(e) {
                Logging.cloudLog('Failed to set route rating', { lastRouteName, rating, e });
            }
        } else {
            Logging.cloudLog('Failed to get last route name', { rating });
        }

        if (isUpdateAvailable) {
            const releaseNotes = await ChffrPlus.readParam(Params.KEY_RELEASE_NOTES);
            dispatch(NavigationActions.navigate({ routeName: 'UpdatePrompt',
                params: { releaseNotes: releaseNotes }
            }));
        } else {
            dispatch(NavigationActions.navigate({ routeName: 'Home' }))
        }

    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DriveRating);
