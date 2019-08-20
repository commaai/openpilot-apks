/*
    ChffrPlus X Theme
    ~~~~~~~~~~~~~~~~~
*/

import { Colors } from '../../../node_modules/comma-x-native/x/themes/Base/BaseColors';

export let ChffrPlusTheme = {
    text: {
        sizes: {
            tiny: 14,
            small: 16,
            smallish: 17,
            default: 18,
            medium: 20,
            big: 24,
            bigger: 26,
            jumbo: 28,
        },
        weights: {
            light: 'OpenSans-Light',
            regular: 'OpenSans-Regular',
            semibold: 'OpenSans-Semibold',
            bold: 'OpenSans-Bold',
        },
        colors: {
            setupDisabled: '#1D2225',
            lightGrey200: '#ACB7BD',
        },
    },
    button: {
        sizes: {
            atom: 20,
        },
        colors: {
            setupDefault: {
                backgroundColor: Colors.lightGrey500,
                borderColor: Colors.lightGrey400,
                borderRadius: 13,
            },
            setupPrimary: {
                backgroundColor: Colors.blue50,
                borderColor: Colors.blue100,
                borderRadius: 13,
            },
            setupInverted: {
                backgroundColor: Colors.transparent,
                borderColor: '#1D2225',
                borderRadius: 13,
                borderWidth: 1,
            },
            setupDisabled: {
                backgroundColor: '#0B0E0E',
                borderRadius: 13,
            },
            settingsDefault: {
                backgroundColor: 'rgba(233, 233, 233, 0.08)',
                borderColor: 'transparent',
                borderRadius: 13,
            },
        },
    },
    radioField: {
        defaults: {
            opacityDisabled: 1,
        },
        sizes: {
            medium: 40,
            mediumLabel: 18,
        },
    },
    gradient: {
        colors: {
            engaged_green: [
                'rgb(24, 125, 68)',
                'rgb(15, 93, 47)'
            ],
            dark_black: [
                'rgb(22, 24, 26)',
                'rgb(3, 4, 4)',
            ]
        },
    },
    line: {
        colors: {
            light: 'rgba(233, 233, 233, 0.1)',
        },
        spacing: {
            mini: 5,
        },
    },
}
