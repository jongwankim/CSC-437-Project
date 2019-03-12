import React, { Component } from 'react';
import { Register, SignIn, CnvOverview, 
   CnvDetail, Inventory, CheckedOut } from '../index';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Navbar, Nav, NavItem, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ConfDialog } from '../index';
import './Main.css';

var ProtectedRoute = ({component: Cmp, path, ...rest }) => {
   // console.log("HELLOOOOO" + JSON.stringify(rest));
   return (<Route path={path} render={(props) => {
      return Object.keys(rest.Prss).length !== 0 ?
      <Cmp {...rest}/> : <Redirect to='/signin'/>;}}/>);};
   
class Main extends Component {

   constructor(props) {
      super(props);

      this.state = {
         showError: false
      }
   }
   
   signedIn() {
      return Object.keys(this.props.Prss).length !== 0; // Nonempty Prss obj
   }

   // Function component to generate a Route tag with a render method 
   // conditional on login.  Params {conditional: Cmp to render if signed in}

   confirmationDismiss = (result) => {
      this.setState({ showError: false });
   }

   componentDidUpdate(prevProps) {
      if (this.props.Errs !== prevProps.Errs && 
       Object.keys(this.props.Errs).length > 0)
         this.setState({ showError: true });
   }

   render() {
      console.log("Redrawing main");
      const Errs = this.props.Errs.length ? this.props.Errs.map((err, i) => {
        return (<Alert type="danger" key={i} >{err}</Alert>)
      }) : '';


      return (
         <div>
            <div>
               <Navbar>
                  <Navbar.Toggle />
                  {this.signedIn() ?
                     <Navbar.Text key={1}>
                        {`Logged in as: ${this.props.Prss.firstName}
                         ${this.props.Prss.lastName}`}
                     </Navbar.Text>
                     :
                     ''
                  }
                  <Navbar.Collapse>
                     <Nav>
                        {this.signedIn() ?
                           [
                              <LinkContainer key={"inv"} to="/Inventory">
                                 <NavItem>Inventory</NavItem>
                              </LinkContainer>,
                              <LinkContainer key={"cout"} to="/CheckedOut">
                                 <NavItem>Checked Out Items</NavItem>
                              </LinkContainer>

                           ]
                           :
                           [
                              <LinkContainer key={0} to="/signin">
                                 <NavItem>Sign In</NavItem>
                              </LinkContainer>,
                              <LinkContainer key={1} to="/register">
                                 <NavItem>
                                    Register
                               </NavItem>
                              </LinkContainer>,
                           ]
                        }
                     </Nav>
                     {this.signedIn() ?
                        <Nav pullRight>
                           <NavItem eventKey={1}
                            onClick={() => this.props.signOut(
                              () => this.props.history.push("/signin"))}>
                              Sign out
                           </NavItem>
                        </Nav>
                        :
                        ''
                     }
                  </Navbar.Collapse>
               </Navbar>
            </div>

            {/*Alternate pages beneath navbar, based on current route*/}
            <Switch>
               <Route exact path='/'
                component={() => this.props.Prss ? <Redirect to="/Inventory" />
                : <Redirect to="/signin" />} />
               <Route path='/signin' render={() => <SignIn {...this.props} />}
                />
               <Route path='/register'
                render={() => <Register {...this.props} />} />
               <ProtectedRoute path='/Inventory' component={Inventory}
                {...this.props}/>}
               />
               <ProtectedRoute path='/CheckedOut' component={CheckedOut}
                {...this.props}/>}
               />
             
            </Switch>

            {/*Error popup dialog*/}
            <ConfDialog
               show={this.state.showError} 
               title={"Error Notice"}
               body={Errs} 
               isErr={true}
               onClose={this.confirmationDismiss} />
         </div>
      );
   }
}

export default Main;
