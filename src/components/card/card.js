import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import firebase from 'firebase'
import moment from 'moment'

import './card.css'
import '../noteModal/note.css'
import { getAllGoals } from '../storage/actions'

const Card = ({ data, name }) => {
    const dispatch = useDispatch()
    const card = useRef()
    const noteContainer = useRef()
    const noteOverlay = useRef()
    const noteInput = useRef()
    const notePara = useRef()
    const [note, setNote] = useState('')
    const [parentId, setParentId] = useState(null)

    useEffect(() => {
        if (data?.deadLine && data?.deadLine < new Date().toTimeString()) {
            firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(name).collection('goals').doc(data.id).delete()
            dispatch(getAllGoals(name))
        }
    }, [name, data.id, data.deadLine, dispatch])

    const deleteGoals = () => {
        firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(name).collection('goals').doc(data.id).delete()
        dispatch(getAllGoals(name))
    }
 
    const openNoteHandler = useCallback(() => {
        noteContainer.current.classList.add('active')
        noteOverlay.current.classList.add('active')
    }, [noteContainer, noteOverlay])

    const exitHandler = useCallback(() => {
        noteContainer.current.classList.remove('active')
        noteOverlay.current.classList.remove('active')
    }, [noteContainer, noteOverlay])

    const noteSubmitHandler = () => {
        firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(name).collection('goals').doc(data.id).update({
            note: note
        }).then(() => dispatch(getAllGoals(name)))
        noteInput.current.classList.remove('active')
        notePara.current.classList.remove('active')
        setNote('')
    }

    const onDragStart = (e) => {
        card.current.classList.add('dragging')
        setParentId(card.current.parentElement.dataset.id)
    }

    const onDragEnd = (e) => {
        card.current.classList.remove('dragging')
        if (card.current.parentElement.dataset.id !== name && card.current.dataset.id) {
            firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(parentId).collection('goals').doc(card.current.dataset.id).get().then((snap) => {
                if (snap.data()) {
                    firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(card.current.parentElement.dataset.id).collection('goals').add(snap.data())             
                    firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(parentId).collection('goals').doc(card.current.dataset.id).delete()
                    }
                })
        }
    }

    return (
        <>
        <div className='card' onClick={openNoteHandler} draggable='true' onDragStart={onDragStart} ref={card} onDragEnd={onDragEnd} data-id={data.id}>
            <p className='goal'>{data.goal}</p>
            <p className='time'>{moment(data.time).format('MMMM Do , h:mm a')}</p>
                {data.deadLine && <p className='deadline'>DeadLine: <span style={{ color: 'red' }}>{data?.deadLine}{data.deadLine.slice(0, 2) > 12 ? ' pm' : ' am'}</span></p>}
            <button className='btn'><i class="fas fa-trash fa-2x" onClick={deleteGoals}></i></button>
        </div>
        <div className='note
            ' ref={noteContainer}>
                <div className='note__container'> 
                    <div className='note__container-header'>
                        <h1 className='note__container-header-title'>{data.goal.slice(0, 20)}{data.goal.length > 20 ? '...' : ''}</h1>
                        <h3 className='note__container-header-time'>{moment(data.time).fromNow()}</h3>
                        <button className='note__container-header-btn' onClick={exitHandler}><i class="fas fa-times fa-2x"></i></button>
                    </div>
                    <div className='note__container-main'>
                        <h1 className='note__container-main-title' onClick={() => {
                            noteInput.current.classList.toggle('active')
                            notePara.current.classList.toggle('active')
                        }}>Add Notes  <i class="fas fa-pen-alt"></i></h1>
                        <div className='note__container-main-inputContainer' ref={noteInput}>
                            <textarea onChange={(e) => {
                                e.preventDefault()
                                setNote(e.target.value)
                            }} className='note__container-main-input'
                                value={note}
                                placeholder='...notes'
                            ></textarea>
                            <button className='note__container-main-btn' onClick={noteSubmitHandler}><i class="fas fa-arrow-right fa-2x"></i></button>
                        </div>
                        <p className='note__container-main-note' ref={notePara}>{data?.note}</p>
                    </div>
                </div>
        </div>
        <div className='note__overlay' ref={noteOverlay} onClick={exitHandler}>

        </div>
        </>
    )
}
export default Card