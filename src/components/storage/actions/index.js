import firebase from "firebase";

export const getAllCategory = () => async (dispatch) => {
    firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((doc) => {
            return {id: doc.id, date: doc.data().date, dueDate: doc.data().dueDate }
        })
        dispatch({ type: 'ALL_CATEGORY', data: docs })
    }
    )
}

export const getAllGoals = (name) => async (dispatch) => {
    firebase.firestore().collection('todo').doc(firebase.auth().currentUser.uid).collection('category').doc(name).collection('goals').orderBy("time", "asc").get().then((snapshot) => {
        const data = snapshot.docs.map((snap) => {
            return { ...snap.data(), id: snap.id }
        })
        dispatch({ type: 'ALL_GOALS', data: data, category: name })
    })
}