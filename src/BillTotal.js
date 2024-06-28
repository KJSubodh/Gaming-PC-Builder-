import React from 'react';

const BillTotal = (props) => {
  const totalPrice = props.location.search.replace('?total=', '');

  return (
    <div>
      <h2>Bill Total</h2>
      <p>Total Price: ₹{totalPrice}</p>
    </div>
  );
};

export default BillTotal;
