import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Actions, Scene, Router } from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthAction from '../actions/auth';

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

class Init extends Component {
    componentDidMount() {
        setTimeout(() => {
            Actions.main();
        }, 500);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textLogo}>Unit Converter</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    textLogo: {
        fontSize: 48,
        color: 'black',
        fontWeight: '900',
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Init);
