import React from 'react'
import firebase from 'firebase'

import './header.css'

const Header = () => {

    const modalHandler = () => {
        const modal = document.querySelector('.modal')
        const overlay = document.querySelector('.overlay')
        modal.classList.add('active')
        overlay.classList.add('active')
    }

    const weekHandler = () => {
        firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc('TODAY').set({ date: new Date().toISOString(), dueDate: new Date().toISOString()})
    }

    return (
        <div className='header'>
            <div className='header__container'>
                <div className='left'>
                    <h1>WORKMANAGER</h1>
                </div>
                <div className='right'>
                    <button className='btn' onClick={modalHandler}><i class="far fa-plus-square fa-3x" ></i></button>
                    <button className='btn' onClick={weekHandler}>TODAY</button>
                </div>
            </div>
        </div>
    )
}

export default Header