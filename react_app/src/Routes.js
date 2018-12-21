import React,{Component} from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import NewReview from "./NewReview";

class Routes extends Component {
    render() {
      return (
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/New" component={NewReview} />
        </Switch>
        );
      }
    }
    
export default Routes;
    