import React from "react";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, NavbarNav, NavItem, NavLink } from "mdbreact";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";
class App extends React.Component {
  state = {
    isOpen: false
  };

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));

  closeCollapse = collapseID => () =>
    this.state.collapseID === collapseID && this.setState({ collapseID: "" });

  render() {
    return (
      <Router>
      <div className="flexible-content">
     <Navbar color="indigo" dark expand="md">
          <NavbarBrand>
            <strong className="white-text">Kudobuzz Challenge</strong>
          </NavbarBrand>
          <NavbarToggler
            onClick={this.toggleCollapse}
          />
          <Collapse
            id="navbarCollapse3"
            isOpen={this.state.isOpen}
            navbar>
            <NavbarNav left>
                        <NavItem>
                            <NavLink to="/">Dashboard</NavLink>
                        </NavItem>
                        
                        <NavItem>
                            <NavLink to="/New">New Reviews</NavLink>
                        </NavItem>
                        
                    </NavbarNav>
          </Collapse>
      </Navbar>
      
      <main id="content" className="p-5">
        <Routes />
      </main>
     
    </div>
    </Router>
    );
  }
}

export default App;