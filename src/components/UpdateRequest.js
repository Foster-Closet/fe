import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Redirect, useParams } from 'react-router-dom'
import ItemsToChoose from './ItemsToChoose'
import Button from '@material-ui/core/Button'

const UpdateRequest = ({ auth }) => {
  const { id } = useParams()
  const [requestList, setRequestList] = useState([])
  const [items, setItems] = useState([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    axios
      .get('https://foster-closet.herokuapp.com/api/registry/', {
        headers: { Authorization: `Token ${auth}` }
      })
      .then((response) => {
        setRequestList(response.data)
      })
  }, [auth, id])

  const handleSubmit = () => {
    const newItems = items.map((item) => {
      const itemObj = { description: item.value }
      return itemObj
    })
    axios
      .put(
        `https://foster-closet.herokuapp.com/api/registry/${id}`,
        { items: newItems },
        { headers: { Authorization: `Token ${auth}` } }
      )
      .then((response) => {
        setSubmitted(true)
      })
  }

  const deleteItemsInRegistry = (itemToDelete) => {
    axios
      .delete(
        `https://foster-closet.herokuapp.com/api/item/${itemToDelete.id}`,
        {
          headers: { Authorization: `Token ${auth}` }
        }
      )
      .then((response) => {
        setRequestList(
          requestList.filter(
            (currentRegistry) => currentRegistry.id !== itemToDelete.id
          )
        )
      })
  }

  if (!auth) {
    return <Redirect to='/login' />
  }

  if (submitted) {
    return <Redirect to='/my-dashboard' />
  }

  const handleItems = (item) => {
    if (!items.some((current) => current.id === item.id)) {
      setItems([...items, item])
    } else {
      let itemsAfterRemoval = items
      itemsAfterRemoval = itemsAfterRemoval.filter(
        (current) => current.id !== item.id
      )
      setItems([...itemsAfterRemoval])
    }
  }

  return (
    <div className='UpdateRequest'>
      <div>
        {requestList.map((item) => (
          <div key={item.id}>
            Requested list {item.id}
            <ul>
              {item.items.map((sub) => (
                <li key={sub.id}>
                  {sub.description}{' '}
                  <Button
                    color='secondary'
                    onClick={() => deleteItemsInRegistry(sub)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <h2>
        Choose the items you wish to add to this request from the list below
      </h2>
      <div>
        <ItemsToChoose handleItems={handleItems} />
      </div>
      <Button color='primary' onClick={handleSubmit}>
        Update Request
      </Button>
    </div>
  )
}

export default UpdateRequest
