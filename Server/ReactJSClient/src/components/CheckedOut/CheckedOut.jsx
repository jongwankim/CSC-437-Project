import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col, 
 Row, Button } from 'react-bootstrap';
import './CheckedOut.css';
import { ConfDialog } from '../index';

class CheckedOut extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showConfDialog: false
      };
      this.props.getChkd();
      this.props.getInvt();

      this.closeConfDialog = this.closeConfDialog.bind(this);
      this.openConfDialog = this.openConfDialog.bind(this);
   }

   openConfDialog(chkdToReturn, itemToReturn) {
      this.setState({
         showConfDialog: true, 
         chkdToReturn: chkdToReturn, 
         itemToReturn: itemToReturn
      });
   }

   closeConfDialog(result) {
      if (result === 'Ok') {
         this.props.delChkd(this.state.chkdToReturn.id, 
          this.state.itemToReturn.id, this.state.itemToReturn.quantity);

         this.props.getChkd();
         this.props.getInvt();
      }
      this.setState({ showConfDialog: false });
   }



   render() {
      var c = this.props.Chkd;
      var i = this.props.Invt;

      var display = i.map((item, index) => {
         var itemsCheckedOut = c.filter(chkd => {
            return chkd.invtId === item.id;
         });
         var itemsToShow = itemsCheckedOut.map((its, index) => {
            console.log("ADDING: ", its.firstName);
            return (
               <ListGroupItem key={index}>
               <Row>
                  <Col xs={3}>{its.firstName} {its.lastName}</Col>
                  <Col xs={3}>{its.email}</Col>
                  <Col xs={4}>
                     {new Intl.DateTimeFormat('us',
                     {
                        year: "numeric", month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit", second: "2-digit"
                     })
                     .format(new Date(its.whenChecked))}
                  </Col>
                  <Col xs={2}>
                     <Button onClick={() => this.openConfDialog(its, item)}>
                        Return
                     </Button>
                  </Col>
               </Row>
               </ListGroupItem>
            );
         });
         return (
            <div key={index}>
            <h3>{item.itemName}</h3>
            <ListGroup>
               {itemsToShow.length ? itemsToShow : 
                <ListGroupItem>
                   None are checked out at this time
                </ListGroupItem>}
            </ListGroup>
            </div>
         );

      })

      var chkds = c.map((item, index) => {
         return (
            <li key={index}>{item.firstName}</li>
         );
      });

      return (
         <div className="container">
            <ul>
               {display}
            </ul>
            <ConfDialog show={this.state.showConfDialog} title={"Return Item"} 
               body={'Are you sure you want to return the item "' + 
                (this.state.itemToReturn && this.state.itemToReturn.itemName) + 
                '"?'}
               onClose={this.closeConfDialog} />
         </div>
      );
   }
}

export default CheckedOut;
