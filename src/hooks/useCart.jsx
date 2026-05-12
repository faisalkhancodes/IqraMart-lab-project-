import { useContext } from 'react';
import { CartContext } from '../context/cartContextInstance';

export const useCart = () => useContext(CartContext);

export default useCart;
