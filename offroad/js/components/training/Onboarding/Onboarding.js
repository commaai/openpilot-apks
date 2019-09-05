import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import ChffrPlus from '../../..//native/ChffrPlus';
import { completeTrainingStep } from '../step';
import { onTrainingRouteCompleted } from '../../../utils/version';

import X from '../../../themes';
import Styles from './OnboardingStyles';

const Step = {
    OB_SPLASH: 'OB_SPLASH',
    OB_INTRO: 'OB_INTRO',
    OB_SENSORS: 'OB_SENSORS',
    OB_CONTROLS: 'OB_CONTROLS',
    OB_OUTRO: 'OB_OUTRO',
};

class Onboarding extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            step: Step.OB_SPLASH,
            stepPoint: 0,
            stepChecks: [],
            engagedMocked: false,
            photoOffset: new Animated.Value(0),
            photoCycled: new Animated.Value(0),
            photoCycledLast: new Animated.Value(0),
            leadEntered: new Animated.Value(0),
            gateHighlighted: new Animated.Value(0),
        };
    }

    componentWillUnmount() {
        this.handleEngagedMocked(false);
    }

    setStep(step) {
        this.setState({
            step: '',
            stepChecks: [],
        }, () => {
            return this.setState({ step });
        });
        this.handleEngagedMocked(false);
    }

    setStepPoint(stepPoint) {
        this.setState({
            stepPoint: 0,
        }, () => {
            return this.setState({ stepPoint });
        })
    }

    handleRestartPressed = () => {
        this.props.restartTraining();
        this.setStep('OB_SPLASH');
    }

    handleIntroCheckboxPressed(stepCheck) {
        const { stepChecks } = this.state;
        if (stepChecks.indexOf(stepCheck) === -1) {
            const newStepChecks = [...stepChecks, stepCheck];
            this.setState({ stepChecks: newStepChecks });
            if (newStepChecks.length == 3) {
                setTimeout(() => {
                    this.setStep('OB_SENSORS');
                }, 300)
            }
        } else {
            stepChecks.splice(stepChecks.indexOf(stepCheck), 1);
            this.setState({ stepChecks });
        }
    }

    handleSensorRadioPressed(option) {
        switch(option) {
            case 'index':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                return this.setStepPoint(0); break;
            case 'camera':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(0);
                return this.setStepPoint(1); break;
            case 'radar':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animateLeadEntered(100);
                return this.setStepPoint(2); break;
        }
    }

    handleSensorVisualPressed(visual) {
        const { stepChecks } = this.state;
        const hasCheck = (stepChecks.indexOf(visual) > -1);
        if (stepChecks.length > 0 && !hasCheck) {
            this.animatePhotoOffset(0);
            this.setState({ stepChecks: [...stepChecks, visual] });
            this.setStepPoint(0);
            return this.setStep('OB_CONTROLS');
        } else {
            this.setState({ stepChecks: [...stepChecks, visual] });
            switch(visual) {
                case 'camera':
                    this.animatePhotoCycled(100);
                    this.animateLeadEntered(100);
                    return this.setStepPoint(2); break;
                case 'radar':
                    this.animatePhotoOffset(0);
                    this.animateLeadEntered(0);
                    this.animatePhotoCycled(0);
                    return this.setStepPoint(0); break;
            }
        }
    }

    handleControlsRadioPressed(option) {
        switch(option) {
            case 'index':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                this.animatePhotoCycledLast(0);
                return this.setStepPoint(0); break;
            case 'cruise':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(0);
                return this.setStepPoint(1); break;
            case 'monitoring':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                return this.setStepPoint(2); break;
            case 'limitations':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                return this.setStepPoint(3); break;
            case 'pedal':
                this.animatePhotoOffset(100);
                this.animatePhotoCycledLast(100);
                return this.setStepPoint(4); break;
        }
    }

    handleControlsVisualPressed(visual) {
        const { stepChecks } = this.state;
        const hasCheck = (stepChecks.indexOf(visual) > -1);
        this.setState({ stepChecks: [...stepChecks, visual] });
        switch(visual) {
            case 'cruise':
                this.animatePhotoCycled(100);
                this.handleEngagedMocked(true);
                return this.setStepPoint(2); break;
            case 'monitoring':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animatePhotoCycledLast(100);
                return this.setStepPoint(3); break;
            case 'limitations':
                this.animatePhotoOffset(100);
                this.animatePhotoCycled(100);
                this.animatePhotoCycledLast(100);
                return this.setStepPoint(4); break;
            case 'pedal':
                this.animatePhotoOffset(0);
                this.animatePhotoCycled(0);
                this.animatePhotoCycledLast(0);
                this.handleEngagedMocked(false);
                this.setStepPoint(0);
                return this.setStep('OB_OUTRO'); break;
        }
    }

    animatePhotoOffset(offset) {
        const { photoOffset } = this.state;
        Animated.timing(
            photoOffset,
            {
                toValue: offset,
                duration: 1000,
            }
        ).start();
    }

    animatePhotoCycled(offset) {
        const { photoCycled } = this.state;
        Animated.timing(
            photoCycled,
            {
                toValue: offset,
                duration: 800,
            }
        ).start();
    }

    animatePhotoCycledLast(offset) {
        const { photoCycledLast } = this.state;
        Animated.timing(
            photoCycledLast,
            {
                toValue: offset,
                duration: 800,
            }
        ).start();
    }

    animateLeadEntered(offset) {
        const { leadEntered } = this.state;
        Animated.timing(
            leadEntered,
            {
                toValue: offset,
                duration: 500,
            }
        ).start();
    }

    animateTouchGateHighlighted(amount) {
        const { gateHighlighted } = this.state;
        Animated.sequence([
          Animated.timing(
            gateHighlighted,
            {
              toValue: amount,
              duration: 300,
            }
          ),
          Animated.timing(
              gateHighlighted,
              {
                  toValue: 0,
                  duration: 500,
              }
          )
        ]).start()
    }

    handleWrongGatePressed() {
        this.animateTouchGateHighlighted(50);
    }

    handleEngagedMocked(shouldMock) {
        this.setState({ engagedMocked: shouldMock })
        if (shouldMock) {
            ChffrPlus.sendBroadcast("ai.comma.plus.frame.ACTION_ENGAGED_MOCKED");
        } else {
            ChffrPlus.sendBroadcast("ai.comma.plus.frame.ACTION_ENGAGED_UNMOCKED");
        }
    }

    renderSplashStep() {
        return (
            <X.Entrance style={ Styles.onboardingSplashView }>
                <X.Text
                    size='jumbo' color='white' weight='bold'
                    style={ Styles.onboardingStepHeader }>
                    Welcome to openpilot alpha
                </X.Text>
                <X.Text
                    color='white' weight='light'
                    style={ Styles.onboardingStepContext }>
                    Now that you’re all set up, it’s important to
                    understand the functionality and limitations of
                    openpilot as alpha software before testing.
                </X.Text>
                <View style={ Styles.onboardingPrimaryAction }>
                    <X.Button
                        color='setupPrimary'
                        onPress={ () => this.setStep('OB_INTRO') }>
                        Begin Training
                    </X.Button>
                </View>
            </X.Entrance>
        )
    }

    renderIntroStep() {
        const { stepChecks } = this.state;
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                <View style={ Styles.onboardingStepPoint }>
                    <View style={ Styles.onboardingStepPointChain }>
                        <X.Button
                            size='small' color='ghost'
                            style={ Styles.onboardingStepPointChainPrevious }
                            onPress={ () => this.setStep('OB_SPLASH') }>
                            <X.Image
                                source={ require('../../../img/icon_chevron_right.png') }
                                style={ Styles.onboardingStepPointChainPreviousIcon } />
                        </X.Button>
                        <View style={ Styles.onboardingStepPointChainNumber }>
                            <X.Text color='white' weight='semibold'>
                                1
                            </X.Text>
                        </View>
                    </View>
                    <View style={ Styles.onboardingStepPointBody }>
                        <X.Text size='bigger' color='white' weight='bold'>
                            openpilot is an advanced driver assistance system.
                        </X.Text>
                        <X.Text
                            size='smallish' color='white' weight='light'
                            style={ Styles.onboardingStepContextSmall }>
                            A driver assistance system is not a self driving car.
                            This means openpilot is designed to work with you,
                            not without you. Your attention is required to drive.
                        </X.Text>
                        <X.CheckboxField
                            size='small'
                            color='white'
                            isChecked={ stepChecks.includes(1) }
                            onPress={ () => this.handleIntroCheckboxPressed(1) }
                            label='I will keep my eyes on the road.' />
                        <X.CheckboxField
                            size='small'
                            color='white'
                            isChecked={ stepChecks.includes(2) }
                            onPress={ () => this.handleIntroCheckboxPressed(2) }
                            label='I will be ready to take over at any time.' />
                        <X.CheckboxField
                            size='small'
                            color='white'
                            isChecked={ stepChecks.includes(3) }
                            onPress={ () => this.handleIntroCheckboxPressed(3) }
                            label='I will be ready to take over at any time!' />
                    </View>
                </View>
            </X.Entrance>
        )
    }

    renderSensorsStepPointIndex() {
        const { stepChecks } = this.state;
        return (
            <View style={ Styles.onboardingStepPoint }>
                <View style={ Styles.onboardingStepPointChain }>
                    <X.Button
                        size='small' color='ghost'
                        style={ Styles.onboardingStepPointChainPrevious }
                        onPress={ () => this.setStep('OB_INTRO') }>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointChainPreviousIcon } />
                    </X.Button>
                    <View style={ Styles.onboardingStepPointChainNumber }>
                        <X.Text color='white' weight='semibold'>
                            2
                        </X.Text>
                    </View>
                </View>
                <View style={ Styles.onboardingStepPointBody }>
                    <X.Text size='bigger' color='white' weight='bold'>
                        openpilot uses multiple sensors to see the road ahead.
                    </X.Text>
                    <X.Text
                        size='smallish' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmall }>
                        Before any signals are sent to control your car,
                        sensors are fused to construct a scene of the road.
                    </X.Text>
                    <X.RadioField
                        size='big'
                        color='white'
                        isChecked={ stepChecks.includes('camera') }
                        hasAppend={ true }
                        onPress={ () => this.handleSensorRadioPressed('camera') }
                        label='Camera from EON' />
                    <X.RadioField
                        size='big'
                        color='white'
                        isDisabled={ !stepChecks.includes('camera') }
                        isChecked={ stepChecks.includes('radar') }
                        hasAppend={ true }
                        onPress={ () => this.handleSensorRadioPressed('radar') }
                        label='Radar from your car' />
                </View>
            </View>
        )
    }

    renderSensorsStepPointCamera() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Button
                    size='small' color='ghost' textWeight='light'
                    style={ Styles.onboardingStepPointCrumb }
                    onPress={ () => this.handleSensorRadioPressed('index') }>
                    openpilot sensors
                </X.Button>
                <X.Text size='medium' color='white' weight='bold'>
                    Camera from EON
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    A vision algorithm leverages EON’s road-facing
                    camera to determine the path to drive.
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    The lane lines are drawn with varying widths to
                    reflect the confidence in finding your lane.
                </X.Text>
                <X.Button color='ghost'
                    style={ Styles.onboardingStepPointInstruction }
                    onPress={ () => this.animateTouchGateHighlighted(100) }>
                    <X.Text
                        size='small' color='white' weight='semibold'
                        style={ Styles.onboardingStepPointInstructionText }>
                        Select path to continue
                    </X.Text>
                    <X.Image
                      source={ require('../../../img/icon_chevron_right.png') }
                      style={ Styles.onboardingStepPointInstructionIcon } />
                </X.Button>
            </X.Entrance>
        )
    }

    renderSensorsStepPointRadar() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Button
                    size='small' color='ghost' textWeight='light'
                    style={ Styles.onboardingStepPointCrumb }
                    onPress={ () => this.handleSensorRadioPressed('index') }>
                    openpilot sensors
                </X.Button>
                <X.Text size='medium' color='white' weight='bold'>
                    Radar from your car
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    The stock radar in your car helps openpilot measure
                    the lead car distance for longitudinal control.
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    The indicator is drawn either red or yellow to
                    illustrate relative speed to the lead car.
                </X.Text>
                <X.Button color='ghost'
                    style={ Styles.onboardingStepPointInstruction }
                    onPress={ () => this.handleWrongGatePressed() }>
                    <X.Text
                        size='small' color='white' weight='semibold'
                        style={ Styles.onboardingStepPointInstructionText }>
                        Select lead car indicator
                    </X.Text>
                    <X.Image
                        source={ require('../../../img/icon_chevron_right.png') }
                        style={ Styles.onboardingStepPointInstructionIcon } />
                </X.Button>
            </X.Entrance>
        )
    }

    renderSensorsStepPoint() {
        const { stepPoint } = this.state;
        switch (stepPoint) {
            case 0:
                return this.renderSensorsStepPointIndex(); break;
            case 1:
                return this.renderSensorsStepPointCamera(); break;
            case 2:
                return this.renderSensorsStepPointRadar(); break;
        }
    }

    renderSensorsStep() {
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                { this.renderSensorsStepPoint() }
            </X.Entrance>
        )
    }

    renderControlsStepPointIndex() {
        const { stepChecks } = this.state;
        return (
            <View style={ Styles.onboardingStepPoint }>
                <View style={ Styles.onboardingStepPointChain }>
                    <X.Button
                        size='small' color='ghost'
                        style={ Styles.onboardingStepPointChainPrevious }
                        onPress={ () => this.setStep('OB_SENSORS') }>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointChainPreviousIcon } />
                    </X.Button>
                    <View style={ Styles.onboardingStepPointChainNumber }>
                        <X.Text color='white' weight='semibold'>
                            3
                        </X.Text>
                    </View>
                </View>
                <View style={ Styles.onboardingStepPointBody }>
                    <X.Text size='bigger' color='white' weight='bold'>
                        openpilot will start driving when cruise control is set.
                    </X.Text>
                    <X.Text
                        size='smallish' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmall }>
                        Press cruise to engage and a pedal to disengage.
                    </X.Text>
                    <X.RadioField
                        color='white'
                        isChecked={ stepChecks.includes('cruise') }
                        hasAppend={ true }
                        onPress={ () => this.handleControlsRadioPressed('cruise') }
                        label='Engage openpilot' />
                    <X.RadioField
                        color='white'
                        isDisabled={ !stepChecks.includes('cruise') }
                        isChecked={ stepChecks.includes('monitoring') }
                        hasAppend={ true }
                        onPress={ () => this.handleControlsRadioPressed('monitoring') }
                        label='Driver Monitoring' />
                    <X.RadioField
                        color='white'
                        isDisabled={ !stepChecks.includes('monitoring') }
                        isChecked={ stepChecks.includes('limitations') }
                        hasAppend={ true }
                        onPress={ () => this.handleControlsRadioPressed('limitations') }
                        label='Limited Features' />
                    <X.RadioField
                        color='white'
                        isDisabled={ !stepChecks.includes('limitations') }
                        isChecked={ stepChecks.includes('pedal') }
                        hasAppend={ true }
                        onPress={ () => this.handleControlsRadioPressed('pedal') }
                        label='Disengage openpilot' />
                </View>
            </View>
        )
    }

    renderControlsStepPointEngage() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Button
                    size='small' color='ghost' textWeight='light'
                    style={ Styles.onboardingStepPointCrumb }
                    onPress={ () => this.handleControlsRadioPressed('index') }>
                    openpilot controls
                </X.Button>
                <X.Text size='medium' color='white' weight='bold'>
                    Engage openpilot
                </X.Text>
                <X.Text
                    size='small' color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    When you are ready to engage openpilot at a comfortable
                    speed, locate the cruise controls on your steering wheel
                    and press "SET" to begin.
                </X.Text>
                <X.Button color='ghost'
                    style={ Styles.onboardingStepPointInstruction }
                    onPress={ () => this.handleWrongGatePressed() }>
                    <X.Text
                        size='small' color='white' weight='semibold'
                        style={ Styles.onboardingStepPointInstructionText }>
                        Tap "SET" to engage
                    </X.Text>
                    <X.Image
                        source={ require('../../../img/icon_chevron_right.png') }
                        style={ Styles.onboardingStepPointInstructionIcon } />
                </X.Button>
            </X.Entrance>
        )
    }

    renderControlsStepPointMonitoring() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleControlsRadioPressed('index') }>
                        openpilot controls
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        Driver Monitoring
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        When openpilot is engaged, you must always pay attention!
                        openpilot monitors awareness with 3D facial reconstruction
                        and pose. Distracted drivers are alerted, then disengaged
                        from openpilot until corrected.
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            Select face to continue
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderControlsStepPointLimitations() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleControlsRadioPressed('index') }>
                        openpilot controls
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        Limited Features
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        Keep in mind that certain situations are not handled by
                        openpilot. Scenarios such as traffic lights, stop signs,
                        quick vehicle cutins and pedestrians are unrecognized
                        and openpilot may accelerate.
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            Select light to continue
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderControlsStepPointDisengage() {
        return (
            <X.Entrance
                transition='fadeInLeft'
                duration={ 1000 }
                style={ Styles.onboardingStepPointSmall }>
                <X.Entrance>
                    <X.Button
                        size='small' color='ghost' textWeight='light'
                        style={ Styles.onboardingStepPointCrumb }
                        onPress={ () => this.handleControlsRadioPressed('index') }>
                        openpilot controls
                    </X.Button>
                    <X.Text size='medium' color='white' weight='bold'>
                        Disengage openpilot
                    </X.Text>
                    <X.Text
                        size='small' color='white' weight='light'
                        style={ Styles.onboardingStepContextSmaller }>
                        While openpilot is engaged, you may keep your hands
                        on the wheel to override lateral controls. Longitudinal
                        controls will be managed by openpilot until the gas
                        or brake pedal is pressed to disengage.
                    </X.Text>
                    <X.Button color='ghost'
                        style={ Styles.onboardingStepPointInstruction }
                        onPress={ () => this.handleWrongGatePressed() }>
                        <X.Text
                            size='small' color='white' weight='semibold'
                            style={ Styles.onboardingStepPointInstructionText }>
                            Tap a pedal to disengage
                        </X.Text>
                        <X.Image
                            source={ require('../../../img/icon_chevron_right.png') }
                            style={ Styles.onboardingStepPointInstructionIcon } />
                    </X.Button>
                </X.Entrance>
            </X.Entrance>
        )
    }

    renderControlsStepPoint() {
        const { stepPoint } = this.state;
        switch (stepPoint) {
            case 0:
                return this.renderControlsStepPointIndex(); break;
            case 1:
                return this.renderControlsStepPointEngage(); break;
            case 2:
                return this.renderControlsStepPointMonitoring(); break;
            case 3:
                return this.renderControlsStepPointLimitations(); break;
            case 4:
                return this.renderControlsStepPointDisengage(); break;
        }
    }

    renderControlsStep() {
        return (
            <X.Entrance style={ Styles.onboardingStep }>
                { this.renderControlsStepPoint() }
            </X.Entrance>
        )
    }

    renderOutroStep() {
        return (
            <X.Entrance style={ Styles.onboardingOutroView }>
                <X.Text
                    size='jumbo' color='white' weight='bold'
                    style={ Styles.onboardingStepHeader }>
                    Congratulations! You have completed openpilot training.
                </X.Text>
                <X.Text
                    color='white' weight='light'
                    style={ Styles.onboardingStepContextSmaller }>
                    This guide can be replayed at any time from the
                    EON settings. To learn more about openpilot, read the
                    wiki and join the community at discord.comma.ai
                </X.Text>
                <X.Line color='transparent' spacing='small' />
                <View style={ Styles.onboardingActionsRow }>
                    <View style={ Styles.onboardingPrimaryAction }>
                        <X.Button
                            color='setupPrimary'
                            onPress={ this.props.completeTrainingStep }>
                            Finish Training
                        </X.Button>
                    </View>
                    <View style={ Styles.onboardingSecondaryAction }>
                        <X.Button
                            color='setupInverted'
                            textColor='white'
                            onPress={ this.handleRestartPressed }>
                            Restart
                        </X.Button>
                    </View>
                </View>
            </X.Entrance>
        )
    }

    renderStep() {
        const { step } = this.state;
        switch (step) {
            case Step.OB_SPLASH:
                return this.renderSplashStep(); break;
            case Step.OB_INTRO:
                return this.renderIntroStep(); break;
            case Step.OB_SENSORS:
                return this.renderSensorsStep(); break;
            case Step.OB_CONTROLS:
                return this.renderControlsStep(); break;
            case Step.OB_OUTRO:
                return this.renderOutroStep(); break;
        }
    }

    render() {
        const {
            step,
            stepPoint,
            stepChecks,
            photoOffset,
            photoCycled,
            photoCycledLast,
            leadEntered,
            engagedMocked,
            gateHighlighted,
        } = this.state;

        const overlayStyle = [
            Styles.onboardingOverlay,
            stepPoint > 0 ? Styles.onboardingOverlayCollapsed : null,
        ];

        const gradientColor = engagedMocked ? 'engaged_green' : 'dark_blue';

        const Animations = {
            leadIndicatorDescended: {
                transform: [{
                    translateY: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 40]
                    })
                }, {
                    translateX: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, -10]
                    })
                }, {
                    scaleX: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 1.5]
                    })
                }, {
                    scaleY: photoCycled.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 1.5]
                    })
                }]
            },
        };


        return (
            <View style={ Styles.onboardingContainer }>
                <Animated.Image
                    source={ require('../../../img/photo_baybridge_a_01.jpg') }
                    style={ [Styles.onboardingPhoto, {
                        transform: [{
                            translateX: photoOffset.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, -50]
                            })
                        }],
                    }] }>
                    <Animated.Image
                        source={ require('../../../img/illustration_training_lane_01.png') }
                        style={ [Styles.onboardingVisualLane, {
                            opacity: photoOffset.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, 1],
                            })
                        }] } />
                    <Animated.Image
                        source={ require('../../../img/illustration_training_lane_01.png') }
                        tintColor='lime'
                        pointerEvents='none'
                        style={ [Styles.onboardingVisualLane, {
                            opacity: gateHighlighted.interpolate({
                                inputRange: [0, 100],
                                outputRange: [0, 1],
                            })
                        }] }>
                        { stepPoint == 1 ? (
                            <X.Button
                                onPress={ () => { this.handleSensorVisualPressed('camera') } }
                                style={ [Styles.onboardingVisualLaneTouchGate] } />
                        ) : null }
                    </Animated.Image>

                    { (step === 'OB_SENSORS' && stepPoint > 1) ? (
                        <View style={ Styles.onboardingVisuals }>
                            <Animated.Image
                                source={ require('../../../img/photo_baybridge_b_01.jpg') }
                                style={ [Styles.onboardingPhotoCycled, {
                                    opacity: photoCycled.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: [0, 1],
                                    })
                                }] } />
                            <Animated.Image
                                source={ require('../../../img/illustration_training_lane_02.png') }
                                style={ [Styles.onboardingVisualLaneZoomed, {
                                    opacity: photoCycled.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: [0, 1],
                                    })
                                }] }>
                            </Animated.Image>
                            <Animated.Image
                                source={ require('../../../img/illustration_training_lead_01.png') }
                                style={ [Styles.onboardingVisualLead,
                                    Animations.leadIndicatorDescended ] } />
                            <Animated.Image
                                source={ require('../../../img/illustration_training_lead_02.png') }
                                style={ [Styles.onboardingVisualLead,
                                    Styles.onboardingVisualLeadZoomed,
                                    Animations.leadIndicatorDescended, {
                                    opacity: photoCycled.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: [0, 1]
                                    }),
                                }] } />
                            <Animated.View
                                style={ [Styles.onboardingVisualLeadTouchGate,
                                    Animations.leadIndicatorDescended, {
                                      opacity: gateHighlighted.interpolate({
                                          inputRange: [0, 100],
                                          outputRange: [0, 1],
                                      }),
                                    }] }>
                                <X.Button
                                    style={ Styles.onboardingVisualLeadTouchGateButton }
                                    onPress={ () => { this.handleSensorVisualPressed('radar') } } />
                            </Animated.View>
                        </View>
                    ) : null }

                    { step === 'OB_CONTROLS' ? (
                        <View style={ Styles.onboardingVisuals }>
                            <Animated.Image
                                source={ require('../../../img/photo_wheel_buttons_01.jpg') }
                                style={ [Styles.onboardingPhotoCruise] }>
                                { stepPoint == 1 ? (
                                    <Animated.View
                                      style={ [{
                                        opacity: gateHighlighted.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: [0, 1],
                                        }),
                                      }] }>
                                        <X.Button
                                            style={ Styles.onboardingVisualCruiseTouchGate }
                                            onPress={ () => { this.handleControlsVisualPressed('cruise') } } />
                                    </Animated.View>
                                ) : null }
                            </Animated.Image>
                            { stepPoint == 2 ? (
                                <Animated.Image
                                    source={ require('../../../img/photo_monitoring_01.jpg') }
                                    style={ [Styles.onboardingPhotoCycled, {
                                        opacity: photoCycled.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: [0, 1],
                                        }),
                                    }] }>
                                    <Animated.View style={ [Styles.onboardingFaceTouchGate, {
                                      opacity: gateHighlighted.interpolate({
                                          inputRange: [0, 100],
                                          outputRange: [0, 1],
                                      }),
                                    }]}>
                                        <X.Button
                                            style={ Styles.onboardingPedalTouchGateButton }
                                            onPress={ () => { this.handleControlsVisualPressed('monitoring') } } />
                                    </Animated.View>
                                </Animated.Image>
                            ) : null }
                            { stepPoint == 3 ? (
                                <Animated.Image
                                    source={ require('../../../img/photo_traffic_light_01.jpg') }
                                    style={ [Styles.onboardingPhotoCycled, {
                                        opacity: photoCycled.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: [0, 1],
                                        }),
                                    }] }>
                                    <Animated.View style={ [Styles.onboardingLightTouchGate, {
                                      opacity: gateHighlighted.interpolate({
                                          inputRange: [0, 100],
                                          outputRange: [0, 1],
                                      }),
                                    }]}>
                                        <X.Button
                                            style={ Styles.onboardingPedalTouchGateButton }
                                            onPress={ () => { this.handleControlsVisualPressed('limitations') } } />
                                    </Animated.View>
                                </Animated.Image>
                            ) : null }
                            { stepPoint == 4 ? (
                                <View style={ Styles.onboardingVisuals }>
                                    <Animated.Image
                                        source={ require('../../../img/photo_traffic_light_01.jpg') }
                                        style={ [Styles.onboardingPhotoCycled] } />
                                    <Animated.Image
                                        source={ require('../../../img/photo_pedals_01.jpg') }
                                        style={ [Styles.onboardingPhotoCycled, {
                                            opacity: photoCycledLast.interpolate({
                                                inputRange: [0, 100],
                                                outputRange: [0, 1],
                                            }),
                                        }] }>
                                        <Animated.View style={ [Styles.onboardingBrakePedalTouchGate, {
                                          opacity: gateHighlighted.interpolate({
                                              inputRange: [0, 100],
                                              outputRange: [0, 1],
                                          }),
                                        }]}>
                                            <X.Button
                                                style={ Styles.onboardingPedalTouchGateButton }
                                                onPress={ () => { this.handleControlsVisualPressed('pedal') } } />
                                        </Animated.View>
                                        <Animated.View style={ [Styles.onboardingGasPedalTouchGate, {
                                          opacity: gateHighlighted.interpolate({
                                              inputRange: [0, 100],
                                              outputRange: [0, 1],
                                          }),
                                        }] }>
                                            <X.Button
                                                style={ Styles.onboardingPedalTouchGateButton }
                                                onPress={ () => { this.handleControlsVisualPressed('pedal') } } />
                                        </Animated.View>
                                    </Animated.Image>
                                </View>
                            ) : null }
                        </View>
                    ) : null }

                    <Animated.View
                        style={ [...overlayStyle, {
                            transform: [{
                                translateX: photoOffset.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 50]
                                })
                            }],
                        }] }>
                        <X.Gradient
                            color={ gradientColor }>
                            { this.renderStep() }
                        </X.Gradient>
                    </Animated.View>
                </Animated.Image>
            </View>
        )
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    completeTrainingStep: completeTrainingStep('Onboarding', dispatch),
    restartTraining: () => {
        onTrainingRouteCompleted('Onboarding');
    },
    onSidebarCollapsed: () => {
        ChffrPlus.sendBroadcast("ai.comma.plus.frame.ACTION_SIDEBAR_COLLAPSED");
    },
    onSidebarExpanded: () => {
        ChffrPlus.sendBroadcast("ai.comma.plus.frame.ACTION_SIDEBAR_EXPANDED");
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
