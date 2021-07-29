import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './main.css'
import Category from '../components/categoryTemplate/category'
import Modal from '../components/modal/modal'
import { getAllCategory } from '../components/storage/actions'

const MainScreen = () => {
    const dispatch = useDispatch()
    const category = useSelector((state) => state.goals.allCategory)

    useEffect(() => {
        dispatch(getAllCategory())
    }, [dispatch])
    
    const mapCategory = category.map((data, i) => {
        return <Category data={data} key={i} />
    })

    return (
        <>
            <div className='main'>
                <div className='main__container'>
                    {mapCategory}
                </div>
            </div>
            <Modal />
        </>
    )
}

export default MainScreen