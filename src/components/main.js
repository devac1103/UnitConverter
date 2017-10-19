import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    Image,
    StyleSheet,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Actions, Scene, Router } from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthAction from '../actions/auth';
import { Colors, Device, FontSize } from '../lib/device-info';

import { Dropdown } from 'react-native-material-dropdown';

// map redux store to props
function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
}

// map actions to props
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            Auth: bindActionCreators(AuthAction, dispatch),
        }
    }
}

let lengthRatio = {
    Kilometer: 1000,
    Meter: 1,
    Centimeter: 1/100,
    Millimeter: 1/1000,
    Mile: 1609.344,
    Yard: 0.9144,
    Feet: 0.3048,
    Inch: 0.0254
};

let massRatio = {
    Kilogram: 1000,
    Gram: 1,
    Milligram: 1/1000,
    Microgram: 1/1000000,
    USTon: 1000000,
    Pound: 453.592,
    Ounce: 28.35
};

let tempRatio = {
    Fahrenheit: 9/5,
    Celsius: 1
}

class Main extends Component {

    constructor(props) {
        super(props);

        this.onUnitChanged = this.onUnitChanged.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onInValueFocused = this.onInValueFocused.bind(this);
        this.onOutValueFocused = this.onOutValueFocused.bind(this);
        this.inUnitRef = this.updateRef.bind(this, 'inUnit');
        this.outUnitRef = this.updateRef.bind(this, 'outUnit');
        this.inValueRef = this.updateRef.bind(this, 'inValue');
        this.outValueRef = this.updateRef.bind(this, 'outValue');

        this.state = {
            tabIndex: 0,
            inValue: '',
            outValue: '',
            inUnit: '',
            outUnit: '',
        };
    }

    componentDidMount() {
        if (this.state.tabIndex == 0) {
            this.setState({
                inUnit: 'Meter',
                outUnit: 'Meter',
            });
        } else if (this.state.tabIndex == 1) {
            this.setState({
                inUnit: 'Kilogram',
                outUnit: 'Kilogram',
            });
        } else {
            this.setState({
                inUnit: 'Fahrenheit',
                outUnit: 'Fahrenheit',
            });
        }
    }

    calculateOutput() {
        let { inUnit, outUnit, inValue, outValue } = this.state;
        let ratio;
        if (this.state.tabIndex == 0) {
            ratio = lengthRatio[inUnit] / lengthRatio[outUnit];   
        } else if (this.state.tabIndex == 1) {
            ratio = massRatio[inUnit] / massRatio[outUnit];
        } else {
            ratio = tempRatio[inUnit] / tempRatio[outUnit];
        }
        if (this.state.tabIndex != 2) {
            this.setState({
                outValue: inValue * ratio + "",
            });
        } else {
            if (ratio == 5/9) {
                this.setState({
                    outValue: inValue / ratio + 32 + "",
                });
            } else if (ratio == 9/5) {
                this.setState({
                    outValue: (inValue - 32) / ratio + "",
                });
            } else {
                this.setState({
                    outValue: inValue + "",
                });
            }
        }
    }

    onTextChanged(text) {
        ['inValue', 'outValue']
            .map((name) => ({ name, ref: this[name]}))
            .filter(({ ref }) => ref && ref.isFocused())
            .forEach(({ name, ref }) => {
                this.setState({ [name]: text}, () => {
                    this.calculateOutput();
                });
            });
    }

    onInValueFocused() {
        this.setState({
            inValue: '',
        })
    }

    onOutValueFocused() {
        this.setState({
            outValue: '',
        })
    }

