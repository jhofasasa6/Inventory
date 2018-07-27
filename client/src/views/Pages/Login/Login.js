import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Form,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import { login } from "../../../actions/authAction";
import PropTypes from "prop-types";
import { users } from "../../../actions/types";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      messageError: ""
    };
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();    
    this.props.login(this.state, `${users}/login`).then(res => {
      if (this.props.isAuthenticated) 
        this.context.router.history.push("/");
    });
  }

  render() {
    let message;
    if (this.props.messageError !== "") {
      message = <Alert color="danger">{this.props.messageError}</Alert>;
    } else {
      message = "";
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form
                      className="was-validated"
                      onSubmit={this.onSubmit.bind(this)}
                    >
                      <h1>Login</h1> {message}
                      <p className="text-muted">Inicie con su cuenta</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="username"
                          placeholder="Username"
                          required
                          onChange={this.onChange.bind(this)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          name="password"
                          placeholder="Password"
                          required
                          onChange={this.onChange.bind(this)}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            type="submit"
                            color="primary"
                            className="px-4"
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  messageError: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

Login.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  messageError: state.auth.messageError,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
