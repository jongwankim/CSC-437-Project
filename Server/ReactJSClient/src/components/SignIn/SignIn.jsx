import React, { Component } from 'react';
import { Form, FormGroup, Col, FormControl, 
 Button, ControlLabel, Alert } from 'react-bootstrap';
import { ConfDialog } from '../index';
import './SignIn.css';

class SignIn extends Component {
   constructor(props) {
      super(props);

      // Current login state
      this.state = {
         email: 'adm@11.com',
         password: 'password'//,
         //showError: false
      }

       // bind 'this' to the correct context
       this.handleChange = this.handleChange.bind(this);
       this.signIn = this.signIn.bind(this);
   }

   // Call redux actionCreator signin via props.
   signIn(event) {
      console.log("in signin function")
      this.props.signIn(this.state, 
      () => this.props.history.push("/Inventory"),
      () => this.setState({ showError: true }));
      event.preventDefault()
   }

   // Continually update state as letters typed. Rerenders, but no DOM change!
   handleChange(event) {
      const newState = {};
      newState[event.target.name] = event.target.value;
      this.setState(newState);
   }

   componentWillUnmount() {
    this.props.clearErrs();
   }

   /*confirmationDismiss = (result) => {
      this.setState({ showError: false });
   }*/

   render() {

      /*const Errs = this.props.Errs.length ? this.props.Errs.map((err, i) => {
        return (<Alert type="danger" key={i} >{err}</Alert>)
      }) : '';*/

      return (
         <section className="container">
            <Col smOffset={2}>
               <h1>Sign in</h1>
            </Col>
            <Form horizontal>
               <FormGroup controlId="formHorizontalEmail">
                  <Col componentClass={ControlLabel} sm={2}>
                     Email
                  </Col>
                  <Col sm={8}>
                     <FormControl
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      />
                  </Col>
               </FormGroup>
               <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={2}>
                     Password
                  </Col>
                  <Col sm={8}>
                     <FormControl
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handleChange}
                     />
                  </Col>
               </FormGroup>
               {/*Errs*/}
               <FormGroup>
                  <Col smOffset={2} sm={8}>
                     <Button type="submit" onClick={this.signIn}>
                        Sign in
                     </Button>
                 </Col>
               </FormGroup>
            </Form>
            {/*<ConfDialog
               show={this.state.showError} 
               title={"Error Notice"}
               body={Errs} 
               isErr={true}
               onClose={this.confirmationDismiss} />*/}
         </section>
      )
   }
}

export default SignIn;
