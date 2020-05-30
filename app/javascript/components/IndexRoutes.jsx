import React from "react";
import { Link } from "react-router-dom";
import 'antd/dist/antd.css';
import { Col, Row } from 'antd';

class ShowRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { routes: null };
    }

    componentDidMount() {
        const {
            match: {
                params: { id }
            }
        } = this.props;

        const url = `/api/v1/routes`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                this.setState({ routes: response });
            })
            .catch(() => this.props.history.push("/"));
    }

    render() {
        const { routes } = this.state;

        if (routes !== null) {
            return (
                <div>
                  <h1>Routes</h1>
                  {this.renderRoutes(routes)}
                </div>
            );
        } else {
            return (<h1>Loading</h1>);
        }
    }

    renderRoutes(routes) {
        if (routes.length > 0) {
            return (<div>
                    {
                        routes.map((route, index) =>
                                      {
                                          return this.renderRoute(route, index);
                                      }
                                     )
                    }
                    </div>
                   );
        } else {
            return null;
        }
    }


    renderRoute(route, index) {
        return (
            <div key={index}>
              <Link to={"/routes/"+route.id}>
                <Row>
                  <Col xs={7} sm={5} md={5} lg={4} xl={4}>
                    {route.name}
                  </Col>
                  <Col xs={5} sm={3} md={3} lg={2} xl={2}>
                    {route.distance_km}
                  </Col>
                </Row>
              </Link>
            </div>
        );
    }
}

export default ShowRoutes;
