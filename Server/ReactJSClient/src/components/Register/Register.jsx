import React, { Component } from 'react';
import {ConfDialog} from '../index';
import {
  FormGroup, ControlLabel, FormControl, HelpBlock,
  Checkbox, Button, Alert
} from 'react-bootstrap';

import './Register.css';

// Functional component label plus control w/optional help message
function FieldGroup({id, label, help, ...props }) {
   return (
       <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
       </FormGroup>
   );
}

class Register extends Component {
   constructor(props) {
      super(props);
      this.state = {
         firstName: '',
         lastName: '',
         email: '',
         password: '',
         passwordTwo: '',
         termsAccepted: false,
         role: 0,
         offerSignIn: false,
         showError: false
      }
      this.handleChange = this.handleChange.bind(this);
   }

   submit() {
      let { // Make a copy of the relevant values in current state
         firstName,
         lastName,
         email,
         password,
         termsAccepted,
         role
      } = this.state;

      const user = {
         firstName,
         lastName,
         email,
         password,
         termsAccepted,
         role
      };


      this.props.register(user, 
      () => {this.setState({offerSignIn: true})},
      () => {this.setState({showError: true});});
   }

   handleChange(ev) {
      let newState = {};

      switch (ev.target.type) {
      case 'checkbox':
         newState[ev.target.id] = ev.target.checked;
         break;
      default:
         newState[ev.target.id] = ev.target.value;
      }
      this.setState(newState);
   }

   formValid() {
      let s = this.state;

      return s.email && s.password && s.password === s.passwordTwo
       && s.termsAccepted;
   }

   componentWillUnmount() {
    this.props.clearErrs();
   }

   errorDismiss = (result) => {
      this.setState({ showError: false });
   }

   render() {
      const Errs = this.props.Errs.length ? this.props.Errs.map((err, i) => {
         return (<Alert type="danger" key={i} >{err}</Alert>)
      }) : '';

      return (
         <div className="container">
            <form>
               <FieldGroup id="email" type="email" label="Email Address"
                  placeholder="Enter email" value={this.state.email}
                  onChange={this.handleChange} required={true}
               />

              <FieldGroup id="firstName" type="text" label="First Name"
               placeholder="Enter first name" value={this.state.firstName}
               onChange={this.handleChange}
               />

              <FieldGroup id="lastName" type="text" label="Last Name"
               placeholder="Enter last name" value={this.state.lastName}
               onChange={this.handleChange} required={true}
               />

              <FieldGroup id="password" type="password" label="Password"
               value={this.state.password}
               onChange={this.handleChange} required={true}
               />

              <FieldGroup id="passwordTwo" type="password" 
               label="Repeat Password"
               value={this.state.passwordTwo}
               onChange={this.handleChange} required={true}
               help="Repeat your password"
              />

              <Checkbox  id="termsAccepted" value={this.state.termsAccepted}
               onChange={this.handleChange}>
                  Do you accept the terms and conditions?
              </Checkbox>
           </form>

           {this.state.password !== this.state.passwordTwo ?
            <Alert bsStyle="warning">
               Passwords don't match
            </Alert> : ''}

           {/*Errs*/} 
           <Button bsStyle="primary" onClick={() => this.submit()}
            disabled={!this.formValid()}>
              Submit
           </Button>

           <ConfDialog
              show={this.state.offerSignIn}
              title="Registration Success"
              body={`Would you like to log in as ${this.state.email}?`}
              buttons={['YES', 'NO']}
              onClose={answer => {
                 this.setState({offerSignIn: false});
                 if (answer === 'Ok') {
                    this.props.signIn(
                     {email: this.state.email, password: this.state.password},
                     () => this.props.history.push("/"));
                 }
              }}
           />
           {/*<ConfDialog
               show={this.state.showError} 
               title={"Error Notice"}
               body={Errs} 
               isErr={true}
               onClose={this.errorDismiss} />*/}
        </div>
      )
   }
}

export default Register;
