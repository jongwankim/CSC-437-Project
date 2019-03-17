import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col, 
 Row, Button, Form, FormGroup,
 ControlLabel, FormControl } from 'react-bootstrap';
import './CheckedOut.css';

class CheckedOut extends Component {
   constructor(props) {
      super(props);
      this.props.getChkd();
      this.props.getInvt();

      this.state = {
         searchItem: ''
      }

      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      const newState = {};
      newState[event.target.name] = event.target.value;
      this.setState(newState);
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
                  <Col xs={2}><Button>Return</Button></Col>
               </Row>
               </ListGroupItem>
            );
         });
         return (
            <div key={index}>
            <h3>{item.itemName}</h3>
            <ListGroup>
               {itemsToShow.length ? itemsToShow : 
                  <ListGroupItem>None are checked out at this time</ListGroupItem>}
            </ListGroup>
            </div>
         );
      });

      return (
         <div className="container">
         <Row>
         <Col xs={4}>
         <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
               <FormControl
                type="searchItem"
                name="searchItem"
                placeholder="Search By Item"
                value={this.state.searchItem}
                onChange={this.handleChange}
                />
            </FormGroup>
         </Form>
         </Col>
         <Col xs={4}>
         <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
               <FormControl
                type="searchItem"
                name="searchItem"
                placeholder="Search By Name"
                value={this.state.searchItem}
                onChange={this.handleChange}
                />
            </FormGroup>
         </Form>
         </Col>
         <Col xs={4}>
         <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
               <FormControl
                type="searchItem"
                name="searchItem"
                placeholder="Search By Email"
                value={this.state.searchItem}
                onChange={this.handleChange}
                />
            </FormGroup>
         </Form>
         </Col>
         </Row>
         <div>
            <ul>
               {display}
            </ul>
         </div>
         </div>
      );
   }
}

export default CheckedOut;
