import React, { Component } from 'react';
import { Image, Button } from 'react-bootstrap';
import './Inventory.css';

class Item extends Component {
   
   render() {
      var { item } = this.props;
      const imageSize = 200;

      return (
         <div className="item">
         <span
            onClick={() => this.props.deleteItem(item)} 
            className="remove-item">X</span>
         <div className="content">
            <Image rounded width={imageSize} height={imageSize} src={"images/" + item.id + ".png"} />
            <h4>{item.itemName}</h4>
            <div>Quantity: {item.quantity}</div>
            <Button 
               className="item-button"
               onClick={() => this.props.openCheckOut(item)}
               disabled={item.quantity === 0}>
               Checkout
            </Button>
         </div>
         </div>
      );
   }
}

export default Item;
