import React, {useState} from 'react'
import { Route, Router } from 'react-router'
import firebase from 'firebase/app';

import './app.css'
import Header from './components/header/header'
import History from './history'
import MainScreen from './screens/main'

const firebaseConfig = {
    apiKey: "AIzaSyBiRotVCKID0A-17Kj7MjlOcmEo5Im6GGc",
    authDomain: "work-manager-19fbb.firebaseapp.com",
    databaseURL: "https://work-manager-19fbb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "work-manager-19fbb",
    storageBucket: "work-manager-19fbb.appspot.com",
    messagingSenderId: "646665103505",
    appId: "1:646665103505:web:f1f29d1c8529d22b8af730",
    measurementId: "G-QR01VTSDT2"
};


if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        if (user === null) {
            setLoggedIn(false)
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res) => {
                console.log(res)
            }).catch(e => {
                console.log(e)
            })
        } else {
            setLoggedIn(true)
        }
    })

    if (loggedIn) {
        return (
            <Router history={History}>
                <Header />
                <Route component={MainScreen} to='/' />
            </Router>
        )
    }

    return (<div style={{display:'flex', width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#000'}}>
        <h1 style={{color: '#fff', fontSize: '70px', fontFamily: 'sans-serif'}}>WORKMANAGER</h1>
    </div>)
}

export default App