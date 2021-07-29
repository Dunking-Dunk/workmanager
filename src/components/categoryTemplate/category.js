import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import firebase from 'firebase'
import moment from 'moment'

import './category.css'
import Card from '../card/card'
import { getAllGoals } from '../storage/actions'

const Category = ({ data }) => {
    const dispatch = useDispatch()
    const [goals, setGoals] = useState('')
    const [deadLine, setDeadLine] = useState('')
    const allGoals = useSelector((state) => state.goals.allGoals[data.id])
    const add = useRef()
    const textarea = useRef()
    const submit = useRef()
    const container = useRef()
    const inputTime = useRef()

    useEffect(() => {
        dispatch(getAllGoals(data.id))
        if (moment(data.dueDate).format("MMM Do YY") < moment(new Date().toISOString()).format("MMM Do YY") && allGoals) {
            allGoals.forEach((val) => {
                firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(data.id).collection('goals').doc(val.id).delete()
            })
            firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(data.id).delete()
        }
    }, [dispatch, data])

    const addGoalHandler = useCallback(() => {
        add.current.classList.toggle('active')
        textarea.current.classList.toggle('active')
        submit.current.classList.toggle('active')
        inputTime.current.classList.toggle('active')
    }, [add, textarea, submit])

    const onSubmit = () => {
        if (goals.length !== 0) {
            firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(data.id).collection('goals').add({
                goal: goals,
                time: new Date().toISOString(),
                deadLine: deadLine
            }).then(() => {
                dispatch(getAllGoals(data.id))
                add.current.classList.remove('active')
                textarea.current.classList.remove('active')
                submit.current.classList.remove('active')
                inputTime.current.classList.remove('active')
                setGoals('')
            })
        }
    }

    const cardMap = allGoals?.map((val, i) => {
        return <Card data={val} key={i} name={data.id}/>
    })

    const deleteCategory = () => {
        if (allGoals.length !== 0) {
            allGoals?.forEach((val) => {
                firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(data.id).collection('goals').doc(val.id).delete()
            })
        }
        firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(data.id).delete()
    }

    const afterDragStart = (elem, y) => {
        const allElements = [...elem.current.querySelectorAll('.card:not(.dragging)')]
        return allElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return {offset: offset, element: child}
            }
            else {
                return closest
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }
    
    const onDragOver = (e) => {
        e.preventDefault()
        const afterDrag = afterDragStart(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterDrag === null) {
            container.current.appendChild(draggable)
        } else {
            container.current.insertBefore(draggable, afterDrag)
        }
    }

    return (
        <div className='categoryTemplate'>
            <div className='categoryTemplate__container' >
                <div className='categoryTemplate__container-header'>
                    <h1>{data.id}</h1>
                    <h3>{moment(data.date).format("MMM Do YY")}</h3>
                    <h3 style={{color: moment(data?.dueDate).format("MMM Do YY") > moment(new Date().toISOString()).format("MMM Do YY")? 'green':'red'}}>Due Date: {moment(data?.dueDate).format("MMM Do YY")}</h3>
                    <button className='categoryTemplate__container-header-btn' onClick={deleteCategory}><i class="fas fa-trash fa-2x"></i></button>
                </div>
                <div className='categoryTemplate__container-holder' onDragOver={onDragOver} ref={container} data-id={data.id}>
                    {cardMap}
                </div>
                <button className='categoryTemplate__container-add' onClick={addGoalHandler} ref={add}>Add Goals   <i class="fas fa-pen"></i></button>
                <textarea className='categoryTemplate__container-textarea' ref={textarea} onChange={e => setGoals(e.target.value)} value={goals} placeholder='...Goals'></textarea>
                <input type='time' name='time' className='categoryTemplate__container-inputTime' ref={inputTime} onChange={(e) => setDeadLine(e.target.value)} value={deadLine}/>
                <button className='categoryTemplate__container-submit' ref={submit} onClick={onSubmit}><i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    )
}

export default Category