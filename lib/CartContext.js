'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const loadCart = () => {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : { items: [] }
  } catch {
    return { items: [] }
  }
}

const cartReducer = (state, action) => {
  let newState

  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        }
      }
      break
    }
    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
      break
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity === 0) {
        newState = {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        }
      } else {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
        }
      }
      break
    case 'CLEAR_CART':
      newState = { items: [] }
      break
    default:
      newState = state
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(newState))
  }
  return newState
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, loadCart)

  const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item })
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const getTotalItems = () => state.items.reduce((total, item) => total + item.quantity, 0)
  const getTotalPrice = () => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)

  const getCartTotal = () => {
    const subtotal = getTotalPrice()
    const shipping = subtotal > 500 ? 0 : 10
    const tax = subtotal * 0.1
    return { subtotal, shipping, tax, total: subtotal + shipping + tax }
  }

  return (
    <CartContext.Provider value={{
      cart: state, addToCart, removeFromCart, updateQuantity,
      clearCart, getTotalItems, getTotalPrice, getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
