import React, { useState } from 'react'
import firebase from 'firebase'


import './modal.css'

const Modal = () => {
    const [category, setCategory] = useState('')
    const [dueDate, setDueDate] = useState(null)

    const onInputChange = (e) => {
        setCategory(e.target.value)
    }

    const exitHandler = () => {
        const overlay = document.querySelector('.overlay')
        const modal = document.querySelector('.modal')
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }

    const submitHandler = () => {
        if (category.length !== 0 && category.length < 30 && dueDate) {
            firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(category).set({ date: new Date().toISOString(), dueDate: dueDate})
            exitHandler()
            setCategory('')
            setDueDate(null)
        } 
        }
        
    return (
        <>
            <div className='modal'>
                <div className='modal__container'>
                    <h1>New Category</h1>
                    <input type='default' onChange={onInputChange} value={category} />
                    <button className='submit' onClick={submitHandler}><i class="fas fa-plus-circle fa-2x"></i></button>
                    <button className='exit' onClick={exitHandler}><i class="fas fa-times fa-2x"></i></button>
                    <div className='modal__container-date_input'>
                        <p className='para'>Due date:</p>
                        <input type='date' className='date_input' onChange={(e) => {setDueDate(e.target.value)}}/>
                    </div>
                    
                </div>
            </div>
            <div className='overlay'>

            </div>
        </>
    )
}

export default Modal