    onUnitChanged(text) {
        ['inUnit', 'outUnit']
            .map((name) => ({ name, ref: this[name]}))
            .filter(({ ref }) => ref && ref.isFocused())
            .forEach(({ name, ref }) => {
                this.setState({ [name]: text});
                this.calculateOutput(text);
            });
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    onLengthClicked() {
        console.log('Length Clicked');
        this.setState({
            tabIndex: 0,
            inValue: '',
            outValue: '',
        });
        this.setState({
            inUnit: 'Meter',
            outUnit: 'Meter',
        });
    }

    onMassClicked() {
        console.log('Mass Clicked');
        this.setState ({
            tabIndex: 1,
            inValue: '',
            outValue: '',
        });
        this.setState({
            inUnit: 'Kilogram',
            outUnit: 'Kilogram',
        });
    }

    onTempClicked() {
        console.log('Temp Clicked');
        this.setState({
            tabIndex: 2,
            inValue: '',
            outValue: '',
        });
        this.setState({
            inUnit: 'Fahrenheit',
            outUnit: 'Fahrenheit',
        });
    }

    render() {
        let lengthData = [{
                value: 'Kilometer',
            }, {
                value: 'Meter',
            }, {
                value: 'Centimeter',
            }, {
                value: 'Millimeter',
            }, {
                value: 'Mile',
            }, {
                value: 'Yard',
            }, {
                value: 'Feet',
            }, {
                value: 'Inch',
            }];

        let massData = [{
                value: 'Kilogram',
            }, {
                value: 'Gram',
            }, {
                value: 'Milligram',
            }, {
                value: 'Microgram',
            }, {
                value: 'USTon',
            }, {
                value: 'Pound',
            }, {
                value: 'Ounce',
            }];

        let tempData = [{
                value: 'Fahrenheit',
            }, {
                value: 'Celsius',
            }];

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.text}>Unit Converter</Text>
                </View>
                <View style={styles.tabBar}>
                    <TouchableOpacity onPress={() => this.onLengthClicked()} style={[styles.tabBarItem, (this.state.tabIndex == 0) && styles.tabBarBorder]}>
                        <View>
                            <Text style={styles.textTabBarItem}>
                                Length
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onMassClicked()} style={[styles.tabBarItem, (this.state.tabIndex == 1) && styles.tabBarBorder]}>
                        <View>
                            <Text style={styles.textTabBarItem}>
                                Mass
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onTempClicked()} style={[styles.tabBarItem, (this.state.tabIndex == 2) && styles.tabBarBorder]}>
                        <View>
                            <Text style={styles.textTabBarItem}>
                                Temp
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentArea}>
                    <View>
                        <Text style={styles.description}>From:</Text>
                    </View>
                    <View style={styles.contentField}>
                        <View style={styles.inputTextArea}>
                            <TextInput
                                ref={this.inValueRef}
                                style={styles.textIn}
                                underlineColorAndroid='transparent'
                                keyboardType="numeric"
                                maxLength={10}
                                placeholder="0"
                                value={this.state.inValue}
                                onChangeText={this.onTextChanged}
                                onFoucs={this.onInValueFocused} 
                            />
                        </View>
                        {
                            (this.state.tabIndex == 0) &&
                            <Dropdown
                                ref={this.inUnitRef}
                                value={this.state.inUnit}
                                onChangeText={this.onUnitChanged}
                                label='From Unit'
                                labelHeight={12}
                                data={lengthData}
                                itemPadding={5}
                                textColor="white"
                                itemColor="black"
                                selectedItemColor="red"
                                baseColor="red"
                                containerStyle={styles.valueList}
                            />
                        }
                        {
                            (this.state.tabIndex == 1) &&
                            <Dropdown
                                ref={this.inUnitRef}
                                value={this.state.inUnit}
                                onChangeText={this.onUnitChanged}
                                label='From Unit'
                                labelHeight={12}
                                data={massData}
                                itemPadding={5}
                                textColor="white"
                                itemColor="black"
                                selectedItemColor="red"
                                baseColor="red"
                                containerStyle={styles.valueList}
                            />
                        }
                        {
                            (this.state.tabIndex == 2) &&
                            <Dropdown
                                ref={this.inUnitRef}
                                value={this.state.inUnit}
                                onChangeText={this.onUnitChanged}
                                label='From Unit'
                                labelHeight={12}
                                data={tempData}
                                itemPadding={5}
                                textColor="white"
                                itemColor="black"
                                selectedItemColor="red"
                                baseColor="red"
                                containerStyle={styles.valueList}
                            />
                        }
                    </View>
                    <View>
                        <Text style={styles.description}>To:</Text>
                    </View>
                    <View style={styles.contentField}>
                        <View style={styles.inputTextArea}>
                            <TextInput
                                ref={this.outValueRef}
                                style={styles.textIn}
                                underlineColorAndroid='transparent'
                                keyboardType="numeric"
                                maxLength={10}
                                placeholder="0"
                                value={this.state.outValue}
                                onChangeText={this.onTextChanged}
                                onFoucs={this.onOutValueFocused}
                            />
                        </View>
                        {
                            (this.state.tabIndex == 0) &&
                            <Dropdown
                                ref={this.outUnitRef}
                                value={this.state.outUnit}
                                onChangeText={this.onUnitChanged}
                                label='To Unit'
                                labelHeight={12}
                                data={lengthData}
                                itemPadding={5}
                                textColor="white"
                                itemColor="black"
                                selectedItemColor="blue"
                                baseColor="blue"
                                containerStyle={styles.valueList}
                            />
                        }
                        {
                            (this.state.tabIndex == 1) &&
                            <Dropdown
                                ref={this.outUnitRef}
                                value={this.state.outUnit}
                                onChangeText={this.onUnitChanged}
                                label='To Unit'
                                labelHeight={12}
                                data={massData}
                                itemPadding={5}
                                textColor="white"
                                itemColor="black"
                                selectedItemColor="blue"
                                baseColor="blue"
                                containerStyle={styles.valueList}
                            />
                        }
                        {
                            (this.state.tabIndex == 2) &&
                            <Dropdown
                                ref={this.outUnitRef}
                                value={this.state.outUnit}
                                onChangeText={this.onUnitChanged}
                                label='To Unit'
                                labelHeight={12}
                                data={tempData}
                                itemPadding={5}
                                textColor="white"
                                itemColor="black"
                                selectedItemColor="blue"
                                baseColor="blue"
                                containerStyle={styles.valueList}
                            />
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Device.width,
        height: Device.height,
        backgroundColor: '#F5FCFF',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Device.width,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.black,
    },
    text: {
        color: Colors.white,
        fontSize: FontSize.size20,
        fontWeight: '900',
    },
    tabBar: {
        position: 'absolute',
        top: 50,
        left: 0,
        flexDirection: 'row',
        width: Device.width,
        height: 50,
        backgroundColor: Colors.black,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabBarItem: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBarBorder: {
        borderBottomWidth: 5,
        borderBottomColor: Colors.darkGreyColor,
    },
    textTabBarItem: {
        textAlign: 'center',
        color: Colors.white,
    },
    contentArea: {
        position: 'absolute',
        top: 100,
        width: Device.width,
        height: Device.height - 100,
        paddingTop: 40,
    },
    description: {
        marginLeft: 10,
        color: Colors.black,
        fontSize: FontSize.size20,
        fontWeight: '900',
    },
    contentField: {
        flexDirection: 'row',
        height: 50,
        width: Device.width,
        marginVertical: 10,
        marginHorizontal: 10,
    },
    valueList: {
        // flex: 1,
        width: Device.width / 2 - 10,
        padding: 8,
        borderBottomWidth: 2,
        borderBottomColor: Colors.black,
        backgroundColor: Colors.black,
    },
    inputTextArea: {
        // flex: 1,
        height: 50,
        width: Device.width / 2 - 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.black,
        // backgroundColor: Colors.black,
    },
    textIn: {
        width: Device.width / 2 - 10,
        color: Colors.black,
        textAlign: 'center',
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
